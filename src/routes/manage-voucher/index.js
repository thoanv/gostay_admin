import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import {Table, Avatar, Form, DatePicker, Tag, Button, Row, Input} from "antd";
import moment from "moment";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import { _getAllManageVoucher, onVerifyVoucher } from '../../actions/ManageVoucherActions';
import { confirmProofOfPayment } from '../../actions/OrderActions';
import VoucherDetail from "Routes/manage-voucher/detail";
import {getAllSpot} from "Actions/DestinationActions";
import BaseSelect from "Components/Elements/BaseSelect";

class voucherManagerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        sort: {
          type: "desc",
          attr: "",
        },
        paging: {
          perpage: 10,
          page: 1,
        },
        type: {
          type: "=",
          value: 0,
        },
      },
      isShowProofModal: false,
      selectedRowKeys: [],
      open: false,
      openDetails: false,
      openAssign: false,
      current_assign: null,
      tourFilter: {
        paging: 0,
      },
      loading: true,
      destinationFilter: {
        paging: 0,
      },
      order_current: null,
    };
  }

  async componentDidMount() {
    try {
      await this.props.getAllManageVoucher(this.state.filter);
      this.props.getAllDestination(this.state.destinationFilter);
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  onVerifyVoucher = (id, status) => {
    this.props.onVerifyVoucher(id, status);
  }


  onEditOrderNumber = (order) => {
    this.props.getDetailManageVoucher(this.state.filter, order.id).then((res) =>
        this.setState({
          open: true,
          orderdetail: res.data,
        })
    );
  };

  onOrderClose = () => {
    this.setState({
      openDetails: false,
      voucher: null,
    });
  };

  getOrder(order) {
    if (order === "ascend") return "asc";
    if (order === "descend") return "desc";
    return "desc";
  }

  getTourStatus = (value) => {
    switch(value) {
      case 0:
        return <Tag style={{ marginTop: "0" }} color='#ed7014'>
          CHỜ XÁC NHẬN
        </Tag>
      case 1:
        return <Tag style={{ marginTop: "0" }} color='green'>
          ĐÃ XÁC NHẬN
        </Tag>
      case 2:
        return <Tag style={{ marginTop: "0" }} color='red'>
          HUỶ
        </Tag>
      default:
        return ""
    }
  }


  onCloseApproveProofModal() {
    this.setState({isShowProofModal: false, currentOrder: null});
  }

  onCreate = (edit = false, item) => {
    this.setState({
      edit,
      open: true,
      item: edit ? item : null
    });
  };

  onOpenDetails = (item) => {
    this.setState({
      openDetails: true,
      voucher: item
    });
  }

  onClose = () => {
    this.setState({
      open: false,
      item: null,
      edit: false,
      isSubmiting: false,
    });
  };

  onSave =  (data, id) => {
    this.onClose();
    this.props._addPopup(data);
  };


  onDelete = (id) => this.props._onDelete({id});

  render() {
    const { selectedRowKeys, loading, currentOrder, isShowProofModal } = this.state;

    const { listManageVoucher, listDestination, paging, destinations } = this.props;

    const columns = [
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
      },

      {
        title: 'Tên voucher',
        key: "name",
        render: (text, record) => {
          return <div style={{ color: 'blue', cursor: 'pointer' }}
                      onClick={() => this.onOpenDetails(record)}>
            {record.name}
          </div>;
        },
      },
      {
        title: 'Số lượng',
        key: "amount",
        render: (text, record) => (
            <div>
              {record.amount}
            </div>
        )
      },

      {
        title: 'Giá',
        key: "price",
        render: (text, record) => (
            <div>
              {record.price}
            </div>
        )},
      {
        title: 'Giá khuyến mại',
        key: "discount",
        render: (text, record) => (
            <div>
              {record.discount}
            </div>)
      },

      {
        title: 'Điểm du lịch',
        render: (record) => {
          return listDestination.find(e => e.id == record.tourist_id) ? listDestination.find(e => e.id == record.tourist_id).name : ''
        },
        key: "description",
        sorter: true,
      },
      {
        title: <IntlMessages id="global.status" />,
        key: "status",
        align: 'center',
        render: (record) => {
          return this.getTourStatus(record.status)
        },
      },
      {
        title: <IntlMessages id="Xác nhận" />,
        align: 'center',
        render: (text, record, index) => {
          if(record.status == '2') return null;
          return (
              <div>
                {record.status == '0' ?
                    <Row>
                      <Button type="primary" size="small" className="mt-1"
                              onClick={() => this.onVerifyVoucher(record.id, 1)}>
                        Xác nhận
                      </Button>
                    </Row> : null }
                <Row>
                  <Button type="danger" size="small" className="mt-1"
                          onClick={() => this.onVerifyVoucher(record.id, 2)}>
                    Hủy
                  </Button>
                </Row>
              </div>

          )
        }
      },
    ];
    return (
        <React.Fragment>
          <div className="formelements-wrapper">
            <PageTitleBar
                title={<IntlMessages id="sidebar.manage_voucher" />}
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
                        placeholder="Tên voucher"
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
                {
                  listManageVoucher && listDestination &&
                    <Table
                        loading={loading}
                        columns={columns}
                        dataSource={listManageVoucher}
                        rowKey="id"
                        size="small"

                    />
                }

              </RctCollapsibleCard>
            </div>
          </div>
          <VoucherDetail
              onEditOrderNumber={this.onEditOrderNumber}
              open={this.state.openDetails}
              onOrderClose={this.onOrderClose}
              voucher={this.state.voucher}
          />
          {/*<AddRoom_util*/}
          {/*            open={this.state.open}*/}
          {/*            edit={this.state.edit}*/}
          {/*            item={this.state.item}*/}
          {/*            onSave={this.onSave}*/}
          {/*            onClose={() => this.onClose()}*/}
          {/*        />*/}
        </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    listManageVoucher: state.manageVoucher.list,
    paging: state.orderTour.paging,
    listDestination: state.destination.listDestination,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllManageVoucher: (filter) => dispatch(_getAllManageVoucher(filter)),
    onVerifyVoucher: (id, status) => dispatch(onVerifyVoucher(id, status)),

    getAllDestination: (filter, paginate) =>
        dispatch(getAllSpot(filter, paginate)),
    confirmProofOfPayment: (id, data) => dispatch(confirmProofOfPayment(id, data))
  };
};
export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(voucherManagerComponent)
);
