import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import {Table, Button, Icon, Modal, Tooltip, Form, Input} from "antd";
import moment from "moment";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import BaseSelect from "Components/Elements/BaseSelect";
import {
  getAllOrderVoucher,
  createOrderVoucher,
  updateOrderVoucher,
  deleteVoucher
} from "../../actions/OrderTourActions";
import TableActionBar from "../../components/TableActionBar";
import config from "../../../config";
import VoucherForm from "./VoucherForm";
import renderHTML from "react-render-html";

class Vouchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      selectedRowKeys: [],
      open: false,
      tourFilter: {
        paging: 0
      },
      destinationFilter: {
        paging: 0
      },
      current_voucher: null
    };
  }

  onCloseOrderVoucher = () => {
    this.setState({
      openVoucher: false,
      current_voucher: null,
      edit: false
    });
  };

  onAddOrderVoucher = () => {
    this.setState({
      openVoucher: true,
      current_voucher: null,
      edit: false
    });
  };

  onEditOrderVoucher = data => {
    this.setState({
      openVoucher: true,
      current_voucher: data,
      edit: true
    });
  };

  componentDidMount() {
    this.props.getAllOrderVoucher(+this.props.match.params.id);
  }

  downloadDocument = data => {
    setTimeout(() => {
      window.open(this.props.config.url_asset_root + data.filepath);
    }, 100);
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
              value: value
            }
          }
        });
      } else {
        this.setState(
          {
            filter: {
              ...this.state.filter,
              [name]: {}
            }
          },
          () => this.props.getAllOrderVoucher(this.state.filter)
        );
      }
    } else {
      this.setState({
        filter: {
          ...this.state.filter,
          [name]: {
            type: "=",
            value: value
          }
        }
      });
    }
    setTimeout(() => {
      this.props.getAllOrderTour(this.state.filter);
    }, 300);
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  getOrder(order) {
    if (order === "ascend") return "asc";
    if (order === "descend") return "desc";
    return "desc";
  }

  onSaveVoucher = async (data, id) => {
    await this.setState({
      ...this.state
    });
    if (this.state.edit) {
      let dataSubmit = {
        ...data,
        id: id,
        obj_id: this.props.match.params.id,
        type: "order"
      };

      await this.props
        .updateOrderVoucher({
          ...dataSubmit
        })
        .then(res => {
          this.props.getAllOrderVoucher(this.props.match.params.id);
          this.setState({
            ...this.state,
            isSubmiting: false,
            openVoucher: false,
            current_voucher: null,
            edit: false,
            loading: false
          });
        })
        .catch(err => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            loading: false
          });
        });
    } else {
      await this.props
        .createOrderVoucher({
          ...data,
          obj_id: this.props.match.params.id,
          type: "order"
        })
        .then(res => {
          this.props.getAllOrderVoucher(this.props.match.params.id);
          this.setState({
            ...this.state,
            isSubmiting: false,
            openVoucher: false,
            current_voucher: null,
            edit: false,
            loading: false
          });
        })
        .catch(err => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            loading: false
          });
        });
    }
  };

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
        this.props.getAllOrderTour(this.state.filter);
      }
    );
  };

  onDelete() {
    this.props
      .deleteOrderVoucher({ id: this.state.selectedRowKeys })
      .then(() => {
        this.setState({
          selectedRowKeys: []
        });
      });
  }

  render() {
    const { selectedRowKeys } = this.state;

    const { listOrderVoucher, paging, config } = this.props;

    const hasSelected = selectedRowKeys.length > 0;

    const text = <span>There are no documents</span>

    const columnsVoucher = [
      {
        title: <IntlMessages id="global.title" />,
        key: "title",
        render: record => (
          <b
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => this.onEditOrderVoucher(record)}
          >
            {record.title}
          </b>
        )
      },
      // {
      //   title: <IntlMessages id="global.description" />,
      //   key: "description",
      //   render: record => renderHTML(record.description)
      // },
      {
        title: <IntlMessages id="global.created" />,
        key: "created_at",
        render: record => (
          <div>{moment(record.created_at).format("YYYY/MM/DD")}</div>
        )
      },
      {
        title: <IntlMessages id="global.id" />,
        key: "id",
        dataIndex: "id"
      },
      {
        key: "download",
        width: "20%",
        render: record =>
          record.filepath ? (
            <Button
              type="primary"
              onClick={() => this.downloadDocument(record)}
              style={{ marginBottom: "0px" }}
            >
              <Icon type="download" />
              <IntlMessages id="global.downloaddocument" />
            </Button>
          ) : (
            <Tooltip placement='top' title={text}>
            <Button disabled style={{ marginBottom: "0px" }}>
              <Icon type="download" />
              <IntlMessages id="global.downloaddocument" />
            </Button>
            </Tooltip>
          )
      }
    ];

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="order.voucher" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <Form
                  layout="inline"
                  onSubmit={this.handleSubmit}
                  style={{ display: "flex", justifyContent: "flex-start" }}
              >

                <Form.Item>
                  <Input
                      onChange={(e) => this.onFilter("search", e.target.value)}
                      placeholder="Tên khách sạn , địa chỉ"
                      style={{ width: "350px" }}
                  />
                </Form.Item>
                <Form.Item>
                  <BaseSelect
                      showSearch
                      options={[
                        { value: 1, label: 'ĐÃ XÁC NHẬN' },
                        { value: 0, label: 'CHỜ XÁC NHẬN' },
                        { value: 2, label: 'HUỶ' },
                      ]}
                      defaultText="Chọn trạng thái"
                      optionValue="value"
                      optionLabel="label"
                      onChange={(value) => this.onFilter("status", value)}
                      style={{ width: "350px" }}
                  />
                </Form.Item>
              </Form>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.onSelectChange
                }}
                columns={columnsVoucher}
                dataSource={listOrderVoucher}
                onChange={this.onChangTable}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </RctCollapsibleCard>
          </div>
        </div>
        <VoucherForm
          onSaveVoucher={this.onSaveVoucher}
          openVoucher={this.state.openVoucher}
          edit={this.state.edit}
          current_voucher={this.state.current_voucher}
          onCloseOrderVoucher={this.onCloseOrderVoucher}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    listOrderVoucher: state.orderTour.listOrderVoucher,
    paging: state.orderTour.paging,
    config: state.config
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllOrderVoucher: id => dispatch(getAllOrderVoucher(id)),
    createOrderVoucher: data => dispatch(createOrderVoucher(data)),
    updateOrderVoucher: data => dispatch(updateOrderVoucher(data)),
    deleteOrderVoucher: id => dispatch(deleteVoucher(id))
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Vouchers)
);
