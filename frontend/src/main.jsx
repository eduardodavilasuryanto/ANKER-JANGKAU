import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/reset.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles/main.css";
import App from "./App.jsx";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
