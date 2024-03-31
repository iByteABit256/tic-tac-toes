import React, { useState } from "react";

function ClipboardAnimation({ textToCopy, children }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={copyToClipboard}
    >
      <span style={{ marginRight: "5px" }}>{children}</span>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10px", 
            right: "-25px",
            opacity: copied ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <Clippy
            style={{
              color: "#6a737d",
              position: "absolute",
              top: 0,
              left: 0,
              strokeDasharray: 50,
              strokeDashoffset: copied ? -50 : 0,
              transition: "all 300ms ease-in-out",
            }}
          />
          <Check
            isVisible={copied}
            style={{
              color: "#28a745", 
              position: "absolute",
              top: 0,
              left: 0,
              strokeDasharray: 50,
              strokeDashoffset: copied ? 0 : -50,
              transition: "all 300ms ease-in-out",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Clippy(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5.75 4.75H10.25V1.75H5.75V4.75Z" />
      <path d="M3.25 2.88379C2.9511 3.05669 2.75 3.37987 2.75 3.75001V13.25C2.75 13.8023 3.19772 14.25 3.75 14.25H12.25C12.8023 14.25 13.25 13.8023 13.25 13.25V3.75001C13.25 3.37987 13.0489 3.05669 12.75 2.88379" />
    </svg>
  );
}

function Check(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13.25 4.75L6 12L2.75 8.75" />
    </svg>
  );
}

export default ClipboardAnimation;
