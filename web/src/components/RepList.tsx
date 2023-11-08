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
  debugData<any>(
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
  fakepartyupdate = {
    self: { name: "Vinny", cid: 1, citizenid: "asdbcvc" },
    party: {
      code: "xaTsAw",
      leader: "asdbcvc",
      members: [
        { name: "Vinny", cid: 1, citizenid: "asdbcvc" },
        { name: "Spencer", cid: 2, citizenid: "askdekek" },
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
    20000
  );
  fakepartyupdate = {
    self: { name: "Vinny", cid: 1, citizenid: "asdbcvc" },
    party: {
      code: "xaTsAw",
      leader: "asdbcvc",
      members: [
        { name: "Vinny", cid: 1, citizenid: "asdbcvc" },
        { name: "Spencer", cid: 2, citizenid: "askdekek" },
        { name: "Nimmy", cid: 4, citizenid: "cvsjujds" },
        { name: "Silva", cid: 5, citizenid: "ghkhbjjty" },
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
    20500
  );
}

export type RepData = RepItem[];

interface NotiProps {
  triggerRepNoti: Function
}

export const RepList: React.FC<NotiProps> = ({triggerRepNoti}) => {
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
          fakeData();
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
          triggerRepNoti(newItem.id, newItem.lvl, newItem.xp)
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
