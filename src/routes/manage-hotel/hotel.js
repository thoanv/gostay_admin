import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import {Table, Avatar, Form, DatePicker, Tag, Button, Row, Input} from "antd";
import moment from "moment";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

import {getAllDestination, getAllSpot} from "../../actions/DestinationActions";
import { getAllTour } from "../../actions/TourActions";
import { _getAllManageHotel, onVerifyTour } from '../../actions/ManageHotelActions';
import OrderDetails from "./HotelDetails";
import TableActionBar from "../../components/TableActionBar";
import { confirmProofOfPayment } from '../../actions/OrderActions';
import AddRoom_util from "./AddHotel";
import BaseSelect from "Components/Elements/BaseSelect";

class HotelManagerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        sort: {
          type: "desc",
          attr: "",
        },
        paging: {
          perpage: 10,
          page: 1,
        },
        type: {
          type: "=",
          value: 0,
        },
      },
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
  }

  async componentDidMount() {
    try {
        await this.props.getAllManageHotel(this.state.filter);
        this.props.getAllTour(this.state.tourFilter);
        this.props.getAllDestination(this.state.destinationFilter);
        this.setState({ loading: false })
    } catch (error) {
        this.setState({ loading: false })
    }
  }

  onVerifyHotel = (id, status) => {
    this.props.onVerifyTour(id, status);
  }

  getDetailsOrder = (id, customer, record) => {
    this.props.getDetailManageHotel(id).then((res) => {
      this.setState({
        open: true,
        orderdetail: res.data.info_basic,
        customer,
        selectedRecord: record
      })
    });
  }

  onEditOrderNumber = (order) => {
    this.props.getDetailManageHotel(this.state.filter, order.id).then((res) =>
      this.setState({
        open: true,
        orderdetail: res.data,
      })
    );
  };

  onOrderClose = () => {
    this.setState({
      openDetails: false,
      hotel: null,
    });
  };

  getOrder(order) {
    if (order === "ascend") return "asc";
    if (order === "descend") return "desc";
    return "desc";
  }

  getTourStatus = (value) => {
    switch(value) {
      case 0: 
      return <Tag style={{ marginTop: "0" }} color='#ed7014'>
      CHỜ XÁC NHẬN
    </Tag>
      case 1:
        return <Tag style={{ marginTop: "0" }} color='green'>
        ĐÃ XÁC NHẬN
      </Tag>
      case 2:
        return <Tag style={{ marginTop: "0" }} color='red'>
        HUỶ
      </Tag>
      default: 
      return ""
    }
  }

  getPaymentStatus = (status) => {
    switch (status) {
      case 'PAYMENT_PENDING': {
          return <Tag color='orange'><IntlMessages id='global.order_pending_confirm' /></Tag>
      }
      case 'PAYMENT_SUCCESS': {
          return <Tag color='green'><IntlMessages id='global.order_confirm' /></Tag>
      }
      case 'PAYMENT_CANCELLATION_PENDING': {
          return <Tag color='#2db7f5'><IntlMessages id='global.order_cancel_pending' /></Tag>
      }
      case 'PAYMENT_REJECTED': {
          return <Tag color='#2db7f5'><IntlMessages id='global.order_cancel_pending' /></Tag>
      }
      case 'PAYMENT_CANCELLED': {
          return <Tag color='magenta'><IntlMessages id='global.order_cancel' /></Tag>
      }
      case 'PAYMENT_COMPLETED': {
          return <Tag color='#096dd9'><IntlMessages id='global.order_complete' /></Tag>
      }
      default: return <Tag color='red'><IntlMessages id='global.order_expire' /></Tag>;
  }
  }

  onCloseApproveProofModal() {
    this.setState({isShowProofModal: false, currentOrder: null});
  }

  async onConfirmProof(type) {
      var data = {
          is_confirmed: type,
          payment_date: moment().format('YYYY-MM-DD HH:mm:ss')
      }

      await this.props.confirmProofOfPayment(this.state.currentOrder.id, data);
      this.onCloseApproveProofModal();
      await this.props.getAllManageHotel();
  }

  onCreate = (edit = false, item) => {
    this.setState({
        edit,
        open: true,
        item: edit ? item : null
    });
  };

  onOpenDetails = (item) => {
    this.props.history.push(`/app/manage-hotel/${item.id}`)
  }

  onClose = () => {
      this.setState({
          open: false,
          item: null,
          edit: false,
          isSubmiting: false,
      });
  };

  onSave =  (data, id) => {
    this.onClose();
    this.props._addPopup(data);
  };

  onRatingGenerate = (star = 0) => {
    let starRender = '';
    for(let i = 0; i < star; i++) {
      starRender += '★';
    }
    return starRender;
  }

  onDelete = (id) => this.props._onDelete({id});

  render() {
    const { selectedRowKeys, loading, currentOrder, isShowProofModal } = this.state;

    const { listManageHotel, listDestination, paging, destinations } = this.props;
    console.log(listManageHotel,listDestination)
    const columns = [
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
      },
      // {
      //   title: <IntlMessages id="manage_hotel.tourist_id" />,
      //   dataIndex: "tourist_id",
      //   key: "tourist_id",
      // },
      {
        title: <IntlMessages id="sidebar.hotel" />,
        key: "order_code",
        render: (text, record) => {
          return <div style={{ color: 'blue', cursor: 'pointer' }} 
          onClick={() => this.onOpenDetails(record)}>
            {record.name}
            </div>;
        },
      },
      {
        title: <IntlMessages id="global.rank" />,
        key: "rank",
        render: (text, record) => (
          <div>
              {this.onRatingGenerate(record.star)}
          </div>
      )
      },
    // {
    //   title: <IntlMessages id="global.type" />,
    //   key: "type_residence",
    //   render: (text, record) => (
    //     <div>
    //         {record.type_residence}
    //     </div>
    // )
    // },
    {
      title: <IntlMessages id="manage_hotel.quantity_room" />,
      key: "quantity_room",
      render: (text, record) => (
        <div>
            {record.quantity_room}
        </div>
      )},
    {
      title: <IntlMessages id="global.address" />,
      key: "address",
      render: (text, record) => (
        <div>
            {record.address}
        </div>)
    },
      // {
      //   title: <IntlMessages id="order.customer" />,
      //   key: "lastname",
      //   render: (text, record) => {
      //     const customer = JSON.parse(record.customer_info)
      //     return <b>
      //       {customer.firstName + " " + customer.lastName}
      //   </b>
      //   },
      // },
      {
        title: 'Điểm du lịch',
        render: (record) => {
          return listDestination.find(e => e.id == record.tourist_id) ? listDestination.find(e => e.id == record.tourist_id).name : ''
        },
        key: "description",
        sorter: true,
      },
      {
        title: <IntlMessages id="global.status" />,
        key: "status",
        align: 'center',
        render: (record) => {
          return this.getTourStatus(record.status)
        },
      },
      {
        title: <IntlMessages id="manage_hotel.verify" />,
        align: 'center',
        render: (text, record, index) => {
            if(record.status == '2') return null;
            return (
              <div>
                {record.status == '0' ? 
                <Row>
                  <Button type="primary" size="small" className="mt-1" 
                  onClick={() => this.onVerifyHotel(record.id, 1)}>
                    Xác nhận
                  </Button> 
                </Row> : null }
                <Row>
                  <Button type="danger" size="small" className="mt-1" 
                  onClick={() => this.onVerifyHotel(record.id, 2)}>
                    Hủy khách sạn
                  </Button>
                </Row> 
          </div>

            )
        }
      },
    ];
    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.manage_hotel" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <Form
                  layout="inline"
                  onSubmit={this.handleSubmit}
                  style={{ display: "flex", justifyContent: "flex-start" }}
              >

                <Form.Item>
                  <Input
                      onChange={(e) => this.onFilter("search", e.target.value)}
                      placeholder="Tên khách sạn , địa chỉ"
                      style={{ width: "350px" }}
                  />
                </Form.Item>
                <Form.Item>
                  <BaseSelect
                      showSearch
                      options={[
                        { value: 1, label: 'ĐÃ XÁC NHẬN' },
                        { value: 0, label: 'CHỜ XÁC NHẬN' },
                        { value: 2, label: 'HUỶ' },
                      ]}
                      defaultText="Chọn trạng thái"
                      optionValue="value"
                      optionLabel="label"
                      onChange={(value) => this.onFilter("status", value)}
                      style={{ width: "350px" }}
                  />
                </Form.Item>
              </Form>
              {
                listDestination && listManageHotel &&
                  <Table
                      loading={loading}
                      columns={columns}
                      dataSource={listManageHotel}
                      rowKey="id"
                      size="small"

                  />
              }


            </RctCollapsibleCard>
          </div>
        </div>
        <OrderDetails
          onEditOrderNumber={this.onEditOrderNumber}
          open={this.state.openDetails}
          onOrderClose={this.onOrderClose}
          hotel={this.state.hotel}
        />
        <AddRoom_util
                    open={this.state.open}
                    edit={this.state.edit}
                    item={this.state.item}
                    onSave={this.onSave}
                    onClose={() => this.onClose()}
                />
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    listManageHotel: state.manageHotel.list,
    listDestination: state.destination.listDestination,
    paging: state.orderTour.paging,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllManageHotel: (filter) => dispatch(_getAllManageHotel(filter)),
    onVerifyTour: (id, status) => dispatch(onVerifyTour(id, status)),
    getAllTour: (filter, paginate) => dispatch(getAllTour(filter, paginate)),
    getAllDestination: (filter, paginate) =>
      dispatch(getAllSpot(filter, paginate)),
    getDetailManageHotel: (id) =>
      dispatch(getDetailManageHotel(id)),
      confirmProofOfPayment: (id, data) => dispatch(confirmProofOfPayment(id, data))
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HotelManagerComponent)
);
