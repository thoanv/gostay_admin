import { Table, Tag } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import renderHTML from "react-render-html";
import { withRouter, Link } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import {
  addActivity,
  batchDelete,
  getAllActivity,
  updateActivity
} from "../../../actions/ActivityAction";
import { getAllACCOUNT } from "../../../actions/AccountAction";
import { getAllRules } from "../../../actions/RulesAction";
import { publish, unpublish } from "../../../actions/CommonActions";
import StatusButton from "../../../components/StatusButton";
import TableActionBar from "../../../components/TableActionBar";
import AddActivity from "./AddActivity";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        sort: {
          type: "desc",
          attr: ""
        },
        search: "",
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
      getActivity: null,
      filterAccount: { paging: 0 }
    };
  }
  componentDidMount() {
    this.props.getAllActivity(this.state.filter);
    this.props.getAllRegistered(this.state.filterAccount, "registered");
    this.props.getAllRules(this.state.filterAccount);
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onAddActivity = () => {
    this.setState({
      ...this.state,
      open: true
    });
  };
  onEditActivity(data) {
    this.setState({
      open: true,
      getActivity: data,
      edit: true
    });
  }
  onActivityClose = () => {
    this.setState({
      open: false,
      getActivity: null,
      isSubmiting: false,
      edit: false
    });
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
      () => this.props.getAllActivity(this.state.filter)
    );
  }
  onRefresh() {
    this.props.getAllActivity(this.state.filter);
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
  onChangPage(page, pageSize) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          paging: {
            perpage: pageSize,
            page: page
          }
        }
      },
      () => {
        this.props.getAllActivity(this.state.filter);
      }
    );
  }
  onChangePerpage(current, size) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          paging: {
            perpage: size,
            page: current
          }
        }
      },
      () => {
        this.props.getAllActivity(this.state.filter);
      }
    );
  }
  onSaveActivity = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateActivity({
          ...dataSubmit,
          expired: moment(data.expired).format("YYYY-MM-DD HH:mm:ss")
        })
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getActivity: null,
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
        .createActivity({
          ...data,
          expired: moment(data.expired).format("YYYY-MM-DD HH:mm:ss")
        })
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getActivity: null,
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

  getOrder(order) {
    if (order === "ascend") return "asc";
    if (order === "descend") return "desc";
    return "desc";
  }

  onChangeTable = (
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
          paging: {
            page: pagination.current,
            perpage: pagination.pageSize
          },
          sort: {
            type: this.getOrder(sorter.order),
            attr: sorter.columnKey
          }
        }
      },
      () => this.props.getAllActivity(this.state.filter)
    );
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
        () => this.props.getAllActivity(this.state.filter)
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
        () => this.props.getAllActivity(this.state.filter)
      );
  };

  isStyledHighlightRow = record => {
    if (new Date(record.expired).getTime() < new Date().getTime()) {
      return "highlight";
    }
  };

  render() {

    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
      {
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        key: "status",
        render: (text, record) => (
          <StatusButton
            data_id={record.id}
            status={record.status}
            table="point_activity"
          />
        )
      },
      {
        title: <IntlMessages id="global.title" />,
        dataIndex: "title",
        key: "title",
        sorter: true,
        width: 200,
        render: (text, record) => (
          <span
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => this.onEditActivity(record)}
          >
            {record.title}
          </span>
        )
      },
      {
        title: <IntlMessages id="activity.rule_id" />,
        key: "rule_id",
        render: record => {
          return record.rule_code;
        }
      },
      {
        title: <IntlMessages id="activity.cid" />,
        key: "cid",

        render: (text, record) => (
          <b>
            {
              (record.cid_firstname
                ? `${record.cid_firstname} ${record.cid_lastname}`
                : `${record.cid_email}`
              ).split("null", 1)
            }
          </b>
        ),
      },
      {
        title: <IntlMessages id="activity.referral_id" />,
        key: "referral_id",

        render: (text, record) => (
          <b>
            {
              (record.referral_firstname
                ? `${record.referral_firstname} ${record.referral_lastname}`
                : `${record.referral_email}`
              ).split("null", 1)
            }
          </b>
        ),
      },
      {
        title: <IntlMessages id="activity.referral_data" />,
        dataIndex: "referral_data",
        key: "referral_data"
      },
      {
        title: <IntlMessages id="activity.point" />,
        dataIndex: "points",
        key: "points",
        sorter: true
      },
      {
        title: <IntlMessages id="global.expired" />,
        key: "expired",
        render: record => {
          return (
            <React.Fragment>
              {moment(record.expired).format('23:59:59') < moment().format('23:59:59') ? (
                <Tag color="red">
                  {moment(record.expired).format("YYYY-MM-DD")}
                </Tag>
              ) : (
                  <Tag color="green">
                    {moment(record.expired).format("YYYY-MM-DD")}
                  </Tag>
                )}
            </React.Fragment>
          );
        },
        sorter: true
      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true
      }
    ];

    const { listActivity, paging, listAccount, listRule } = this.props;

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.activity" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={() => this.onAddActivity()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                isShowPublishButtons={true}
                table="point_activity"
                showFilter={false}
                onFilter={this.filter}
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listActivity}
                tableLayout="auto"
                rowKey="id"
                size="small"
                rowClassName={this.isStyledHighlightRow}
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "30"],
                  total: paging.count,
                  defaultCurrent: +paging.page,
                  pageSize: +paging.perpage
                }}
                onChange={this.onChangeTable}
              />
            </RctCollapsibleCard>
          </div>
        </div>
        <AddActivity
          open={this.state.open}
          onSaveActivity={this.onSaveActivity}
          onActivityClose={this.onActivityClose}
          loading={this.state.isSubmiting}
          edit={this.state.edit}
          activity={this.state.getActivity}
          listAccount={listAccount}
          listRule={listRule}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    listActivity: state.activity.listActivity,
    listAccount: state.account.listAccount,
    listRule: state.rules.listRules,
    paging: state.activity.paging
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllActivity: filter => dispatch(getAllActivity(filter)),
    getAllRegistered: (filter, data) => dispatch(getAllACCOUNT(filter, data)),
    getAllRules: filter => dispatch(getAllRules(filter)),
    delete: data => dispatch(batchDelete(data)),
    createActivity: data => dispatch(addActivity(data)),
    updateActivity: data => dispatch(updateActivity(data)),
    publish: data => dispatch(publish(data)),
    unpublish: data => dispatch(unpublish(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
