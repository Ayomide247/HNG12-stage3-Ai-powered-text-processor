import { createContext, useContext, useState } from "react";

const TranslatorContext = createContext();

export const TranslatorProvider = ({ children }) => {
  const [store, setStore] = useState({
    messages: "",
    inputText: "",
    detectedLanguage: "",
    translatedText: "",
    summary: "",
    targetLanguage: "fr",
    downloadingLanguage: false,
    error: "",
  });
  return (
    <TranslatorContext.Provider
      value={{
        store,
        setStore,
      }}
    >
      {children}
    </TranslatorContext.Provider>
  );
};

export const useTranslator = () => useContext(TranslatorContext);
