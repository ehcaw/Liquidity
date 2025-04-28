import { useState } from "react";
import "./App.css";
import Atm from "./components/atm-process";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      <Atm />
    </div>
  );
}

export default App;
