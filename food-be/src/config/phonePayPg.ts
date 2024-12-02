const phonePayHost = process.env.PHONE_PAY_HOST_URL;
const merchantId = process.env.MERCHANT_ID;
const saltIndex = process.env.SALT_INDEX;
const saltKey = process.env.SALT_KEY;

const phonePayConfig = {
  phonePayHost,
  merchantId,
  saltIndex,
  saltKey,
};

export default phonePayConfig;
