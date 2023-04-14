import React, { Component } from "react";
import { getAllACCOUNT } from "../../../actions/AccountAction.js";
import Metrics from "../../Metrics";
import { Avatar } from "antd";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import "../../../../public/style.css";
import AvatarDashBoard from "../../AvatarDashboard/index.js";

class NewCustomers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        paging: {
          page: 1,
          perpage: 4
        },
        sort: {
          type: "desc",
          attr: "created_at"
        }
      }
    };
  }
  componentDidMount() {
    this.props.getAllRegistered(this.state.filter, "registered");
  }
  render() {
    const { listRegistered, config } = this.props;
    const listCustomers = listRegistered;

    return (
      <Metrics title="NEW CUSTOMERS">
        <div className="gx-customers">
          <ul className="gx-list-inline gx-customers-list gx-mb-0">
            {listCustomers.map((user, index) => (
              <li className="gx-mb-2" key={index}>
                <Link to="/app/account/registered">
                  {user.image ? (
                    <Avatar
                      src={config.url_asset_root + user.image}
                      alt={`${user.firstname} ${user.lastname}`}
                      size={50}
                    ></Avatar>
                  ) : (
                    <AvatarDashBoard
                      src={config.url_asset_root + 'backup.png'}
                      alt={`user`}
                      style={{ height: "50px" }}
                    ></AvatarDashBoard>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Metrics>
    );
  }
}

const mapStateToProps = state => {
  return {
    listRegistered: state.account.listAccount,
    config: state.config
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllRegistered: (filter, data) => dispatch(getAllACCOUNT(filter, data))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewCustomers);
