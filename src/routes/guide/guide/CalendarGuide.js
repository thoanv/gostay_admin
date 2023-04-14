import { Form, Modal } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, Children } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { getCalendarByGuide } from "../../../actions/GuideCalendarAction";
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const CustomEventComponent = ({ event }) => {
  if (event.status !== 3) {
    let departures = event.dest_title;

    return (
      <div
        style={{
          textAlign: "center",
          width: "100%"
        }}
      >
        <div>{departures}</div>
        <p style={{ margin: "2.5px 0" }}>{event.tour_code}</p>
        <p style={{ marginBottom: "0" }}>{event.git_qty}</p>
      </div>
    );
  }
  return null;
};

class CalendarGuide extends Component {
  static propTypes = {
    account: PropTypes.object,
    onSaveAccount: PropTypes.func,
    openCalendar: PropTypes.bool,
    onAccountClose: PropTypes.func
  };

  static defaultProps = {
    edit: false,
    openCalendar: false,
    lists: []
  };

  state = {
    groupid: [],
    account: null,
    listGuideCalendar: [],
    filterAll: { paging: 0 }
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    console.log('nextProps',nextProps);
    console.log('props.account',this.props.account);
    if (nextProps.account && nextProps.account !== this.props.account) {
      let current_account = nextProps.account;
      if (current_account) {
        console.log('hihihi',current_account);
        nextProps
          .getCalendarByGuide(this.state.filterAll, current_account.id)
          .then();
      }
    }
  }

  eventStyleGetter = events => {
    var backgroundColor = events.status === 1 ? "#ffc107" : "";
    var style = {
      backgroundColor: backgroundColor,
      borderRadius: "5px",
      display: "block"
    };
    return {
      style: style
    };
  };

  render() {
    const { onAccountClose, openCalendar, listGuideCalendar } = this.props;
    console.log(listGuideCalendar);
    console.log('kkkk', this.props.account);
    const events = listGuideCalendar.map(item => {
      return {
        start: new Date(moment(item.date).format("YYYY-MM-DD 08:00:00")),
        end: new Date(moment(item.date).format("YYYY-MM-DD 23:59:59")),
        ...item
      };
    });

    return (
      <React.Fragment>
        {openCalendar ? (
          <Modal
            title={<IntlMessages id="sidebar.guide_calendar" />}
            visible={openCalendar}
            closable={true}
            onCancel={onAccountClose}
            footer={null}
            width="70%"
          >
            <BigCalendar
              popup
              events={events ? events : []}
              defaultDate={new Date()}
              showMultiDayTimes
              onView={() => {}}
              components={{
                event: CustomEventComponent
              }}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={this.eventStyleGetter}
            />
          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    listGuideCalendar: state.guideCalendar.listGuideCalendar
  };
};
function mapDispatchToProps(dispatch) {
  return {
    getCalendarByGuide: (filter, id)=> dispatch(getCalendarByGuide(filter,id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create({ name: "guide" })(CalendarGuide));
