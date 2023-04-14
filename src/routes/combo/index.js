import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { getAllCombo, deleteCombo, onVerifyCombo, getComboDetail } from "../../actions/ComboActions";
import { getAllDestination } from "../../actions/DestinationActions";
import {
  Table,
  Button,
  Icon,
  Form,
  Tag, Input,
} from "antd";
import BaseSelect from "Components/Elements/BaseSelect";
import ComboDetails from "./ComboDetails";

class ListCombo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        sort: {
          type: "desc",
          attr: "",
        },
        created_at: {
          type: "compare",
          value: {
            from: "",
            to: "",
          },
        },
        title: {
          type: "like",
          value: "",
        },
        alias: {
          type: "=",
          value: [],
        },
        search: "",
        paging: {
          perpage: 10,
          page: 1,
        },
        type: {
          type: "=",
          value: 0,
        },
      },
      selectedRowKeys: [],
      isOpenSetupDepartureModal: false,
      isOpenCreateModal: false,
      loading: false,
      currentCombo: null,
      isEdit: false,
      isOpenFilter: false,
      isOpenFlightSearch: false,
      isOpenComboAirline: false,
      isOpenFlightList: false,
      open: false,
    };
  }
  componentDidMount() {
    this.props.getAllCombo(this.state.filter)
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };


  onDelete() {
    this.props.deleteCombo({ id: this.state.selectedRowKeys });
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
      () => this.props.getAllCombo(this.state.filter)
    );
  };

  onFilter(name, value) {
    this.setState({
      filter: {
        ...this.state.filter,
        [name]: {
          type: "=",
          value: value,
        },
      },
    });
    setTimeout(() => {
      this.props.getAllCombo(this.state.filter);
    }, 300);
  }

  toggleFilter = () => {
    this.setState({
      isOpenFilter: !this.state.isOpenFilter,
    });
  };

  filter = (value, name, type) => {
    if (type === "search") {
      this.setState(
        {
          ...this.state,
          filter: {
            ...this.state.filter,
            search: value,
          },
        },
        () => this.props.getAllCombo(this.state.filter)
      );
    } else
      this.setState(
        {
          ...this.state,
          filter: {
            ...this.state.filter,
            [name]: {
              type: "=",
              value: value,
            },
          },
        },
        () => this.props.getAllCombo(this.state.filter)
      );
  };

  getComboStatus = (value) => {
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
        HUỶ COMBO
      </Tag>
      default: 
      return ""
    }
  }

  onVerifyCombo = (id, status) => {
    this.props.onVerifyCombo(id, status);
  }

  onOrderClose = () => this.setState({open: false});

  getDetailsCombo = (id) => {
    this.props.getDetailsCombo(id).then((res) => {
      console.log(res)
      this.setState({
        open: true,
        infoBasic: res.info_basic,
        comboDate: res.combo_date,
        comboPlan: res.combo_plan,
        listImg: res.list_img
      })
    });
  }

  render() {
    
    const columns = [
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "combo_id",
        key: "combo_id",
        render: (text, record) => {
          return `${record.combo_id}`;
        },
      },
      {
        title: <IntlMessages id="combo.title" />,
        key: "title",
        render: (record) => {
          return <div 
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => this.getDetailsCombo(record.combo_id)}>
            {record.title}
            </div>;
        },
        sorter: true,
      },
      {
        title: <IntlMessages id="combo.supplier" />,
        dataIndex: "supplier",
        key: "supplier",
        render: (text, record) => {
          const supplier = {...record.supplier}
          return `${supplier.firstname} ${supplier.lastname}`;
        },
      },
      {
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        key: "status",
        render: (text, record) => {
          return this.getComboStatus(record.status);
        },
      },
      {
        title: <IntlMessages id="combo.days" />,
        dataIndex: "days",
        key: "days",
        render: (text, record) => {
          return `${record.days}`;
        },
      },
      {
        title: <IntlMessages id="combo.nights" />,
        dataIndex: "nights",
        key: "nights",
        render: (text, record) => {
          return `${record.nights}`;
        },
      },
      {
        title: <IntlMessages id="combo.departure" />,
        key: "departure",
        render: (text, record) => {
          return `${record.destination}`;
        },
      },
      {
        title: <IntlMessages id="combo.price" />,
        key: "cost",
        render: (text, record) => {
          return `${record.cost}`;
        },
      },
      {
        title: <IntlMessages id="global.action" />,
        key: "action",
        align: "center",
        render: (text, record, index) => {
            return (
              <React.Fragment>
                {record.status === 0 ? <div style={{ display: 'flex', flexDirection: 'column' }}>
                    
                        <Button type="primary" size="small" className="mt-1" 
                      onClick={() => this.onVerifyCombo(record.combo_id, 1)}>
                        Xác Nhận
                      </Button>
              </div> : null}
              {record.status !== 2 ? <Button type="danger" size="small" className="mt-1" 
                    onClick={() => this.onVerifyCombo(record.combo_id, 2)}>
                      Huỷ Bỏ
                    </Button> : null}
              </React.Fragment> 
                

            )
        }
      }
    ];

    const {
      loading,
      selectedRowKeys,
      isOpenFilter,
      daysOfCombo,
      desNameCombo,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const { combos, destinationCombo, paging } = this.props;

    const listCountry = [
      { title: "Austrailia", id: 15 },
      { title: "Canada", id: 2 },
      { title: "China", id: 45 },
      { title: "United States", id: 1 },
    ];

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.combo" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-sm-12 col-md-12 col-xl-12">
              {/* <div style={{ display: "inline-block", width: "98%" }}>
                <TableActionBar
                  isShowAddButton={false}
                  isShowPublishButtons={false}
                  isShowDeleteButton={false}
                  isShowCopyButton={false}
                  isDisabled={!hasSelected}
                  rows={this.state.selectedRowKeys}
                  table="combo"
                  onFilter={this.filter}
                >
                  {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                </TableActionBar>
              </div>
              <div style={{ float: "right", lineHeight: "60px" }}>
                <Icon
                  type="filter"
                  style={
                    isOpenFilter
                      ? { color: "blue", fontSize: 20 }
                      : { color: "rgba(0,0,0,.25)", fontSize: 20 }
                  }
                  onClick={() => this.toggleFilter()}
                />
              </div> */}
              <Form
                  layout="inline"
                  onSubmit={this.handleSubmit}
                  style={{ display: "flex", justifyContent: "flex-start" }}
              >

                <Form.Item>
                  <Input
                      onChange={(e) => this.onFilter("search", e.target.value)}
                      placeholder="Tên combo , người đề xuất"
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
                rowSelection={rowSelection}
                columns={columns}
                dataSource={combos}
                rowKey="id"
                onChange={this.onChangeTable}
                // pagination={{
                //   total: paging.count,
                //   defaultCurrent: +paging.page,
                //   pageSize: +paging.perpage,
                //   showSizeChanger: true,
                //   pageSizeOptions: ["10", "20", "30"],
                // }}
                size="small"
              />
            </RctCollapsibleCard>
          </div>
        </div>
        <ComboDetails
          open={this.state.open}
          onOrderClose={this.onOrderClose}
          infoBasic={this.state.infoBasic}
          comboDate={this.state.comboDate}
          comboPlan={this.state.comboPlan}
          listImg={this.state.listImg}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    combos: state.combo.listCombo,
    targetCombo: state.combo.currentCombo,
    destinationCombo: state.destination.listDestination,
    paging: state.combo.paging,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllCombo: (filter) => dispatch(getAllCombo(filter)),
    getAllDestination: (filter) => dispatch(getAllDestination(filter)),
    deleteCombo: (ids) => dispatch(deleteCombo(ids)),
    onVerifyCombo: (id, status) => dispatch(onVerifyCombo(id, status)),
    getDetailsCombo: (id) => dispatch(getComboDetail(id)) 
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ListCombo)
);
