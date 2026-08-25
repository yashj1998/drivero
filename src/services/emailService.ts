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

  const response = await fetch('/api/send-email', {
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

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to send your inquiry. Please try again or call our support line.');
  }

  return data as SendEmailResponse;
}
