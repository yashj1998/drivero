export interface ContactInquiryPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  referenceId?: string;
  submittedAt?: string;
}

export function generateAdminEmailHtml(data: ContactInquiryPayload): string {
  const refId = data.referenceId || `DRV-${Date.now().toString().slice(-6)}`;
  const submittedAt = data.submittedAt || new Date().toUTCString();
  const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
  const phoneDisplay = data.phone?.trim() ? data.phone.trim() : 'Not provided';
  const mailtoLink = `mailto:${encodeURIComponent(data.email)}?subject=${encodeURIComponent(`Re: Driveo Inquiry [${refId}]`)}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Customer Inquiry - Driveo</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f4ef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #121212;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f6f4ef; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #111111; padding: 32px 36px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #ffffff;">
                      DRIVEO<span style="color: #e8541f;">.</span>
                    </div>
                    <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #9b968a; margin-top: 4px;">
                      Concierge Admin System
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #222222; border: 1px solid #333333; color: #e8541f; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px;">
                      REF: ${refId}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notification Hero -->
          <tr>
            <td style="padding: 32px 36px 20px 36px;">
              <div style="display: inline-block; background-color: #fff4ed; border: 1px solid #fbd0b8; color: #e8541f; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">
                ⚡ New Inquiry Received
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #111111; line-height: 1.3;">
                Customer Inquiry from ${fullName}
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #767267; line-height: 1.5;">
                A new inquiry was submitted via the Driveo website contact form.
              </p>
            </td>
          </tr>

          <!-- Customer Info Card -->
          <tr>
            <td style="padding: 0 36px 20px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fbf9f6; border: 1px solid #ede8de; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="padding-bottom: 12px; width: 50%;">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9b968a; font-weight: 700;">Customer Name</div>
                    <div style="font-size: 15px; font-weight: 600; color: #111111; margin-top: 2px;">${fullName}</div>
                  </td>
                  <td style="padding-bottom: 12px; width: 50%;">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9b968a; font-weight: 700;">Email Address</div>
                    <div style="font-size: 15px; font-weight: 600; color: #111111; margin-top: 2px;">
                      <a href="mailto:${data.email}" style="color: #111111; text-decoration: underline;">${data.email}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 4px;">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9b968a; font-weight: 700;">Phone Number</div>
                    <div style="font-size: 14px; font-weight: 500; color: #111111; margin-top: 2px;">
                      ${data.phone?.trim() ? `<a href="tel:${data.phone}" style="color: #111111; text-decoration: none;">${phoneDisplay}</a>` : phoneDisplay}
                    </div>
                  </td>
                  <td style="padding-top: 4px;">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9b968a; font-weight: 700;">Received At</div>
                    <div style="font-size: 13px; font-weight: 500; color: #767267; margin-top: 2px;">${submittedAt}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Box -->
          <tr>
            <td style="padding: 0 36px 28px 36px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; color: #9b968a; font-weight: 700; margin-bottom: 8px;">
                Customer Message
              </div>
              <div style="background-color: #ffffff; border-left: 4px solid #e8541f; border-top: 1px solid #ede8de; border-right: 1px solid #ede8de; border-bottom: 1px solid #ede8de; border-radius: 0 10px 10px 0; padding: 18px 20px; font-size: 14px; line-height: 1.6; color: #222222; white-space: pre-wrap;">${data.message.trim()}</div>
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td style="padding: 0 36px 36px 36px;" align="center">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="background-color: #111111; border-radius: 30px;">
                    <a href="${mailtoLink}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 13px; font-weight: 700; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
                      Reply to ${data.firstName.trim()} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #9b968a;">
                Or simply reply directly to this email in your mail client.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fbf9f6; border-top: 1px solid #ede8de; padding: 24px 36px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #767267; font-weight: 500;">
                DRIVEO Luxury & Performance Fleet Concierge
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #9b968a;">
                100 Market St, San Francisco, CA &middot; +1 (415) 555-0192 &middot; info.yashjoshi7355@gmail.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function generateCustomerEmailHtml(data: ContactInquiryPayload): string {
  const refId = data.referenceId || `DRV-${Date.now().toString().slice(-6)}`;
  const submittedAt = data.submittedAt || new Date().toUTCString();
  const firstName = data.firstName.trim();
  const phoneDisplay = data.phone?.trim() ? data.phone.trim() : 'None provided';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Made Successfully - Driveo</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f4ef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #121212;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f6f4ef; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #111111; padding: 36px 36px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="font-size: 26px; font-weight: 800; letter-spacing: 2px; color: #ffffff;">
                      DRIVEO<span style="color: #e8541f;">.</span>
                    </div>
                    <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #9b968a; margin-top: 4px;">
                      Luxury & Performance Rentals
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #1a2e1f; border: 1px solid #2d5a36; color: #4ade80; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.8px;">
                      ✓ CONFIRMED
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Success Banner & Hero Greeting -->
          <tr>
            <td style="padding: 36px 36px 20px 36px;">
              <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 14px;">
                🎉 Inquiry Made Successfully
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111111; line-height: 1.25;">
                Hello ${firstName},<br />Your inquiry has been received!
              </h1>
              <p style="margin: 14px 0 0 0; font-size: 15px; color: #4a4740; line-height: 1.6;">
                Thank you for reaching out to <strong>Driveo</strong>. Your inquiry has been logged under reference <strong>#${refId}</strong> and delivered directly to our VIP Concierge team.
              </p>
            </td>
          </tr>

          <!-- Status & Ticket Details Box -->
          <tr>
            <td style="padding: 0 36px 20px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fbf9f6; border: 1px solid #ede8de; border-radius: 12px; padding: 18px 20px;">
                <tr>
                  <td style="width: 50%; padding-bottom: 10px;">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9b968a; font-weight: 700;">Inquiry Reference</div>
                    <div style="font-size: 14px; font-weight: 700; color: #111111; margin-top: 2px;">#${refId}</div>
                  </td>
                  <td style="width: 50%; padding-bottom: 10px;">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9b968a; font-weight: 700;">Status</div>
                    <div style="font-size: 13px; font-weight: 600; color: #059669; margin-top: 2px;">● In Review by Concierge</div>
                  </td>
                </tr>
                <tr>
                  <td style="width: 50%;">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9b968a; font-weight: 700;">Estimated Reply Time</div>
                    <div style="font-size: 13px; font-weight: 600; color: #111111; margin-top: 2px;">Within 2–4 hours</div>
                  </td>
                  <td style="width: 50%;">
                    <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9b968a; font-weight: 700;">Date Submitted</div>
                    <div style="font-size: 12px; font-weight: 500; color: #767267; margin-top: 2px;">${submittedAt}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Summary of your message -->
          <tr>
            <td style="padding: 0 36px 24px 36px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; color: #9b968a; font-weight: 700; margin-bottom: 8px;">
                Copy of Your Inquiry
              </div>
              <div style="background-color: #ffffff; border: 1px solid #ede8de; border-radius: 10px; padding: 16px 18px; font-size: 13px; line-height: 1.6; color: #333333; white-space: pre-wrap; font-style: italic;">"${data.message.trim()}"</div>
            </td>
          </tr>

          <!-- What Happens Next -->
          <tr>
            <td style="padding: 0 36px 24px 36px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; color: #9b968a; font-weight: 700; margin-bottom: 8px;">
                What Happens Next
              </div>
              <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #55524b; line-height: 1.7;">
                <li>A dedicated Driveo concierge will review vehicle availability and pricing options.</li>
                <li>You will receive a personalized response at <strong>${data.email}</strong>.</li>
                <li>If you need immediate bookings or changes, our 24/7 hotline is available below.</li>
              </ul>
            </td>
          </tr>

          <!-- Contact Options -->
          <tr>
            <td style="padding: 0 36px 32px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: 1px solid #ede8de; padding-top: 20px;">
                <tr>
                  <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9b968a;">Need urgent assistance?</div>
                    <div style="font-size: 14px; font-weight: 600; color: #111111; margin-top: 4px;">
                      Call +1 (415) 555-0192
                    </div>
                    <div style="font-size: 12px; color: #767267; margin-top: 2px;">24/7 VIP Concierge line</div>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9b968a;">Visit Our Showroom</div>
                    <div style="font-size: 14px; font-weight: 600; color: #111111; margin-top: 4px;">
                      100 Market St, SF
                    </div>
                    <div style="font-size: 12px; color: #767267; margin-top: 2px;">Open daily 9am–7pm</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #111111; padding: 24px 36px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #fbf9f6; font-weight: 500;">
                DRIVEO &middot; The open road awaits.
              </p>
              <p style="margin: 6px 0 0 0; font-size: 11px; color: #9b968a;">
                &copy; 2026 Driveo Fleet Inc. All rights reserved. &middot; info.yashjoshi7355@gmail.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
