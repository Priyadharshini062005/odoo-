import React, { useState } from "react";

interface SustainabilityBannerProps {
  carbonFootprintScore: number | string;
  description: string;
}

const SustainabilityBanner: React.FC<SustainabilityBannerProps> = ({
  carbonFootprintScore,
  description,
}) => {
  const [visibility, setVisibility] = useState(true);

  return (
    <>
      {visibility && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-6 rounded-lg shadow-md">
          <div className="text-lg font-bold mb-2">
            🌿 Make a Difference with Sustainable Choices!
          </div>
          <p className="text-md mb-4">
            This product has a <strong>carbon footprint score</strong> of{" "}
            <span className="text-green-600 font-semibold">
              {carbonFootprintScore}
            </span>
            , meaning it&apos;s designed with care for our planet. By choosing
            this, you contribute to reducing environmental impact.
          </p>
          <p className="text-sm mb-4">{description}</p>
          <div className="text-center mt-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"
              onClick={() => setVisibility(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SustainabilityBanner;
