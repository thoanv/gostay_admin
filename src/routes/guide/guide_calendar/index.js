import { Table, Tag } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import {
  batchDelete,
  getAllGuideCalendar,
  addGuideCalendar,
  updateGuideCalendar
} from "../../../actions/GuideCalendarAction";
import { getAllACCOUNT } from "../../../actions/AccountAction";
import { getAllGit } from "../../../actions/GitAction";
import { getAllDestination } from "../../../actions/DestinationActions";
import { getAllTour } from "../../../actions/TourActions";
import TableActionBar from "../../../components/TableActionBar";
import AddGuideCalendar from "./AddGuideCalendar";

class ListGuideCalendar extends Component {
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
      filterAll: {
        paging: 0
      },
      guides: [],
      suppliers: [],
      addGuideState: false,
      selectedRowKeys: [],
      isSubmiting: false,
      current_calendar: null,
      edit: false
    };
  }

  componentDidMount() {
    this.props.getAllGuideCalendar(this.state.filter);
    this.props.getAllGit(this.state.filterAll);
    this.props.getAllGuide(this.state.filterAll, "guide").then(res => {
      this.setState({
        guides: res.data.list
      })
    })
    this.props.getAllSupplier(this.state.filterAll, "supplier").then(res => {
      this.setState({
        suppliers: res.data.list
      })
    })
    this.props.getAllTour(this.state.filterAll);
    this.props.getAllDestination(this.state.filterAll);
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
      () => this.props.getAllGuideCalendar(this.state.filter)
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
      () => this.props.getAllGuideCalendar(this.state.filter)
    );
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  onAddGuideCalendar = () => {
    this.setState({ addGuideState: true });
  };

  onEditGuideCalendar(calendar) {
    this.setState({
      addGuideState: true,
      current_calendar: calendar,
      edit: true
    });
  }
  onGuideCalendarClose = () => {
    this.setState({
      addGuideState: false,
      current_calendar: null,
      isSubmiting: false,
      edit: false
    });
  };

  onSaveGuideCalendar = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateGuideCalendar({
          ...dataSubmit,
          date: moment(dataSubmit.date).format("YYYY-MM-DD HH:mm:ss")
        })
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addGuideState: false,
            current_calendar: null,
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
        .addGuideCalendar({
          ...data,
          date: moment(data.date).format("YYYY-MM-DD HH:mm:ss")
        })
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addGuideState: false,
            current_calendar: null,
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
    this.props.getAllGuideCalendar(this.state.filter, "guide_calendar");
    this.setState({
      selectedRowKeys: []
    });
  }
  getOrder(order) {
    if (order === "ascend") return "asc";
    if (order === "descend") return "desc";
    return "";
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
      () => this.props.getAllGuideCalendar(this.state.filter)
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
          filter: {
            ...this.state.filter,
            search: value
          }
        },
        () => this.props.getAllGuideCalendar(this.state.filter)
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
        () => this.props.getAllGuideCalendar(this.state.filter)
      );
  };
  render() {
    const { selectedRowKeys, guides, suppliers } = this.state;

    const {
      listGuideCalendar,
      listTour,
      listDestination,
      listGit,
      paging
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
      {
        title: <IntlMessages id="sidebar.guide" />,
        key: "guide",
        render: record => {
          let a = guides.find(item => {
            return item.id === record.cid;
          });
          return (
            <b
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => this.onEditGuideCalendar(record)}
            >
              {a
                ? ((a.firstname
                  ? `${a.firstname} ${a.lastname}`
                  : a.cid_email)
                    ? a.firstname
                      ? `${a.firstname} ${a.lastname}`
                      : a.email
                    : `${a.mobile}`
                  ).split("null", 1)
                : record.cid}
            </b>
          );
        }
      },
      {
        title: <IntlMessages id="global.tour" />,
        key: "tour_id",
        render: record => {
          let a = listTour.find(item => {
            return item.id === record.tour_id;
          });
          return <span>{a ? a.title : ""}</span>;
        }
      },
      {
        title: <IntlMessages id="global.city" />,
        key: "dest_id",
        dataIndex: "dest_title"
      },
      {
        title: <IntlMessages id="global.date" />,
        key: "date",
        className: "center-column",
        render: (text, record) => (
          <React.Fragment>
            <div>{moment(record.date).format("YYYY/MM/DD")}</div>
          </React.Fragment>
        )
      },
      {
        title: <IntlMessages id="global.status" />,
        key: "status",
        render: record =>
          record.status === 1 ? (
            <Tag color="blue">
              <IntlMessages id="guide.status.sent" />
            </Tag>
          ) : record.status === 2 ? (
            <Tag color="green">
              <IntlMessages id="guide.status.accepted" />
            </Tag>
          ) : (
            <Tag color="red">
              <IntlMessages id="guide.status.rejected" />
            </Tag>
          )
      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true
      }
    ];

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.guide_calendar" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={() => this.onAddGuideCalendar()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                isShowPublishButtons={false}
                isShowCopyButton={true}
                showFilter={false}
                onFilter={this.filter}
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>

              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listGuideCalendar}
                tableLayout="auto"
                rowKey="id"
                size="small"
                pagination={{
                  pageSizeOptions: ["10", "20", "30"],
                  total: paging.count,
                  onChange: (page, pageSize) =>
                    this.onChangePage(page, pageSize),
                  showSizeChanger: true,
                  onShowSizeChange: (current, size) =>
                    this.onChangePerpage(current, size)
                }}
              />
            </RctCollapsibleCard>
          </div>
        </div>

        <AddGuideCalendar
          open={this.state.addGuideState}
          onSaveGuideCalendar={this.onSaveGuideCalendar}
          onGuideCalendarClose={this.onGuideCalendarClose}
          loading={this.state.isSubmiting}
          edit={this.state.edit}
          guideCalendar={this.state.current_calendar}
          listGuide={guides}
          listTour={listTour}
          listDestination={listDestination}
          listGit={listGit}
          listSupplier={suppliers}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    listGuideCalendar: state.guideCalendar.listGuideCalendar,
    listGuide: state.account.listAccount,
    listSupplier: state.account.listAccount,
    listAccount: state.account.listAccount,
    listTour: state.tour.listTour,
    listGit: state.git.listGit,
    listDestination: state.destination.listDestination,
    paging: state.guideCalendar.paging
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllGuideCalendar: filter => dispatch(getAllGuideCalendar(filter)),
    getAllGit: filter => dispatch(getAllGit(filter)),
    getAllGuide: (filter, data) => dispatch(getAllACCOUNT(filter, data)),
    getAllACCOUNT: (filter, data) => dispatch(getAllACCOUNT(filter, data)),
    getAllSupplier: (filter, data) => dispatch(getAllACCOUNT(filter, data)),
    getAllTour: filter => dispatch(getAllTour(filter)),
    getAllDestination: filter => dispatch(getAllDestination(filter)),
    addGuideCalendar: data => dispatch(addGuideCalendar(data)),
    updateGuideCalendar: data => dispatch(updateGuideCalendar(data)),
    delete: data => dispatch(batchDelete(data))
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListGuideCalendar)
);
