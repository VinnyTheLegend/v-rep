import React, { useState, useEffect } from "react";
import { RepList } from "./RepList";
import "./App.css";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { PartyComponent } from "./PartyComponent";


// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

const App: React.FC = () => {

  return (
    <div className="nui-wrapper">
      <div className="main-container">
          <PartyComponent />
        <div className="rep-list-container">
          <RepList />
        </div>
      </div>
    </div>
  );
};

export default App;
