import React, {useState, useEffect} from 'react';
import { RepList } from "./RepList"
import './App.css'
import {debugData} from "../utils/debugData";
import {fetchNui} from "../utils/fetchNui";
import {useNuiEvent} from "../hooks/useNuiEvent";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// import your icons
import { faRightFromBracket, faCrown, faUserXmark, faArrowsRotate } from '@fortawesome/free-solid-svg-icons'

// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: 'setVisible',
    data: true,
  }
])

interface ReturnClientDataCompProps {
  data: any
}

const ReturnClientDataComp: React.FC<ReturnClientDataCompProps> = ({data}) => (
  <>
    <h5>Returned Data:</h5>
    <pre>
      <code>
        {JSON.stringify(data, null)}
      </code>
    </pre>
  </>
)

const App: React.FC = () => {

  return (
    <div className="nui-wrapper">
      <div className="main-container">
        <div className="top-info">
          <div className="code-container">
            <form action="" id="join-party-form">
              <input type="text" id="code-input" name="code-input"></input>
              <button id="code-submit" className="btn" type="button">
                Join
              </button>
            </form>
            <div className="code-inner">
              <div id="party-code">CODE HERE</div>
              <div className="btn-code-refresh btn">
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  style={{ color: "#6060b8" }}
                />
              </div>
            </div>
            <div className="btn-leave btn btn-danger">
              <FontAwesomeIcon
                icon={faRightFromBracket}
                style={{ color: "#6060b8" }}
              />
            </div>
          </div>
          <div className="party-container">
            <div className="party-member">
              <div className="filler"></div>
              <span className="party-member-name">Vinny Legend</span>
              <div className="filler"></div>
              <button className="party-leader">
                <FontAwesomeIcon icon={faCrown} style={{ color: "#b49e0e" }} />
              </button>
            </div>
            <div className="party-member">
              <div className="filler"></div>
              <span className="party-member-name">Dikembe Mutombo</span>
              <div className="filler"></div>
              <button className="btn btn-kick btn-danger">
                <FontAwesomeIcon
                  icon={faUserXmark}
                  style={{ color: "#6060b8" }}
                />
              </button>
            </div>
            <div className="party-member">
              <div className="filler"></div>
              <span className="party-member-name">Imbatu Kem</span>
              <div className="filler"></div>
              <button className="btn btn-kick btn-danger">
                <FontAwesomeIcon
                  icon={faUserXmark}
                  style={{ color: "#6060b8" }}
                />
              </button>
            </div>
            <div className="party-member">
              <div className="filler"></div>
              <span className="party-member-name">Rick Jones</span>
              <div className="filler"></div>
              <button className="btn btn-kick btn-danger">
                <FontAwesomeIcon
                  icon={faUserXmark}
                  style={{ color: "#6060b8" }}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="rep-list-container">
          <RepList/>
        </div>
      </div>
    </div>
  );
}

export default App;
