import { Table, Tag, Icon, Progress, Tooltip, Avatar, Button, Modal, Typography, Col, Row, message } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Link, withRouter } from "react-router-dom";
import ImageInTable from "../../../components/ImageInTable";
import TableActionBar from "../../../components/TableActionBar";
import TextTruncate from 'react-text-truncate';
import { getAllCancel_policy } from "../../../actions/CancelPolicyActions"
import {
  _getAll,
  _update,
  _create,
  _delete,
  getlistUtilNearby,
  approveProperty,
  unapproveProperty,
  _exportOrder,
} from "../../../actions/PropertyAction";
import Truncate from "react-truncate";
import NumberFormat from 'react-number-format';
import { _getAllPropertyType } from "../../../actions/PropertyTypeAction";
import AddProperty from "./AddProperty";
import { getAllItems } from "../../../actions/RoomActions";
import { getAllACCOUNT } from "../../../actions/AccountAction";
import NearbyUtils from "./NearbyUtils";
import moment from "moment";
import { SearchSupplier } from "../../statistics/SearchSupplier";
import FilterBar from "../../../components/FilterBar";
import ModalApproved from "../../../components/ModalApproved";
class Property extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      filter: {
        sort: {
          type: "desc",
          attr: "",
        },
        paging: {
          perpage: 10,
          page: 1,
        },
        search: "",
        cid: {
          type: '=',
          value: ""
        }
      },
      edit: false,
      isSubmiting: false,
      selectedRowKeys: [], // Check here to configure the default column
      loading: true,
      open: false,
      item: null,
      filterAccount: { paging: 0 },
      openNearbyUtils: false,
      openModal: false
    };
    this.columns = [
      {
        title: <IntlMessages id="global.cover_img" />,
        dataIndex: "cover_img",
        render: (text, record) => (
          <Avatar
            src={(record.cover_img && record.cover_img.length) ? this.props.config.url_asset_root + record.cover_img[0] : require('../../../assets/img/stay.png')}
            size={60}
          />
        )
      },
      {
        title: <IntlMessages id="global.ownership_document" />,
        dataIndex: "ownership_documents",
        render: (text, record) => {
          return (
            <React.Fragment>

              {record && record.ownership_documents ?
                <React.Fragment>
                  {record.ownership_documents.length ? record.ownership_documents.map((item, index) => (
                    <div className="image_logo" key={index}>
                      <ImageInTable
                        src={record.ownership_documents.length ? this.props.config.url_asset_root + record.ownership_documents[index] : ""}
                        alt={`${record.ownership_documents.length ? record.title : ""}`}
                      ></ImageInTable>
                    </div>
                  ))
                    : null
                  }
                </React.Fragment>

                : null
              }

            </React.Fragment>
          );
        },
      },
      {
        title: <IntlMessages id="global.count_image" />,
        key: "count_image",
        // sorter: true,
        dataIndex: "count_image",

        render: (text, record) => {
          return (
            <span
            >
              {record.gallery.length}/8
            </span>
          );
        },

      },
      {
        title: <IntlMessages id="global.title" />,
        key: "title",
        sorter: true,
        dataIndex: "title",
        ellipsis: true,
        render: (text, record) => {
          return (
            <React.Fragment>
              <TextTruncate
                line={2}
                element="span"
                truncateText="..."
                text={text}
                className="custom-link"
                onClick={() => this.onEdit(record)}
              />
              <div className="mt-1">
                <div><small>Hoàn thành</small></div>
                {
                  record.progress.incompleted.length ? (
                    <div>
                      <Tooltip title={record.progress.incompleted.map(item => (
                        <div>
                          <IntlMessages id={item} />
                        </div>
                      ))}>
                        <Progress percent={record.progress.completed_steps / record.progress.max_steps * 100} />
                      </Tooltip>
                    </div>
                  ) : (
                    <Progress percent={record.progress.completed_steps / record.progress.max_steps * 100} />
                  )
                }
                {
                  !record.latitude || !record.longitude ? (
                    <div>
                      <Tooltip title="Bạn cần điền lại địa chỉ để toạ độ có thể cập nhật tự động">
                        <Typography.Text type="danger">
                          <small>Chưa cập nhật toạ độ <Icon type="question-circle" /></small>
                        </Typography.Text>
                      </Tooltip>
                    </div>
                  ) : null
                }
              </div>
            </React.Fragment>
          );
        },
        width: '200px'
      },

      {
        title: <IntlMessages id="global.status" />,
        key: "status",
        sorter: true,
        align: 'center',
        render: record => {
          return (
            <React.Fragment>
              {record ? (
                record.status === 0 ? (
                  <Tag color="red">
                    <IntlMessages id="global.unpublished" />
                  </Tag>
                ) :
                  record.status === 1 ?
                    (
                      <Tag color="green">
                        <IntlMessages id="global.published" />
                      </Tag>
                    )
                    :
                    (
                      <Tag color="orange">
                        <IntlMessages id="global.trashed" />
                      </Tag>
                    )
              ) : null
              }
            </React.Fragment>
          );
        }
      },
      {
        title: <IntlMessages id="global.approve" />,
        key: "approved",
        className: 'property-status',
        align: 'center',
        render: record => {
          return (
            <div >
              <Button
                onClick={() => {
                  // this.handleApprove(record.id, !record.approved)
                  this.setState({ ...this.state, openModal: true, item: record })
                }}
                // shape="circle"
                // icon="check"
                type={record.approved ? 'primary' : 'default'}
                className={record.approved ? 'success' : ''}
                size="small"
              >
                {record.approved ? 'Đã duyệt' : 'Chưa duyệt'}
              </Button>
            </div>
          );
        }
      },

      {
        title: <IntlMessages id="global.supplier" />,
        key: "customer",
        align: "left",
        render: (record) =>
          record.sup_firstname || record.sup_lastname ? (

            `${record.sup_firstname} ${record.sup_lastname}`

          ) : (
            "Supplier"
          ),
      },

      {
        title: <IntlMessages id="global.working_day_price" />,
        key: "price",
        sorter: true,
        dataIndex: "price",
        render: (text, record) => {
          return (
            <NumberFormat value={record.price} thousandSeparator="." decimalSeparator=',' displayType="text" suffix="đ" />
          );
        },
      },
      {
        title: <IntlMessages id="global.weekend_price" />,
        key: "weekend_price",
        sorter: true,
        dataIndex: "weekend_price",
        render: (text, record) => {
          return (
            <NumberFormat value={record.weekend_price} thousandSeparator="." decimalSeparator=',' displayType="text" suffix="đ" />

          );
        },
      },
      {
        title: <IntlMessages id="global.setup" />,
        key: "room_rate",
        dataIndex: "room_rate",
        render: (text, record) => {
          return (
            <b>
              <Link to={`/app/room_rate/${record.id}`}>
                <IntlMessages id="global.setup_calender" />
              </Link>
            </b>
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
        sorter: true
      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
      },
    ];
  }
  handleApprove = (id, type) => {
    Modal.confirm({
      title: `Bạn có chắc chắn muốn ${type ? 'duyệt' : 'bỏ duyệt'} căn hộ này không?`,
      okText: 'Có',
      okType: 'danger',
      onOk: () => {
        this.setState({ loading: true }, async () => {
          if (type) await this.props.approveProperty(id);
          else await this.props.unapproveProperty(id)
          this.setState({ loading: false });
        })
      },
      onCancel() { },
    })
  }

  setTitle(title) {
    if (title && title.length) {
      return <Truncate lines={2}>{title}</Truncate>;
    }
    return "";
  }
  SetupnearbyUtils = (item) => {
    this.setState({
      openNearbyUtils: true,
      item: item
    });
  };
  async componentDidMount() {
    await this.props._getAll(this.state.filter);
    this.setState({ loading: false })
    // this.props._getAllRoomType();
    // this.props._getAllPropertyType();
    this.props.getAllAccount(this.state.filterAccount, "supplier");
    // this.props._getAllCancelPolicy()
    // this.props.getlistUtilNearby();

  }

  onCancel() {
    this.setState({
      ...this.state,
      open: false,
    });
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  onChangeSearch(event) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          search: event.target.value,
        },
      },
      () => this.props._getAll(this.state.filter)
    );
  }

  onRefresh() {
    this.props._getAll(this.state.filter);
    this.setState({
      selectedRowKeys: [],
    });
  }
  onDelete() {
    this.setState({
      ...this.state,
      loading: true,
    }, async () => {
      await this.props._delete({ id: this.state.selectedRowKeys })
      this.setState({
        ...this.state,
        selectedRowKeys: [],
        loading: false
      });

    })

  }


  onCreate = () => {
    this.setState({
      open: true,
      item: null,
    });
  };

  onEdit = (item) => {
    this.setState({
      open: true,
      item: item,
      edit: true,
    });
  };

  onClose = () => {
    this.setState({
      open: false,
      item: null,
      edit: false,
      isSubmiting: false
    });
  };

  filter = (value, name, type) => {
    if (type === "search") {
      this.setState(
        {
          ...this.state,
          loading: true,
          filter: {
            ...this.state.filter,
            search: value,
          },
        },
        async () => {
          await this.props._getAll(this.state.filter);
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
              value: value,
            },
          },
        },
        async () => {
          await this.props._getAll(this.state.filter);
          this.setState({
            ...this.state,
            loading: false
          })
        }
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
    extra = { itemDataSource: [] }
  ) => {
    this.setState(
      {
        ...this.state,
        loading: true,
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

      async () => {
        await this.props._getAll(this.state.filter);
        this.setState({
          ...this.state,
          loading: false
        })

      }
    );
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
              perpage: pageSize,
            },
          },
        },
        () => {
          this.props._getAll(this.state.filter);
        }
      );
    }
  }

  setStateFalse() {
    this.setState({
      ...this.state,
      isSubmiting: false,
      open: false,
      item: null,
      edit: false,
    });
  }

  onSave = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true,
    });
    if (this.state.edit) {
      try {
        var dataSubmit = { ...data, id: id };
        await this.props._update(dataSubmit);
        this.setStateFalse();
      } catch (error) {
        this.setState({
          ...this.state,
          isSubmiting: false,
        });
      }
    } else {
      try {
        await this.props._create(data);
        this.setStateFalse();
      } catch (error) {
        this.setState({
          ...this.state,
          isSubmiting: false,
        });
      }
    }
  };
  onCloseNearbyUtils = () => {
    this.setState({
      openNearbyUtils: false,
    });
  };

  exportExcel = () => {
    this.setState({
      ...this.state,
      loadingExport: true
    })
    _exportOrder(this.state.filter).then(res => {
      message.success("Xuất file thành công")
      this.setState({
        ...this.state,
        loadingExport: false
      })
    }).catch(err => {
      message.error("Có lỗi xảy ra, vui lòng thử lại")
      this.setState({
        ...this.state,
        loadingExport: false
      })
    })
  }
  render() {
    const { loading, selectedRowKeys } = this.state;

    const {
      list,
      paging,
      propertyType,
      listRoomType,
      listAccount,
      listCancelPolicy,
      listUtilNearby
    } = this.props;

    let account = listAccount && listAccount.length ? listAccount.map(item => {
      return {
        id: item.id,
        title: `${item.firstname} ${item.lastname} - ${item.company}`
      }
    }) : [];


    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.property" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <Row type="flex" justify="space-between">
                <Col></Col>
                <Col style={{ padding: "16px 0px" }}>
                  <Button
                    type="primary"
                    onClick={this.exportExcel}
                    loading={this.state.loadingExport}
                    size="large"
                  >
                    <IntlMessages id="global.export" />
                  </Button>
                </Col>
              </Row>
              <TableActionBar
                // onAdd={() => this.onCreate()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                table="property"
                textSearch={false}
                isShowAddButton={false}

              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>
              <FilterBar
                textSearchPlaceholder="Tìm kiếm"
                onFilter={this.filter}
                data={[
                  {
                    name: "status",
                    data: [{ id: 0, title: <IntlMessages id="global.unpublished" /> }, { id: 1, title: <IntlMessages id="global.published" /> }, { id: 2, title: <IntlMessages id="global.trashed" /> }],
                    placeholder: <IntlMessages id="global.select_status" />,
                  },
                  {
                    name: "property_type",
                    data: propertyType,
                    placeholder: <IntlMessages id="global.select_property_type" />,
                  },
                  {
                    name: "room_type",
                    data: listRoomType,
                    placeholder: <IntlMessages id="global.select_room_type" />,
                  },

                ]}
              >
              </FilterBar>
              <div style={{ marginBottom: "24px" }}>
                <SearchSupplier
                  supplier_id={this.state.filter.cid.value}
                  onChange={(v) => this.filter(v, 'cid')}
                />
              </div>

              <Table
                tableLayout="fixed"
                rowSelection={rowSelection}
                columns={this.columns}
                loading={loading}
                dataSource={list}
                onChange={this.onChangTable}
                rowKey="id"
                size="small"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ["1", "5", "10", "20", "30"],
                  total: paging.count,
                }}
              />
            </RctCollapsibleCard>
          </div>
        </div>
        <AddProperty
          open={this.state.open}
          edit={this.state.edit}
          item={this.state.item}
          onSave={this.onSave}
          onClose={() => this.onClose()}
          listType={propertyType}
          listRoomType={listRoomType}
          account={account}
          listCancelPolicy={listCancelPolicy}
        />
        <NearbyUtils
          open={this.state.openNearbyUtils}
          onClose={() => this.onCloseNearbyUtils()}
          listUtilNearby={listUtilNearby}
          propertydetail={this.state.item}
        />
        <ModalApproved
          onClose={() => this.setState({ ...this.state, openModal: false, item: null })}
          open={this.state.openModal}
          record={this.state.item}
          title={"Duyệt căn hộ"}
          onUpdate={this.props._update}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.property.list,
    paging: state.property.paging,
    propertyType: state.config.property_type,
    listRoomType: state.config.room_type,
    listAccount: state.account.listAccount,
    listCancelPolicy: state.config.cancel_policy,
    listUtilNearby: state.property.listUtilNearby,
    config: state.config
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    _getAll: (filter) => dispatch(_getAll(filter)),
    _update: (id) => dispatch(_update(id)),
    _create: (data) => dispatch(_create(data)),
    _delete: (data) => dispatch(_delete(data)),
    _getAllPropertyType: () => dispatch(_getAllPropertyType({ paging: 0 })),
    _getAllRoomType: () => dispatch(getAllItems({ paging: 0 })),
    _getAllCancelPolicy: () => dispatch(getAllCancel_policy({ paging: 0 })),
    getAllAccount: (filter, data) => dispatch(getAllACCOUNT(filter, data)),
    getlistUtilNearby: () => dispatch(getlistUtilNearby()),
    approveProperty: data => dispatch(approveProperty(data)),
    unapproveProperty: data => dispatch(unapproveProperty(data))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Property)
);
