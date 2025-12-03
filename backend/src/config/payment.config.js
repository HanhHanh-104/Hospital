module.exports = {
  vnpay: {
    tmnCode: process.env.VNP_TmnCode,
    hashSecret: process.env.VNP_HashSecret,
    url: process.env.VNP_Url,
    returnUrl: process.env.VNP_ReturnUrl,
  },
  momo: {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    accessKey: process.env.MOMO_ACCESS_KEY,
    secretKey: process.env.MOMO_SECRET_KEY,
    endpoint: process.env.MOMO_ENDPOINT,
    ipnUrl: process.env.MOMO_IPN_URL,
    redirectUrl: process.env.MOMO_REDIRECT_URL,
  },
};