import { error } from "console";
import { stat } from "fs";

export const authErrors = {
  EMAIL_ALREADY_IN_USE: {
    status: 400,
    error: "Email Already In Use",
  },
  MOBILE_NO_ALREADY_IN_USE: {
    status: 400,
    error: "Mobile No Already In Use",
  },
  INCORRECT_PASSWORD: {
    status: 401,
    error: "Incorrect Password",
  },
  INCORRECT_OLD_PASSWORD: {
    status: 400,
    error: "Incorrect Old Password",
  },
  PASSWORD_MUST_BE_STRING: {
    status: 400,
    error: "Password Must Be String",
  },
  PASSORD_NOT_MATCHED: {
    status: 400,
    error: "Password Do Not Match",
  },
  PROVIDE_TOKEN: {
    status: 401,
    error: "Please provide Token",
  },
  INVALID_TOKEN: {
    status: 401,
    error: "Invalid jwtToken",
  },
};

export const userErrors = {
  USER_NOT_FOUND: {
    status: 404,
    error: "User Not Found",
  },

  INTERNAL_SERVER_ERROR: {
    status: 500,
    error: "Internal Server Error",
  },

  USER_NOT_REGESTERED: {
    status: 404,
    error: "User not Registered",
  },

  USER_NOT_ACTIVE: {
    status: 400,
    error: "User Not Active",
  },

  ADMIN_EXISTS: {
    status: 400,
    error: "Admin already exists",
  },

  USER_NOT_VERIFIED: {
    status: 400,
    error: "User Not Verified",
  },

  INCORRECT_OTP: {
    status: 400,
    error: "Incorrect Otp",
  },

  INVALID_OTP: {
    status: 400,
    error: "Invalid Otp ",
  },
  OTP_EXPIRED: {
    status: 400,
    error: "Otp Time Expired",
  },
  USER_ALREADY_VERIFIED: {
    status: 400,
    error: "User already verified",
  },
  PASSWORD_MISSMATCH: {
    status: 400,
    error: "Password Missmatch",
  },
  INCORRECT_OLD_PASSWORD: {
    status: 400,
    error: "Incorrect Password",
  },
};

export const productCategoyErrors = {
  PRODUCT_CATEGORY_NOT_FOUND: {
    status: 404,
    error: "Product Category Not Found",
  },
  PRODUCT_CATEGORY_ID_NOT_FOUND: {
    status: 404,
    error: "Product Category Id Not Found or Not Valid",
  },
  PRODUCT_CATEGORY_FOUND_SUCCESSFULLY: {
    status: 200,
    message: "Product Category Found Successfully",
  },
  PRODUCT_CATEGORY_CREATED_SUCCESSFULLY: {
    status: 201,
    message: "Product Category Created Successfully",
  },
  PRODUCT_CATEGORY_UPDATED_SUCCESSFULLY: {
    status: 200,
    message: "Product Category Updated Successfully",
  },
  PRODUCT_CATEGORY_DELETED_SUCCESSFULLY: {
    status: 200,
    message: "Product Category Deleted Successfully",
  },
};

export const businessErrors = {
  BUSINESS_WITH_SAME_NAME_ALREADY_EXISTS: {
    status: 400,
    error: "Business with same name already exists",
  },
  BUSINESS_NOT_FOUND: {
    status: 400,
    error: "Business Not found",
  },
  UPI_ALREADY_EXISTS: {
    status: 400,
    error: "Upi Already Exists",
  },
  BANK_ACCOUNT_ALREADY_EXISTS: {
    status: 400,
    error: "Bank Account Already Exists",
  },
};

export const addressErrors = {
  ADDRESS_NOT_FOUND: {
    status: 404,
    error: "Address Not Found",
  },
  UNAUTHORIZED_USER: {
    status: 401,
    error: "Unauthorized User",
  },
  ADRESS_NOT_FOUND: {
    status: 404,
    error: "Adress Not Found",
  },
};

export const productErrors = {
  PRODUCT_NOT_FOUND: {
    status: 404,
    error: "Product Not Found",
  },
  PRODUCT_ALREADY_EXISTS: {
    status: 400,
    error: "Product already exists",
  },
  CREATE_BUSINESS_TO_ADD_PRODUCT: {
    status: 400,
    error: "Create Business to add product",
  },
  NO_PERMISSION_TO_UPDATE_PRODUCT: {
    status: 400,
    error: "No permission to update product",
  },
  INSUFFICIENT_STOCK: {
    status: 400,
    error: "Insufficient Stock",
  },
  INVALID_PRODUCT_ID: {
    status: 400,
    error: "Invalid Product Id",
  },
  NO_PERMISSION_TO_DELETE_PRODUCT: {
    status: 400,
    error: "No permission to delete product",
  },
};

export const orderErrors = {
  ORDER_NOT_FOUND: {
    status: 404,
    error: "Order Not Found",
  },
};

export const bestOfferErrors = {
  BEST_OFFER_NOT_FOUND: {
    status: 404,
    error: "Best Offer Not Found",
  },
  INVALID_BEST_OFFER_ID: {
    status: 400,
    error: "Invalid Best Offer Id",
  },
};

export const categoryErrors = {
  CATEGORY_ALREADY_EXISTS: {
    status: 400,
    error: "Category already exists",
  },
  CATEGORY_NOT_FOUND: {
    status: 404,
    error: "Category Not Found",
  },
  SUB_CATEGORY_NOT_FOUND: {
    status: 404,
    error: "Sub Category Not Found",
  },
  SUBCATEGORY_ALREADY_EXISTS: {
    status: 400,
    error: "Sub Category already exists",
  },
  INVALID_CATEGORY_ID: {
    status: 400,
    error: "Invalid Category Id",
  },
  INVALID_BUSINESS_ID: {
    status: 400,
    error: "Invalid Business Id",
  },
};

export const bestChoiceErrors = {
  BEST_CHOICE_NOT_FOUND: {
    status: 404,
    error: "Best Choice Not Found",
  },
};

export const todaySpecialErrors = {
  TODAY_SPECIAL_NOT_FOUND: {
    status: 404,
    error: "Today Special Not Found",
  },
  PRODUCT_NOT_FOUND: {
    status: 404,
    error: "Product Not Found",
  },
  PRODUCT_ALREADY_EXISTS: {
    status: 400,
    error: "Product already exists",
  },
};

export const paymentErrors = {
  PAYMENT_NOT_FOUND: {
    status: 404,
    error: "Payment Not Found",
  },
};

export const cartErros = {
  CART_NOT_FOUND: {
    status: 404,
    error: "Cart Not Found",
  },
  EMPTY_CART: {
    status: 400,
    error: "Empty Cart",
  },
};

export const reviewErrors = {
  REVIEW_NOT_FOUND: {
    status: 404,
    error: "Review Not Found",
  },
  UNAUTHORIZED_USER: {
    status: 401,
    error: "Unauthorized User",
  },
};

export const searchErrors = {
  SEARCH_NOT_FOUND: {
    status: 404,
    error: "Search Not Found",
  },
};
