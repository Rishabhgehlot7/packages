'use strict';
const { BoostNotificationsManager } = require('./dist/index.js');
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); console.log(`  ✅ ${name}`); passed++; } catch(e) { console.error(`  ❌ ${name}: ${e.message}`); failed++; } }
function assert(c, m) { if (!c) throw new Error(m || 'Assertion failed'); }

console.log('\n🧪 @boostengine/notifications — Test Suite\n');

test('send: creates notification record', () => {
  const mgr = new BoostNotificationsManager();
  const r = mgr.send({ template: 'order_confirmed', recipient: { id: 'C1', phone: '+91999' }, variables: { orderId: 'ORD1' } });
  assert(r.status === 'sent');
  assert(r.template === 'order_confirmed');
});

test('send: uses defaultChannel from config', () => {
  const mgr = new BoostNotificationsManager({ defaultChannel: 'email' });
  const r = mgr.send({ template: 'order_shipped', recipient: { id: 'C2', email: 'x@x.com' } });
  assert(r.channel === 'email');
});

test('send: explicit channel overrides default', () => {
  const mgr = new BoostNotificationsManager({ defaultChannel: 'whatsapp' });
  const r = mgr.send({ channel: 'sms', template: 'otp_verification', recipient: { id: 'C3' } });
  assert(r.channel === 'sms');
});

test('notification:sent event fires', () => {
  const mgr = new BoostNotificationsManager();
  let fired = false;
  mgr.on('notification:sent', () => { fired = true; });
  mgr.send({ template: 'cart_recovery', recipient: { id: 'C4' } });
  assert(fired);
});

test('getHistory: returns notifications for recipient', () => {
  const mgr = new BoostNotificationsManager();
  mgr.send({ template: 'order_confirmed',  recipient: { id: 'alice' } });
  mgr.send({ template: 'order_shipped',    recipient: { id: 'alice' } });
  mgr.send({ template: 'cart_recovery',    recipient: { id: 'bob'   } });
  assert(mgr.getHistory('alice').length === 2);
  assert(mgr.getHistory('bob').length === 1);
});

test('scheduleNotification: status is scheduled', () => {
  const mgr = new BoostNotificationsManager();
  const future = new Date(Date.now() + 86400_000);
  const r = mgr.scheduleNotification({ template: 'cart_recovery', recipient: { id: 'C5' }, scheduledAt: future });
  assert(r.status === 'scheduled');
  assert(r.scheduledAt !== undefined);
});

test('notification:scheduled event fires', () => {
  const mgr = new BoostNotificationsManager();
  let fired = false;
  mgr.on('notification:scheduled', () => { fired = true; });
  mgr.scheduleNotification({ template: 'order_confirmed', recipient: { id: 'C6' }, scheduledAt: new Date(Date.now() + 3600_000) });
  assert(fired);
});

test('registerWebhook: webhook stored', () => {
  const mgr = new BoostNotificationsManager();
  mgr.registerWebhook('https://example.com/hook', ['order.created', 'return.approved']);
  assert(mgr.getWebhooks().length === 1);
  assert(mgr.getWebhooks()[0].url === 'https://example.com/hook');
});

test('triggerWebhooks: fires matching webhooks', () => {
  const mgr = new BoostNotificationsManager();
  mgr.registerWebhook('https://hook.test/a', ['order.created']);
  mgr.registerWebhook('https://hook.test/b', ['return.approved']);
  const triggered = mgr.triggerWebhooks('order.created', { orderId: 'ORD1' });
  assert(triggered.length === 1, `Expected 1 triggered, got ${triggered.length}`);
});

test('triggerWebhooks: wildcard * catches all events', () => {
  const mgr = new BoostNotificationsManager();
  mgr.registerWebhook('https://hook.test/all', ['*']);
  const triggered = mgr.triggerWebhooks('anything.event', { foo: 'bar' });
  assert(triggered.length === 1);
});

test('webhook:triggered event fires', () => {
  const mgr = new BoostNotificationsManager();
  let fired = false;
  mgr.on('webhook:triggered', () => { fired = true; });
  mgr.registerWebhook('https://hook.test', ['test.event']);
  mgr.triggerWebhooks('test.event', {});
  assert(fired);
});

test('deactivateWebhook: prevents future triggers', () => {
  const mgr = new BoostNotificationsManager();
  const wh = mgr.registerWebhook('https://hook.test', ['*']);
  mgr.deactivateWebhook(wh.id);
  const triggered = mgr.triggerWebhooks('any.event', {});
  assert(triggered.length === 0, `Expected 0 triggered after deactivate, got ${triggered.length}`);
});

test('sync: loads external records', () => {
  const mgr1 = new BoostNotificationsManager();
  mgr1.send({ template: 'order_confirmed', recipient: { id: 'sync1' } });
  const exported = mgr1.export();
  const mgr2 = new BoostNotificationsManager();
  mgr2.sync(exported);
  assert(mgr2.getHistory('sync1').length === 1);
});

test('variables stored in record', () => {
  const mgr = new BoostNotificationsManager();
  const r = mgr.send({ template: 'order_confirmed', recipient: { id: 'C7' }, variables: { orderId: 'ORD99', customerName: 'Alice' } });
  assert(r.variables.orderId === 'ORD99');
  assert(r.variables.customerName === 'Alice');
});

test('multiple channels work independently', () => {
  const mgr = new BoostNotificationsManager();
  mgr.send({ channel: 'whatsapp', template: 'order_confirmed', recipient: { id: 'C8' } });
  mgr.send({ channel: 'email',    template: 'order_confirmed', recipient: { id: 'C8' } });
  mgr.send({ channel: 'sms',      template: 'order_confirmed', recipient: { id: 'C8' } });
  const hist = mgr.getHistory('C8');
  assert(hist.length === 3);
  const channels = hist.map(h => h.channel);
  assert(channels.includes('whatsapp') && channels.includes('email') && channels.includes('sms'));
});

console.log(`\n${'─'.repeat(45)}`);
console.log(`Total: ${passed+failed} | ✅ ${passed} | ❌ ${failed}`);
if (failed > 0) { console.error('\n💥 Tests failed!\n'); process.exit(1); }
else { console.log('\n🎉 All tests passed!\n'); }
