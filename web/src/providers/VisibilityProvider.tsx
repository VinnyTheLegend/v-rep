import React, {Context, createContext, useContext, useEffect, useState} from "react";
import {useNuiEvent} from "../hooks/useNuiEvent";
import {fetchNui} from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";

import App from '../components/App';

import { Notifications, PartyNotiState } from "../components/Notifications";

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

  function triggerPartyNoti(newname: string, newmessage: string) {
    setTimeout(() => {
      setPartyNoti({ isin: true, name: newname, message: newmessage });
      setTimeout(() => {
        setPartyNoti({ isin: false, name: newname, message: newmessage });
      }, 3000);
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
      <Notifications isin={partyNoti.isin} name={partyNoti.name} message={partyNoti.message}/>
      <VisibilityCtx.Provider
        value={{
          visible,
          setVisible
        }}
      >
      <div style={{ visibility: visible ? 'visible' : 'hidden', height: '100%'}}>
        <App triggerPartyNoti={triggerPartyNoti}/>
      </div>
    </VisibilityCtx.Provider>
  </>
  )
}

export const useVisibility = () => useContext<VisibilityProviderValue>(VisibilityCtx as Context<VisibilityProviderValue>)
