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
  const fakeitem: RepItem = { id: "Boosting", lvl: 3, xp: [10, 100] };
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
    self: {name: "Vinny", cid: 1, citizenid: "asdbcvc"},
    party: {code: "xaTsAw", leader: "asdbcvc", members: [{name: "Vinny", cid: 1, citizenid: "asdbcvc"}]}
  }
  debugData([
    {
      action: "updateParty",
      data: fakepartyupdate,
    },
  ]);
  fakepartyupdate = {
    self: {name: "Vinny", cid: 1, citizenid: "asdbcvc"},
    party: {code: "xaTsAw", leader: "asdbcvc", members: [{name: "Vinny", cid: 1, citizenid: "asdbcvc"}, {name: "Spencer", cid: 2, citizenid: "askdekek"}]}
  }
  debugData([
    {
      action: "updateParty",
      data: fakepartyupdate,
    },
  ], 5000);
}

export type RepData = RepItem[];

export const RepList: React.FC = () => {
  const [repData, setRepData] = useState<RepData>([]);

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
          fakeData()
        });
    }

    fetchData();
  }, []);

  useNuiEvent<RepData>("initRepData", (newRepData) => {
    setRepData(newRepData);
  });

  const updateRepData = (newItem: RepItem) => {
    setRepData((currentData) => {
      let updated = false;
      let newData = currentData.map((item) => {
        if (item.id === newItem.id) {
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
  );
};
