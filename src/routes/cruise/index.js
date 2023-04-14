import { Table, Tag } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { getAllCruise } from "../../actions/CruiseActions";

class Cruise extends Component {
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
      selectedRowKeys: [],
      open: false,
    };
  }

  componentDidMount() {
    this.props.getAllCruise(this.state.filter);
  }

  onFilter(name, value) {
    if (name == "depart") {
      if (value) {
        value = value.toISOString().substr(0, 10);

        this.setState({
          filter: {
            ...this.state.filter,
            [name]: {
              type: "=",
              value: value,
            },
          },
        });
      } else {
        this.setState(
          {
            filter: {
              ...this.state.filter,
              [name]: {},
            },
          },
          () => this.props.getAllOrderTour(this.state.filter)
        );
      }
    } else {
      this.setState({
        filter: {
          ...this.state.filter,
          [name]: {
            type: "=",
            value: value,
          },
        },
      });
    }
    setTimeout(() => {
      this.props.getAllCruise(this.state.filter);
    }, 300);
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
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
        this.props.getAllCruise(this.state.filter);
      }
    );
  };

  render() {
    const { selectedRowKeys } = this.state;

    const { listCruise, paging } = this.props;

    console.log(listCruise);

    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
      {
        title: <IntlMessages id="global.title" />,
        key: "title",
        render: (record) => (
          <React.Fragment>
            <div>
              <p
              // style={{ color: "blue", cursor: "pointer", margin: 0 }}
              // onClick={() => this.onEditOrderNumber(record)}
              >
                {record.title}
              </p>
            </div>
          </React.Fragment>
        ),
      },
      {
        title: <IntlMessages id="cruise.model" />,
        dataIndex: "model",
        key: "model",
      },
      {
        title: <IntlMessages id="cruise.max_crew" />,
        dataIndex: "max_crew",
        key: "max_crew",
        sorter: true,
      },
      {
        title: <IntlMessages id="cruise.max_guest" />,
        key: "max_guest",
        dataIndex: "max_guest",
        sorter: true,
      },
      {
        title: <IntlMessages id="cruise.max_speed" />,
        dataIndex: "max_speed",
        key: "max_speed",
        sorter: true,
      },
      {
        title: <IntlMessages id="cruise.build_year" />,
        dataIndex: "build_year",
        key: "build_year",
      },
      {
        title: <IntlMessages id="cruise.fuel" />,
        dataIndex: "fuel",
        key: "fuel",
      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true,
      },
    ];

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.cruise" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.onSelectChange,
                }}
                columns={columns}
                dataSource={listCruise}
                onChange={this.onChangTable}
                rowKey="id"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "30"],
                  total: paging.count,
                  defaultCurrent: +paging.page,
                  pageSize: +paging.perpage,
                }}
                size="small"
              />
            </RctCollapsibleCard>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    listCruise: state.cruise.listCruise,
    paging: state.cruise.paging,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllCruise: (filter) => dispatch(getAllCruise(filter)),
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Cruise)
);
