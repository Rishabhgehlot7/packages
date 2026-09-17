import { OmnichannelEngine } from '../src/engine';
import { InteraktWhatsAppAdapter } from '../src/adapters/whatsapp/interakt.adapter';
import { InteraktRCSAdapter } from '../src/adapters/rcs/interakt.adapter';

async function runInteraktTests() {
  console.log('🧪 Starting Interakt API Tests...\n');

  // Replace this with your actual Interakt API Key
  const DUMMY_API_KEY = process.env.INTERAKT_API_KEY || 'YOUR_INTERAKT_API_KEY';
  const TEST_PHONE = '9999999999'; // Use your real number to test
  const TEST_COUNTRY_CODE = '+91';

  // Initialize engine with Interakt keys
  const engine = new OmnichannelEngine({
    providers: {
      whatsapp: { provider: 'interakt', apiKey: DUMMY_API_KEY },
      rcs: { provider: 'interakt', apiKey: DUMMY_API_KEY }
    }
  });

  const waAdapter = (engine as any).whatsappAdapter as InteraktWhatsAppAdapter;
  const rcsAdapter = (engine as any).rcsAdapter as InteraktRCSAdapter;

  if (!waAdapter || !rcsAdapter) {
    console.error('❌ Adapters failed to initialize!');
    return;
  }

  try {
    // ---------------------------------------------------------
    // TEST 1: Track User API (WhatsApp)
    // ---------------------------------------------------------
    console.log('🔹 Testing User Tracking (WhatsApp)...');
    const trackResponse = await waAdapter.trackUser({
      phoneNumber: TEST_PHONE,
      countryCode: TEST_COUNTRY_CODE,
      traits: {
        name: 'Test User',
        email: 'test@example.com'
      }
    });
    console.log('✅ Track User Success:', trackResponse);

    // ---------------------------------------------------------
    // TEST 2: Send Template Message (WhatsApp)
    // ---------------------------------------------------------
    console.log('\n🔹 Testing WhatsApp Template Message...');
    const templateResponse = await waAdapter.sendTemplateMessage({
      phoneNumber: TEST_PHONE,
      countryCode: TEST_COUNTRY_CODE,
      type: 'Template',
      template: {
        name: 'travel_style_reminder',
        languageCode: 'en',
        bodyValues: ['Test User'] 
      }
    });
    console.log('✅ Template Message Success:', templateResponse);

    // ---------------------------------------------------------
    // TEST 3: Send RCS Message with SMS Fallback (RCS)
    // ---------------------------------------------------------
    console.log('\n🔹 Testing RCS Message with SMS Fallback...');
    const rcsResponse = await rcsAdapter.send({
      to: `+91${TEST_PHONE}`,
      title: 'Hello from Boost Omnichannel!',
      description: 'via Interakt RCS',
      mediaUrl: 'https://www.w3schools.com/w3images/fjords.jpg',
      suggestions: [
        { type: 'reply', title: 'Yes', postbackData: 'YES' },
        { type: 'reply', title: 'No', postbackData: 'NO' }
      ]
    });
    // ---------------------------------------------------------
    // TEST 4: Dummy Webhook Parse Test
    // ---------------------------------------------------------
    console.log('\n🔹 Testing Webhook Parsing...');
    const dummyPayload = {
      type: "message_delivered",
      data: {
        message: { id: "msg_12345" },
        customer: { phone_number: "919999999999" }
      }
    };
    const parsedWebhook = waAdapter.parseWebhook!(dummyPayload);
    console.log('✅ Webhook Parse Success:', parsedWebhook);

    console.log('\n🎉 All tests executed successfully!');

  } catch (error: any) {
    console.error('\n❌ Test Failed!');
    if (error.response) {
      console.error('API Error Response:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

runInteraktTests();
