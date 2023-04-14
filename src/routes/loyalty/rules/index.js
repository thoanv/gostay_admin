import StarsIcon from "@material-ui/icons/Stars";
import { Table, Tag } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import renderHTML from "react-render-html";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import {
  addRules,
  deleteRules,
  getAllRules,
  updateRules
} from "../../../actions/RulesAction";
import StatusButton from "../../../components/StatusButton";
import TableActionBar from "../../../components/TableActionBar";
import AddRules from "./AddRules";

const expired_date = [
  {
    id: 0,
    title: "Default"
  },
  {
    id: 1,
    title: <span>1 <IntlMessages id="global.day" /></span>
  },
  {
    id: 2,
    title: <span>2 <IntlMessages id="global.day" /></span>
  },
  {
    id: 3,
    title: <span>3 <IntlMessages id="global.day" /></span>
  },
  {
    id: 4,
    title: <span>4 <IntlMessages id="global.day" /></span>
  },
  {
    id: 5,
    title: <span>5 <IntlMessages id="global.day" /></span>
  },
  {
    id: 6,
    title: <span>6 <IntlMessages id="global.day" /></span>
  },
  {
    id: 7,
    title: <span>7 <IntlMessages id="global.day" /></span>
  },
  {
    id: 8,
    title: <span>8 <IntlMessages id="global.day" /></span>
  },
  {
    id: 9,
    title: <span>9 <IntlMessages id="global.day" /></span>
  },
  {
    id: 10,
    title: <span>10 <IntlMessages id="global.day" /></span>
  },
  {
    id: 11,
    title: <span>11 <IntlMessages id="global.day" /></span>
  },
  {
    id: 12,
    title: <span>12 <IntlMessages id="global.day" /></span>
  },
  {
    id: 13,
    title: <span>13 <IntlMessages id="global.day" /></span>
  },
  {
    id: 14,
    title: <span>14 <IntlMessages id="global.day" /></span>
  },
  {
    id: 15,
    title: <span>15 <IntlMessages id="global.day" /></span>
  },
  {
    id: 16,
    title: <span>16 <IntlMessages id="global.day" /></span>
  },
  {
    id: 17,
    title: <span>17 <IntlMessages id="global.day" /></span>
  },
  {
    id: 18,
    title: <span>18 <IntlMessages id="global.day" /></span>
  },
  {
    id: 19,
    title: <span>19 <IntlMessages id="global.day" /></span>
  },
  {
    id: 20,
    title: <span>20 <IntlMessages id="global.day" /></span>
  },
  {
    id: 21,
    title: <span>21 <IntlMessages id="global.day" /></span>
  },
  {
    id: 22,
    title: <span>22 <IntlMessages id="global.day" /></span>
  },
  {
    id: 23,
    title: <span>23 <IntlMessages id="global.day" /></span>
  },
  {
    id: 24,
    title: <span>24 <IntlMessages id="global.day" /></span>
  },
  {
    id: 25,
    title: <span>25 <IntlMessages id="global.day" /></span>
  },
  {
    id: 26,
    title: <span>26 <IntlMessages id="global.day" /></span>
  },
  {
    id: 27,
    title: <span>27 <IntlMessages id="global.day" /></span>
  },
  {
    id: 28,
    title: <span>28 <IntlMessages id="global.day" /></span>
  },
  {
    id: 29,
    title: <span>29 <IntlMessages id="global.day" /></span>
  },
  {
    id: 30,
    title:<span>1 <IntlMessages id="global.month" /></span>
  },
  {
    id: 60,
    title: <span>2 <IntlMessages id="global.month" /></span>
  },
  {
    id: 90,
    title:<span>3 <IntlMessages id="global.month" /></span>
  },
  {
    id: 180,
    title:<span>6 <IntlMessages id="global.month" /></span>
  },
  {
    id: 360,
    title:<span>1 <IntlMessages id="global.year" /></span>
  },
  {
    id: 720,
    title:<span>2 <IntlMessages id="global.year" /></span>
  },
  {
    id: 1080,
    title:<span>3 <IntlMessages id="global.year" /></span>
  },
  {
    id: 1440,
    title:<span>4 <IntlMessages id="global.year" /></span>
  },
  {
    id: 1800,
    title:<span>5 <IntlMessages id="global.year" /></span>
  },
  {
    id: 3600,
    title:<span>10 <IntlMessages id="global.year" /></span>
  }
];

