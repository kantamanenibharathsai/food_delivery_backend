import { messaging } from "firebase-admin";

export const userMessages = {
  USER_CREATED_SUCCESSFULLY: {
    status: 201,
    message: "User Created Successfully",
  },
  USER_LOGIN_SUCCESS: {
    status: 200,
    message: "User Login Successfully",
  },

  USER_UPDATION_SUCCESS: {
    status: 200,
    message: "User Updated Successfully",
  },

  SEND_OTP_SUCCESS: {
    status: 200,
    message: "OTP Send Successfully",
  },

  RESET_PASSWORD_SUCCESS: {
    status: 200,
    message: "Password Reset Successfully",
  },

  VERIFY_OTP_SUCCESS: {
    status: 200,
    message: "OTP Verified Successfully",
  },

  PASSWORD_UPDATE_SUCCESS: {
    status: 200,
    message: "Password Updated Successfully",
  },

  USER_PROFILE_UPDATE_SUCCESS: {
    status: 200,
    message: "Profile Updated Successfully",
  },
};

export const orderSuccessMessages = {
  ORDER_PLACED_SUCCESSFULLY: {
    status: 201,
    message: "Order Placed Successfully",
  },
  PAYEMENT_SUCCESS: {
    status: 200,
    message: "Payment Successfull",
  },
};

export const addressMessages = {
  ADDRESS_ADDED_SUCCESSFULLY: {
    status: 201,
    message: "Address Added Successfully",
  },
  ADDRESS_UPDATED_SUCCESSFULLY: {
    status: 200,
    message: "Address Updated Successfully",
  },
  ADDRESS_DELETED_SUCCESSFULLY: {
    status: 200,
    message: "Address Deleted Successfully",
  },
};

export const reviewMessages = {
  REVIEW_ADDED_SUCCESSFULLY: {
    status: 201,
    message: "Review Added Successfully",
  },
  REVIEW_UPDATED_SUCCESSFULLY: {
    status: 200,
    message: "Review Updated Successfully",
  },
  REVIEW_DELETED_SUCCESSFULLY: {
    status: 200,
    message: "Review Deleted Successfully",
  },
  REVIEW_FOUND_SUCCESSFULLY: {
    status: 200,
    message: "Review Found Successfully",
  },
};

export const cartMessages = {
  ITEM_ADDED_TO_CART: {
    status: 201,
    message: "Item Added To Cart",
  },
  ITEM_REMOVED_FROM_CART: {
    status: 200,
    message: "Item Removed From Cart",
  },
  CART_UPDATED_SUCCESSFULLY: {
    status: 200,
    message: "Cart Updated Successfully",
  },
  CLEANED_CART_SUCCESSFULLY: {
    status: 200,
    message: "Cart cleard Successfully"
  },
  CART_FOUND_SUCCESSFULLY: {
    status: 200,
    message: "Cart Found Successfully",
  },
};

export const bestChoiceMessages = {
  BEST_CHOICE_ADDED_SUCCESSFULLY: {
    status: 201,
    message: "Best Choice Added Successfully",
  },
  BEST_CHOICE_UPDATED_SUCCESSFULLY: {
    status: 200,
    message: "Best Choice Updated Successfully",
  },
  BEST_CHOICE_DELETED_SUCCESSFULLY: {
    status: 200,
    message: "Best Choice Deleted Successfully",
  },
  BEST_CHOICE_FOUND_SUCCESSFULLY: {
    status: 200,
    message: "Best Choice Found Successfully",
  },
};

export const todaySpecialMessages = {
  TODAY_SPECIAL_ADDED_SUCCESSFULLY: {
    status: 201,
    message: "Today Special Added Successfully",
  },
  TODAY_SPECIAL_UPDATED_SUCCESSFULLY: {
    status: 200,
    message: "Today Special Updated Successfully",
  },
  TODAY_SPECIAL_DELETED_SUCCESSFULLY: {
    status: 200,
    message: "Today Special Deleted Successfully",
  },
  TODAY_SPECIAL_FOUND_SUCCESSFULLY: {
    status: 200,
    message: "Today Special Found Successfully",
  },
};

export const bestOfferMessages = {
  BEST_OFFER_ADDED_SUCCESSFULLY: {
    status: 201,
    message: "Best Offer Added Successfully",
  },
  BEST_OFFER_UPDATED_SUCCESSFULLY: {
    status: 200,
    message: "Best Offer Updated Successfully",
  },
  BEST_OFFER_DELETED_SUCCESSFULLY: {
    status: 200,
    message: "Best Offer Deleted Successfully",
  },
  BEST_OFFER_FOUND_SUCCESSFULLY: {
    status: 200,
    message: "Best Offer Found Successfully",
  },
  PRODUCT_ADDED_TO_BEST_OFFER: {
    status: 201,
    message: "Product Added To Best Offer",
  },
};

export const searchMessages = {
  SEARCH_FOUND_SUCCESSFULLY: {
    status: 200,
    message: "Search Found Successfully",
  },
  SEARCH_CREATED_SUCCESSFULLY: {
    status: 201,
    message: "Search Created Successfully",
  },
};

export const businessMessages = {
  BUSINESS_FOUND_SUCCESSFULLY: {
    status: 200,
    message: "Business Found Successfully",
  },
  BUSINESS_CREATED_SUCCESSFULLY: {
    status: 201,
    message: "Business Created Successfully",
  },
  BUSINESS_UPDATED_SUCCESSFULLY: {
    status: 200,
    message: "Business Updated Successfully",
  },
  BUSINESS_DELETED_SUCCESSFULLY: {
    status: 200,
    message: "Business Deleted Successfully",
  },
  BANK_DETAILS_ADDED_SUCCESSFULLY: {
    status: 201,
    message: "Bank Details Added Successfully",
  },
  UPI_ADDED_SUCCESSFULLY: {
    status: 201,
    message: "Upi Added Successfully",
  },
};

export const categoryMessages = {
  CATEGORY_CREATED_SUCCESSFULLY: {
    status: 201,
    message: "Category Created Successfullt",
  },
  CATEGORT_UPDATED_SUCCESSFULLY: {
    status: 200,
    message: "Category Updated Successfully",
  },
  CATEGORY_FOUND_SUCCESSFULLY: {
    status: 200,
    messages: "Category Found Successfully",
  },
  CATEGORY_REMOVED_SUCCESSFULLY: {
    status: 200,
    message: "Category Removed Successfully",
  },
  BUSINESS_CATEGORY_CREATED_SUCCESFULLY: {
    status: 201,
    message: "Business Category Created Successfully",
  },
  BUSINESS_CATEGORY_FOUND_SUCCESSFULLY: {
    status: 200,
    message: "Business Category Found Successfully",
  },
};

export const productMessages = {
  PRODUCT_FOUND_SUCCESSFULLY: {
    status: 200,
    message: "Product Found Successfully",
  },
  PRODUCT_CREATED_SUCCESSFULLY: {
    status: 201,
    message: "Product Created Successfully",
  },
  PRODUCT_UPDATED_SUCCESSFULLY: {
    status: 200,
    message: "Product Updated Successfully",
  },
  PRODUCT_DELETED_SUCCESSFULLY: {
    status: 200,
    message: "Product Deleted Successfully",
  },
  PRODUCT_REMOVED_SUCCESSFULLY: {
    status: 200,
    message: "Product Removed Successfully",
  },
};
