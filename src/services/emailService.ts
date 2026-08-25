export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}

export interface SendEmailResponse {
  success: boolean;
  referenceId: string;
  adminDelivered: boolean;
  customerDelivered: boolean;
  message: string;
  adminEmailId?: string;
  customerEmailId?: string;
  warning?: string;
  error?: string;
}

export async function sendContactInquiry(formData: ContactFormData): Promise<SendEmailResponse> {
  // Basic frontend validation
  if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
    throw new Error('Please enter both your first and last name.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email?.trim() || !emailRegex.test(formData.email.trim())) {
    throw new Error('Please enter a valid email address.');
  }

  if (!formData.message?.trim()) {
    throw new Error('Please enter your message or question.');
  }

  if (formData.message.trim().length < 5) {
    throw new Error('Please enter a more descriptive message (at least 5 characters).');
  }

  const apiUrl = (import.meta.env.VITE_API_URL as string) || '/api/send-email';

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || '',
        message: formData.message.trim(),
      }),
    });
  } catch (netErr: any) {
    throw new Error('Network error: Unable to connect to email service. Please check your internet connection.');
  }

  if (response.status === 404) {
    throw new Error(
      'Deployment Configuration Notice: Serverless endpoint (/api/send-email) returned 404. Ensure vercel.json / netlify.toml is included and RESEND_API_KEY is configured in your hosting dashboard.'
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to send your inquiry. Please try again or call our support line.');
  }

  return data as SendEmailResponse;
}
