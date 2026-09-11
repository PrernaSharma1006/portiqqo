const path = require('path');
require(path.join(__dirname, '../backend/node_modules/dotenv')).config({ path: path.join(__dirname, '../backend/.env') });
const Razorpay = require(path.join(__dirname, '../backend/node_modules/razorpay'));

console.log('KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'PRESENT' : 'MISSING');

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

rzp.orders.create({
  amount: 8100,
  currency: 'INR',
  receipt: 'rcpt_test_123456',
  notes: { test: 'true' }
}).then(order => {
  console.log('✅ ORDER CREATED SUCCESSFULLY:', order);
}).catch(err => {
  console.error('❌ ORDER CREATION FAILED:', JSON.stringify(err, null, 2));
});
