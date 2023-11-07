import React from "react";

import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
import { useNuiEvent } from "../hooks/useNuiEvent";

import { RepItem } from "./RepList"

export const RepItemComponent: React.FC<RepItem> = ({ id, lvl, xp }) => {

  return (
    <li key={id} className="rep-item">
      <div className="rep-item-name">
        <span>{id}</span>
      </div>
      <div className="lvl">
        <span>LVL: {lvl}</span>
      </div>
      <div className="rep-item-bar-container">
        <div style={{ width: `${(xp[0]/xp[1]) * 100}%` }} className="rep-item-bar"></div>
      </div>
    </li>
  );
};
