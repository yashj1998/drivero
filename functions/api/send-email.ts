import { processContactSubmission } from '../../api/send-email';

export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const env = context.env || {};
    const result = await processContactSubmission(body, {
      apiKey: env.RESEND_API_KEY,
      adminEmail: env.ADMIN_EMAIL,
      fromEmail: env.FROM_EMAIL,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'An error occurred while processing your inquiry.',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
