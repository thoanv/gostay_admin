import React, { Component } from 'react'
import { getAllWishlistLog } from '../../actions/WishlistActions';
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import TableActionBar from '../../components/TableActionBar';
import IntlMessages from "Util/IntlMessages";
import { Table } from 'antd';
import moment from 'moment';
class Logs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      filterAccount: {
        paging: 0
      },
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
      },
      selectedRowKeys: [],
    };
    this.columns = [
      {
        title: <IntlMessages id="global.user" />,
        key: "title",
        dataIndex: "title",
        render: (text, record) => (
          <b> {(record.firstname || record.lastname) ? (record.firstname + " " + record.lastname) : (record.email || record.phone)} </b>
        ),
      },


      {
        title: <IntlMessages id="global.type_product" />,
        dataIndex: "product",
        render: (text, record) => {
          return (
            <a>
              {record.object.title}
            </a>
          );
        },
      },
      {
        title: <IntlMessages id="global.time" />,
        dataIndex: "w_time",
        key: "created_at",
        className: "center-column",
        render: (text, record) => (
          <React.Fragment>
            <div>{moment(record.w_time).format("DD/MM/YYYY, HH:mm")}</div>
          </React.Fragment>
        ),
        sorter: true
      },


    ];

  }

  componentDidMount() {
    this.props._getAll(this.state.filter)
  }
  onShowSizeChange = (current, pageSize) => {
    console.log('pageSize', pageSize);
    this.setState(
      {
        filter: {
          ...this.state.filter,

          paging: {
            perpage: pageSize,
            page: current,
          },
        },
      },
      () => this.props._getAll(this.state.filter)
    );
  }

  getOrder(order) {
    if (order === "ascend") return "asc";
    if (order === "descend") return "desc";
    return "desc";
  }
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
        async () => {
          await this.props._getAll(this.state.filter);
          this.setState({
            ...this.state,

          })
        }
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
        async () => {
          await this.props._getAll(this.state.filter);
          this.setState({
            ...this.state,

          })
        }
      );
  };
  onChangTable = (
    pagination,
    filters,
    sorter,
    extra = { itemDataSource: [] }
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

      async () => {
        await this.props._getAll(this.state.filter);
        this.setState({
          ...this.state,

        })

      }
    );
  };
  render() {
    const { list, paging } = this.props

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.wishlist.logs" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                isShowAddButton={false}
                isShowPublishButtons={false}
                isShowCopyButton={false}
                isShowDeleteButton={false}
                table="logs"
                onFilter={this.filter}
              >

              </TableActionBar>
              <Table
                tableLayout="auto"
                columns={this.columns}
                dataSource={list}
                onChange={this.onChangTable}
                rowKey="w_id"
                size="small"

                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ["1", "5", "10", "20", "30"],
                  total: +paging.count,
                  defaultCurrent: +paging.page,
                  pageSize: +paging.perpage,
                }}
              />
            </RctCollapsibleCard>
          </div>
        </div>

      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.wishlist.listlog.list,
    paging: state.wishlist.listlog.paging,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    _getAll: (filter) => dispatch(getAllWishlistLog(filter)),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Logs)
);