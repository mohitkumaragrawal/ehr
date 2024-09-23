import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SmartContractProvider } from "./SmartContractProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SmartContractProvider>
      <App />
    </SmartContractProvider>
  </React.StrictMode>
);
