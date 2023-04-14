import { DatePicker, Form, Table, Tag } from "antd";
import BaseSelect from "Components/Elements/BaseSelect";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { getAllDestination } from "../../../actions/DestinationActions";
import {
  getAllOrderTour,
  getDetailOrderTour,
} from "../../../actions/OrderTourActions";
import { getAllTour } from "../../../actions/TourActions";
import OrderDetails from "./OrderDetails";

class CitiesEscape extends Component {
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
          value: 1,
        },
      },
      selectedRowKeys: [],
      open: false,
      openAssign: false,
      current_assign: null,
      tourFilter: {
        paging: 0,
      },
      destinationFilter: {
        paging: 0,
      },
      order_current: null,
    };
  }

  componentDidMount() {
    this.props.getAllOrderTour(this.state.filter);
    this.props.getAllTour(this.state.tourFilter);
    this.props.getAllDestination(this.state.destinationFilter);
  }

  onEditOrderNumber = (data) => {
    this.props.getDetailOrderTour(this.state.filter, data.id).then((res) => {
      this.setState({
        open: true,
        order_current: res.data,
      });
    });
  };

  onOrderClose = () => {
    this.setState({
      open: false,
      order_current: null,
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

  render() {
    const { selectedRowKeys } = this.state;

    const { listOrderTour, tours, paging, destinations } = this.props;

    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
      {
        title: <IntlMessages id="order.number" />,
        key: "order_number",
        render: (record) => (
          <React.Fragment>
            <div>
              <p
                style={{ color: "blue", cursor: "pointer", margin: 0 }}
                onClick={() => this.onEditOrderNumber(record)}
              >
                {record.order_number}
              </p>
            </div>
            {/* <Tag
              style={{ marginBottom: "0px", cursor: "pointer" }}
              color="green"
            >
              <Link
                style={{ color: "green" }}
                to={`/app/vouchers/${record.id}`}
              >
                Voucher
              </Link>
            </Tag> */}
          </React.Fragment>
        ),
        sorter: true,
      },
      {
        title: <IntlMessages id="order.tour" />,
        dataIndex: "tour_title",
        key: "tour_title",
      },
      {
        title: <IntlMessages id="order.depart" />,
        key: "depart",
        render: (record) => {
          return moment(record.depart).format("YYYY/MM/DD");
        },
        sorter: true,
      },
      {
        title: <IntlMessages id="order.customer" />,
        key: "lastname",
        render: (text, record) => (
          <b>
            <Link to={`/app/customer/${record.cid}`} style={{ color: "blue" }}>
              {record.firstname + " " + record.lastname}
            </Link>
          </b>
        ),
      },
      {
        title: <IntlMessages id="order.unit_price" />,
        dataIndex: "unit_price",
        key: "unit_price",
        sorter: true,
      },
      {
        title: <IntlMessages id="order.qty" />,
        dataIndex: "qty",
        key: "qty",
        sorter: true,
      },
      {
        title: <IntlMessages id="order.total" />,
        render: (record) => {
          let checkDot = record.total.lastIndexOf(".");
          return record.total.slice(0, checkDot + 3);
        },
        key: "total",
        sorter: true,
      },
      {
        title: <IntlMessages id="order.currency" />,
        dataIndex: "currency",
        key: "currency",
      },
      {
        title: <IntlMessages id="global.status" />,
        key: "status",
        render: (record) => {
          return record.status === "PENDING" ? (
            <Tag color="red">{record.status}</Tag>
          ) : (
            <Tag color="green">{record.status}</Tag>
          );
        },
      },
      {
        title: <IntlMessages id="global.created" />,
        dataIndex: "created_at",
        key: "created_at",
        className: "center-column",
        render: (text, record) => (
          <React.Fragment>
            <div>{moment(record.created_at).format("DD/MM/YYYY")}</div>
            <div>{moment(record.created_at).format("HH:mm")}</div>
          </React.Fragment>
        ),
      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true,
      },
    ];

    let tourName = tours.map((item) => {
      if (item.title) {
        return {
          ...item,
          id: item.id,
          title: item.title,
        };
      }
    });

    let desName = destinations.map((item) => {
      if (item.title) {
        return {
          id: item.id,
          title: item.title,
        };
      }
    });

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.orders" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <Form layout="inline" onSubmit={this.handleSubmit}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Form.Item>
                    <DatePicker
                      placeholder="Start date"
                      onChange={(value) => this.onFilter("depart", value)}
                    />
                  </Form.Item>
                  <Form.Item>
                    <BaseSelect
                      showSearch
                      options={tourName}
                      defaultText="Select a tour"
                      optionValue="id"
                      onChange={(value) => this.onFilter("tour_id", value)}
                      style={{ width: "200px" }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <BaseSelect
                      showSearch
                      options={desName}
                      defaultText="Select departure city"
                      optionValue="id"
                      onChange={(value) => this.onFilter("departure_id", value)}
                      style={{ width: "200px" }}
                    />
                  </Form.Item>
                </div>
              </Form>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.onSelectChange,
                }}
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
          orderTour={this.state.order_current}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    listOrderTour: state.orderTour.listOrderTour,
    tours: state.tour.listTour,
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
    getDetailOrderTour: (filter, id) =>
      dispatch(getDetailOrderTour(filter, id)),
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CitiesEscape)
);
