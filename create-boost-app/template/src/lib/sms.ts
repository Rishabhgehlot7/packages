const authKey = process.env.MSG91_AUTH_KEY;
const senderId = process.env.MSG91_SENDER_ID || 'CLBHCH';

export async function sendOrderSMS(phone: string, message: string) {
  if (!authKey) {
    console.warn('⚠️ MSG91_AUTH_KEY not configured. Skipping SMS.');
    return false;
  }

  try {
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const url = `https://api.msg91.com/api/v2/sendsms`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'authkey': authKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: senderId,
        route: '4',
        country: '91',
        sms: [
          {
            message,
            to: [cleanPhone],
          },
        ],
      }),
    });

    const data = await response.json();
    return data.type === 'success';
  } catch (error) {
    console.error('Error sending MSG91 SMS:', error);
    return false;
  }
}
