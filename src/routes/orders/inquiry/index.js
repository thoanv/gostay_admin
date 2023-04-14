import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { publish, unpublish } from "../../../actions/CommonActions";
import {
  getAllInquiry,
  updateInquiry,
  createInquiry,
  batchDelete
} from "../../../actions/InquiryAction";
import { getAllACCOUNT } from "../../../actions/AccountAction";
import { getAllDestination } from "../../../actions/DestinationActions";
import IntlMessages from "Util/IntlMessages";
import { Table, Input, Tag, Button } from "antd";
import "antd/dist/antd.css";
import TableActionBar from "../../../components/TableActionBar";
import StatusButton from "../../../components/StatusButton";
import moment from "moment";
import AddInquiry from "./AddInquiry";
import AssignInquiry from "./AssignInquiry";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listInquiry: [],
      filter: {
        sort: {
          type: "desc",
          attr: ""
        },
        paging: {
          perpage: 10,
          page: 1
        }
      },
      edit: false,
      isSubmiting: false,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      open: false,
      getInquiry: null,
      filterAccount: { paging: 0 }
    };
  }

  componentDidMount() {
    this.props.getAllInquiry(this.state.filter);
    this.props.getAllRegistered(this.state.filterAccount, "registered");
    this.props.getAllDestination(this.state.filterAccount);
  }

  onCancel() {
    this.setState({
      ...this.state,
      open: false
    });
  }

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false
      });
    }, 1000);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onChangeSearch(event) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          search: event.target.value
        }
      },
      () => this.props.getAllInquiry(this.state.filter)
    );
  }

  onRefresh() {
    this.props.getAllInquiry(this.state.filter, "inquiry");
    this.setState({
      selectedRowKeys: []
    });
  }

  onDelete() {
    this.props.delete({ id: this.state.selectedRowKeys }).then(() => {
      this.setState({
        selectedRowKeys: []
      });
    });
  }

  onCreateInquiry = () => {
    this.setState({
      open: true,
      getInquiry: null
    });
  };

  onEditInquiry = inquiry => {
    this.setState({
      open: true,
      getInquiry: inquiry,
      edit: true
    });
  };

  onInquiryClose = () => {
    this.setState({
      open: false,
      getInquiry: null,
      edit: false,
      isSubmiting: false
    });
  };

  filter = (value, name, type) => {
    if (type === "search") {
      this.setState(
        {
          ...this.state,
          filter: {
            ...this.state.filter,
            search: value
          }
        },
        () => this.props.getAllInquiry(this.state.filter)
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
        () => this.props.getAllInquiry(this.state.filter)
      );
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
            attr: sorter.columnKey
          },
          paging: {
            perpage: pagination.pageSize,
            page: pagination.current
          }
        }
      },
      () => {
        console.log(this.state.filter);
        this.props.getAllInquiry(this.state.filter);
      }
    );
  };

  onShowAssign = data => {
    this.setState({
      openAssign: true,
      current_assign: data
    });
  };

  onCloseAssign = () => {
    this.setState({
      openAssign: false,
      current_assign: null
    });
  };

  handleChangePage(page, pageSize) {
    if (
      page != this.state.filter.paging.page ||
      (pageSize != this.state.filter.paging.perpage && pageSize)
    ) {
      this.setState(
        {
          ...this.state,
          filter: {
            ...this.state.filter,
            paging: {
              ...this.state.filter.paging,
              page: page,
              perpage: pageSize
            }
          }
        },
        () => {
          this.props.getAllInquiry(this.state.filter);
        }
      );
    }
  }

  onSaveInquiry = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateInquiry({
          ...dataSubmit,
          date: moment(dataSubmit.date).format("YYYY-MM-DD HH:mm:ss")
        })
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getInquiry: null,
            edit: false
          });
        })
        .catch(err => {
          this.setState({
            ...this.state,
            isSubmiting: false
          });
        });
    } else {
      await this.props
        .createInquiry({
          ...data,
          date: moment(data.date).format("YYYY-MM-DD HH:mm:ss")
        })
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getInquiry: null,
            inquiry: null,
            edit: false
          });
        })
        .catch(err => {
          this.setState({
            ...this.state,
            isSubmiting: false
          });
        });
    }
  };

  render() {
    const { loading, selectedRowKeys } = this.state;

    const style = {
      color: "blue",
      cursor: "pointer"
    };

    const { listInquiry, paging, listAccount, listDestination } = this.props;

    const listDestinationCountry = listDestination.filter(item => {
      return item.country_id === 15;
    });

    const columns = [
      {
        title: <IntlMessages id="inquiry.name" />,
        key: "name",
        render: record => {
          return (
            <span style={style} onClick={() => this.onEditInquiry(record)}>
              {record.name}
            </span>
          );
        }
      },
      {
        title: <IntlMessages id="inquiry.phone" />,
        key: "phone",
        dataIndex: "phone",
        sorter: true
      },
      {
        title: <IntlMessages id="inquiry.email" />,
        key: "email",
        dataIndex: "email"
      },
      {
        title: <IntlMessages id="inquiry.depart_city" />,
        key: "depart_city",
        dataIndex: "depart_title"
      },
      {
        title: <IntlMessages id="inquiry.date" />,
        key: "date",
        render: record => {
          return moment(record.date).format("YYYY-MM-DD");
        },
        sorter: true
      },
      {
        title: <IntlMessages id="global.status" />,
        key: "status",
        render: record => {
          return record.status === 1 ? (
            <Tag color="red">
              <IntlMessages id="global.waiting" />
            </Tag>
          ) : record.status === 2 ? (
            <Tag color="blue">
              <IntlMessages id="global.doing" />
            </Tag>
          ) : (
            <Tag color="green">
              <IntlMessages id="global.done" />
            </Tag>
          );
        }
      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true
      },
      {
        title: <IntlMessages id="global.assign" />,
        key: "assign",
        render: record =>
          record.assign == null && record.cid != null ? (
            <Button
              type="primary"
              onClick={() => this.onShowAssign(record)}
              style={{ margin: "0px" }}
            >
              <IntlMessages id="global.assign" />
            </Button>
          ) : (
            <div>{record.cid != null ? record.assgin_detail.email : null}</div>
          ),
        sorter: true
      }
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.inquiry" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={() => this.onCreateInquiry()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                table="inquiry"
                isShowPublishButtons={false}
                onChange={this.onChangTable}
                onFilter={this.filter}
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>
              <Table
                tableLayout="auto"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listInquiry}
                onChange={this.onChangTable}
                rowKey="id"
                size="small"
                rowClassName={this.isStyledHighlightRow}
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "30"],
                  total: paging.count,
                  defaultCurrent: parseInt(paging.page),
                  pageSize: parseInt(paging.perpage)
                }}
              />
            </RctCollapsibleCard>
          </div>
        </div>
        <AddInquiry
          open={this.state.open}
          edit={this.state.edit}
          inquiry={this.state.getInquiry}
          onSaveInquiry={this.onSaveInquiry}
          onInquiryClose={() => this.onInquiryClose()}
          listAccount={listAccount}
          listDestination={listDestination}
          listDestinationCountry={listDestinationCountry}
        />
        <AssignInquiry
          openAssign={this.state.openAssign}
          onCloseAssign={this.onCloseAssign}
          current_assign={this.state.current_assign}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    listInquiry: state.inquiry.listInquiry,
    listDestination: state.destination.listDestination,
    listAccount: state.account.listAccount,
    paging: state.inquiry.paging
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllInquiry: filter => dispatch(getAllInquiry(filter)),
    getAllRegistered: (filter, data) => dispatch(getAllACCOUNT(filter, data)),
    getAllDestination: filter => dispatch(getAllDestination(filter)),
    createInquiry: data => dispatch(createInquiry(data)),
    updateInquiry: id => dispatch(updateInquiry(id)),
    delete: data => dispatch(batchDelete(data)),
    publish: data => dispatch(publish(data)),
    unpublish: data => dispatch(unpublish(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
