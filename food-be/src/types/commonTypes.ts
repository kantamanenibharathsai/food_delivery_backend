export type ADMIN = "ADMIN";
export type CUSTOMER = "CUSTOMER";
export type SELLER = "SELLER";

export type role = ADMIN | CUSTOMER | SELLER;

export type SUCCESS = "SUCCESS";
export type FAILED = "FAILED";
export type PENDING = "PENDING";
export type CREATED = "CREATED";
export type CANCELLED = "CANCELLED";

export type orderStatus = SUCCESS | FAILED | PENDING | CREATED | CANCELLED;

export type CASH_ON_DELIVERY = "COD";
export type UPI = "UPI";
export type CARD = "CARD";

export type paymentType = CASH_ON_DELIVERY | UPI | CARD;
