import React from "react";
import "./App.css";
import Card from "./Cmponents/Card";

function App() {
  return (
    <div className="app">
      <Card buttonText="red" />
      <Card buttonText="blue" />
      <Card buttonText="yellow" />
    </div>
  );
}

export default App;
