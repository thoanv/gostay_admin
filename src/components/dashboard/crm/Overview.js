import React from "react";
import '../../../../public/style.css';
import LineIndicator from "./LineIndicator";

const Overview = () => {

  return (
    <div className="gx-card-overview">
      <div className="gx-overview-row">
        <div className="gx-line-indicator-col">
          <h2 className="h4 gx-card-title">Revenu Overview</h2>
          <ul className="gx-line-indicator">
            <li>
              <LineIndicator width="25%" title="Australia" color="purple" value="25%" />
            </li>
            <li>
              <LineIndicator width="40%" title="United State" color="green" value="40%" />
            </li>
            <li>
              <LineIndicator width="28%" title="Canada" color="yellow" value="28%" />
            </li>
            <li>
              <LineIndicator width="18%" title="New Zealand" color="grey" value="18%" />
            </li>
          </ul>
        </div>
        <div className="gx-overview-description">
          <div className="gx-revenu gx-revenu-total">
            <h1>$2,650</h1>
            <span className="gx-fs-md">Total Revenu</span>
          </div>

          <div className="gx-revenu">
            <div className="gx-revenu-row">
              <div className="gx-revenu-col">
                <h3>23</h3>
                <span className="gx-fs-sm">Clients</span>
              </div>

              <div className="gx-revenu-col">
                <h3>07</h3>
                <span className="gx-fs-sm">Countries</span>
              </div>
            </div>
          </div>
        </div>
        <div className="gx-map-col">
          {/* <BubbleMap /> */}
        </div>
      </div>
    </div>

  );
};

export default Overview;
