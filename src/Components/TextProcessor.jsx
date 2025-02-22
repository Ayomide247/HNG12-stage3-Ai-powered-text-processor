import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbWorld } from "react-icons/tb";
import { FaRegLightbulb } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";
import { getStrLength } from "../utils/helpers/index";
import { languages } from "../utils/data";
import { useTranslator } from "./AiContext";

const TextProcessor = () => {
  const { store, setStore } = useTranslator();
  const showToast = () => {
    toast.error("Summarizer API is not available", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  useEffect(() => {
    if (store.messages.trim() !== "") {
      detectLanguage(store.messages);
    }
  }, [store.messages]);

  const detectLanguage = async (text) => {
    if (!("ai" in window) || !("languageDetector" in window.ai)) {
      setStore((prevState) => {
        return {
          ...prevState,
          error: () => {
            toast.error(
              "Language Detector API is not supported on this browser.",
              {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              }
            );
          },
        };
      });
      return;
    }
    try {
      const detector = await window.ai.languageDetector.create();
      await detector.ready;
      const results = await detector.detect(text);
      if (results.length > 0) {
        // ;
        setStore((prevState) => {
          return {
            ...prevState,
            detectedLanguage: results[0].detectedLanguage,
          };
        });
      }
    } catch (error) {
      setStore((prevState) => {
        return {
          ...prevState,
          error: () => {
            toast.error("Error during language detection", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
          },
        };
      });
    }
  };

  const translateLanguage = async (
    text,
    sourceLang = "en",
    targetLang = store.targetLanguage
  ) => {
    const translatorCapabilities = await self.ai.translator.capabilities();
    const isAvailable = translatorCapabilities.languagePairAvailable(
      sourceLang,
      targetLang
    );
    if (!isAvailable) {
      toast.error("Language translator is not supported on this Browser", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    const translate = async () => {
      const translator = await self.ai.translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });
      const response = await translator.translate(store.messages);
      setStore((prevState) => {
        return {
          ...prevState,
          translatedText: response,
        };
      });
    };
    if (isAvailable === "after-download") {
      setStore((prevState) => {
        return {
          ...prevState,
          downloadingLanguage: true,
        };
      });
      await self.ai.translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            setStore((prevState) => {
              return {
                ...prevState,
                downloadingLanguage: false,
              };
            });
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
      const response = await translator.translate(store.messages);

      setStore((prevState) => {
        return {
          ...prevState,
          translatedText: response,
        };
      });
    }
  };

  const handleInput = async (e) => {
    e.preventDefault();
    if (store.inputText.trim() === "");
    setStore((prevState) => {
      return {
        ...prevState,
        messages: store.inputText,
        inputText: "",
      };
    });
  };

  return (
    <form className=" md:w-[50rem] ">
      <textarea
        rows={5}
        placeholder="Enter your message here"
        className="w-full focus:outline-none p-2"
        value={store.inputText}
        onChange={(e) => {
          setStore((prevState) => {
            return {
              ...prevState,
              inputText: e.target.value,
            };
          });
        }}
        required
      />

      <div className="mt-5 flex flex-wrap items-center justify-between w-full p-2">
        <div className="flex items-center justify-center space-x-2 gap-1">
          {getStrLength(store.inputText) > 9 && (
            <div
              onClick={showToast}
              className="flex gap-1 items-center rounded-full border border-secondary w-fit p-2 cursor-pointer bg-secondary transition ease-in duration-300 shadow-lg"
            >
              <ToastContainer />
              <FaRegLightbulb className="" />
              <p className="font-light">Summarize</p>
            </div>
          )}

          {store.detectedLanguage && (
            <div className="flex items-center gap-3">
              <div className="relative inline-block">
                <div className="flex gap-1 items-center rounded-full border border-secondary w-fit p-2 cursor-pointer hover:bg-secondary transition ease-in duration-300 shadow-lg">
                  <TbWorld size={18} />
                  <select
                    onChange={(e) =>
                      setStore((prevState) => {
                        return {
                          ...prevState,
                          targetLanguage: e.target.value,
                        };
                      })
                    }
                    className="bg-transparent text-pure outline-none cursor-pointer font-light"
                  >
                    {languages.map((lang) => (
                      <option
                        key={lang.value}
                        value={lang.value}
                        className="bg-primary text-pure"
                        selected={store.targetLanguage === lang.value}
                        disabled={lang.label === "English"}
                      >
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                onClick={() => translateLanguage(store.inputText)}
                className="flex gap-1 items-center rounded-full border border-secondary w-fit p-2 px-4 cursor-pointer bg-secondary transition ease-in duration-300 shadow-lg"
              >
                <p className="font-light">Translate</p>
              </div>
              <ToastContainer />
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
