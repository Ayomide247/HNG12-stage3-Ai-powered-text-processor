import { languages } from "../data";

export const getStrLength = (str) => {
  return str ? String(str).length : 0;
};

export const getLanguageName = (key) => {
    return languages.filter((f) => f.value === key)?.[0]?.label
};
