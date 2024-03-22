import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import Favicon from "react-favicon";

import App from "./app";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Favicon url="./favicon.ico"/>
    <App />
  </StrictMode>,
);
