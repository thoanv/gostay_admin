import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { Table, Avatar, Form, DatePicker, Tag, Button } from "antd";
import moment from "moment";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import config from "../../../../config";
import {
  getAllOrderTour,
  getDetailOrderTour,
} from "../../../actions/OrderTourActions";
import { getAllDestination } from "../../../actions/DestinationActions";
import BaseSelect from "Components/Elements/BaseSelect";
import { getAllTour } from "../../../actions/TourActions";
import OrderDetails from "./OrderDetails";
import AssignOrder from "./AssignOrder";
import { OrderStatus } from "../../../components/OrderStatus";
import { PayMethod } from "../../../components/PayMethod";
import { ApproveProofModal } from "../../../components/ApproveProofModal";
import { confirmProofOfPayment } from '../../../actions/OrderActions';

class TourOrder extends Component {
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
        await this.props.getAllOrderTour(this.state.filter);
        this.props.getAllTour(this.state.tourFilter);
        this.props.getAllDestination(this.state.destinationFilter);
        this.setState({ loading: false })
    } catch (error) {
        this.setState({ loading: false })
    }

}

  getDetailsOrder = (id, customer, record) => {
    this.props.getDetailOrderTour(id).then((res) => {
      this.setState({
        open: true,
        orderdetail: res.data.info_basic,
        customer,
        selectedRecord: record
      })
    });
  }

  onEditOrderNumber = (order) => {
    this.props.getDetailOrderTour(this.state.filter, order.id).then((res) =>
      this.setState({
        open: true,
        orderdetail: res.data,
      })
    );
  };

  onOrderClose = () => {
    this.setState({
      open: false,
      order_current: null,
    });
  };

  onShowAssign = (data) => {
    this.setState({
      openAssign: true,
      current_assign: data,
    });
  };

  onCloseAssign = () => {
    this.setState({
      openAssign: false,
      current_assign: null,
    });
  };

  onFilter(name, value) {
    if (name == "depart") {
      if (value) {
        value = value.toISOString().substr(0, 10);

        this.setState({
          filter: {
            ...this.state.filter,
            [name]: {
              type: "=",
              value: value,
            },
          },
        });
      } else {
        this.setState(
          {
            filter: {
              ...this.state.filter,
              [name]: {},
            },
          },
          () => this.props.getAllOrderTour(this.state.filter)
        );
      }
    } else {
      this.setState({
        filter: {
          ...this.state.filter,
          [name]: {
            type: "=",
            value: value,
          },
        },
      });
    }
    setTimeout(() => {
      this.props.getAllOrderTour(this.state.filter);
    }, 300);
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  getOrder(order) {
    if (order === "ascend") return "asc";
    if (order === "descend") return "desc";
    return "desc";
  }

  onChangTable = (
    pagination,
    filters,
    sorter,
    extra = { currentDataSource: [] }
  ) => {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          sort: {
            type: this.getOrder(sorter.order),
            attr: sorter.columnKey,
          },
          paging: {
            perpage: pagination.pageSize,
            page: pagination.current,
          },
        },
      },
      () => {
        this.props.getAllOrderTour(this.state.filter);
      }
    );
  };

  getTourStatus = (value) => {
    switch(value) {
      case "ORDER_PENDING": 
      return <Tag style={{ marginTop: "0" }} color='#ed7014'>
      ORDER_PENDING
    </Tag>
      case 1:
        return <Tag style={{ marginTop: "0" }} color='green'>
        ĐÃ XÁC NHẬN
      </Tag>
      case 2:
        return <Tag style={{ marginTop: "0" }} color='red'>
        HUỶ TOUR
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
      await this.props.getAllOrderTour();
  }

  render() {
    const { selectedRowKeys, loading, currentOrder, isShowProofModal } = this.state;

    const { listOrderTour, tours, paging, destinations } = this.props;

    const columns = [
      {
        title: <IntlMessages id="order.number" />,
        key: "order_code",
        render: (text, record) => {
          const tourInfo = JSON.parse(record.info);
            const customer = JSON.parse(record.customer_info)
          return <div style={{ color: 'blue', cursor: 'pointer' }} 
          onClick={() => this.getDetailsOrder(tourInfo.tour_id, customer, record)}>
            {record.order_number}
            </div>;
        },
      },

      {
        title: <IntlMessages id='order.payment_status' />,
        dataIndex: 'payment-status',
        align: 'center',
        key: 'payment-status',
        render: (text, record) => (
            <div>
                {this.getPaymentStatus(record.pay_status)}
                
            </div>
        )
    },
      {
        title: <IntlMessages id="global.pay_method" />,
        key: "pay_method",
        dataIndex: "pay_method",
        align: 'center',
        render: (text, record) => {
            return (
                <PayMethod
                    methodCode={text}
                    hasPaymentProof={record.proof_of_payment}
                    paymentProofApproved={record.proof_approved_status}
                    onClickProofStatus={() => this.setState({currentOrder: record, isShowProofModal: true})}
                />
            );
        },
    },
      {
        title: <IntlMessages id="order.depart" />,
        // dataIndex: "depart",
        key: "depart",
        render: (record) => {
          return moment(record.depart).format("YYYY/MM/DD");
        },
        sorter: true,
      },
      {
        title: <IntlMessages id="order.customer" />,
        key: "lastname",
        render: (text, record) => {
          const customer = JSON.parse(record.customer_info)
          return <b>
            {customer.firstName + " " + customer.lastName}
        </b>
        },
      },
      {
        title: <IntlMessages id="order.discount" />,
        render: (record) => {
          return `${record.discount}`;
        },
        key: "discount",
        sorter: true,
      },
      {
        title: <IntlMessages id="order.total" />,
        render: (record) => {
          return `${record.total}`;
        },
        key: "total",
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
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true,
      },
      {
        title: <IntlMessages id="global.action" />,
        // dataIndex: "created_at",
        render: (text, record, index) => {
            const tourInfo = JSON.parse(record.info);
            const customer = JSON.parse(record.customer_info)
            return (
                <div>
                    <Button type="primary" size="small" className="mt-1" 
                    onClick={() => this.getDetailsOrder(tourInfo.tour_id, customer, record)}>
                      Chi Tiết
                    </Button>
                </div>

            )
        }
    },
    ];

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.orders" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.onSelectChange,
                }}
                loading={loading}
                columns={columns}
                dataSource={listOrderTour}
                onChange={this.onChangTable}
                rowKey="id"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "30"],
                  total: paging.count,
                  defaultCurrent: +paging.page,
                  pageSize: +paging.perpage,
                }}
                size="small"
             
              />
            </RctCollapsibleCard>
          </div>
        </div>
        <OrderDetails
          onEditOrderNumber={this.onEditOrderNumber}
          open={this.state.open}
          onOrderClose={this.onOrderClose}
          orderTour={this.state.orderdetail}
          customer={this.state.customer}
          selectedRecord={this.state.selectedRecord}
        />
        <AssignOrder
          openAssign={this.state.openAssign}
          onCloseAssign={this.onCloseAssign}
          current_assign={this.state.current_assign}
        />
        {
                    currentOrder ? (
                        <ApproveProofModal 
                            visible={isShowProofModal}
                            onCancel={() => this.onCloseApproveProofModal()}
                            onApprove={() => this.onConfirmProof(1)}
                            onReject={() => this.onConfirmProof(0)}
                            proof={currentOrder.proof_of_payment}
                            orderNumber={currentOrder.order_number}
                            showButtons={currentOrder.proof_approved_status != 1}
                        />
                    ) : null
                }
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    listOrderTour: state.orderTour.listOrderTour,
    tours: state.tour.listOrderTour,
    destinations: state.destination.listDestination,
    paging: state.orderTour.paging,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllOrderTour: (filter) => dispatch(getAllOrderTour(filter)),
    getAllTour: (filter, paginate) => dispatch(getAllTour(filter, paginate)),
    getAllDestination: (filter, paginate) =>
      dispatch(getAllDestination(filter, paginate)),
    getDetailOrderTour: (id) =>
      dispatch(getDetailOrderTour(id)),
      confirmProofOfPayment: (id, data) => dispatch(confirmProofOfPayment(id, data))
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TourOrder)
);
