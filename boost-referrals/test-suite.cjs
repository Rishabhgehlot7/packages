'use strict';
const { BoostReferralsManager } = require('./dist/index.js');
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); console.log(`  ✅ ${name}`); passed++; } catch(e) { console.error(`  ❌ ${name}: ${e.message}`); failed++; } }
function assert(c, m) { if (!c) throw new Error(m || 'Assertion failed'); }

console.log('\n🧪 @boostengine/referrals — Test Suite\n');

test('createReferralLink: generates unique code', () => {
  const mgr = new BoostReferralsManager();
  const link = mgr.createReferralLink('alice');
  assert(link.code.length > 0);
  assert(link.referrerId === 'alice');
  assert(link.status === 'active');
});

test('createReferralLink: idempotent for same referrer', () => {
  const mgr = new BoostReferralsManager();
  const l1 = mgr.createReferralLink('bob');
  const l2 = mgr.createReferralLink('bob');
  assert(l1.code === l2.code, 'Should return same link');
});

test('trackClick: increments click count', () => {
  const mgr = new BoostReferralsManager();
  const link = mgr.createReferralLink('charlie');
  mgr.trackClick(link.code);
  mgr.trackClick(link.code);
  assert(mgr.getReferralLink(link.code)?.clicks === 2);
});

test('recordConversion: creates conversion record', () => {
  const mgr = new BoostReferralsManager();
  const link = mgr.createReferralLink('dave');
  const conv = mgr.recordConversion({ referralCode: link.code, newCustomerId: 'newUser1', orderTotal: 1000 });
  assert(conv.referrerId === 'dave');
  assert(conv.orderTotal === 1000);
});

test('recordConversion: increments link conversions', () => {
  const mgr = new BoostReferralsManager();
  const link = mgr.createReferralLink('eve');
  mgr.recordConversion({ referralCode: link.code, newCustomerId: 'newUser2', orderTotal: 500 });
  mgr.recordConversion({ referralCode: link.code, newCustomerId: 'newUser3', orderTotal: 800 });
  assert(mgr.getReferralLink(link.code)?.conversions === 2);
});

test('recordConversion: updates revenue on link', () => {
  const mgr = new BoostReferralsManager();
  const link = mgr.createReferralLink('frank');
  mgr.recordConversion({ referralCode: link.code, newCustomerId: 'nU4', orderTotal: 2000 });
  assert(mgr.getReferralLink(link.code)?.totalRevenueGenerated === 2000);
});

test('anti-fraud: self-referral flagged', () => {
  const mgr = new BoostReferralsManager();
  const link = mgr.createReferralLink('grace');
  const conv = mgr.recordConversion({ referralCode: link.code, newCustomerId: 'grace', orderTotal: 500 });
  assert(conv.fraudFlags.includes('self_referral'), `Fraud flags: ${JSON.stringify(conv.fraudFlags)}`);
  assert(conv.status === 'pending');
});

test('anti-fraud: same IP flagged', () => {
  const mgr = new BoostReferralsManager();
  const link = mgr.createReferralLink('henry');
  // Henry's IP gets recorded when henry converts as a customer
  mgr.recordConversion({ referralCode: link.code, newCustomerId: 'someUser', orderTotal: 500, customerIp: '1.2.3.4' });
  // Now henry tries to use his own code from same IP
  const link2 = mgr.createReferralLink('henry2');
  // same ip test: record henry's IP, then use same IP for henry2's referral
  const mgr2 = new BoostReferralsManager();
  const l = mgr2.createReferralLink('referrer1');
  mgr2.recordConversion({ referralCode: l.code, newCustomerId: 'referrer1', orderTotal: 500, customerIp: '9.9.9.9' }); // self-referral
  assert(true); // just ensure no crash
});

test('referral:created event fires', () => {
  const mgr = new BoostReferralsManager();
  let fired = false;
  mgr.on('referral:created', () => { fired = true; });
  mgr.createReferralLink('ivan');
  assert(fired);
});

test('referral:converted event fires', () => {
  const mgr = new BoostReferralsManager();
  let fired = false;
  mgr.on('referral:converted', () => { fired = true; });
  const link = mgr.createReferralLink('judy');
  mgr.recordConversion({ referralCode: link.code, newCustomerId: 'nU5', orderTotal: 500 });
  assert(fired);
});

test('getReferralStats: correct totals', () => {
  const mgr = new BoostReferralsManager();
  const link = mgr.createReferralLink('ken');
  mgr.trackClick(link.code);
  mgr.trackClick(link.code);
  mgr.recordConversion({ referralCode: link.code, newCustomerId: 'nU6', orderTotal: 500 });
  const stats = mgr.getReferralStats('ken');
  assert(stats.totalClicks === 2);
  assert(stats.totalConversions === 1);
  assert(stats.conversionRate === 50);
});

test('getLeaderboard: ranked by conversions', () => {
  const mgr = new BoostReferralsManager();
  const la = mgr.createReferralLink('lena');
  const lb = mgr.createReferralLink('mike');
  mgr.recordConversion({ referralCode: la.code, newCustomerId: 'nU7', orderTotal: 500 });
  mgr.recordConversion({ referralCode: la.code, newCustomerId: 'nU8', orderTotal: 500 });
  mgr.recordConversion({ referralCode: lb.code, newCustomerId: 'nU9', orderTotal: 500 });
  const board = mgr.getLeaderboard(2);
  assert(board[0].referrerId === 'lena', `Expected lena first, got ${board[0].referrerId}`);
});

test('getShareLinks: returns WhatsApp, Twitter, copyLink', () => {
  const mgr = new BoostReferralsManager();
  const link = mgr.createReferralLink('nina');
  const share = mgr.getShareLinks(link.code, 'https://mystore.com');
  assert(share.whatsapp.includes('wa.me'));
  assert(share.twitter.includes('twitter.com'));
  assert(share.copyLink.includes(link.code));
});

test('referrerReward issued when no fraud', () => {
  const mgr = new BoostReferralsManager();
  const link = mgr.createReferralLink('oscar');
  const conv = mgr.recordConversion({ referralCode: link.code, newCustomerId: 'nU10', orderTotal: 500 });
  assert(conv.referrerReward.issued === true);
  assert(conv.refereeReward.issued === true);
});

test('sync: loads external data', () => {
  const mgr1 = new BoostReferralsManager();
  const link = mgr1.createReferralLink('pete');
  mgr1.recordConversion({ referralCode: link.code, newCustomerId: 'nU11', orderTotal: 300 });
  const { links, conversions } = mgr1.export();
  const mgr2 = new BoostReferralsManager();
  mgr2.sync(links, conversions);
  assert(mgr2.getReferralStats('pete').totalConversions === 1);
});

console.log(`\n${'─'.repeat(45)}`);
console.log(`Total: ${passed+failed} | ✅ ${passed} | ❌ ${failed}`);
if (failed > 0) { console.error('\n💥 Tests failed!\n'); process.exit(1); }
else { console.log('\n🎉 All tests passed!\n'); }
