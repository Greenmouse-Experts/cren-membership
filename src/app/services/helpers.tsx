// @ts-nocheck
export const getLocalToken = (key) => {
  if (typeof window !== "undefined" && typeof window.localStorage?.getItem === "function") {
    try {
      const storageItem = window.localStorage.getItem(key);
      if (storageItem) return storageItem;
    } catch {
      return null;
    }
  }
  return null;
};
export const formatString = (string, number) => {
  if (string.length > number - 2) {
    return string.substring(0, number).concat("...");
  } else return string;
};

export const formatAsNgnMoney = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "";
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
