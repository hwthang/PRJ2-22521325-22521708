import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoutes from "./features/auth/AuthRoutes";

function App() {
  const appRoutes = [<AuthRoutes />];
  return (
    <>
      {appRoutes.map((routes, index) => (
        <div key={index}>{routes}</div>
      ))}
    </>
  );
}

export default App;
