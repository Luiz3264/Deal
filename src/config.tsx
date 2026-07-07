import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Cfg from "./cfg.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Cfg />
  </StrictMode>,
);
