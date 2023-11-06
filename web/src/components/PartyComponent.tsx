import React, { useState, useEffect } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import your icons
import {
  faRightFromBracket,
  faCrown,
  faUserXmark,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

interface PartyMember {
  cid: number;
  name: string;
  citizenid: string;
}

interface PartyData {
  code: string;
  leader: string;
  members: PartyMember[];
}

interface PartyUpdate {
  self: PartyMember;
  party: PartyData;
}

export const PartyComponent: React.FC = () => {
  const [partyData, setPartyData] = useState<PartyData>();
  const [playerInfo, setPlayerInfo] = useState<PartyMember>();
  const [joinInput, setJoinInput] = useState<string>("");

  useNuiEvent<PartyUpdate>("updateParty", (updateData) => {
    console.log("updating party");
    setPlayerInfo(updateData.self);
    setPartyData(updateData.party);
  });

  function joinRequest() {
    fetchNui<any>("nuiJoinRequest", joinInput)
      .then((retData) => {
        console.log("join request sent");
      })
      .catch((e) => {
        console.log("join request fail");
      });
  }

  function kickRequest(target: number) {
    fetchNui<any>("nuiKickRequest", target)
      .then((retData) => {
        console.log("kick request sent");
      })
      .catch((e) => {
        console.log("kick request fail");
      });
  }

  function leaveRequest() {
    if (playerInfo?.citizenid === partyData?.leader && partyData?.members.length === 1) {
      newCodeRequest()
      return
    }
    fetchNui<any>("nuiLeaveRequest")
      .then((retData) => {
        console.log("leave request sent");
      })
      .catch((e) => {
        console.log("leave request fail");
      });
  }

  function newCodeRequest() {
    fetchNui<any>("nuiNewCodeRequest")
      .then((retData) => {
        console.log("newcode request sent");
      })
      .catch((e) => {
        console.log("newcode request fail");
      });
  }

  return (
    <div className="top-info">
      <div className="code-container">
        <form action="" id="join-party-form">
          <input
            type="text"
            id="code-input"
            name="code-input"
            value={joinInput}
            onChange={(e) => setJoinInput(e.target.value)}
          ></input>
          <button
            id="code-submit"
            className="btn"
            type="button"
            onClick={joinRequest}
          >
            Join
          </button>
        </form>
        <div className="code-inner">
          <div id="party-code">{partyData?.code || "no code"}</div>
          {partyData?.leader === playerInfo?.citizenid && (
            <div className="btn-code-refresh btn" onClick={newCodeRequest}>
              <FontAwesomeIcon
                icon={faArrowsRotate}
                style={{ color: "#6060b8" }}
              />
            </div>
          )}
        </div>
        <div className="btn-leave btn btn-danger" onClick={leaveRequest}>
          <FontAwesomeIcon
            icon={faRightFromBracket}
            style={{ color: "#6060b8" }}
          />
        </div>
      </div>
      <div className="party-container">
        {partyData &&
          partyData.members.map((member) => {
            return (
              <div className="party-member">
                <div className="filler"></div>
                <span className="party-member-name">{member.name}</span>
                <div className="filler"></div>
                {partyData.leader === member.citizenid ? (
                  <button className="party-leader">
                    <FontAwesomeIcon
                      icon={faCrown}
                      style={{ color: "#b49e0e" }}
                    />
                  </button>
                ) : (
                  playerInfo?.citizenid === partyData.leader && (
                    <button
                      className="btn btn-kick btn-danger"
                      onClick={() => kickRequest(member.cid)}
                    >
                      <FontAwesomeIcon
                        icon={faUserXmark}
                        style={{ color: "#6060b8" }}
                      />
                    </button>
                  )
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
