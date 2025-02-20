import { createContext, useContext, useState } from "react";

const TranslatorContext = createContext();

export const TranslatorProvider = ({ children }) => {
  const [messages, setMessages] = useState("");
  const [inputText, setInputText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [summary, setSummary] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("fr");
  const [downloadingLanguage, setDownloadingLanguage] = useState(false);

  return (
    <TranslatorContext.Provider
      value={{
        messages,
        setMessages,
        inputText,
        setInputText,
        detectedLanguage,
        setDetectedLanguage,
        translatedText,
        setTranslatedText,
        summary,
        setSummary,
        targetLanguage,
        setTargetLanguage,
        downloadingLanguage,
        setDownloadingLanguage,
        // sendMessage,
      }}
    >
      {children}
    </TranslatorContext.Provider>
  );
};

export const useTranslator = () => useContext(TranslatorContext);
