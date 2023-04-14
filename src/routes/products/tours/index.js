import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { getAllSearchTour, deleteTour, onVerifyTour, getTourDetail } from "../../../actions/TourActions";
import { getAllDestination } from "../../../actions/DestinationActions";
import {
  Table,
  Button,
  Pagination,
  Icon,
  Row,
  Form,
  Tag, Input,
} from "antd";
import StatusButton from "../../../components/StatusButton";
import DepartureModal from "./DepartureModal";
import BaseSelect from "Components/Elements/BaseSelect";
import TableActionBar from "../../../components/TableActionBar";
import AddTour from "./AddTour";
import ImageInTable from "../../../components/ImageInTable";
import FlightSearch from "./FlightSearch";
import TourAirlines from "./TourAirlines";
import TourFlight from "./TourFlight";
import TourDetails from "./TourDetails";

class ListTour extends Component {
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
        status: {
          type: "=",
          value: null,
        },
      },
      selectedRowKeys: [],
      isOpenSetupDepartureModal: false,
      isOpenCreateModal: false,
      loading: false,
      currentTour: null,
      isEdit: false,
      isOpenFilter: false,
      isOpenFlightSearch: false,
      isOpenTourAirline: false,
      isOpenFlightList: false,
      open: false,
      airlineType: "1", // airline type '1' is onward, '2' is return
    };
  }
  componentDidMount() {
    this.props.getAllTour(this.state.filter).then((res) => {

    });

  }

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
          this.props.getAllTour(this.state.filter);
        }
      );
    }
  }



  onChangeSearch(event) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          search: event.target.value,
        },
      },
      () => this.props.getAllTour(this.state.filter)
    );
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  onCloseModal() {
    this.setState({
      isOpenSetupDepartureModal: false,
      isOpenCreateModal: false,
      isOpenFlightSearch: false,
      currentTour: null,
      isEdit: false,
      isOpenTourAirline: false,
      isOpenFlightList: false,
    });
  }

  onRefresh() {
    this.props.getAllTour(this.state.filter);
    this.setState({
      selectedRowKeys: [],
    });
  }

  onDelete() {
    this.props.deleteTour({ id: this.state.selectedRowKeys });
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
      () => this.props.getAllTour(this.state.filter)
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
      this.props.getAllTour(this.state.filter);
    }, 300);
  }

  toggleFilter = () => {
    this.setState({
      isOpenFilter: !this.state.isOpenFilter,
    });
  };

  filterDestination = (id) => {
    this.setState({
      filter: {
        ...this.state.filter,
        destination_id: id,
      },
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
        () => this.props.getAllTour(this.state.filter)
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
        () => this.props.getAllTour(this.state.filter)
      );
  };

  checkDuration(arr, str) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].title.toString() === str.toString()) return 0;
    }
    return 1;
  }

  openTourAirlineModal() {
    this.setState({
      isOpenFlightSearch: false,
      isOpenTourAirline: true,
    });
  }

  goBackToFlightSearch() {
    this.setState({
      isOpenFlightSearch: true,
      isOpenTourAirline: false,
    });
  }

  setAirlineType(key) {
    this.setState({ airlineType: key });
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
        HUỶ TOUR
      </Tag>
      default: 
      return ""
    }
  }

  onVerifyTour = (id, status) => {
    this.props.onVerifyTour(id, status);
  }

  onOrderClose = () => this.setState({open: false});

  getDetailsTour = (id) => {
    this.props.getDetailsTour(id).then((res) => {
      this.setState({
        open: true,
        infoBasic: res.info_basic,
        tourDate: res.tour_date,
        tourPlan: res.tour_plan,
        listImg: res.list_img
      })
    });
  }

  render() {
    const columns = [
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "tour_id",
        key: "tour_id",
        render: (text, record) => {
          return `${record.tour_id}`;
        },
      },
      {
        title: <IntlMessages id="tour.title" />,
        key: "title",
        render: (record) => {
          return <div 
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => this.getDetailsTour(record.tour_id)}>
            {record.title}
            </div>;
        },
        sorter: true,
      },
      {
        title: <IntlMessages id="tour.supplier" />,
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
          return this.getTourStatus(record.status);
        },
      },
      {
        title: <IntlMessages id="tour.days" />,
        dataIndex: "days",
        key: "days",
        render: (text, record) => {
          return `${record.days}`;
        },
      },
      {
        title: <IntlMessages id="tour.nights" />,
        dataIndex: "nights",
        key: "nights",
        render: (text, record) => {
          return `${record.nights}`;
        },
      },
      {
        title: <IntlMessages id="tour.departure" />,
        dataIndex: "departure",
        key: "departure",
        render: (text, record) => {
          return `${record.departure}`;
        },
      },
      {
        title: <IntlMessages id="tour.price" />,
        dataIndex: "cost",
        key: "cost",
        render: (text, record) => {
          return `${record.cost}`;
        },
      },
      {
        title: <IntlMessages id="global.created_at" />,
        key: "created_at",
        align: 'center',
        render: (text, record) => {
          return `${record.created_at}`;
        },
      },
      {
        title: <IntlMessages id="global.action" />,
        // dataIndex: "created_at",
        key: "action",
        align: "center",
        render: (text, record, index) => {
            return (
              <React.Fragment>
                {record.status === 0 ? <div style={{ display: 'flex', flexDirection: 'column' }}>
                    
                        <Button type="primary" size="small" className="mt-1" 
                      onClick={() => this.onVerifyTour(record.tour_id, 1)}>
                        Xác Nhận
                      </Button>
              </div> : null}
              {record.status !== 2 ?
              <Button type="danger" size="small" className="mt-1" 
                    onClick={() => this.onVerifyTour(record.tour_id, 2)}>
                      Huỷ Bỏ
                    </Button> : null }
              </React.Fragment>
                

            )
        }
      }
    ];

    const {
      loading,
      selectedRowKeys,
      isOpenFilter,
      daysOfTour,
      desNameTour,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const { tours, destinationTour, paging } = this.props;

    const listCountry = [
      { title: "Austrailia", id: 15 },
      { title: "Canada", id: 2 },
      { title: "China", id: 45 },
      { title: "United States", id: 1 },
    ];

    // let desNameTour = destinationTour.map(item => {
    //   if (item.title) {
    //     return {
    //       id: item.id,
    //       title: item.title
    //     };
    //   }
    // });

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.tours" />}
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
                  table="tour"
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
                        placeholder="Tên tour , người đề xuất"
                        style={{ width: "350px" }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <BaseSelect
                      showSearch
                      options={[
                        { value: 1, label: 'ĐÃ XÁC NHẬN' },
                        { value: 0, label: 'CHỜ XÁC NHẬN' },
                        { value: 2, label: 'HUỶ TOUR' },
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
                dataSource={tours}
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
        <TourDetails
          open={this.state.open}
          onOrderClose={this.onOrderClose}
          infoBasic={this.state.infoBasic}
          tourDate={this.state.tourDate}
          tourPlan={this.state.tourPlan}
          listImg={this.state.listImg}
        />

        {/* <DepartureModal
          isVisible={this.state.isOpenSetupDepartureModal}
          onCloseModal={() => this.onCloseModal()}
          tour={this.state.currentTour ? this.state.currentTour.id : null}
        />

        <AddTour
          open={this.state.isOpenCreateModal}
          edit={this.state.isEdit}
          item={this.state.currentTour ? this.state.currentTour.id : null}
          onClose={() => this.onCloseModal()}
        />

        <FlightSearch
          visible={this.state.isOpenFlightSearch}
          tour_id={this.state.currentTour ? this.state.currentTour.id : null}
          onClose={() => this.onCloseModal()}
          onOk={() => this.openTourAirlineModal()}
          onChangeType={(key) => this.setAirlineType(key)}
        />

        <TourAirlines
          visible={this.state.isOpenTourAirline}
          tour_id={this.state.currentTour ? this.state.currentTour.id : null}
          onClose={() => this.onCloseModal()}
          onBack={() => this.goBackToFlightSearch()}
          defaultTab={this.state.airlineType}
        />

        <TourFlight
          visible={this.state.isOpenFlightList}
          tour_id={this.state.currentTour ? this.state.currentTour.id : null}
          onClose={() => this.onCloseModal()}
          // onBack={() => this.goBackToFlightSearch()}
          // defaultTab={this.state.airlineType}
        /> */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    tours: state.tour.listTour,
    targetTour: state.tour.currentTour,
    destinationTour: state.destination.listDestination,
    paging: state.tour.paging,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllTour: (filter) => dispatch(getAllSearchTour(filter)),
    getAllDestination: (filter) => dispatch(getAllDestination(filter)),
    deleteTour: (ids) => dispatch(deleteTour(ids)),
    onVerifyTour: (id, status) => dispatch(onVerifyTour(id, status)),
    getDetailsTour: (id) => dispatch(getTourDetail(id)) 
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ListTour)
);
