import React, { useState, useEffect } from "react";

import { RepItemComponent } from "./RepItemComponent";

import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
import { useNuiEvent } from "../hooks/useNuiEvent";

export interface RepItem {
  id: string;
  xp: { 0: number; 1: number };
  lvl: number;
}

function fakeData() {
  const fakereps: RepData = [
    { id: "Bank Robbery", lvl: 5, xp: [50, 100] },
    { id: "House Robbery", lvl: 2, xp: [25, 100] },
  ];
  let fakeitem: RepItem = { id: "Boosting", lvl: 3, xp: [10, 100] };
  debugData<any>([
    {
      action: "initRepData",
      data: fakereps,
    },
    {
      action: "updateRepItem",
      data: fakeitem,
    },
  ]);
  let fakepartyupdate = {
    self: { name: "Vinny", cid: 1, citizenid: "asdbcvc" },
    party: {
      code: "xaTsAw",
      leader: "asdbcvc",
      members: [{ name: "Vinny", cid: 1, citizenid: "asdbcvc" }],
    },
  };
  debugData([
    {
      action: "updateParty",
      data: fakepartyupdate,
    },
  ]);
  fakepartyupdate = {
    self: { name: "Vinny", cid: 1, citizenid: "asdbcvc" },
    party: {
      code: "xaTsAw",
      leader: "asdbcvc",
      members: [
        { name: "Vinny", cid: 1, citizenid: "asdbcvc" },
        { name: "Spencer", cid: 2, citizenid: "askdekek" },
      ],
    },
  };
  debugData(
    [
      {
        action: "updateParty",
        data: fakepartyupdate,
      },
      {
        action: "updateRepItem",
        data: { id: "House Robbery", lvl: 2, xp: [90, 100] },
      },
    ],
    5000
  );
  fakepartyupdate = {
    self: { name: "Vinny", cid: 1, citizenid: "asdbcvc" },
    party: {
      code: "xaTsAw",
      leader: "asdbcvc",
      members: [
        { name: "Vinny", cid: 1, citizenid: "asdbcvc" },
        { name: "Spencer", cid: 2, citizenid: "askdekek" },
        { name: "Gio", cid: 3, citizenid: "askdujds" },
      ],
    },
  };
  debugData(
    [
      {
        action: "updateParty",
        data: fakepartyupdate,
      },
    ],
    10000
  );
  fakepartyupdate = {
    self: { name: "Vinny", cid: 1, citizenid: "asdbcvc" },
    party: {
      code: "xaTsAw",
      leader: "asdbcvc",
      members: [
        { name: "Vinny", cid: 1, citizenid: "asdbcvc" },
        { name: "Spencer", cid: 2, citizenid: "askdekek" },
        { name: "Gio", cid: 3, citizenid: "askdujds" },
        { name: "Nimmy", cid: 4, citizenid: "cvsjujds" },
      ],
    },
  };
  debugData(
    [
      {
        action: "updateParty",
        data: fakepartyupdate,
      },
    ],
    15000
  );
}

export type RepData = RepItem[];

interface NotiData {
  width: string;
  name: string;
  lvl: number;
  state: "in" | "out"
}

export const RepList: React.FC = () => {
  const [repData, setRepData] = useState<RepData>([]);
  const [notiData, setNotiData] = useState<NotiData>();

  useEffect(() => {
    async function fetchData() {
      fetchNui<any>("getRepData")
        .then((retData) => {
          console.log("Got return data from client scripts:");
          console.dir(retData);
          //setRepData(retData);
        })
        .catch((e) => {
          console.error("Setting mock data due to error", e);
          fakeData();
        });
    }

    fetchData();
  }, []);

  useNuiEvent<RepData>("initRepData", (newRepData) => {
    setRepData(newRepData);
  });

  function triggerRepNoti( new_item: RepItem, old_item: RepItem | void) {
    console.log(`${(old_item.xp[0]/old_item.xp[1]) * 100}%`)
    old_item ? 
    setNotiData({width: `${(old_item.xp[0]/old_item.xp[1]) * 100}%`, name: old_item.id, lvl: old_item.lvl, state: "out"}) :
    setNotiData({width: "0%", name: new_item.id, lvl: new_item.lvl, state: "out"})
    setTimeout(() => {
      setNotiData({width: `${(new_item.xp[0]/new_item.xp[1]) * 100}%`, name: new_item.id, lvl: new_item.lvl, state: "in"})
    }, 1000);
    setTimeout(() => {
      setNotiData({width: `${(new_item.xp[0]/new_item.xp[1]) * 100}%`, name: new_item.id, lvl: new_item.lvl, state: "out"})
    }, 5000);
  }

  const updateRepData = (newItem: RepItem) => {
    setRepData((currentData) => {
      let updated = false;
      let newData = currentData.map((item) => {
        if (item.id === newItem.id) {
          triggerRepNoti(newItem, item)
          updated = true;
          return newItem;
        }
        return item;
      });
      if (updated) {
        return newData;
      }
      return [...newData, newItem];
    });
  };

  useNuiEvent<RepItem>("updateRepItem", (newItem) => {
    updateRepData(newItem);
  });

  return (
    <>
      <ul className="rep-list">
        {repData &&
          repData.map((item) => {
            return (
              <RepItemComponent
                key={item.id}
                id={item.id}
                lvl={item.lvl}
                xp={item.xp}
              />
            );
          })}
      </ul>
      {notiData && (notiData.state === "in" ?
      (<div className="rep-noti" style={{transform: "translateY(0)"}}>
        <div>  
          <div>
            <span>{notiData.name} LVL: {notiData.lvl}</span>
          </div>
          <div className="noti-bar-container">
            <div className="noti-bar" style={{width: notiData.width}}></div>
          </div>
        </div>
      </div>) :
      (<div className="rep-noti" style={{transform: "translateY(100%)"}}>
      <div>  
        <div>
          <span>{notiData.name} LVL: {notiData.lvl}</span>
        </div>
        <div className="noti-bar-container">
          <div className="noti-bar" style={{width: notiData.width}}></div>
        </div>
      </div>
    </div>))
      }
    </>
  );
};
