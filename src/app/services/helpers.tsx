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
  if (!value) return "";
  return `€${value.toLocaleString("en-US").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};
