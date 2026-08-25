import { generateAdminEmailHtml, generateCustomerEmailHtml, type ContactInquiryPayload } from './emailTemplates';

export interface SendEmailResult {
  success: boolean;
  referenceId: string;
  adminDelivered: boolean;
  customerDelivered: boolean;
  message: string;
  adminEmailId?: string;
  customerEmailId?: string;
  warning?: string;
}

export async function processContactSubmission(
  payload: ContactInquiryPayload,
  envConfig?: {
    apiKey?: string;
    adminEmail?: string;
    fromEmail?: string;
  }
): Promise<SendEmailResult> {
  const apiKey = envConfig?.apiKey || process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Resend API key is not configured. Please set RESEND_API_KEY in your .env or environment variables.');
  }
  const adminEmail = envConfig?.adminEmail || process.env.ADMIN_EMAIL || 'info.yashjoshi7355@gmail.com';
  const fromEmail = envConfig?.fromEmail || process.env.FROM_EMAIL || 'Driveo Concierge <onboarding@resend.dev>';

  if (!payload.firstName?.trim() || !payload.lastName?.trim()) {
    throw new Error('Please provide your first and last name.');
  }

  if (!payload.email?.trim() || !payload.email.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }

  if (!payload.message?.trim()) {
    throw new Error('Please provide a message.');
  }

  const referenceId = `DRV-${Date.now().toString().slice(-6)}`;
  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const enrichedPayload: ContactInquiryPayload = {
    ...payload,
    referenceId,
    submittedAt,
  };

  const fullName = `${payload.firstName.trim()} ${payload.lastName.trim()}`;

  // 1. Send Admin Notification Email
  const adminEmailHtml = generateAdminEmailHtml(enrichedPayload);
  let adminResId: string | undefined;

  const adminResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [adminEmail],
      reply_to: payload.email.trim(),
      subject: `🚗 New Inquiry [${referenceId}]: ${fullName}`,
      html: adminEmailHtml,
    }),
  });

  const adminResData = await adminResponse.json();

  if (!adminResponse.ok) {
    console.error('Failed to send admin email via Resend:', adminResData);
    throw new Error(adminResData?.message || 'Failed to deliver notification email to admin.');
  }

  adminResId = adminResData.id;

  // 2. Send Customer Auto-Responder Email
  const customerEmailHtml = generateCustomerEmailHtml(enrichedPayload);
  let customerDelivered = false;
  let customerResId: string | undefined;
  let warningMessage: string | undefined;

  try {
    const customerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [payload.email.trim()],
        reply_to: adminEmail,
        subject: `✅ Inquiry Made Successfully [${referenceId}] - Driveo Concierge`,
        html: customerEmailHtml,
      }),
    });

    const customerResData = await customerResponse.json();

    if (customerResponse.ok) {
      customerDelivered = true;
      customerResId = customerResData.id;
    } else {
      console.warn('Customer auto-responder note:', customerResData);
      warningMessage = customerResData?.message || 'Customer auto-responder skipped (domain verification required for external recipients).';
    }
  } catch (err: any) {
    console.warn('Customer auto-responder error:', err.message);
    warningMessage = err.message;
  }

  return {
    success: true,
    referenceId,
    adminDelivered: true,
    customerDelivered,
    adminEmailId: adminResId,
    customerEmailId: customerResId,
    warning: warningMessage,
    message: 'Your inquiry has been successfully sent to the Driveo Concierge team.',
  };
}

// Serverless / HTTP handler for platforms like Vercel / Netlify
export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await processContactSubmission(body);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'An unexpected error occurred.',
    });
  }
}
