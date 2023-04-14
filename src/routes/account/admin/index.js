import { Table, Button, Divider, message } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
// import config from "../../../../config";
import {
  batchDelete,
  createACCOUNT,
  getListAdmin,
  updateACCOUNT,
  _exportAdmin
} from "../../../actions/AccountAction";
import { checkToken } from "../../../actions/AuthActions"
import AvatarInTable from "../../../components/AvatarInTable";
import StatusButton from "../../../components/StatusButton";
import TableActionBar from "../../../components/TableActionBar";
import AddAdmin from "./AddAdmin";
import SetRole from "./SetRole";

class ListAdmin extends Component {
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
      addAccountState: false,
      current_account: null,
      selectedRowKeys: [],
      isSubmiting: false,
      edit: false,
      openRole: false,
      loading: true,
      loadingExport: false
    };
  }

  async componentDidMount() {
    await this.props.getAllAdmin(this.state.filter, "admin");
    this.setState({
      loading: false
    })
  }

  filter = (value, name, type) => {

    if (type === "search") {
      this.setState(
        {
          ...this.state,
          loading: true,
          filter: {
            ...this.state.filter,
            search: value
          }
        },
        async () => {
          await this.props.getAllAdmin(this.state.filter, "admin")
          this.setState({
            ...this.state,
            loading: false
          })
        }
      );
    } else {
      this.setState(
        {
          ...this.state,
          loading: true,
          filter: {
            ...this.state.filter,
            [name]: {
              type: "=",
              value: value
            }
          }
        },
        async () => {
          await this.props.getAllAdmin(this.state.filter, "admin")
          this.setState({
            ...this.state,
            loading: false
          })
        }
      );
    }
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onAddAccount = () => {
    this.setState({ addAccountState: true });
  };
  onEditAccount(account) {
    this.setState({
      addAccountState: true,
      current_account: account,
      edit: true
    });
  }
  onAccountClose = () => {
    this.setState({
      addAccountState: false,
      current_account: null,
      isSubmiting: false,
      edit: false
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
            addAccountState: false,
            current_account: null,
            edit: false
          });
          this.props.checkToken()
        })
        .catch(err => {
          this.setState({
            ...this.state,
            isSubmiting: false
          });
        });
    } else
      await this.props
        .createAdmin(data)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addAccountState: false,
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

  onDelete() {
    this.props.deleteAccount({ id: this.state.selectedRowKeys }).then(res => {
      this.setState({
        ...this.state,
        selectedRowKeys: []
      });
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
        loading: true,
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
      async () => {
        await this.props.getAllAdmin(this.state.filter, "admin")
        this.setState({
          ...this.state,
          loading: false
        })

      }
    );
  };

  onRefresh = () => {
    this.props.getAllAdmin(this.state.filter, "admin");
    this.setState({
      selectedRowKeys: []
    });
  }

  openSetRole = (data) => {
    this.setState({
      ...this.state,
      current_account: data,
      openRole: true
    })
  }

  closeSetRole = () => {
    this.setState({
      ...this.state,
      current_account: null,
      openRole: false
    })
  }
  updateRoleSuccess = (user) => {
    this.setState({
      ...this.state,
      current_account: user,
    })
  }

  exportExcel = () => {
    this.setState({
        loadingExport: true
    })
    _exportAdmin(this.state.filter).then(res => {
        message.success("Xuất file thành công")
        this.setState({
            loadingExport: false
        })
    }).catch(err => {
        message.error("Có lỗi xảy ra, vui lòng thử lại")
        this.setState({
            loadingExport: false
        })
    })
}

  render() {
    var { config } = this.props;

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
                  : `admin`
              }
              alt={`${record.firstname} ${record.lastname}`}
            ></AvatarInTable>
          ) : (
            <AvatarInTable
              src={config.url_asset_root + 'backup.png'}
              alt={`admin`}
              title={
                record.firstname
                  ? `${record.firstname}${record.lastname}`
                  : `admin`
              }
            ></AvatarInTable>
          )
      },
      {
        title: <IntlMessages id="global.roles" />,
        dataIndex: "roles",
        render: (text, record) => {
          let { roles } = record;
          if (roles && roles.length) {
            return roles.map(item => {
              return (
                <Button size="small" className="mr-2" key={item.id} onClick={() => this.openSetRole(record)} >{item.title}</Button>
              )
            })
          }
          return (
            <Button size="small" onClick={() => this.openSetRole(record)} >{"Set roles"}</Button>
          )
        }
      },
      {
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        align: 'center',
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
        sorter: true,
        render: (text, record) => (
          <Button type="link" className="p-0" onClick={() => this.onEditAccount(record)}>
            {record.email}
          </Button>
        )
      },
      {
        title: <IntlMessages id="global.mobile" />,
        dataIndex: "mobile",
        key: "mobile",
        sorter: true
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
        title: <IntlMessages id="global.company" />,
        dataIndex: "company",
        key: "company"
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
        title: <IntlMessages id="global.lastlogin" />,
        dataIndex: "last_login",
        key: "last_login",
        className: "center-column",
        render: (text, record) =>
          record.last_login ? (
            <React.Fragment>
              <div>{moment(record.last_login).format("DD/MM/YYYY")}</div>
              <div>{moment(record.last_login).format("HH:mm")}</div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div>{moment(record.updated_at).format("DD/MM/YYYY")}</div>
              <div>{moment(record.updated_at).format("HH:mm")}</div>
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

    const { selectedRowKeys, loading, loadingExport } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const { listAdmin, paging } = this.props;

    const hasSelected = selectedRowKeys.length > 0;

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.admin" />}
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
                onFilter={this.filter}
                showFilter
                data={[
                  {
                    name: "status",
                    data: [
                      {
                        id: 0,
                        title: "Không hoạt động"
                      },
                      {
                        id: 1,
                        title: "Đang hoạt động"
                      }
                    ],
                    placeholder: "Chọn trạng thái",
                  }
                ]}
              >
                <Divider type="vertical" />
                <Button type="primary" loading={loadingExport} onClick={this.exportExcel}>Xuất file Excel</Button>
                <Divider type="vertical" />
                <span style={{ marginLeft: 8 }}>
                  {
                    hasSelected
                      ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} />
                      : null
                  }
                </span>
              </TableActionBar>

              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listAdmin}
                rowKey="id"
                size="small"
                loading={loading}
                pagination={{
                  pageSizeOptions: ["10", "20", "30"],
                  total: paging.count,
                  showSizeChanger: true
                }}
                tableLayout="auto"
                onChange={this.onChangTable}

              />
            </RctCollapsibleCard>
          </div>
        </div>
        <AddAdmin
          open={this.state.addAccountState}
          onSaveAccount={this.onSaveAccount}
          onAccountClose={this.onAccountClose}
          loading={this.state.isSubmiting}
          edit={this.state.edit}
          account={this.state.current_account}
        />

        <SetRole
          open={this.state.openRole}
          onClose={this.closeSetRole}
          account={this.state.current_account}
          updateRoleSuccess={this.updateRoleSuccess}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    listAdmin: state.account.listAccount,
    paging: state.account.paging,
    config: state.config
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllAdmin: (filter, data) => dispatch(getListAdmin(filter, data)),
    createAdmin: account => dispatch(createACCOUNT(account)),
    updateAccount: account => dispatch(updateACCOUNT(account)),
    deleteAccount: account => dispatch(batchDelete(account)),
    checkToken: () => dispatch(checkToken()),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListAdmin)
);
