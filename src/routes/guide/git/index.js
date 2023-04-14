import { Table, Tag } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import {
  batchDelete,
  getAllGit,
  createGit,
  updateGit
} from "../../../actions/GitAction";
import { getAllTour } from "../../../actions/TourActions";
import TableActionBar from "../../../components/TableActionBar";
import StatusButton from "../../../components/StatusButton";
import AddGit from "./AddGit";

class ListGit extends Component {
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
      filterAll: {
        paging: 0
      },
      open: false,
      selectedRowKeys: [],
      isSubmiting: false,
      current_git: null,
      edit: false
    };
  }
  componentDidMount() {
    this.props.getAllGit(this.state.filter);
    this.props.getAllTour(this.state.filterAll);
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
      () => this.props.getAllGit(this.state.filter)
    );
  }
  onChangePage(page, pageSize) {
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
      () => this.props.getAllGit(this.state.filter)
    );
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  onAddGit = () => {
    this.setState({ open: true });
  };

  onEditGit(data) {
    this.setState({
      open: true,
      current_git: data,
      edit: true
    });
  }
  onGitClose = () => {
    this.setState({
      open: false,
      current_git: null,
      isSubmiting: false,
      edit: false
    });
  };

  onSaveGit = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateGit({
          ...dataSubmit,
          start_date: moment(dataSubmit.start_date).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          end_date: moment(dataSubmit.end_date).format("YYYY-MM-DD HH:mm:ss")
        })
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            current_git: null,
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
        .createGit({
          ...data,
          start_date: moment(data.start_date).format("YYYY-MM-DD HH:mm:ss"),
          end_date: moment(data.end_date).format("YYYY-MM-DD HH:mm:ss")
        })
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            current_git: null,
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
  onRefresh() {
    this.props.getAllGit(this.state.filter);
    this.setState({
      selectedRowKeys: []
    });
  }
  getOrder(order) {
    if (order === "ascend") return "asc";
    if (order === "descend") return "desc";
    return "";
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
      () => this.props.getAllGit(this.state.filter)
    );
  };

  onDelete() {
    this.props.delete({ id: this.state.selectedRowKeys }).then(() => {
      this.setState({
        selectedRowKeys: []
      });
    });
  }
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
        () => this.props.getAllGit(this.state.filter)
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
        () => this.props.getAllGit(this.state.filter)
      );
  };
  render() {
    const { selectedRowKeys } = this.state;

    const { listGit, listTour, paging } = this.props;

    console.log(listGit);
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
      {
        key: "status",
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        render: (text, record) => (
          <StatusButton
            data_id={record.id}
            status={record.status}
            table="git"
          />
        )
      },
      {
        title: <IntlMessages id="global.tour" />,
        key: "tour_code",
        render: record => {
          return (
            <b
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => this.onEditGit(record)}
            >
              {record.tour_code}
            </b>
          );
        }
      },
      {
        title: <IntlMessages id="git.start_date" />,
        key: "start_date",
        render: (text, record) => (
          <Tag color="green">
            {moment(record.start_date).format("YYYY-MM-DD")}
          </Tag>
        )
      },
      {
        title: <IntlMessages id="git.end_date" />,
        key: "end_date",
        render: (text, record) => (
          <Tag color="red">
            {moment(record.end_date).format("YYYY-MM-DD")}
          </Tag>
        )
      },
      {
        title: <IntlMessages id="git.qty" />,
        key: "qty",
        dataIndex: "qty"
      },
      {
        title: <IntlMessages id="global.created" />,
        key: "created_at",
        render: record => {
          return moment(record.created_at).format('YYYY-MM-DD')
        }
      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true
      }
    ];

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.git" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={() => this.onAddGit()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                isShowPublishButtons={true}
                showFilter={false}
                onFilter={this.filter}
                table='git'
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>

              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listGit}
                tableLayout="auto"
                rowKey="id"
                size="small"
                pagination={{
                  pageSizeOptions: ["10", "20", "30"],
                  total: paging.count,
                  onChange: (page, pageSize) =>
                    this.onChangePage(page, pageSize),
                  showSizeChanger: true,
                  onShowSizeChange: (current, size) =>
                    this.onChangePerpage(current, size)
                }}
              />
            </RctCollapsibleCard>
          </div>
        </div>

        <AddGit
          open={this.state.open}
          onSaveGit={this.onSaveGit}
          onGitClose={this.onGitClose}
          loading={this.state.isSubmiting}
          edit={this.state.edit}
          git={this.state.current_git}
          listTour={listTour}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    listGit: state.git.listGit,
    listTour: state.tour.listTour,
    paging: state.git.paging
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllGit: filter => dispatch(getAllGit(filter)),
    getAllTour: filter => dispatch(getAllTour(filter)),
    createGit: data => dispatch(createGit(data)),
    updateGit: data => dispatch(updateGit(data)),
    delete: data => dispatch(batchDelete(data))
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListGit)
);
