import { Button, Col, Form, Icon, Input, Modal, Row, Spin, Table, Tabs, Tag } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
// actions



const { Search } = Input;

class EventDetail extends Component {
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
    event: PropTypes.object,
    open: PropTypes.bool,
    current_passenger: PropTypes.object,
    current_voucher: PropTypes.object,
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.event) {

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


  formatCurency = inputNumber => {
    let formetedNumber=(Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    let splitArray=formetedNumber.split('.');
    if(splitArray.length>1){
      formetedNumber=splitArray[0];
    }
    return(formetedNumber);
  };
  // formatCurency(currency) {
  //   const index = currency.indexOf(".");
  //   return currency.slice(0, index + 3);
  // }

  Time(e,format = "DD/MM/YYYY HH:mm:ss") {
    var d = new Date();
    let con = new Date(e.toString().replace(" ", "T"));
    let res = new Date(
      con.setMinutes(con.getMinutes() - d.getTimezoneOffset())
    );
    return moment(res).format(format);
  }

  render() {
    const { onOrderClose, open, event } = this.props;
    const albums = event ? event.img.filter(e => e.type == 2) : []
    const banners = event ?  event.img.filter(e => e.type == 1): []
const typeEvent = [{id: 1, title: "Teambuilding"},
  {
    id: 2,
    title: "Tiệc cưới"
  },
  {id: 3, title: "Sinh nhật"},
  {id: 4, title: "Hội nghị - hội thảo"},
  {id: 5, title: "Lễ ra mắt"},
  {id: 6, title: "Tất niên"}
];


    const condition = event ? JSON.parse(event.condition) : [];
    const { TabPane } = Tabs;



    return (
      <React.Fragment>
        <Modal
          toggle={onOrderClose}
          visible={open}
          closable={false}
          onCancel={this.props.onOrderClose}
          footer={null}
          width="85%"
          centered={true}
        >

          {event ? (
            <Tabs defaultActiveKey="1">
              <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                <Row>
                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={9}>
                        <p>
                          <IntlMessages id="Tên event" />:
                        </p>
                      </Col>
                      <Col span={15}>
                        <p>{event ? event.name : ""}</p>
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
                        <p>{event ? event.amount : ""}</p>
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
                          {this.formatCurency(event.price)}
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
                        <p>{this.formatCurency(event.discount)}</p>
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
                        <p>{this.Time(event.start_date,'DD/MM/YYYY')} -> {this.Time(event.end_date,'DD/MM/YYYY')}</p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row style={this.cssRow()}>
                      <Col span={10}>
                        <p>
                          <IntlMessages id="Loại Event" />:
                        </p>
                      </Col>
                      <Col span={14}>
                        <p>
                          {event
                            ? typeEvent.find(e => e.id == event.type).title
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
                          {event ? this.Time(event.created_at) : ""}
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
                        {event ? this.Time(event.created_at) : ""}
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
                        {event ? (
                          event.status === "PENDING" ? (
                            <Tag style={{ marginTop: "0" }} color="red">
                              {event.status}
                            </Tag>
                          ) : (
                              <Tag style={{ marginTop: "0" }} color="green">
                                {event.status}
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
    listManageEvent: state.manageEvent.list,
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
  )(EventDetail)
);
