import React, { useState, useEffect } from "react";

import { CSSTransition } from "react-transition-group";

export interface PartyNotiState {
    isin: boolean;
    name: string;
    message: string;
  }


export const PartyNotifications: React.FC<PartyNotiState> = ({isin, name, message}) => {

  return (
    <CSSTransition
      timeout={3000}
      classNames="noti-anim"
      in={isin}
    >
      <div className="party-noti">
        <div>
          <div>
            <span>{name}</span>
            <span>{message}</span>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};
