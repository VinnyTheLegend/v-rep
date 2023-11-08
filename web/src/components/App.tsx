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

export interface ParentProps {
  triggerPartyNoti: Function
  triggerRepNoti: Function
}

const App: React.FC<ParentProps> = ({triggerPartyNoti, triggerRepNoti}) => {

  return (
    <div className="nui-wrapper">
      <div className="main-container">
          <PartyComponent triggerPartyNoti={triggerPartyNoti}/>
        <div className="rep-list-container">
          <RepList  triggerRepNoti={triggerRepNoti}/>
        </div>
      </div>
    </div>
  );
};

export default App;
