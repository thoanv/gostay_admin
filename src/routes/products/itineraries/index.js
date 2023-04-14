import { Button, Table } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { getAllDestination } from "../../../actions/DestinationActions";
import {
  batchDelete,
  createATicketItineraries,
  getTicketItineraries,
  updateTicketItineraries,
} from "../../../actions/TicketItineraries Action";
import { getAllTour } from "../../../actions/TourActions";

import AddItineraries from "./AddItineraries";
import ImageInTable from "../../../components/ImageInTable";
import TableActionBar from "../../../components/TableActionBar";
import StatusButton from "../../../components/StatusButton";
import { getAllTicket } from "../../../actions/TicketAction";

class TicketItineraries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItineraries: [],
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
        search: "",
        paging: {
          perpage: 10,
          page: 1,
        },
      },
      isCreateTicketItineraries: false,
      isEditTicketItineraries: false,
      selectedRowKeys: [],
      addTicketItinerariesState: false,
      isSubmiting: false,
      current_ticketitineraries: null,
      edit: false,
    };
  }
  componentDidMount() {
    this.props.getAllTicket(this.state.filter);
    this.props.getTicketItineraries(this.props.match.params.id);
    this.props.getAllTour(this.props.filter);
    this.props.getAllDestination({ ...this.state.filter, paging: 0 });
  }

  handleChangePage(page, pageSize) {
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
        this.props.getItineraries(
          this.state.filter,
          this.props.match.params.id
        );
      }
    );
  }

  closeCreateCustomerModal() {
    this.setState({
      ...this.state,
      isCreateTicketItineraries: false,
    });
  }
  openCreateItinerariesModal() {
    this.setState({
      ...this.state,
      isCreateTicketItineraries: true,
    });
  }
  closeEditCustomerModal() {
    this.setState({
      ...this.state,
      isEditTicketItineraries: false,
    });
  }
  openEditItinerariesModal() {
    this.setState({
      ...this.state,
      isEditTicketItineraries: true,
    });
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
      () =>
        this.props.getItineraries(this.state.filter, this.props.match.params.id)
    );
  }

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  onRefresh() {
    this.props.getItineraries(this.state.filter, "itinerary");
    this.setState({
      selectedRowKeys: [],
    });
  }

  onDelete() {
    this.props.delete({ id: this.state.selectedRowKeys }).then(() => {
      this.setState({
        selectedRowKeys: [],
      });
    });
  }

  onAddItineraries = () => {
    this.setState({
      addTicketItinerariesState: true,
    });
  };
  onEditItineraries(itineraries) {
    this.setState({
      addTicketItinerariesState: true,
      current_ticketitineraries: itineraries,
      edit: true,
    });
  }
  onItinerariesClose = () => {
    this.setState({
      addTicketItinerariesState: false,
      current_ticketitineraries: null,
      isSubmiting: false,
      edit: false,
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
        () =>
          this.props.getItineraries(
            this.state.filter,
            this.props.match.params.id
          )
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
        () =>
          this.props.getItineraries(
            this.state.filter,
            this.props.match.params.id
          )
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
      () => {
        this.props.getItineraries(
          this.state.filter,
          this.props.match.params.id
        );
      }
    );
  };

  async onSaveItineraries(data, id) {
    await this.setState({
      ...this.state,
      isSubmiting: true,
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateTicketItineraries(dataSubmit)
        .then((res) => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addTicketItinerariesState: false,
            current_ticketitineraries: null,
            edit: false,
          });
        })
        .catch((err) => {
          this.setState({
            ...this.state,
            isSubmiting: false,
          });
        });
    } else {
      var datacreate = { ...data, tour_id: this.props.match.params.id };
      await this.props
        .createATicketItineraries(datacreate)
        .then((res) => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addTicketItinerariesState: false,
            current_ticketitineraries: null,
            edit: false,
          });
        })
        .catch((err) => {
          this.setState({
            ...this.state,
            isSubmiting: false,
          });
        });
    }
  }

  render() {
    var listTourName = this.props.listTour.map((item) => {
      return {
        id: item.id,
        title: item.title,
      };
    });

    var listDestinationName = this.props.listDestination.map((item) => {
      return {
        id: item.id,
        title: item.title,
      };
    });

    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const { paging, config } = this.props;

    const columns = [
      {
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        width: "7%",
      },
      {
        title: <IntlMessages id="global.title" />,
        dataIndex: "title",
        align: "left",
        width: "28%",
      },
      {
        title: <IntlMessages id="global.image" />,
        dataIndex: "image",
        // align: "center",
        width: "20%",
      },
      {
        title: <IntlMessages id="global.meals" />,
        dataIndex: "meal",
        width: "7%",
      },
      {
        title: <IntlMessages id="global.destination" />,
        dataIndex: "dest_title",
        width: "13%",
      },

      {
        title: "ID",
        dataIndex: "id",
        sorter: true,
        width: "5%",
      },
    ];
    var data = this.props.listItineraries.map((item) => {
      return {
        ...item,
        title: (
          <Button type="link" className="p-0" onClick={() => this.onEditItineraries(item)}>
            {item.title}
          </Button>
        ),
        status: (
          <StatusButton
            data_id={item.id}
            status={item.status}
            table="itinerary"
          />
        ),

        meal: <span>{item.meal.join()}</span>,
        image: (
          <ImageInTable src={config.url_asset_root + item.image} height={50}></ImageInTable>
        ),
      };
    });

    // var ticketName =  this.props.listItineraries[0].title;

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.ticketitineraries" />}
            match={this.props.match}
          />
          <div className="row">
            <div className="col-sm-12 col-md-12 col-xl-12">
              <RctCollapsibleCard>
                <div className="mb-20">
                  <TableActionBar
                    onAdd={() => this.onAddItineraries()}
                    onDelete={() => this.onDelete()}
                    onRefresh={() => this.onRefresh()}
                    isDisabled={!hasSelected}
                    rows={this.state.selectedRowKeys}
                    isShowPublishButtons={true}
                    table="itinerary"
                    onFilter={this.filter}
                  >
                    {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                  </TableActionBar>

                  <Table
                    tableLayout="fixed"
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    size="small"
                    onChange={this.onChangTable}
                    pagination={false}
                  />
                </div>
                <AddItineraries
                  open={this.state.addTicketItinerariesState}
                  onSaveItineraries={(data, id) =>
                    this.onSaveItineraries(data, id)
                  }
                  loading={this.state.isSubmiting}
                  edit={this.state.edit}
                  itinerary={this.state.current_ticketitineraries}
                  //   tourName={listTourName}
                  destinationName={listDestinationName}
                  onItinerariesClose={this.onItinerariesClose}
                />
              </RctCollapsibleCard>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    listItineraries: state.ticketitinerary.listdata,
    listTour: state.tour.listTour,
    listDestination: state.destination.listDestination,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllTicket: (filter) => dispatch(getAllTicket(filter)),
    getTicketItineraries: (id) => dispatch(getTicketItineraries(id)),
    getAllTour: (filter) => dispatch(getAllTour(filter)),
    getAllDestination: (filter) => dispatch(getAllDestination(filter)),
    delete: (data) => dispatch(batchDelete(data)),
    createATicketItineraries: (data) =>
      dispatch(createATicketItineraries(data)),
    updateTicketItineraries: (data) => dispatch(updateTicketItineraries(data)),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TicketItineraries)
);
