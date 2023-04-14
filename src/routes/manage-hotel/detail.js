import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import {withRouter, Link, useLocation} from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import {Table, Avatar, Form, DatePicker, Tag, Button, Row, Col, Card} from "antd";
import moment from "moment";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

import { getAllDestination } from "../../actions/DestinationActions";
import { getAllTour } from "../../actions/TourActions";
import {
  _getAllManageHotel,
  _getAllRoomOfHotel,
  _getDetailManageHotel,
  onVerifyTour
} from '../../actions/ManageHotelActions';
import OrderDetails from "./HotelDetails";
import TableActionBar from "../../components/TableActionBar";
import { confirmProofOfPayment } from '../../actions/OrderActions';
import AddRoom_util from "./AddHotel";
import Paragraph from "antd/lib/skeleton/Paragraph";
import CustomPlacesAutoComplete from "Components/Elements/CustomPlacesAutoComplete";
import AvatarInTable from "Components/AvatarInTable";

class ManageHotelDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {

      isShowProofModal: false,
      selectedRowKeys: [],
      open: false,
      openDetails: false,
      openAssign: false,
      current_assign: null,
      tourFilter: {
        paging: 0,
      },
      loading: true,
      destinationFilter: {
        paging: 0,
      },
      order_current: null,
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
  }

  async componentDidMount() {
    try {
      const id = this.props.match.params.id;
      await this.props.getDetailManageHotel(id).then((res) => {
        this.setState({
          open: true,
        })
      });

      await this.props.getAllRoomOfHotel(id).then((res) => {
        this.setState({
          open: true,
        })
      });

      this.props.getAllDestination([]);

      this.setState({ loading: false })
    } catch (error) {
      console.log(error,2222)
        this.setState({ loading: false })
    }
  }





  render() {
    const { loading } = this.state;

    const { detail,room } = this.props;
    const util =  detail && detail.utilities ? JSON.parse(detail.utilities) : []
    return (
      <React.Fragment>
        {
          detail && room && <Card>

              <React.Fragment>
                <Row gutter={16} className="mt-4">
                  <Col xs={12} sm={12} md={12}>
                    <Form.Item
                        labelPosition="left"
                        label="Tên khách sạn"
                        name='name'



                    >
                      <p>{detail.name}</p>

                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={12} md={12}>
                    <Form.Item
                        label={"Tổng số lượng phòng"}
                        name='quantity_room'

                    >
                      <p>{detail.quantity_room}</p>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16} className="mt-4">
                  <Col xs={12} sm={12} md={12}>
                    <Form.Item
                        label={"Địa chỉ"}
                        name='address'
                        rules={[{
                          required: true,
                          message: <IntlMessages id="global.required"/>
                        }]}
                    >
                      <p>{detail.address}</p>
                    </Form.Item>

                  </Col>
                  <Col xs={12} sm={12} md={12}>
                    <Form.Item
                        label={"Loại hình cư trú"}
                        name='type_residence'
                        rules={[{
                          required: true,
                          message: <IntlMessages id="global.required"/>
                        }]}
                    >
                      <p>{[
                        {title: 'Khách sạn', id: 1},
                        {title: 'Khu nghỉ dưỡng', id: 2},
                        {title: 'Căn hộ khách sạn', id: 3},
                        {title: 'Căn hộ', id: 4},
                        {title: 'Biệt thự', id: 5},
                        {title: 'Homestay', id: 6},
                        {title: 'Du lịch sinh thái', id: 7},
                        {title: 'Cắm trại', id: 8},
                        {title: 'Cơ sở lưu trú khác', id: 9},
                      ].find(e => e.id == detail.type_residence).title}</p>
                      {/* <BaseSelect
                      options={
                        [
                          {title: 'Khách sạn', id: 1},
                          {title: 'Khu nghỉ dưỡng', id: 2},
                          {title: 'Căn hộ khách sạn', id: 3},
                          {title: 'Căn hộ', id: 4},
                          {title: 'Biệt thự', id: 5},
                          {title: 'Homestay', id: 6},
                          {title: 'Du lịch sinh thái', id: 7},
                          {title: 'Cắm trại', id: 8},
                          {title: 'Cơ sở lưu trú khác', id: 9},
                        ]}
                      defaultText={"Chọn loại hình cư trú"}
                      showSearch={true}
                  />


                   <Select
                                                                    showSearch

                                                                    placeholder="Chọn loại hình cư trú"
                                                                    filterOption={(input, option) =>
                                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                    }

                                                                >
                                                                    <Option value="1">Hotel</Option>
                                                                    <Option value="2">Condotel</Option>
                                                                    <Option value="3">Homestay</Option>

                                                                </Select>*/}

                    </Form.Item>
                  </Col>
                </Row>


                <Row gutter={16} className="mt-4">
                  <Col xs={12} sm={12} md={12}>
                    <Form.Item
                        label={"Thương hiệu"}
                        name='trademark_id'
                        rules={[{
                          required: true,
                          message: <IntlMessages id="global.required"/>
                        }]}
                    >
                      {/* <BaseSelect
                      options={listBrand}
                      defaultText={"Chọn thương hiệu"}
                      showSearch={true}
                  />
*/}
                    </Form.Item>

                  </Col>
                  <Col xs={12} sm={12} md={12}>
                    <Form.Item
                        label={"Điểm du lịch"}
                        name='tourist_id'
                        rules={[{
                          required: true,
                          message: <IntlMessages id="global.required"/>
                        }]}
                    >
                      <Paragraph>This is a copyable text.</Paragraph>{/*
                  <BaseSelect
                      options={listTouristSpot}
                      defaultText={<IntlMessages
                          id="tour.step.general.tourist_spot_choice"/>}
                      showSearch={true}
                  />*/}
                    </Form.Item>
                  </Col>
                </Row>


                <Form.Item initialValue='' name='description'
                           label="Thông tin khách sạn" rules={[{
                  required: true,
                  message: <IntlMessages id="global.required"/>
                }]}>
                  <div dangerouslySetInnerHTML={{__html: detail.description}} />

                </Form.Item>


                <Row gutter={24} className="mt-4">
                  <Col xs={24} sm={24} md={24}>
                    <Form.Item
                        label={"Tiện ích/dịch vụ chung"}
                        rules={[{
                          required: true,
                          message: <IntlMessages id="global.required"/>
                        }]}
                        name='utilities'
                    >
                      <Table
                          style={{width:'100%'}}
                          columns={this.columns}
                          dataSource={util}
                          rowKey="id"
                          size="middle"

                      />

                    </Form.Item>

                  </Col>

                </Row>


                <Row gutter={16} className="mt-4">

                  <Col xs={12} sm={12} md={12}>
                    <Form.Item
                        initialValue='' name='surcharge_policy'
                        label={"Các khoản phụ phí khác"}

                    >
                      <div dangerouslySetInnerHTML={{__html: detail.surcharge_policy}} />

                    </Form.Item>
                  </Col>

                  <Col xs={12} sm={12} md={12}>


                    <Form.Item
                        initialValue=''
                        label={"Thông tin lưu ý"}
                        name='policy'
                    >
                      <div dangerouslySetInnerHTML={{__html: detail.policy}} />

                    </Form.Item>


                  </Col>
                </Row>
                <Row gutter={16} className="mt-4">
                  <Col xs={12} sm={12} md={12}>
                    <Form.Item
                        initialValue=''
                        label={"Chính sách huỷ phòng"}
                        name='cancellation_policy'
                    >
                      <div dangerouslySetInnerHTML={{__html: detail.cancellation_policy}} />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={12} md={12}>


                    <Form.Item
                        initialValue=''
                        label={"Chính sách trẻ em"}
                        name='children_policy'
                    >
                      <div dangerouslySetInnerHTML={{__html: detail.children_policy}} />


                    </Form.Item>


                  </Col>
                </Row>


                <Row gutter={16} className="mt-4">
                  <Col xs={12} sm={12} md={12}>
                    <Form.Item
                        label={"Quy định ngày cuối tuần"}
                        name='weekend'
                    >
                      {/*<Checkbox.Group*/}
                      {/*    style={{display: "grid"}}*/}
                      {/*    options={this.listWeekend.map(column => ({*/}
                      {/*      label: column.label,*/}
                      {/*      value: column.id*/}
                      {/*    }))}*/}

                      {/*/>*/}

                      <Paragraph>This is a copyable text.</Paragraph>
                    </Form.Item>

                  </Col>
                  <Col xs={12} sm={12} md={12}>
                    <Form.Item
                        label={"% VAT giá phòng"}

                        name='vat'
                        rules={[{
                          required: true,
                          message: <IntlMessages id="global.required"/>
                        }]}

                    >

                      <div dangerouslySetInnerHTML={{__html: detail.vat}} />
                    </Form.Item>

                    <Form.Item
                        label={"Hạng sao"}
                        name='star'
                        rules={[{
                          required: true,
                          message: <IntlMessages id="global.required"/>
                        }]}

                    >
                      <p>{detail.star}</p>
                    </Form.Item>


                  </Col>
                </Row>


                {/*<Form.Item label={<IntlMessages id="global.location" />}>*/}
                {/*  <CustomPlacesAutoComplete*/}
                {/*      onChange={this.onSetLocation}*/}
                {/*      defaultadressMap={''}*/}
                {/*      defaultPosition={{*/}
                {/*        lat:Number.parseFloat(defaultValues.lat),*/}
                {/*        lng:Number.parseFloat(defaultValues.long),*/}
                {/*      }}*/}
                {/*  />*/}
                {/*</Form.Item>*/}


              </React.Fragment>
            </Card>
        }

      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    detail: state.manageHotel.detail,
    room: state.manageHotel.room,
    paging: state.orderTour.paging,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDetailManageHotel: (id) => dispatch(_getDetailManageHotel(id)),
    getAllRoomOfHotel: (id) => dispatch(_getAllRoomOfHotel(id)),
    getAllDestination: (filter, paginate) => dispatch(getAllDestination(filter, paginate)),
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ManageHotelDetail)
);