class ListRules extends Component {
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
      addRuleState: false,
      selectedRowKeys: [],
      isSubmiting: false,
      current_rule: null,
      edit: false
    };
  }
  componentDidMount() {
    this.props.getAllRules(this.state.filter);
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onAddRules = () => {
    this.setState({
      addRuleState: true
    });
  };
  onEditRules(rule) {
    this.setState({
      addRuleState: true,
      current_rule: rule,
      edit: true
    });
  }
  onRulesClose = () => {
    this.setState({
      addRuleState: false,
      current_rule: null,
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
      () => this.props.getAllRules(this.state.filter)
    );
  }
  onRefresh() {
    this.props.getAllRules(this.state.filter);
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
        this.props.getAllRules(this.state.filter);
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
        this.props.getAllRules(this.state.filter);
      }
    );
  }
  onSaveRules = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateRules(dataSubmit)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addRuleState: false,
            current_rule: null,
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
        .createRules(data)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addRuleState: false,
            current_rule: null,
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
      () => this.props.getAllRules(this.state.filter)
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
        () => this.props.getAllRules(this.state.filter)
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
        () => this.props.getAllRules(this.state.filter)
      );
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
            table="point_rule"
          />
        )
      },
      {
        title: <IntlMessages id="global.name" />,
        dataIndex: "rule_name",
        key: "rule_name",
        render: (text, record) => (
          <span
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => this.onEditRules(record)}
          >
            {record.rule_name}
          </span>
        )
      },
      {
        title: <IntlMessages id="global.title" />,
        dataIndex: "title",
        key: "title"
      },
      {
        title: <IntlMessages id="global.code" />,
        dataIndex: "code",
        key: "code",
        sorter: true
      },
      {
        title: <IntlMessages id="global.point" />,
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
        title: <IntlMessages id="rule.expired_day" />,
        key: "expired_day",
        render: record => {
          let a = expired_date.find(item => {
            return item.id === record.expired_day;
          });
          return <span>{a.title}</span>;
        },
        sorter: true
      },
      {
        title: <IntlMessages id="global.autoapproved" />,
        dataIndex: "autoapproved",
        key: "autoapproved",
        className: "center-column",
        render: (text, record) => (
          <React.Fragment>
            {record ? (
              record.autoapproved === 1 ? (
                <Tag color="green">
                  <IntlMessages id="global.yes" />
                </Tag>
              ) : (
                  <Tag color="red"
                    style={{ cursor: "pointer" }}
                  >
                    <IntlMessages id="global.no" />
                  </Tag>
                )
            ) : null}
          </React.Fragment>
        )
      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true
      }
    ];
    const { listRules, paging } = this.props;
    console.log('listRules', listRules);
    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.rules" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listRules}
                tableLayout="auto"
                rowKey="id"
                size="small"
                pagination={{
                  pageSizeOptions: ["10", "20", "30"],
                  total: paging.count,
                  showSizeChanger: true
                }}
                onChange={this.onChangeTable}
              />
            </RctCollapsibleCard>
          </div>
        </div>
        <AddRules
          open={this.state.addRuleState}
          onSaveRules={this.onSaveRules}
          onRulesClose={this.onRulesClose}
          loading={this.state.isSubmiting}
          edit={this.state.edit}
          expired_date={expired_date}
          rule={this.state.current_rule}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    listRules: state.rules.listRules,
    paging: state.rules.paging
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllRules: filter => dispatch(getAllRules(filter)),
    delete: data => dispatch(deleteRules(data)),
    createRules: data => dispatch(addRules(data)),
    updateRules: data => dispatch(updateRules(data))
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListRules)
);
