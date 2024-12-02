import axios from "axios";
import phonePayConfig from "../config/phonePayPg";
import sha256 from "sha256";
import logger from "../loggers/logger";
import { v4 as uuid } from "uuid";

interface paymentResponse {
  success: true;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: string;
    responseCode: string;
    paymentInstrument: {
      type: string;
      utr: string;
      upiTransactionId: string;
      accountHolderName: string;
      cardNetwork: string | null;
      accountType: string | null;
      cardType: string;
      pgTransactionId: string;
      bankTransactionId: null;
      pgAuthorizationCode: null;
      arn: string;
      bankId: null;
      brn: string | any;
      pgServiceTransactionId: string;
    };
  };
}

export async function checkTransactionStatus(merchantTransactionId: string) {
  const statusUrl = `${phonePayConfig.phonePayHost}/pg/v1/status/${phonePayConfig.merchantId}/${merchantTransactionId}`;
  const string = `/pg/v1/status/${phonePayConfig.merchantId}/${merchantTransactionId}${phonePayConfig.saltKey}`;
  const sha256_val = sha256(string);
  const xVerifyChecksum = `${sha256_val}###${phonePayConfig.saltIndex}`;
  const response = await fetch(statusUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": xVerifyChecksum,
      "X-MERCHANT-ID": merchantTransactionId,
      accept: "application/json",
    },
  });

  const dataa: paymentResponse = await response.json();
  console.log(dataa);
  const { data } = dataa;
  return data;
}

export async function paymentRefund(payload: {
  merchantId: string;
  originalTransactionId: string;
  amount: number;
}) {
  try {
    let { merchantId, originalTransactionId, amount } = payload;
    const merchantTransactionId = uuid();
    const base64Data = {
      merchantId,
      originalTransactionId,
      merchantTransactionId,
      amount,
    };
    const base64EncodedPayload = Buffer.from(
      JSON.stringify(base64Data),
      "utf8"
    ).toString("base64");

    const statusUrl = `${phonePayConfig.phonePayHost}/pg/v1/refund`;
    const stringToHash =
      base64EncodedPayload + "/pg/v1/refund" + phonePayConfig.saltKey;
    const sha256_val = await sha256(stringToHash);
    const xVerifyChecksum = sha256_val + "###" + phonePayConfig.saltIndex;

    const response = await fetch(statusUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerifyChecksum,
      },
      body: JSON.stringify({ requset: base64EncodedPayload }),
    });
    console.log(base64EncodedPayload, "----", xVerifyChecksum);
    console.log(base64Data.merchantTransactionId);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error: any) {
    console.error(error + " refund error");
    return error.message;
  }
}
