import React from "react";
import { Navbar, TextProcessor } from "../Components/index";
import { getLanguageName } from "../utils/helpers";
import { useTranslator } from "../Components/AiContext";

const Dashboard = () => {
  const {
    inputText,
    setInputText,
    messages,
    detectedLanguage,
    translatedText,
    summary,
    downloadingLanguage,
  } = useTranslator();
  return (
    <div className="flex font-roboto ">
      <div className="flex-1 min-h-screen text-pure bg-primary">
        <Navbar />
        <main className="flex flex-col md:items-center justify-between lg:h-[60%] p-4 ">
          <div className="  flex flex-col justify-between">
            <h1 className="text-[30px] font-semibold text-lightpure grid place-content-center">
              What's in your mind?
            </h1>

            <section>
              {messages === "" ? (
                ""
              ) : (
                <div className=" mt-20">
                  <p className="md:w-[50rem] h-[15rem overflow-scroll ">
                    {messages}
                  </p>
                  <div className="mb-4 p-2 border border-gray-700 w-fit rounded-lg text-sm text-pure">
                    <p>
                      <strong>Detected Language: </strong>
                      {getLanguageName(detectedLanguage)
                        ? getLanguageName(detectedLanguage)
                        : detectedLanguage}
                    </p>
                  </div>
                </div>
              )}

              {downloadingLanguage ? (
                <h2>Loading...</h2>
              ) : translatedText === "" ? (
                ""
              ) : (
                <div className="shadow mt-20">
                  <div>Translation: </div>
                  <p className="md:w-[50rem] h-[15rem] overflow-scroll ">
                    {translatedText}
                  </p>
                </div>
              )}

              {summary === "" ? (
                ""
              ) : (
                <div className="shadow mt-20">
                  <div>Summary (Max 150 chars):</div>
                  <p className="md:w-[50rem] h-[15rem] overflow-scroll ">
                    {summary}
                  </p>
                </div>
              )}
            </section>
            <section className="flex flex-col justify-between bg-[#303030] rounded-2xl w-full px-2 py-3 mt-20">
              <TextProcessor />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
