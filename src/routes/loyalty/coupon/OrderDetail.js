import { Col, Form, Modal, Row, Tabs, Tag , Table} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { getDetailOrderTour } from "../../../actions/OrderTourActions";
const columnsPassenger = [
  {
    title: <IntlMessages id="order.passenger.firstname" />,
    key: "firstname",
    render: (record) => {
      return record.firstname;
    },
  },
  {
    title: <IntlMessages id="order.passenger.lastname" />,
    key: "lastname",
    render: (record) => {
      return record.lastname;
    },
  },
  {
    title: <IntlMessages id="order.passenger.country" />,
    key: "country",
    render: (record) => {
      return record.country_txt;
    },
  },
  {
    title: <IntlMessages id="order.passenger.age" />,
    key: "age",
    render: (record) => {
      return moment().diff(moment(record.birthday), "year");
    },
  },
 
];
class OrderDetail extends Component {
  state = {
    openPassenger: false,
    current_passenger: null,
    edit: false,
    fileList: [],
    uploading: false,
    openVoucher: false,
    current_voucher: null,
  };
  static propTypes = {
    orderTour: PropTypes.object,
    open: PropTypes.bool,
    current_passenger: PropTypes.object,
    current_voucher: PropTypes.object,
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.orderTour) {
      if (nextProps.orderTour != this.props.orderTour) {
        this.props.getDetailOrderTour(nextState.filter, nextProps.orderTour.id);
      }
    }
  }

  cssRow = () => {
    return {
      borderBottom: "1px solid #e8e8e8",
      padding: "0 !important",
      marginBottom: "1em ",
    };
  };

  formatCurency(currency) {
    const index = currency.indexOf(".");
    return currency.slice(0, index + 3);
  }
  setDate(data) {
    let v = data ? data : "";
    if (v) {
      var m = moment.utc(v); // parse input as UTC
      if (
        m
          .clone()
          .local()
          .format("DD-MM-YYYY") == moment().format("DD-MM-YYYY")
      ) {
        return m
          .clone()
          .local()
          .fromNow();
      } else
        return m
          .clone()
          .local()
          .format("ddd, MMM DD, YYYY, HH:mm");
    }
    return "";
  }
  render() {
    const { onOrderClose, open, orderTour, orderTours } = this.props;
    const { TabPane } = Tabs;

   

    const totalFormat = orderTour ? this.formatCurency(orderTour.total) : null;

    return (
      <React.Fragment>
        <Modal
          toggle={onOrderClose}
          visible={open}
          closable={true}
          onCancel={this.props.onOrderClose}
          footer={null}
          width="75%"
          centered={true}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="order.number" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{orderTour ? orderTour.order_number : ""}</p>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="order.tour" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{orderTour ? orderTour.tour_title : ""}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="order.customer" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>
                        {orderTour
                          ? `${orderTour.firstname} ${orderTour.lastname}`
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="order.unit_price" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{orderTour ? orderTour.unit_price : ""}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="order.depart" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>
                        {orderTour
                          ? moment(orderTour.depart).format("DD/MM/YYYY")
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="order.qty" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{orderTour ? orderTour.qty : ""}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="order.created_at" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>
                        {orderTour ? this.setDate(orderTour.created_at) : ""}
                      </p>
                    </Col>
                  </Row>
                </Col>

                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="order.total" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{orderTour ? totalFormat : ""}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="global.status" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      {orderTour ? (
                        orderTour.status === "PENDING" ? (
                          <Tag style={{ marginTop: "0" }} color="red">
                            {orderTour.status}
                          </Tag>
                        ) : (
                          <Tag style={{ marginTop: "0" }} color="green">
                            {orderTour.status}
                          </Tag>
                        )
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="order.currency" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{orderTour ? orderTour.currency : ""}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {orderTour ? (
                orderTour.coupon_code !== "" ? (
                  <Row>
                    <Col span={12}>
                      <Row style={this.cssRow()}>
                        <Col span={7}>
                          <p>
                            <IntlMessages id="global.coupon_code" />:
                          </p>
                        </Col>
                        <Col span={17}>{orderTour.coupon_code}</Col>
                      </Row>
                    </Col>
                    <Col span={12}>
                      <Row style={this.cssRow()}>
                        <Col span={7}>
                          <p>
                            <IntlMessages id="global.coupon_amount" />:
                          </p>
                        </Col>
                        <Col span={17}>
                          <p>{orderTour.coupon_amount}</p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ) : null
              ) : null}
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="global.email" />:
                      </p>
                    </Col>
                    <Col span={17}>{orderTour ? orderTour.email : ""}</Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="global.mobile" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{orderTour ? orderTour.mobile : ""}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="global.type" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>
                        {orderTour
                          ? orderTour.type === 0
                            ? " Tour package"
                            : orderTour.type === 2
                            ? "Attraction"
                            : "Cities_escape"
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </TabPane>
            {
              orderTour &&
              orderTour.type === 2 ?
              null
              :
              <TabPane tab={<IntlMessages id="order.passenger" />} key="2">
              <Row>
                <Col span={24}>
                  <h4 style={{ padding: "10px 0" }}>
                    {orderTour ? orderTour.tour_title.toUpperCase() : ""}{" "}
                  </h4>
                </Col>
                <Col span={24}>
                  <Table
                    columns={columnsPassenger}
                    dataSource={orderTour && orderTour.passenger  ? orderTour.passenger : null}
                    rowKey="id"
                    pagination={false}
                  />
                </Col>
              </Row>
            </TabPane>
            }
          </Tabs>
        </Modal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    orderTours: state.orderTour.listOrderTour,
  };
};
function mapDispatchToProps(dispatch) {
  return {
    getDetailOrderTour: (filter, id) =>
      dispatch(getDetailOrderTour(filter, id)),
  };
}

export default Form.create({ name: "orders" })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderDetail)
);
