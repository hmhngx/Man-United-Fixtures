import React from "react";
import "./MatchHighlights.css";

const MatchHighlights = ({ highlightVideo, context = "modal" }) => {
  if (!highlightVideo) {
    return <p>No highlights available for this match.</p>;
  }

  const videoHeight = context === "table" ? "150" : "315";
  const videoWidth = context === "table" ? "100%" : "100%";

  return (
    <div className={`match-highlights ${context}`}>
      {context === "modal" && <h3>Match Highlights</h3>}
      <div className="video-container">
        <iframe
          width={videoWidth}
          height={videoHeight}
          src={highlightVideo}
          title="Match Highlights"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MatchHighlights;