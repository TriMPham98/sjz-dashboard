import React, { useState } from "react";

const Resources = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 text-white">Resources</h1>
      <div className="bg-gray-900 p-6 rounded-lg shadow-md">
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
  );
};

export default Resources;
