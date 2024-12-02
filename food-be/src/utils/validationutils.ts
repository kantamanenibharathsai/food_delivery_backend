const { ObjectId } = require("mongodb");

export function isValidObjectId(id: any) {
  if (!isString(id)) return false;
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

export function isString(str: any) {
  if (typeof str !== "string") return false;

  return true;
}

export function validEmail(email: string) {
  const regex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}$");
  const test = regex.test(email);
  return test;
}

export function isNumber(number: any) {
  if (typeof number === "number") return true;
  return false;
}

export function isAlphaNum(str: any) {
  const number = Number(str);
  return !isNaN(number);
}

export function isArray(arr: any) {
  return Array.isArray(arr);
}

export function isDate(date: any) {
  const dateObj = new Date(date);
  if (dateObj.toString() === "Invalid Date") {
    return false;
  }
  return true;
}
export function isValidDate(dateString: string) {
  // Regular expression to check if the date string matches YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  // Check if the date string matches the format
  if (!regex.test(dateString)) {
    return false;
  }

  // Parse the date components
  const [year, month, day] = dateString.split("-").map(Number);

  // Create a new Date object with the parsed components
  const date = new Date(year, month - 1, day);

  // Check if the Date object represents a valid date
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  return true;
}

export function isObject(obj: any) {
  return typeof obj === "object" && obj !== null;
}

export function isBoolean(bool: string): boolean {
  return bool === "true" || bool === "false";
}
