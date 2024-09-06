import React, { useState } from "react";
import GrandStaffQuiz from "./GrandStaffQuiz";

const Resources = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 text-white">Resources</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-800 flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Songs We're Learning
          </h2>
          <div className="flex-grow">
            <iframe
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/playlist/5I4bxWhUVi9mj1Qpcb6CC5?utm_source=generator&theme=0"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"></iframe>
          </div>
        </div>

        <div className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              Bridges Rock Band Enrollment Form
            </h2>
            <a
              href="/BridgesRockBandEnrollment.pdf"
              download
              className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded">
              Download
            </a>
          </div>
          <div className="relative" style={{ paddingTop: "141.42%" }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            <iframe
              src="/BridgesRockBandEnrollment.pdf"
              className="absolute top-0 left-0 w-full h-full"
              style={{ border: "none" }}
              onLoad={handleIframeLoad}
              title="Bridges Rock Band Enrollment"></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
