import AndroidIcon from "@material-ui/icons/Android";
import AppleIcon from "@material-ui/icons/Apple";
import LanguageIcon from "@material-ui/icons/Language";
import { Table, Button, Icon, Divider, Modal, Tag, message } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import IntlMessages from "Util/IntlMessages";
import {
  batchDelete,
  createACCOUNT,
  getAllACCOUNT,
  updateACCOUNT,
  _exportAccount
} from "../../../actions/AccountAction";
import { syncCustomerToBitrix24 } from "../../../actions/CustomerActions";
import { getAllCountry } from "../../../actions/CountryActions";
import AvatarInTable from "../../../components/AvatarInTable";
import StatusButton from "../../../components/StatusButton";
import TableActionBar from "../../../components/TableActionBar";
import AddRegistered from "./AddRegistered";
import { shorten } from '../../../util/string_helper'

class ListRegistered extends Component {
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
      addRegisteredState: false,
      selectedRowKeys: [],
      isSubmiting: false,
      current_account: null,
      edit: false,
      loading: true,
      loadingExport: false
    };
  }
  async componentDidMount() {
    await this.props.getAllRegistered(this.state.filter, "registered");
    this.props.getAllConuntry();
    this.setState({
      loading: false
    })
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
      () => this.props.getAllRegistered(this.state.filter, "registered")
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
      () => this.props.getAllRegistered(this.state.filter, "registered")
    );
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  onAddAccount = () => {
    this.setState({ addRegisteredState: true });
  };
  onEditAccount(account) {
    this.setState({
      addRegisteredState: true,
      current_account: account,
      edit: true
    });
  }
  onAccountClose = () => {
    this.setState({
      addRegisteredState: false,
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
            addRegisteredState: false,
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
        .createRegister(data)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addRegisteredState: false,
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
    this.props.getAllRegistered(this.state.filter, "registered");
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
        loading: true,
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
      async () => {
        await this.props.getAllRegistered(this.state.filter, "registered")
        this.setState({
          ...this.state,
          loading: false
        })

      }

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
          loading: true,
          filter: {
            ...this.state.filter,
            search: value
          }
        },
        async () => {
          await this.props.getAllRegistered(this.state.filter, "registered")
          this.setState({
            ...this.state,
            loading: false
          })
        }
      );
    } else
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
          await this.props.getAllRegistered(this.state.filter, "registered")
          this.setState({
            ...this.state,
            loading: false
          })
        }
      );
  };

  onSyncData() {
    Modal.confirm({
      title: "Bạn chắc chắn muốn đồng bộ toàn bộ dữ liệu khách hàng sang hệ thống Bitrix24?",
      onOk: async () => {
        await this.props.syncCustomerToBitrix24();
        await this.props.getAllRegistered(this.state.filter, "registered")
      }
    })
  }

  exportExcel = () => {
    this.setState({
      loadingExport: true
    })
    _exportAccount('registered', this.state.filter).then(res => {
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
    const { selectedRowKeys, loading, loadingExport } = this.state;
    var { config } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        key: "image",
        title: "",
        dataIndex: "image",
        width: 60,
        render: (text, record) =>
          record.image ? (
            <AvatarInTable
              src={config.url_asset_root + record.image}
              defaul={record.image === "//logo3.png" ? 1 : 0}
              title={
                record.firstname
                  ? `${record.firstname} ${record.lastname}`
                  : `user`
              }
              alt={`${record.firstname}${record.lastname}`}
            ></AvatarInTable>
          ) : (
            <AvatarInTable
              src={config.url_asset_root + 'backup.png'}
              alt={`user`}
              title={
                record.firstname
                  ? `${record.firstname} ${record.lastname}`
                  : `user`
              }
            ></AvatarInTable>
          )
      },
      {
        key: "status",
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        width: 100,
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
          <Link to={`/app/account/${record.id}`}>
            <Button type="link" className="p-0">
              {
                record && record.email ? (
                  <div><span>{record.email}</span> {record.email_verified === 1 ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> : null}</div>
                ) : (
                  <span>{record.social}</span>
                )
              }
            </Button>
          </Link>
        )
      },
      {
        title: <IntlMessages id="global.mobile" />,
        dataIndex: "mobile",
        key: "mobile",
        render: (text, record) => (
          <Link to={`/app/account/${record.id}`}>
            <Button type="link" className="p-0">
              {record && record.mobile ? record.mobile + ' ' : null}

              {record && record.phone_verified === 1 ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> : null}
            </Button>
          </Link>
        ),
        sorter: true
      },
      {
        title: <IntlMessages id="global.name" />,
        dataIndex: "firstname",
        key: "firstname",
        render: (text, record) => (
          <Link to={`/app/account/${record.id}`}>
            <b>
              <Button type="link" className="p-0" onClick={() => this.onEditAccount(record)}>
                {record.firstname} {record.lastname}
              </Button>
            </b>
          </Link>
        ),
        sorter: true
      },



      // {
      //   title: <IntlMessages id="global.country" />,
      //   dataIndex: "country_code",
      //   className: "center-column",
      //   render: (text, record) => (
      //     <React.Fragment>
      //       <div>{record.country_code}</div>
      //       <div><small>{record.ip_address}</small></div>
      //     </React.Fragment>
      //   ),
      //   sorter: true
      // },
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
        sorter: true
      },

      {
        title: "Đăng ký qua",
        dataIndex: "signup_type",
        key: "signup_type",
        render: (text, record) => (
          <b>

            {record.signup_type}

          </b>
        ),
        sorter: true
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
        title: <IntlMessages id="global.referral_os" />,
        dataIndex: "referral_os",
        className: "center-column",


      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true
      },
      {
        title: "Bitrix ID",
        dataIndex: "bitrix24_contact_id",
        key: "bitrix24_contact_id",
        align: 'center',
        sorter: true,
        render: (text, record) => (
          <div>
            <div>{record.bitrix24_contact_id}</div>
            <div>{record.bitrix24_sync_status ? <Tag color="green">Đã sync</Tag> : <Tag color="red">Chưa sync</Tag>}</div>
          </div>
        ),
      },
      {
        title: "Hành động",
        align: 'center',
        render: (text, record) => (
          <div>
            <Button size="small" onClick={() => this.onEditAccount(record)}><IntlMessages id="global.edit" /></Button>
          </div>
        ),
      }
    ];

    const { listRegistered, paging, country } = this.props;
    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.registered" />}
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
                  },
                  {
                    name: "signup_type",
                    data: [
                      {
                        id: 'EMAIL',
                        title: "EMAIL"
                      },
                      {
                        id: 'PHONE',
                        title: "PHONE"
                      },
                      {
                        id: 'FACEBOOK',
                        title: "FACEBOOK"
                      },
                      {
                        id: 'GOOGLE',
                        title: "GOOGLE"
                      },
                      {
                        id: 'APPLE',
                        title: "APPLE"
                      }
                    ],
                    placeholder: "Chọn loại đăng ký",
                  },
                  {
                    name: "bitrix24_sync_status",
                    data: [
                      {
                        id: 0,
                        title: "Chưa đồng bộ"
                      },
                      {
                        id: 1,
                        title: "Đã đồng bộ"
                      }
                    ],
                    placeholder: "Đồng bộ qua Bitrix24",
                  },
                  {
                    name: "referral_os",
                    data: [
                      {
                        id: 'DESKTOP',
                        title: "DESKTOP"
                      },
                      {
                        id: 'ANDROID',
                        title: "ANDROID"
                      },
                      {
                        id: 'IOS',
                        title: "IOS"
                      }
                    ],
                    placeholder: "Nền tảng",
                  }
                ]}
              >
                <Divider type="vertical" />
                <Button onClick={() => this.onSyncData()}>Đồng bộ sang Bitrix24</Button>
                <Divider type="vertical" />
                <Button type="primary" loading={loadingExport} onClick={this.exportExcel}>Xuất file Excel</Button>
                <Divider type="vertical" />
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>

              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listRegistered}
                loading={loading}
                tableLayout="auto"
                rowKey="id"
                size="small"
                pagination={{
                  pageSizeOptions: ["1", "5", "10", "20", "50"],
                  total: paging.count,
                  showSizeChanger: true
                }}
                scroll={{
                  x: true
                }}
                onChange={this.onChangeTable}
              />
            </RctCollapsibleCard>
          </div>
        </div>

        <AddRegistered
          open={this.state.addRegisteredState}
          onSaveAccount={this.onSaveAccount}
          onAccountClose={this.onAccountClose}
          loading={this.state.isSubmiting}
          edit={this.state.edit}
          account={this.state.current_account}
          country={country}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    listRegistered: state.account.listAccount,
    paging: state.account.paging,
    country: state.country.listCountry,
    config: state.config
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllRegistered: (filter, data) => dispatch(getAllACCOUNT(filter, data)),
    createRegister: account => dispatch(createACCOUNT(account)),
    updateAccount: account => dispatch(updateACCOUNT(account)),
    delete: data => dispatch(batchDelete(data)),
    getAllConuntry: () => dispatch(getAllCountry({ paging: 0 })),
    syncCustomerToBitrix24: () => dispatch(syncCustomerToBitrix24())
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListRegistered)
);
