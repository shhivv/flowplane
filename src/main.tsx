import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { appWindow } from "@tauri-apps/api/window";
import Portal from "./Portal";

import { enable } from "tauri-plugin-autostart-api";

enable().then().catch(console.error);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // Re add strict mode
  appWindow.label === "main" ? <App /> : <Portal />,
);
