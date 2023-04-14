import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { publish, unpublish } from "../../../actions/CommonActions";
import {
  getAllTicket,
  updateTicket,
  createTicket,
  batchDelete
} from "../../../actions/TicketAction";
import { getAllCountry } from "../../../actions/CountryActions";
import { getAllCategory } from "../../../actions/CategoryActions";
import { getAllDestination } from "../../../actions/DestinationActions";
import IntlMessages from "Util/IntlMessages";
import { Table, Button } from "antd";
import "antd/dist/antd.css";
import TableActionBar from "../../../components/TableActionBar";
import StatusButton from "../../../components/StatusButton";
import ImageInTable from "../../../components/ImageInTable";
import AddTicket from "./AddTicket";
import moment from "moment";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTicket: [],
      filter: {
        type : { type : '=', value : 1},
        sort: {
          type: "desc",
          attr: ""
        },
        paging: {
          perpage: 10,
          page: 1
        }
      },
      edit: false,
      isSubmiting: false,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      open: false,
      getTicket: null,
      filterAccount: { paging: 0 }
    };
  }

  componentDidMount() {
    this.props.getAllTicket(this.state.filter);
    this.props.getAllCountry(this.state.filterAccount);
    this.props.getAllCategory(this.state.filterAccount);
    this.props.getAllDestination(this.state.filterAccount);
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

  onChangeSearch(event) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          search: event.target.value
        }
      },
      () => this.props.getAllTicket(this.state.filter)
    );
  }

  onRefresh() {
    this.props.getAllTicket(this.state.filter, "ticket");
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

  onCreateTicket = () => {
    this.setState({
      open: true,
      getTicket: null
    });
  };

  onEditTicket = ticket => {
    this.setState({
      open: true,
      getTicket: ticket,
      edit: true
    });
  };

  onTicketClose = () => {
    this.setState({
      open: false,
      getTicket: null,
      edit: false,
      isSubmiting: false
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
        () => this.props.getAllTicket(this.state.filter)
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
        () => this.props.getAllTicket(this.state.filter)
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
        this.props.getAllTicket(this.state.filter);
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
              perpage: pageSize
            }
          }
        },
        () => {
          this.props.getAllTicket(this.state.filter);
        }
      );
    }
  }

  onSaveTicket = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateTicket({
          ...dataSubmit
        })
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getTicket: null,
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
      await this.props
        .createTicket({
          ...data
        })
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getTicket: null,
            ticket: null,
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
    const { loading, selectedRowKeys } = this.state;

    const {
      listTicket,
      listCountry,
      listCategory,
      listDestination,
      paging
    } = this.props;

    const columns = [
      {
        key: "image",
        title: "Image",
        render: (text, record) => (
          <div className="image_logo">
            <ImageInTable
              src={config.url_asset_root + record.image}
              alt={`${record.image}_logo`}
            ></ImageInTable>
          </div>
        )
      },
      {
        key: "status",
        title: <IntlMessages id="global.status" />,
        render: (text, record) => {
          return (
            <React.Fragment>
              {record ? (
                <StatusButton
                  data_id={record.id}
                  status={record.status}
                  table="tour"
                />
              ) : null}
            </React.Fragment>
          );
        }
      },
      {
        title: "Title",
        key: "title",
        render: record => (
          <Button type="link" className="p-0" onClick={() => this.onEditTicket(record)}>
            {record.title}
          </Button>
        )
      },
      // {
      //   title: "SKU",
      //   dataIndex: "code"
      // },

      {
        title: "Country",
        key: "country",
        render: record => {
          let a = listCountry.find(item => {
            return item.id === record.country_id;
          });
          return <span>{a ? a.title : record.country_id}</span>;
        }
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        sorter: true
      },
      {
        title: "Itinerary",
        dataIndex: "",
        render: (text, record) => (
          <b>
            <Link
              to={`/app/ticket_itineraries/${record.id}`}
              style={{ color: "blue" }}
            >
              Setup Itineraries
            </Link>
          </b>
        )
      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true
      }
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.cities_Escape" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={() => this.onCreateTicket()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                table="ticket"
                isShowPublishButtons={true}
                onFilter={this.filter}
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>

              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listTicket}
                tableLayout="auto"
                onFilter={this.filter}
                onChange={this.onChangTable}
                rowKey="id"
                size="small"
                pagination={{
                  pageSizeOptions: ["10", "20", "30"],
                  total: paging.count,
                  defaultCurrent: +paging.page,
                  pageSize: +paging.perpage,
                  showSizeChanger: true
                }}
              />
            </RctCollapsibleCard>
          </div>
        </div>
        <AddTicket
          open={this.state.open}
          edit={this.state.edit}
          ticket={this.state.getTicket}
          countries={listCountry}
          categories={listCategory}
          destination={listDestination}
          onSaveTicket={this.onSaveTicket}
          onTicketClose={() => this.onTicketClose()}
          isLoading={loading}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    listTicket: state.ticket.listTicket,
    listCountry: state.country.listCountry,
    listCategory: state.category.listCategory,
    paging: state.ticket.paging,
    config: state.config
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllTicket: filter => dispatch(getAllTicket(filter)),
    getAllCountry: filter => dispatch(getAllCountry(filter)),
    getAllCategory: filter => dispatch(getAllCategory(filter)),
    getAllDestination: filter => dispatch(getAllDestination(filter)),
    createTicket: data => dispatch(createTicket(data)),
    updateTicket: id => dispatch(updateTicket(id)),
    delete: data => dispatch(batchDelete(data)),
    publish: data => dispatch(publish(data)),
    unpublish: data => dispatch(unpublish(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(index);
