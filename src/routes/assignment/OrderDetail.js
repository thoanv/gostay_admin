import { Col, Form, Modal, Row, Tag, Tabs, Table, Spin } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";
import moment from "moment";
import { getDetailOrderTour } from "../../actions/OrderTourActions";
const { TabPane } = Tabs;
class OrderDetail extends Component {
  state = {
    orderTour: null
  };
  static propTypes = {
    orderTour: PropTypes.object,
    open: PropTypes.bool,
    current_passenger: PropTypes.object
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.idOrderTour) {
      if (nextProps.idOrderTour != this.props.idOrderTour) {
        this.props
          .getDetailOrderTour(nextState.filter, nextProps.idOrderTour)
          .then(res => {
            this.setState({
              orderTour: res.data
            });
          });
      }
    }
  }

  cssRow = () => {
    return {
      borderBottom: "1px solid #e8e8e8",
      padding: "0 !important",
      marginBottom: "1em "
    };
  };

  handleClose = () => {
    this.props.onCloseOrderDetail();
    this.setState({
      orderTour: null
    });
  };

  render() {
    const { open } = this.props;
    const { orderTour } = this.state;
    const detailOrderTour = this.state.orderTour;

    const columnsPassenger = [
      {
        title: <IntlMessages id="order.passenger.firstname" />,
        key: "firstname",
        render: record => {
          return record.firstname;
        }
      },
      {
        title: <IntlMessages id="order.passenger.lastname" />,
        key: "lastname",
        render: record => {
          return record.lastname;
        }
      },
      {
        title: <IntlMessages id="order.passenger.country" />,
        key: "country",
        render: record => {
          return record.country_txt;
        }
      },
      {
        title: <IntlMessages id="order.passenger.age" />,
        key: "age",
        render: record => {
          return moment().diff(moment(record.birthday), "year");
        }
      }
    ];
    return (
      <React.Fragment>
        <Modal
          toggle={this.handleClose}
          visible={open}
          closable={true}
          onCancel={() => this.handleClose()}
          footer={null}
          width="65%"
          centered={true}
        >
          {this.state.orderTour ? (
            <Tabs defaultActiveKey="1" type="card">
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
                          <IntlMessages id="order.depart_city" />:
                        </p>
                      </Col>
                      <Col span={17}>
                        <p>{orderTour ? orderTour.des_title : ""}</p>
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
                        <p>{orderTour ? orderTour.total : ""}</p>
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
                          {orderTour
                            ? moment(orderTour.created_at).format(
                                "DD/MM/YYYY HH:mm"
                              )
                            : ""}
                        </p>
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
                          <IntlMessages id="order.airline" />:
                        </p>
                      </Col>
                      <Col span={17}>
                        <p>
                          {orderTour
                            ? orderTour.airline_code +
                              "-" +
                              orderTour.airline_class
                            : ""}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={<IntlMessages id="order.passenger" />} key="2">
                <Row>
                  <Col span={24}>
                    <h4 style={{ padding: "10px 0" }}>
                      {orderTour ? orderTour.tour_title.toUpperCase() : ""}{" "}
                      <IntlMessages id="order.passenger_manifest" />
                    </h4>
                  </Col>
                  <Col span={24}>
                    <Table
                      columns={columnsPassenger}
                      dataSource={
                        detailOrderTour ? detailOrderTour.passenger : []
                      }
                      rowKey="id"
                      pagination={false}
                    />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          ) : (
            <Spin size="large" />
          )}
        </Modal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    detailOrderTour: state.orderTour.currentOrderTour
  };
};
function mapDispatchToProps(dispatch) {
  return {
    getDetailOrderTour: (filter, id) => dispatch(getDetailOrderTour(filter, id))
  };
}

export default Form.create({ name: "orders" })(
  connect(mapStateToProps, mapDispatchToProps)(OrderDetail)
);
