import { Alert, Avatar, Timeline } from "antd";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "../../../../public/style.css";
import { getPaymentAction } from "../../../actions/CommonActions";
import WidgetHeader from "../../WidgetHeader/index";
import { checkToken } from "../../../actions/AuthActions";

class RecentPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getPaymentAction();
  }

  formatMoney(money) {
    if (!money) return 0;
    let index = money.indexOf(".");
    return money.slice(0, index + 3);
  }

  Time(e) {
    var d = new Date();
    let con = new Date(e.toString().replace(" ", "T"));
    let res = new Date(
      con.setMinutes(con.getMinutes() - d.getTimezoneOffset())
    );
    return moment(res).format("DD/MM/YYYY HH:mm:ss");
  }

  message = (message) => {
    return (
      <div>
        <div>
          <strong style={{ color: "#777" }}>
            {message.detail.firstname + " " + message.detail.lastname}
          </strong>{" "}
          has already confirmed payment{" "}
          <strong style={{ color: "#777" }}>
            {this.formatMoney(message.detail.total) +
              " " +
              message.detail.currency}
          </strong>{" "}
          for order number{" "}
          <strong style={{ color: "#777" }}>
            {message.detail.order_number}
          </strong>
        </div>
        <div style={{ textAlign: "right" }}>
          <small>{this.Time(message.created_at)}</small>
        </div>
      </div>
    );
  };

  render() {
    const { paymentList } = this.props;

    return (
      <div className="gx-entry-payment">
        <div className="gx-entry-sec">
          <WidgetHeader title="Recent Payment" />
          <div className="gx-timeline-info" key={"payment"}>
            {paymentList.map((item, index) => (
              <div key={index}>
                <Alert message={this.message(item)} type="success" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    paymentList: state.common.paymentList,
    auth: state.authUser.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPaymentAction: () => dispatch(getPaymentAction()),
    checkToken: () => dispatch(checkToken()),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RecentPayment)
);
