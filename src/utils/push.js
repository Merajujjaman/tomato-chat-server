const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:asmmerajujjaman@gmail.com', // Your email address
  // Replace with your VAPID public and private keys  
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = webpush;