import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
import { FaRegLightbulb } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";
import { getStrLength } from "../utils/helpers/index";
import { languages } from "../utils/data";
import { useTranslator } from "./AiContext";

const TextProcessor = () => {
  const {
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
    setDownloadingLanguage,
  } = useTranslator();
  const detectedLanguageRef = useRef("");

  useEffect(() => {
    if (messages.trim() !== "") {
      detectLanguage(messages);
    }
  }, [messages]);

  const detectLanguage = async (text) => {
    if (!("ai" in window) || !("languageDetector" in window.ai)) {
      console.error("Language Detector API is not available in this browser.");
      return;
    }
    try {
      const detector = await window.ai.languageDetector.create();
      await detector.ready;
      const results = await detector.detect(text);
      if (results.length > 0) {
        setDetectedLanguage(results[0].detectedLanguage);
      }
    } catch (error) {
      console.error("Error during language detection:", error);
    }
  };

  if ("ai" in self && "translator" in self.ai) {
    // console.log("AI DEY");
    // The Translator API is supported.
  }
  const translateLanguage = async (
    text,
    sourceLang = "en",
    targetLang = targetLanguage
  ) => {
    const translatorCapabilities = await self.ai.translator.capabilities();
    const isAvailable = translatorCapabilities.languagePairAvailable(
      sourceLang,
      targetLang
    );

    const translate = async () => {
      const translator = await self.ai.translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });
      const response = await translator.translate(messages);
      setTranslatedText(response);
    };
    if (isAvailable === "after-download") {
      setDownloadingLanguage(true);
      await self.ai.translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            setDownloadingLanguage(false);
            // console.log(`Downloaded ${e.loaded} of ${e.total} bytes`);
          });
        },
      });
      translate();
    }
    if (isAvailable === "readily") {
      const translator = await self.ai.translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });
      const response = await translator.translate(messages);
      console.log(response);
      setTranslatedText(response);
    }
  };
  // translateLanguage();

  const translateText = async (text, targetLang = "en") => {
    const API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, target: targetLang }),
      });

      const data = await response.json();
      console.log(data);

      setTranslatedText(data.data.translations[0].translatedText);
    } catch (error) {
      console.error("Translation Error:", error);
    }
  };

  // const summarizeText = async (text) => {
  //   const API_KEY = import.meta.env.VITE_APP_SUMMARIZER_API_KEY;
  //   const url =
  //     "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${API_KEY}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ inputs: text, max_length: 150 }),
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //     setSummary(data[0].summary_text);
  //   } catch (error) {
  //     console.error("Summarization Error:", error);
  //   }
  // };

  const handleInput = async (e) => {
    e.preventDefault();
    if (inputText.trim() === "");
    setMessages(inputText);
    await translateText(inputText);
    // await summarizeText(inputText);
    setInputText("");
  };

  return (
    <form className=" md:w-[50rem] ">
      <textarea
        rows={5}
        placeholder="Enter your message here"
        className="w-full focus:outline-none p-2"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        required
      />
      <div className="mt-5 flex flex-wrap items-center justify-between w-full p-2">
        <div className="flex items-center justify-center space-x-2 gap-1">
          {getStrLength(inputText) > 9 && (
            <div
              onClick={() => summarizeText(messages)}
              className="flex gap-1 items-center rounded-full border border-secondary w-fit p-2 cursor-pointer bg-secondary transition ease-in duration-300 shadow-lg"
            >
              <FaRegLightbulb className="" />
              <p className="font-light">Summarize</p>
            </div>
          )}

          {detectedLanguage && (
            <div className="flex items-center gap-3">
              <div className="relative inline-block">
                <div className="flex gap-1 items-center rounded-full border border-secondary w-fit p-2 cursor-pointer hover:bg-secondary transition ease-in duration-300 shadow-lg">
                  <TbWorld size={18} />
                  <select
                    // value={selected}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="bg-transparent text-pure outline-none cursor-pointer font-light"
                  >
                    {languages.map((lang) => (
                      <option
                        key={lang.value}
                        value={lang.value}
                        className="bg-primary text-pure"
                        selected={targetLanguage === lang.value}
                      >
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                onClick={() => translateLanguage(inputText)}
                className="flex gap-1 items-center rounded-full border border-secondary w-fit p-2 px-4 cursor-pointer bg-secondary transition ease-in duration-300 shadow-lg"
              >
                <TbWorld className="" />
                <p className="font-light">Translate</p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleInput}
          className="bg-pure text-primary w-fit p-3 rounded-full shadow-lg cursor-pointer hover:bg-secondary transition ease-in duration-300"
        >
          <FaArrowUp />
        </button>
      </div>
    </form>
  );
};

export default TextProcessor;
