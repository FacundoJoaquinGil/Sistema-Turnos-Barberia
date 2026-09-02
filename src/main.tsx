import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import AOS from "aos";
import "aos/dist/aos.css";

import App from "./App";
import "./index.css";

AOS.init({
  duration: 650,
  once: true,
  offset: 60,
  easing: "ease-out-cubic",
});

createRoot(
  document.getElementById("root")!,
).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);