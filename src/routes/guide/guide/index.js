import { Table, Button } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import {
  batchDelete,
  createACCOUNT,
  getAllACCOUNT,
  updateACCOUNT
} from "../../../actions/AccountAction";
import AvatarInTable from "../../../components/AvatarInTable";
import StatusButton from "../../../components/StatusButton";
import TableActionBar from "../../../components/TableActionBar";
import AddGuide from "./AddGuide";
import CalendarGuide from "./CalendarGuide";

class ListGuide extends Component {
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
      addGuideState: false,
      openCalendar: false,
      selectedRowKeys: [],
      isSubmiting: false,
      current_account: null,
      edit: false
    };
  }
  componentDidMount() {
    this.props.getAllGuide(this.state.filter, "guide");
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
      () => this.props.getAllGuide(this.state.filter, "guide")
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
      () => this.props.getAllGuide(this.state.filter, "guide")
    );
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  onAddAccount = () => {
    this.setState({ addGuideState: true });
  };
  onEditAccount(account) {
    this.setState({
      addGuideState: true,
      current_account: account,
      edit: true
    });
  }
  onShowCalendar(account) {
    this.setState({
      openCalendar: true,
      current_account: account
    });
  }
  onAccountClose = () => {
    this.setState({
      addGuideState: false,
      current_account: null,
      isSubmiting: false,
      edit: false,
      openCalendar: false
    });
  };
  onSaveAccount = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateAccount(dataSubmit)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addGuideState: false,
            current_account: null,
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
        .createGuide(data)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addGuideState: false,
            current_account: null,
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
    this.props.getAllGuide(this.state.filter, "guide");
    this.setState({
      selectedRowKeys: []
    });
  }
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
      () => this.props.getAllGuide(this.state.filter, "guide")
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
        () => this.props.getAllGuide(this.state.filter, "guide")
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
        () => this.props.getAllGuide(this.state.filter, "guide")
      );
  };

  render() {
    const { listGuide, paging, config } = this.props;
    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        key: "image",
        title: <IntlMessages id="global.avatar" />,
        dataIndex: "image",
        render: (text, record) =>
          record.image ? (
            <AvatarInTable
              src={config.url_asset_root + record.image}
              defaul={record.image === "//logo3.png" ? 1 : 0}
              title={
                record.firstname
                  ? `${record.firstname}${record.lastname}`
                  : `user`
              }
              alt={`${record.firstname} ${record.lastname}`}
            ></AvatarInTable>
          ) : (
              <AvatarInTable
                src={require('../../../assets/img/user.png')}
                alt={`user`}
                title={
                  record.firstname
                    ? `${record.firstname}${record.lastname}`
                    : `user`
                }
              ></AvatarInTable>
            )
      },
      {
        key: "status",
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        render: (text, record) => (
          <StatusButton
            data_id={record.id}
            status={record.status}
            table="customer"
          />
        )
      },
      {
        title: <IntlMessages id="global.email" />,
        dataIndex: "email",
        key: "email",
        render: (text, record) => (
          <b
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => this.onEditAccount(record)}
          >
            {record.email}
          </b>
        )
      },
      {
        title: <IntlMessages id="global.firstname" />,
        dataIndex: "firstname",
        key: "firstname"
      },
      {
        title: <IntlMessages id="global.lastname" />,
        dataIndex: "lastname",
        key: "lastname"
      },
      {
        title: <IntlMessages id="guide.nickname" />,
        dataIndex: "nick_name",
        key: "nickname"
      },
      {
        title: <IntlMessages id="global.mobile" />,
        dataIndex: "mobile",
        key: "mobile",
        sorter: true
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
        )
      },
      {
        title: <IntlMessages id="sidebar.calendar" />,
        key: "calendar",
        render: record => {
          return (
            <Button
              type="primary"
              onClick={() => this.onShowCalendar(record)}
              style={{ marginBottom: "0px" }}
            >
              <IntlMessages id="sidebar.calendar" />
            </Button>
          );
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
            title={<IntlMessages id="sidebar.guide" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={() => this.onAddAccount()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                table="customer"
                isShowPublishButtons={true}
                showFilter={false}
                onFilter={this.filter}
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>

              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listGuide}
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
                onChange={this.onChangeTable}
              />
            </RctCollapsibleCard>
          </div>
        </div>

        <AddGuide
          open={this.state.addGuideState}
          onSaveAccount={this.onSaveAccount}
          onAccountClose={this.onAccountClose}
          loading={this.state.isSubmiting}
          edit={this.state.edit}
          account={this.state.current_account}
        />

        <CalendarGuide
          openCalendar={this.state.openCalendar}
          onAccountClose={this.onAccountClose}
          loading={this.state.isSubmiting}
          account={this.state.current_account}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    listGuide: state.account.listAccount,
    paging: state.account.paging,
    config: state.config
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllGuide: (filter, data) => dispatch(getAllACCOUNT(filter, data)),
    createGuide: account => dispatch(createACCOUNT(account)),
    updateAccount: account => dispatch(updateACCOUNT(account)),
    delete: data => dispatch(batchDelete(data))
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListGuide)
);
