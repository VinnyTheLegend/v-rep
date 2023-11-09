import React, { useState, useEffect } from "react";

import { CSSTransition } from "react-transition-group";

export interface RepNotiState {
  isin: boolean;
  name: string;
  lvl: number;
  xp: [number, number];
}

export const RepNotifications: React.FC<RepNotiState> = ({
  isin,
  name,
  lvl,
  xp,
}) => {
  return (
    <CSSTransition timeout={3000} classNames="noti-anim" in={isin}>
      <div className="rep-noti" >
        <div>
          <div>
            <span>
              {name} LVL: {lvl}
            </span>
          </div>
          <div className="noti-bar-container">
            <div className="noti-bar" style={{ width: `${(xp[0]/xp[1]) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};
