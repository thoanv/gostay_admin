import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { Table, Modal, message, Button, Avatar, Rate, Tag } from "antd";
import TableActionBar from "../../../components/TableActionBar";
import StatusButton from "../../../components/StatusButton";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import {
  getAllHotel,
  addHotel,
  updateHotel,
  deleteHotel
} from "../../../actions/HotelActions";
import { getAllDestination } from "../../../actions/DestinationActions";
import AddHotel from "./AddHotel";

class ListHotel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        sort: {
          type: "desc",
          attr: ""
        },
        created_at: {
          type: "compare",
          value: {
            from: "",
            to: ""
          }
        },
        title: {
          type: "like",
          value: ""
        },
        alias: {
          type: "=",
          value: []
        },
        search: "",
        paging: {
          perpage: 10,
          page: 1
        }
      },
      open: false,
      current_hotel: null,
      selectedRowKeys: [],
      isSubmiting: false,
      edit: false,
      filterDest: { paging: 0 }
    };
  }

  componentDidMount() {
    this.props.getAllHotel(this.state.filter);
    this.props.getAllDestination(this.state.filterDest);
  }

  filter = (value, name, type) => {
    console.log(value);
    if (type === "search") {
      this.setState(
        {
          ...this.state,
          filter: {
            ...this.state.filter,
            search: value
          }
        },
        () => this.props.getAllHotel(this.state.filter)
      );
    } else
      this.setState(
        {
          ...this.state,
          filter: {
            ...this.state.filter,
            [name]: {
              type: "=",
              value: value
            }
          }
        },
        () => this.props.getAllHotel(this.state.filter)
      );
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onAddHotel = () => {
    this.setState({ open: true });
  };
  onEditHotel(hotel) {
    this.setState({ open: true, current_hotel: hotel, edit: true });
  }
  onHotelClose = () => {
    this.setState({
      open: false,
      current_hotel: null,
      isSubmiting: false,
      edit: false
    });
  };

  onSaveHotel = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateHotel(dataSubmit)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            current_hotel: null,
            edit: false
          });
        })
        .catch(err => {
          this.setState({
            ...this.state,
            isSubmiting: false
          });
        });
    } else
      await this.props
        .createHotel(data)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            current_hotel: null,
            edit: false
          });
        })
        .catch(err => {
          this.setState({
            ...this.state,
            isSubmiting: false
          });
        });
  };

  onDelete() {
    this.props.deleteHotel({ id: this.state.selectedRowKeys }).then(res => {
      this.setState({
        ...this.state,
        selectedRowKeys: []
      });
    });
  }

  onRefresh = () => {
    this.props.getAllHotel(this.state.filter, "admin");
    this.setState({
      selectedRowKeys: []
    });
  }


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
            attr: sorter.columnKey
          },
          paging: {
            perpage: pagination.pageSize,
            page: pagination.current
          }
        }
      },
      () => this.props.getAllHotel(this.state.filter)
    );
  };
  render() {
    const columns = [
      {
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        render: (text, record) => (
          <StatusButton
            data_id={record.id}
            status={record.status}
            table="hotel"
          />
        )
      },
      {
        title: <IntlMessages id="hotel.name" />,
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <b
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => this.onEditHotel(record)}
          >
            {record.name}
          </b>
        ),
        sorter: true
      },
      {
        title: <IntlMessages id="hotel.checkin" />,
        dataIndex: "checkin",
        key: "checkin"
      },
      {
        title: <IntlMessages id="hotel.checkout" />,
        dataIndex: "checkout",
        key: "checkout"
      },
      {
        title: <IntlMessages id="global.address" />,
        dataIndex: "address",
        key: "address"
      },
      {
        title: <IntlMessages id="review.rank" />,
        dataIndex: "rank",
        key: "rank",
        render: (text, record) => (
          <span>
            <Rate disabled value={record.rank} />
          </span>
        ),
        sorter: true
      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true
      }
    ];

    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const { listHotel, paging, listDestination } = this.props;

    const hasSelected = selectedRowKeys.length > 0;

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.hotel" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={() => this.onAddHotel()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                table="hotel"
                isShowPublishButtons={true}
                onFilter={this.filter}
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>

              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listHotel}
                tableLayout="auto"
                rowKey="id"
                size="small"
                pagination={{
                  pageSizeOptions: ["10", "20", "30"],
                  total: paging.count,
                  showSizeChanger: true
                }}
                onChange={this.onChangTable}
              />
            </RctCollapsibleCard>
          </div>
        </div>
        <AddHotel
          open={this.state.open}
          onSaveHotel={this.onSaveHotel}
          onHotelClose={this.onHotelClose}
          loading={this.state.isSubmiting}
          edit={this.state.edit}
          hotel={this.state.current_hotel}
          listDestination={listDestination}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    listHotel: state.hotel.listHotel,
    listDestination: state.destination.listDestination,
    paging: state.hotel.paging
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllHotel: filter => dispatch(getAllHotel(filter)),
    getAllDestination: filter => dispatch(getAllDestination(filter)),
    createHotel: data => dispatch(addHotel(data)),
    updateHotel: data => dispatch(updateHotel(data)),
    deleteHotel: data => dispatch(deleteHotel(data))
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListHotel)
);
