import { Button, Col, Form, Icon, Input, Modal, Row, Spin, Table, Tabs, Tag } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
// actions



const { Search } = Input;

class VoucherDetail extends Component {
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
    voucher: PropTypes.object,
    open: PropTypes.bool,
    current_passenger: PropTypes.object,
    current_voucher: PropTypes.object,
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.voucher) {

    }
  }

  onEditOrderPassenger = (passenger) => {
    this.setState({
      openPassenger: true,
      edit: true,
      current_passenger: passenger,
    });
  };


  cssRow = () => {
    return {
      borderBottom: "1px solid #e8e8e8",
      padding: "0 !important",
      marginBottom: "1em ",
    };
  };
  
  

  formatCurency(currency) {
    if(!currency || currency == 0 || currency == '') return 0
    const index = currency.indexOf(".");
    return currency.slice(0, index + 3);
  }

  Time(e,format = "DD/MM/YYYY HH:mm:ss") {
    var d = new Date();
    let con = new Date(e.toString().replace(" ", "T"));
    let res = new Date(
      con.setMinutes(con.getMinutes() - d.getTimezoneOffset())
    );
    return moment(res).format(format);
  }

  render() {
    const { onOrderClose, open, voucher } = this.props;
    const albums = voucher ? voucher.img.filter(e => e.type == 2) : []
    const banners = voucher ?  voucher.img.filter(e => e.type == 1): []

const typevoucher = [{id: 1, title: "Ẩm thức"},
  {
    id: 2,
    title: "Khách sạn"
  },
  {id: 3, title: "Nghỉ dưỡng"},
  {id: 4, title: "Chơi Golf"}
];


    const condition = voucher ? JSON.parse(voucher.condition) : [];
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

          {voucher ? (
            <Tabs defaultActiveKey="1">
              <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                <Row>
                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={9}>
                        <p>
                          <IntlMessages id="Tên voucher" />:
                        </p>
                      </Col>
                      <Col span={15}>
                        <p>{voucher ? voucher.name : ""}</p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={9}>
                        <p>
                          <IntlMessages id="Số lượng" />:
                        </p>
                      </Col>
                      <Col span={15}>
                        <p>{voucher ? voucher.amount : ""}</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={9}>
                        <p>
                          <IntlMessages id="Giá" />:
                        </p>
                      </Col>
                      <Col span={15}>
                        <p>
                          {this.formatCurency(voucher.price)}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={10}>
                        <p>
                          <IntlMessages id="global.price_discount" />:
                        </p>
                      </Col>
                      <Col span={14}>
                        <p>{this.formatCurency(voucher.discount)}</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={9}>
                        <p>
                          <IntlMessages id="Giá trẻ em" />:
                        </p>
                      </Col>
                      <Col span={15}>
                        <p>
                          {this.formatCurency(voucher.price_child || 0)}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={10}>
                        <p>
                          <IntlMessages id="Giá KM trẻ em" />:
                        </p>
                      </Col>
                      <Col span={14}>
                        <p>{this.formatCurency(voucher.discount_child || 0)}</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={9}>
                        <p>
                          <IntlMessages id="Thời gian sử dụng" />:
                        </p>
                      </Col>
                      <Col span={15}>
                        <p>{this.Time(voucher.start_date,'DD/MM/YYYY')} -> {this.Time(voucher.end_date,'DD/MM/YYYY')}</p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={10}>
                        <p>
                          <IntlMessages id="Loại voucher" />:
                        </p>
                      </Col>
                      <Col span={14}>
                        <p>
                          {voucher
                            ? typevoucher.find(e => e.id == voucher.type).title
                            : ""}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={9}>
                        <p>
                          <IntlMessages id="tour.create_date" />:
                        </p>
                      </Col>
                      <Col span={15}>
                        <p>
                          {voucher ? this.Time(voucher.created_at) : ""}
                        </p>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={10}>
                        <p>
                          <IntlMessages id="global.updated" />:
                        </p>
                      </Col>
                      <Col span={14}>
                        {voucher ? this.Time(voucher.created_at) : ""}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={9}>
                        <p>
                          <IntlMessages id="global.status" />:
                        </p>
                      </Col>
                      <Col span={15}>
                        {voucher ? (
                          voucher.status === "PENDING" ? (
                            <Tag style={{ marginTop: "0" }} color="red">
                              {voucher.status}
                            </Tag>
                          ) : (
                              <Tag style={{ marginTop: "0" }} color="green">
                                {voucher.status}
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
                      <Col span={24}>
                      <p>Điều kiện bao gồm</p>
                      {
                        condition && condition.consists_of.map(e => {
                          return (<p>{e}</p>)

                        })

                      }<p>Điều kiện không bao gồm</p>
                      {
                        condition && condition.un_consists_of.map(e => {
                          return (<p>{e}</p>)

                        })

                      }<p>Điều kiện sử dụng</p>
                      {
                        condition && condition.condition_use.map(e => {
                          return (<p>{e}</p>)

                        })

                      }<p>Điều kiện trẻ em</p>
                      {
                        condition && condition.condition_chid.map(e => {
                          return (<p>{e}</p>)

                        })

                      }
                      </Col>
                    </Row>
                  </Col>
                </Row>
                
              </TabPane>
              <TabPane tab={<IntlMessages id="global.image" />} key="2">
                <Row>
                  <Col span={4}>

                    <h4>Albums ảnh</h4>
                  </Col>
                  <Col span={20}>
                  {
                    albums.map(e => {
                      return (
                          <img src={e.link} style={{width:'80px',height:'80px'}} />
                      )

                    })
                  }</Col>
                </Row>
                <Row className={'mt-3'}>
                  <Col span={4}>

                    <h4>Banner</h4>
                  </Col>
                  <Col span={20}>
                  {
                    banners.map(e => {
                      return (
                          <img src={e.link} style={{width:'80px',height:'80px'}} />
                      )

                    })
                  }</Col>
                </Row>
              </TabPane>
              
            </Tabs>
          ) : (
              <Spin size="large"></Spin>
            )}
        </Modal>

      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    listManagevoucher: state.manageVoucher.list,
  };
};
function mapDispatchToProps(dispatch) {
  return {

  };
}

export default Form.create({ name: "orders" })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VoucherDetail)
);
