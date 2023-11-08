import React, { useState, useEffect } from "react";

import { TransitionGroup, CSSTransition } from "react-transition-group";

export interface PartyNotiState {
    isin: boolean;
    name: string;
    message: string;
  }


export const Notifications: React.FC<PartyNotiState> = ({isin, name, message}) => {

  return (
    <CSSTransition
      timeout={3000}
      classNames="party-noti-anim"
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
