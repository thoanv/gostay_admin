import { Button, Col, Form, Icon, Input, Modal, Row, Spin, Table, Tabs, Tag } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { getCustomerDetail } from "../../../actions/AccountAction";
import { giveCoupon } from "../../../actions/CouponAction";
// actions
import { upload } from "../../../actions/FileManagerActions";
import {
  getAllOrderTour,
  getDetailOrderTour,
  updateOrderTour,
  updatePassenger
} from "../../../actions/OrderTourActions";
import {
  convertFileToBase64,
  getFileExtension
} from "../../../helpers/helpers";
import Givecoupon from "../../detailcustomer/givecoupon";
import PassengerForm from "./PassengerForm";
import IconButton from '@material-ui/core/IconButton';

const { Search } = Input;

class OrderDetails extends Component {
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
        this.props.getDetailOrderTour(nextState.filter, nextProps.orderTour.id).then(res => (
          this.props.getCustomerDetail(res.data.cid).then(response => (
            this.setState({
              count_listactivecoupon: response.data.active_coupon.count
            })
          ))
        ))
      }
    }
  }

  onEditOrderPassenger = (passenger) => {
    this.setState({
      openPassenger: true,
      edit: true,
      current_passenger: passenger,
    });
  };

  onCloseOrderPassenger = () => {
    this.setState({
      openPassenger: false,
      current_passenger: null,
      edit: false,
    });
  };

  cssRow = () => {
    return {
      borderBottom: "1px solid #e8e8e8",
      padding: "0 !important",
      marginBottom: "1em ",
    };
  };
  ongivecouponClose = () => {
    this.setState({
      opengivecoupon: false,
    });
  };
  clickgift = data => {
    this.setState({
      opengivecoupon: true,
      cid: data
    })

  }
  handleOk = () => {
    this.setState({
      opengivecoupon: false,
    });

    var data = {}
    data.cid = this.state.cid
    this.props.giveCoupon(data).then(res => (
      this.props.getCustomerDetail(this.state.cid).then(res => (
        this.setState({

          count_listactivecoupon: res.data.active_coupon.count
        })
      ))
    ))
  }
  onSavePassenger = async (data, id) => {
    await this.setState({
      ...this.state,
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updatePassenger({
          ...dataSubmit,
          expired: moment(dataSubmit.expired).format("YYYY-MM-DD HH:mm:ss"),
        })
        .then((res) => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            openPassenger: false,
            current_passenger: null,
            edit: false,
            loading: false,
          });
        })
        .catch((err) => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            loading: false,
          });
        });
    }
  };

  async handleUpload() {
    this.setState({ uploading: true });
    var file = this.state.fileList[0];
    var base64Data = await convertFileToBase64(file);
    var extension = getFileExtension(file.name);

    this.props
      .upload({
        file: base64Data,
        path: "/tickets",
        name: file.name,
      })
      .then((result) => {
        this.props.updateOrderTour({
          ticket: result.data,
          id: this.props.orderTour.id,
        });
        this.setState({ uploading: false });
      });
  }

  formatCurency(currency) {
    const index = currency.indexOf(".");
    return currency.slice(0, index + 3);
  }

  Time(e) {
    var d = new Date();
    let con = new Date(e.toString().replace(" ", "T"));
    let res = new Date(
      con.setMinutes(con.getMinutes() - d.getTimezoneOffset())
    );
    return moment(res).format("DD/MM/YYYY HH:mm:ss");
  }

  render() {
    const { onOrderClose, open, orderTour, detailOrderTour, detailAccount } = this.props;
    const { count_listactivecoupon } = this.state
    const totalFormat = orderTour ? this.formatCurency(orderTour.total) : null;



    const { TabPane } = Tabs;

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
      {
        render: (record) => {
          return (
            <Button type="link" className="p-0" onClick={() => this.onEditOrderPassenger(record)}>
              <IntlMessages id="global.edit" />
            </Button>
          );
        },
      },
    ];

    return (
      <React.Fragment>
        <Modal
          toggle={onOrderClose}
          visible={open}
          closable={false}
          onCancel={this.props.onOrderClose}
          footer={null}
          width="65%"
          centered={true}
        >
          <Row style={{ height: '20px' }}>
            <Col span={24} style={{ textAlign: "right", marginBottom: "20px" }}>
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                htmlType="submit"
                loading={this.props.loading}
              >
                <IntlMessages id="order.send" />
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                htmlType="submit"
                loading={this.props.loading}
              >
                <IntlMessages id="order.print" />
              </Button>
              <Button type="default" onClick={() => this.props.onOrderClose()}>
                <IntlMessages id="global.cancel" />
              </Button>
            </Col>
          </Row>
          {orderTour ? (
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
                          <IntlMessages id="global.email" />:
                        </p>
                      </Col>
                      <Col span={17}>
                        <p>{orderTour ? orderTour.email : ""}</p>
                      </Col>
                    </Row>
                  </Col>
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
                </Row>
                <Row>
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
                          {orderTour ? this.Time(orderTour.created_at) : ""}
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
                      dataSource={detailOrderTour.passenger}
                      rowKey="id"
                      pagination={false}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={<IntlMessages id="global.givecoupon" />} key="3">
                <IconButton className="shake"
                  style={{ backgroundColor: 'white' }}
                  onClick={() => this.clickgift(detailAccount.id)}
                >
                  <Icon type="gift"
                    style={{ color: "rgba(244, 4, 4, 0.98)", fontSize: '36px', cursor: 'pointer' }}
                  />
                </IconButton>
              </TabPane>
            </Tabs>
          ) : (
              <Spin size="large"></Spin>
            )}
        </Modal>
        <PassengerForm
          onSavePassenger={this.onSavePassenger}
          current_passenger={this.state.current_passenger}
          onCloseOrderPassenger={this.onCloseOrderPassenger}
          edit={this.state.edit}
          openPassenger={this.state.openPassenger}
        />
        <Givecoupon
          ongivecouponClose={this.ongivecouponClose}
          open={this.state.opengivecoupon}
          handleOk={this.handleOk}
          count_listactivecoupon={count_listactivecoupon}
          detailAccount={detailAccount}
        >
        </Givecoupon>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    orderTours: state.orderTour.listOrderTour,
    detailOrderTour: state.orderTour.currentOrderTour,
    detailAccount: state.account.detailAccount
  };
};
function mapDispatchToProps(dispatch) {
  return {
    getAllOrderTour: (filter) => dispatch(getAllOrderTour(filter)),
    getDetailOrderTour: (filter, id) =>
      dispatch(getDetailOrderTour(filter, id)),
    updatePassenger: (data) => dispatch(updatePassenger(data)),
    updateOrderTour: (data) => dispatch(updateOrderTour(data)),
    upload: (data) => dispatch(upload(data)),
    getCustomerDetail: id => dispatch(getCustomerDetail(id)),
    giveCoupon: data => dispatch(giveCoupon(data))
  };
}

export default Form.create({ name: "orders" })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderDetails)
);
