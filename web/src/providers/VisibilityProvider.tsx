import React, {Context, createContext, useContext, useEffect, useState} from "react";
import {useNuiEvent} from "../hooks/useNuiEvent";
import {fetchNui} from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";

import App from '../components/App';

import { PartyNotifications, PartyNotiState } from "../components/PartyNotifications";
import { RepNotifications, RepNotiState } from "../components/RepNotifications";


const VisibilityCtx = createContext<VisibilityProviderValue | null>(null)

interface VisibilityProviderValue {
  setVisible: (visible: boolean) => void
  visible: boolean
}



// This should be mounted at the top level of your application, it is currently set to
// apply a CSS visibility value. If this is non-performant, this should be customized.
export const VisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false)

  const [partyNoti, setPartyNoti] = useState<PartyNotiState>({
    isin: false,
    name: "none",
    message: "none",
  });

  const [repNoti, setRepNoti] = useState<RepNotiState>({
    isin: false,
    name: "none",
    lvl: 0,
    xp: [0,100]
  });

  function triggerPartyNoti(newname: string, newmessage: string) {
    setPartyNoti({ isin: true, name: newname, message: newmessage });
    setTimeout(() => {
      setPartyNoti((currentData) => {
        return { ...currentData, isin: false };
      });
    }, 3000);
  }

  function triggerRepNoti(newname: string, newlvl: number, newxp: number[]) {
    setRepNoti((currentData) => {
      return { ...currentData, isin: false };
    })
    setRepNoti({ isin: true, name: newname, lvl: newlvl, xp: newxp});
    setTimeout(() => {
      setRepNoti((currentData) => {
        return { ...currentData, isin: false };
      })
    }, 3000);
  }


  useNuiEvent<boolean>('setVisible', setVisible)

  // Handle pressing escape/backspace
  useEffect(() => {
    // Only attach listener when we are visible
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (["Escape"].includes(e.code)) {
        if (!isEnvBrowser()) fetchNui("hideFrame");
        else setVisible(!visible);
      }
    }

    window.addEventListener("keydown", keyHandler)

    return () => window.removeEventListener("keydown", keyHandler)
  }, [visible])

  return (
    <>
      <PartyNotifications isin={partyNoti.isin} name={partyNoti.name} message={partyNoti.message}/>
      <RepNotifications isin={repNoti.isin} name={repNoti.name} lvl={repNoti.lvl} xp={repNoti.xp}/>
      <VisibilityCtx.Provider
        value={{
          visible,
          setVisible
        }}
      >
      <div style={{ visibility: visible ? 'visible' : 'hidden', height: '100%'}}>
        <App triggerPartyNoti={triggerPartyNoti} triggerRepNoti={triggerRepNoti}/>
      </div>
    </VisibilityCtx.Provider>
  </>
  )
}

export const useVisibility = () => useContext<VisibilityProviderValue>(VisibilityCtx as Context<VisibilityProviderValue>)
