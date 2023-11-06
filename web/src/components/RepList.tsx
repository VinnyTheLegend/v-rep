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
          const fakereps: RepData = [
            { id: "Bank Robbery", lvl: 5, xp: [50, 100] },
            { id: "House Robbery", lvl: 2, xp: [25, 100] },
          ];
          debugData([
            {
              action: "initRepData",
              data: fakereps,
            },
          ]);
          const fakeitem: RepItem = { id: "Boosting", lvl: 3, xp: [10, 100] };
          debugData([
            {
              action: "updateRepItem",
              data: fakeitem,
            },
          ]);
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
