import React from "react";

export default function MediaPlaceholder({ imagePath, videoUrl, label, className = "" }) {
  if (videoUrl) {
    return (
      <video
        className={className}
        src={videoUrl}
        controls
        style={{ width: "100%", borderRadius: "var(--radius-md)", border: "1px solid var(--color-hairline)" }}
      />
    );
  }

  return (
    <img
      className={className}
      src={imagePath}
      alt={`Screenshot of ${label}`}
      style={{ width: "100%", borderRadius: "var(--radius-md)", border: "1px solid var(--color-hairline)" }}
    />
  );
}
