import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Tabs,
  Tag,
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import {
  convertFileToBase64,
  getFileExtension,
} from "../../../helpers/helpers";
const { Search } = Input;

class HotelDetails extends Component {
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
    orderDetail: PropTypes.object,
    open: PropTypes.bool,
    current_passenger: PropTypes.object,
    current_voucher: PropTypes.object,
  };


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
        this.props.updateorderDetail({
          ticket: result.data,
          id: this.props.orderDetail.id,
        });
        this.setState({ uploading: false });
      });
  }

  formatCurency(currency) {
    return currency;
  }

  Time(e) {
    var d = new Date();
    // let con = new Date(e.toString().replace(" ", "T"));
    // let res = new Date(
    //   con.setMinutes(con.getMinutes() - d.getTimezoneOffset())
    // );
    return moment(d).format("DD/MM/YYYY HH:mm:ss");
  }
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

  getComboStatus = (value) => {
    switch(value) {
      case "ORDER_PENDING":
        return <Tag style={{ marginTop: "0" }} color='#ed7014'>
          Chờ thanh toán
        </Tag>
      case "ORDER_CONFIRMED":
        return <Tag style={{ marginTop: "0" }} color='green'>
          ĐÃ XÁC NHẬN
        </Tag>
      case 2:
        return <Tag style={{ marginTop: "0" }} color='red'>
          HUỶ COMBO
        </Tag>
      default:
        return ""
    }
  }

  render() {
    const { onOrderClose, open, orderDetail, customer, selectedRecord } = this.props;

    const totalFormat = orderDetail ? this.formatCurency(orderDetail.total) : null;
    const hotelInfo = orderDetail ? JSON.parse(orderDetail.info) : null;
console.log(hotelInfo)
    var { fileList } = this.state;

    const { TabPane } = Tabs;

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
              
              <Button type="default" onClick={() => this.props.onOrderClose()}>
                <IntlMessages id="global.cancel" />
              </Button>
            </Col>
          </Row>
          <Tabs defaultActiveKey="1">
            <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
              <Row>
                {
                  hotelInfo && hotelInfo.map(e => {
                    return (<p className={'mb-3 ml-4 w-100'}>
                      <span><b>{e.title}</b> từ {moment(e.expired).format("YYYY-MM-DD")} đến {moment(e.expired).format("YYYY-MM-DD")}</span>

                    </p>)

                    })
                }
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
                        {orderDetail
                          ? `${customer[0].firstName} ${customer[0].lastName}`
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </Col>
                {/* <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="order.unit_price" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{orderDetail ? orderDetail.unit_price : ""}</p>
                    </Col>
                  </Row>
                </Col> */}
              </Row>
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="global.email" />:
                      </p>
                    </Col>
                    <Col span={17}>{customer ? `${customer[0].email}`: ""}</Col>
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
                      <p>{selectedRecord ? selectedRecord.total : ""}</p>
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
                      <p>{customer ? `${customer[0].phone}` : ""}</p>
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
                      <p>{selectedRecord ? selectedRecord.qty : ""}</p>
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
                      <p>{orderDetail ? this.Time(orderDetail.created_at) : ""}</p>
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
                      {orderDetail && this.getComboStatus(orderDetail.status)}
                    </Col>
                  </Row>
                </Col>
              </Row>
              {selectedRecord ? (
                selectedRecord.coupon_code !== "" ? (
                  <Row>
                    <Col span={12}>
                      <Row style={this.cssRow()}>
                        <Col span={7}>
                          <p>
                            <IntlMessages id="order.number" />:
                          </p>
                        </Col>
                        <Col span={17}>{selectedRecord.order_number}</Col>
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
                          <p>{selectedRecord.discount}</p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ) : null
              ) : null}
            </TabPane>
          </Tabs>
        </Modal>
      </React.Fragment>
    );
  }
}

export default HotelDetails
