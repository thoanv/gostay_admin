import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Tabs,
  Tag,
  Upload,
  Table
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
// actions
import { upload } from "../../actions/FileManagerActions";
import {
  getAllOrderTour,
  getDetailOrderTour,
  updateOrderTour,
  updatePassenger
} from "../../actions/OrderTourActions";
import Zoom from 'react-medium-image-zoom'
import {
  convertFileToBase64,
  getFileExtension,
} from "../../helpers/helpers";
import { getCustomerDetail } from "../../actions/AccountAction";
import { giveCoupon } from "../../actions/CouponAction";
import AvatarInTable from "../../components/AvatarInTable";
import 'react-medium-image-zoom/dist/styles.css'
import {_getAllRoomOfHotel} from "Actions/ManageHotelActions";
import NumberFormat from "react-number-format";

class HotelDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
    openPassenger: false,
    current_passenger: null,
    edit: false,
    fileList: [],
    uploading: false,
    openVoucher: false,
    current_voucher: null,
    };
    this.columns = [
      {
          title: <IntlMessages id="global.id" />,
          dataIndex: "id",
          key: "id",
      },
      {
          title: <IntlMessages id="global.code" />,
          key: "code",
          render: (text, record) => {
              return (
                  <Tag >{record.code}</Tag>
              );
          },

      },
      {
        title: <IntlMessages id="global.image" />,
        key: "icon",
        align: 'center',
        render: (text, record) => record.icon ? (
            <AvatarInTable
              src={record.icon}
              defaul={1}
              title={record.name}
            ></AvatarInTable>
          ) : null
    },
      {
          title: <IntlMessages id="global.title" />,
          key: "name",
          render: (text, record) => {
              return (
                  <b
                      style={{ color: "blue", cursor: "pointer" }}
                  >
                      {record.name}
                  </b>
              );
          },
      },
    ];

    this.columns_room = [
      {
          title: <IntlMessages id="global.id" />,
          dataIndex: "id",
          key: "id",
      },
      {
          title: 'Tên phòng',
          key: "title",
          render: (text, record) => {
              return (
                  <Tag >{record.title}</Tag>
              );
          },

      },
      {
        title: 'Giá thường',
        key: "price",
        align: 'left',
        render: (text, record) =>  {
          return (
              <div>
              <p>Giá ngày thường : <b
                  style={{ color: "blue", cursor: "pointer" }}
              >
                <NumberFormat value={record.price} thousandSeparator={true} displayType="text" />

              </b></p>

                <p>Giá thường + ăn sáng: <b
                  style={{ color: "blue", cursor: "pointer" }}
              >
                  <NumberFormat value={record.price_breakfast} thousandSeparator={true} displayType="text" />
              </b></p>
                <p>Giá thường + hoàn hủy :<b
                  style={{ color: "blue", cursor: "pointer" }}
              >
                  <NumberFormat value={record.price_refun} thousandSeparator={true} displayType="text" />
              </b></p>
                <p>Ăn sáng + hoàn hủy :<b
                    style={{ color: "blue", cursor: "pointer" }}
                >
                  <NumberFormat value={record.price_super} thousandSeparator={true} displayType="text" />
                </b></p>
              </div>
          );
        }
    },
      {
          title: 'Giá ngày cuối tuần',
          key: "price_weeken",
          render: (text, record) => {
              return (
                  <div>
                    <p>Giá ngày cuối tuần : <b
                        style={{ color: "blue", cursor: "pointer" }}
                    >
                      <NumberFormat value={record.price_weeken} thousandSeparator={true} displayType="text" />

                    </b></p>

                    <p>Giá ngày cuối tuần + ăn sáng: <b
                        style={{ color: "blue", cursor: "pointer" }}
                    >
                      <NumberFormat valutruee={record.price_weeken_breakfast} thousandSeparator={true} displayType="text" />
                    </b></p>
                    <p>Giá ngày cuối tuần + hoàn hủy :<b
                        style={{ color: "blue", cursor: "pointer" }}
                    >
                      <NumberFormat value={record.price_weeken_refun} thousandSeparator={true} displayType="text" />
                    </b></p>
                    <p>Ăn sáng + hoàn hủy :<b
                        style={{ color: "blue", cursor: "pointer" }}
                    >
                      <NumberFormat value={record.price_super_week} thousandSeparator={true} displayType="text" />
                    </b></p>

                  </div>
              );
          },
      },

      {
          title: 'Giá ngày lễ tết',
          key: "price_holiday",
          render: (text, record) => {
              return (
                  <div>
                    <p>Giá ngày lễ tết : <b
                        style={{ color: "blue", cursor: "pointer" }}
                    >
                      <NumberFormat value={record.price_holiday} thousandSeparator={true} displayType="text" />

                    </b></p>

                    <p>Giá lễ tết + ăn sáng : <b
                        style={{ color: "blue", cursor: "pointer" }}
                    >
                      <NumberFormat value={record.price_weeken_breakfast} thousandSeparator={true} displayType="text" />
                    </b></p>
                    <p>Giá lễ tết + hoàn hủy :<b
                        style={{ color: "blue", cursor: "pointer" }}
                    >
                      <NumberFormat value={record.price_weeken_refun} thousandSeparator={true} displayType="text" />
                    </b></p>
                    <p>Ăn sáng + hoàn hủy :<b
                        style={{ color: "blue", cursor: "pointer" }}
                    >
                      <NumberFormat value={record.price_super_holiday} thousandSeparator={true} displayType="text" />
                    </b></p>
                  </div>
              );
          },
      },
    ];
  }
  
  static propTypes = {
    hotel: PropTypes.object,
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

  async componentDidUpdate(prevProps, prevState) {
    if (
        (this.state.hotel &&
        prevProps.hotel.id != this.props.hotel.id) || (prevProps.hotel == undefined && this.props.hotel )
    ) {
      await this.props.getAllRoomOfHotel(this.props.hotel.id);

    }

  }
  Time(e) {
    var d = new Date();
    // let con = new Date(e.toString().replace(" ", "T"));
    // let res = new Date(
    //   con.setMinutes(con.getMinutes() - d.getTimezoneOffset())
    // );
    return moment(d).format("DD/MM/YYYY HH:mm:ss");
  }

  onRatingGenerate = (star = 0) => {
    let starRender = '';
    for(let i = 0; i < star; i++) {
      starRender += '★';
    }
    return starRender;
  }

  render() {
    const { onOrderClose, open, hotel, rooms } = this.props;
  console.log(this.state)

    const { TabPane } = Tabs;



    const util =  hotel && hotel.utilities ? JSON.parse(hotel.utilities) : []  

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
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="global.id" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{hotel ? hotel.id : ""}</p>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="hotel.name" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{hotel ? hotel.name : ""}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                {/* <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="mhotel.type_residence" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>
                        {hotel
                          ? `${hotel.type_residence}`
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </Col> */}
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="global.rank" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>
                        {hotel
                          ? `${this.onRatingGenerate(hotel.star)}`
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
                        <IntlMessages id="mhotel.address" />:
                      </p>
                    </Col>
                    <Col span={17}>{hotel ? hotel.address : ""}</Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="mhotel.quantity_room" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>
                        {hotel
                          ? hotel.quantity_room
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
                        <IntlMessages id="mhotel.description" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <div>{hotel ? <div dangerouslySetInnerHTML={{ __html: hotel.description}} /> : ""}</div>
                      
                    </Col>
                  </Row>
                </Col>

                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="mhotel.cancel_policy" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{hotel ? hotel.cancellation_policy : ""}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="mhotel.children_policy" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{hotel ? hotel.children_policy : ""}</p>
                    </Col>
                  </Row>
                </Col>
                
              </Row>
              <Row>
              <Col span={24}>
                <Table
                                tableLayout="auto"
                                columns={this.columns}
                                dataSource={util}
                                rowKey="id"
                                size="small"

                            />
                          </Col>  
                </Row>
            </TabPane>
            <TabPane tab={'Thông tin giá'} key="2">

              <Row>
              <Col span={24}>
                <Table
                                tableLayout="auto"
                                columns={this.columns_room}
                                dataSource={rooms}
                                rowKey="id"
                                size="small"

                            />
                          </Col>
                </Row>
            </TabPane>
            <TabPane tab={<IntlMessages id="file.image" />} key="3">
              <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
                {hotel && hotel.img && hotel.img.length > 0 && hotel.img.map((item, index) => <div key={index} style={{ margin: 2 }}>
                  <Zoom>
                  <img
                    src={item.link}
                    width="280"
                    height="280"
                  />
                  </Zoom>
                </div>
                )}
              </div>
            </TabPane>
          </Tabs>
        </Modal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    hotels: state.hotel.listOrderTour,
    rooms: state.manageHotel.room,
    detailOrderTour: state.hotel.currentOrderTour,
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
    getAllRoomOfHotel: (id) => dispatch(_getAllRoomOfHotel(id)),
    getCustomerDetail: id => dispatch(getCustomerDetail(id)),
    giveCoupon: data => dispatch(giveCoupon(data)),
  };
}

export default Form.create({ name: "orders" })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HotelDetails)
);
