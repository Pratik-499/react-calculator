import React from "react";
import { ToastProvider } from 'react-toast-notifications'
import Calc from "./Calc";

const App = () => {
  return (
    <ToastProvider>
      <Calc />
    </ToastProvider>
  );
};

export default App;
