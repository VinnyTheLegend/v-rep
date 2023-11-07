import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import your icons
import { faCrown, faUserXmark } from "@fortawesome/free-solid-svg-icons";

export const PartyMemberComponent: React.FC<any> = ({
  membercitizenid,
  playercitizenid,
  membercid,
  leader,
  name,
  kickRequest,
}) => {

  return (
    <div className="party-member-outer">
        <div className="party-member">
        <div className="filler"></div>
        <span className="party-member-name">{name}</span>
        <div className="filler"></div>
        {leader === membercitizenid ? (
            <button className="party-leader">
            <FontAwesomeIcon icon={faCrown} style={{ color: "#b49e0e" }} />
            </button>
        ) : (
            playercitizenid === leader && (
            <button
                className="btn btn-kick btn-danger"
                onClick={() => kickRequest(membercid)}
            >
                <FontAwesomeIcon icon={faUserXmark} style={{ color: "#6060b8" }} />
            </button>
            )
        )}
        </div>
    </div>
  );
};
