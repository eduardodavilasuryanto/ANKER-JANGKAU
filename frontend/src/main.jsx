import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/reset.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles/main.css";
import App from "./App.jsx";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0c8c5e",
            borderRadius: 6,
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
