import React, { Component } from "react";
import {
  getItineraries,
  batchDelete,
  createAItineraries,
  updateItineraries
} from "../../actions/ItineraryAction";
import { getAllTour } from "../../actions/TourActions";
import { getAllDestination } from '../../actions/DestinationActions';

import {
  changeStatus,
  publish,
  unpublish
} from "../../actions/CommonActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import {
  Table,
  Rate
} from "antd";
import TableActionBar from "../../components/TableActionBar";
import StatusButton from "../../components/StatusButton";
import AddItineraries from "./AddItineraries";
import ImageInTable from "../../components/ImageInTable";

class Itineraries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItineraries: [],
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
        search: "",
        paging: {
          perpage: 10,
          page: 1
        }
      },
      isCreateItineraries: false,
      isEditItineraries: false,
      selectedRowKeys: [],
      addItinerariesState: false,
      isSubmiting: false,
      current_itineraries: null,
      edit: false
    };
  }
  componentDidMount() {
    console.log(this.props);
    this.props.getItineraries(this.state.filter, this.props.match.params.id)
    this.props.getAllTour(this.props.filter)
    this.props.getAllDestination({...this.state.filter, paging: 0})
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
            perpage: pageSize
          }
        }
      },
      () => {
        this.props.getItineraries(this.state.filter, this.props.match.params.id);
      }
    );
  }

  closeCreateCustomerModal() {
    this.setState({
      ...this.state,
      isCreateItineraries: false
    });
  }
  openCreateItinerariesModal() {
    this.setState({
      ...this.state,
      isCreateItineraries: true
    });
  }
  closeEditCustomerModal() {
    this.setState({
      ...this.state,
      isEditItineraries: false
    });
  }
  openEditItinerariesModal() {
    this.setState({
      ...this.state,
      isEditItineraries: true
    });
  }
  onChangeSearch(event) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          search: event.target.value
        }
      },
      () => this.props.getItineraries(this.state.filter, this.props.match.params.id)
    );
  }

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false
      });
    }, 1000);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onRefresh() {
    this.props.getItineraries(this.state.filter, "itinerary");
    this.setState({
      selectedRowKeys: []
    });
  }

  onDelete() {
    this.props.delete({ id: this.state.selectedRowKeys }).then(() => {
      this.setState({
        selectedRowKeys: []
      });
    });
  }


  onAddItineraries = () => {
    this.setState({
      addItinerariesState: true
    });
  };
  onEditItineraries(itineraries) {
    this.setState({
      addItinerariesState: true,
      current_itineraries: itineraries,
      edit: true
    });
  }
  onItinerariesClose = () => {
    this.setState({
      addItinerariesState: false,
      current_itineraries: null,
      isSubmiting: false,
      edit: false
    });
  };

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
        () => this.props.getItineraries(this.state.filter, this.props.match.params.id)
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
        () => this.props.getItineraries(this.state.filter, this.props.match.params.id)
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
            attr: sorter.columnKey
          },
          paging: {
            perpage: pagination.pageSize,
            page: pagination.current
          }
        }
      },
      () => {
        this.props.getItineraries(this.state.filter, this.props.match.params.id);
      }
    );
  };


  async onSaveItineraries(data, id) {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateItineraries(dataSubmit)
        .then(res => {
          this.props.getItineraries(this.state.filter, this.props.match.params.id);
          this.setState({
            ...this.state,
            isSubmiting: false,
            addItinerariesState: false,
            current_itineraries: null,
            edit: false
          });
        })
        .catch(err => {
          this.setState({
            ...this.state,
            isSubmiting: false
          });
        });
    } else {
      var datacreate = { ...data, tour_id: this.props.match.params.id };
      await this.props
        .createItineraries(datacreate)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addItinerariesState: false,
            current_itineraries: null,
            edit: false
          });
        })
        .catch(err => {
          this.setState({
            ...this.state,
            isSubmiting: false
          });
        });
    }
  };

  render() {
    var listTourName = this.props.listTour.map(item => {
      return ({
        id: item.id,
        title: item.title
      })
    })

    var listDestinationName = this.props.listDestination.map(item => {
      return ({
        id: item.id,
        title: item.title
      })
    })

    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const hasSelected = selectedRowKeys.length > 0;

    const { paging, config } = this.props;

    const columns = [
      {
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        width: "7%"
      },
      {
        title: <IntlMessages id="global.title" />,
        dataIndex: "title",
        align: "left",
        width: "28%"
      },
      {
        title: <IntlMessages id="global.image" />,
        dataIndex: "image",
        // align: "center",
        width: "20%"
      },
      {
        title: <IntlMessages id="global.meals" />,
        dataIndex: "meal",
        width: "7%"
      },
      {
        title: <IntlMessages id="global.destination" />,
        dataIndex: "dest_title",
        width: "13%"
      },
      {
        title: <IntlMessages id="itineraries.rank" />,
        dataIndex: "hotel_rank",
        key: "hotel_rank",
        sorter: true,
        width: "20%"
      },
      {
        title: "ID",
        dataIndex: "id",
        sorter: true,
        width: "5%"
      }
    ];

    var data = this.props.listItineraries.map(item => {
      return {
        ...item,
        title: (
          <b style={{ color: "blue", cursor: "pointer" }} onClick={() => this.onEditItineraries(item)}>
            {item.title}
          </b>
        ),
        status: (
          <StatusButton
            data_id={item.id}
            status={item.status}
            table="itinerary"
          />
        ),
        hotel_rank: (
          <span>
              <Rate disabled value={item.hotel_rank} />
          </span> 
        ),
        meal: (
          <span>{item.meal.join()}</span>
        ),
        image: (
          <ImageInTable src={config.url_asset_root + item.image} height={50}></ImageInTable>
        )
      };
    });

    var tourName = this.props.listItineraries[0] == undefined ? ' ' : this.props.listItineraries[0].tour_title;


    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.itineraries" />}
            match={this.props.match}
          />
          <div className="row">
            <div className="col-sm-12 col-md-12 col-xl-12">
              <RctCollapsibleCard heading={`Tour: ${tourName}`}>
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
                    pagination={{
                      showSizeChanger: true,
                      size: 'small',
                      pageSizeOptions: ["10", "20", "30"],
                      total: paging.count,
                    }}
                  />
                </div>
                <AddItineraries
                  open={this.state.addItinerariesState}
                  onSaveItineraries={(data, id) => this.onSaveItineraries(data, id)}
                  loading={this.state.isSubmiting}
                  edit={this.state.edit}
                  itinerary={this.state.current_itineraries}
                  tourName={listTourName}
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
    listItineraries: state.itinerary.items,
    listTour: state.tour.listTour,
    listDestination: state.destination.listDestination,
    paging: state.itinerary.paging,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItineraries: (filter, id) => dispatch(getItineraries(filter, id)),
    getAllTour: filter => dispatch(getAllTour(filter)),
    getAllDestination: (filter) => dispatch(getAllDestination(filter)),
    changeStatus: data => dispatch(changeStatus(data)),
    publish: data => dispatch(publish(data)),
    unpublish: data => dispatch(unpublish(data)),
    delete: data => dispatch(batchDelete(data)),
    createItineraries: data => dispatch(createAItineraries(data)),
    updateItineraries: data => dispatch(updateItineraries(data))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Itineraries)
);
