import { Rate, Table, Tag, Button } from "antd";
import "antd/dist/antd.css";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { getAllAccountWithoutPaging } from "../../../actions/AccountAction";
import { publish, unpublish } from "../../../actions/CommonActions";
import {
  batchDelete,
  changeStatus,
  createReview,
  getAllReview,
  updateReview,
} from "../../../actions/ReviewAction";
import { getAllTour, getAllProduct } from "../../../actions/TourActions";
import AvatarInTable from "../../../components/AvatarInTable";
import TableActionBar from "../../../components/TableActionBar";
import AddReview from "./AddReview.js";
import { Link } from "react-router-dom";
import Truncate from "react-truncate";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listReview: [],
      filter: {
        sort: {
          type: "desc",
          attr: "",
        },
        search: "",
        paging: {
          perpage: 10,
          page: 1,
        },
      },
      edit: false,
      isSubmiting: false,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      open: false,
      getReview: null,
      filterTour: {
        // type: {
        //   type: "=",
        //   value: 1,
        // },
        paging: 0,
      },
    };
  }

  componentDidMount() {
    this.props.getAllReview(this.state.filter, "review").then((res) => {});
    this.props.getAllRegistered(this.state.filter, "registered");
    this.props.getAllProduct(this.state.filterTour, false).then((res) => {
      console.log(res.data);
    });
  }

  onCancel() {
    this.setState({
      ...this.state,
      open: false,
    });
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

  openEditReviewModal = () => {
    this.setState({
      ...this.state,
      isEditReview: true,
    });
  };

  closeEditReviewModal = () => {
    this.setState({
      ...this.state,
      isEditReview: false,
    });
  };

  openCreateReviewModal = () => {
    this.setState({
      ...this.state,
      isCreateReview: true,
      getAirine: null,
    });
  };

  closeCreateReviewModal = () => {
    this.setState({
      ...this.state,
      isCreateReview: false,
    });
  };

  onChangeSearch(event) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          search: event.target.value,
        },
      },
      () => this.props.getAllReview(this.state.filter)
    );
  }

  onRefresh() {
    this.props.getAllReview(this.state.filter, "review");
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

  onCreateReview = () => {
    this.setState({
      open: true,
      getReview: null,
    });
  };

  onEditReview = (review) => {
    this.setState({
      open: true,
      getReview: review,
      edit: true,
    });
  };

  onReviewClose = () => {
    this.setState({
      open: false,
      getReview: null,
      edit: false,
      isSubmiting: false,
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
        () => this.props.getAllReview(this.state.filter)
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
        () => this.props.getAllReview(this.state.filter)
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
        this.props.getAllReview(this.state.filter);
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
              perpage: pageSize,
            },
          },
        },
        () => {
          this.props.getAllReview(this.state.filter);
        }
      );
    }
  }

  onSaveReview = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true,
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateReview(dataSubmit)
        .then((res) => {
          this.props.getAllReview(this.state.filter);
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getReview: null,
            edit: false,
            loading: false,
          });
        })
        .catch((err) => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            loading: false,
          });
        });
    } else {
      await this.props
        .createReview(data)
        .then((res) => {
          this.props.getAllReview(this.state.filter);
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getReview: null,
            review: null,
            edit: false,
            loading: false,
          });
        })
        .catch((err) => {
          this.setState({
            ...this.state,
            isSubmiting: false,
          });
        });
    }
  };
  setTitle(title) {
    if (title && title.length) {
      return <Truncate lines={1}>{title}</Truncate>;
    }
    return "";
  }
  render() {
    const { selectedRowKeys } = this.state;

    const { listReview, paging, config } = this.props;

    const columns = [
      {
        title: <IntlMessages id="review.avatar" />,
        render: (record) =>
          record.user_avatar ? (
            <AvatarInTable
              src={config.url_asset_root + record.user_avatar}
              defaul={record.image === "//logo3.png" ? 1 : 0}
              title={
                record.reviewer_firstname
                  ? `${record.reviewer_firstname}${record.reviewer_lastname}`
                  : `gouser`
              }
              alt={`${record.reviewer_firstname} ${record.reviewer_lastname}`}
            ></AvatarInTable>
          ) : (
            <AvatarInTable
              src={require('../../../assets/img/user.png')}
              alt={`gouser`}
              title={
                record.reviewer_firstname
                  ? `${record.reviewer_firstname}${record.reviewer_lastname}`
                  : `gouser`
              }
            ></AvatarInTable>
          ),
      },
      {
        title: <IntlMessages id="review.user_review" />,
        key: "title",
        sorter: true,
        align: "left",
        render: (record) =>
          record.reviewer_firstname || record.reviewer_lastname ? (
            <Link
              to={`/app/customer/${record.reviewer_id}`}
              style={{ color: "blue" }}
            >
              {`${record.reviewer_firstname} ${record.reviewer_lastname}`}
            </Link>
          ) : (
            "User review"
          ),
      },
      {
        title: <IntlMessages id="review.tour_name" />,
        key: "tour_name",
        render: (record) => (
          <Button type="link" className="p-0" onClick={() => this.onEditReview(record)}>
            {this.setTitle(record.tour_name)}
          </Button>
        ),
        width: 350,
        sorter: true,
      },

      {
        title: <IntlMessages id="global.status" />,
        key: "status",
        render: (record) => {
          return record.status === 0 ? (
            <Tag color="red">
              <IntlMessages id="global.unpublish" />
            </Tag>
          ) : record.status === 1 ? (
            <Tag color="green">
              <IntlMessages id="global.publish" />
            </Tag>
          ) : (
            <Tag color="blue">
              <IntlMessages id="global.pending" />
            </Tag>
          );
        },
      },
      {
        title: <IntlMessages id="review.rank" />,
        key: "rank",
        sorter: true,
        render: (record) =>
          record ? (
            <span>
              <Rate disabled value={record.rank} />
            </span>
          ) : (
            ""
          ),
      },
      {
        title: "ID",
        dataIndex: "id",
        sorter: true,
      },
    ];

    var listTourName = this.props.listProduct.map((item) => {
      return {
        id: item.id,
        title: `[${item.code}] ${item.title}`,
      };
    });

    var listAccountName = this.props.listRegistered.map((item) => {
      return {
        id: item.id,
        title: ((item.firstname
        ? `${item.firstname} ${item.lastname}`
        : item.email)
          ? item.firstname
            ? `${item.firstname} ${item.lastname}`
            : item.email
          : `${item.mobile}`
        ).split("null", 1),
      };
    });

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;
    console.log("p", paging);
    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.reviews" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-sm-12 col-md-12 col-xl-12">
              <TableActionBar
                onAdd={() => this.onCreateReview()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                isShowPublishButtons={false}
                rows={this.state.selectedRowKeys}
                table="review"
                onFilter={this.filter}
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>
              <Table
                tableLayout="auto"
                rowSelection={rowSelection}
                onChange={this.onChangTable}
                columns={columns}
                dataSource={listReview}
                size="small"
                rowKey="id"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "30"],
                  total: paging.count,
                  defaultCurrent: +paging.page,
                  pageSize: +paging.perpage,
                }}
              />
            </RctCollapsibleCard>
          </div>
        </div>

        <AddReview
          open={this.state.open}
          onSaveReview={this.onSaveReview}
          edit={this.state.edit}
          loading={this.state.isSubmiting}
          review={this.state.getReview}
          onReviewClose={this.onReviewClose}
          tourName={listTourName}
          accountName={listAccountName}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  // console.log('map state: ', state);
  return {
    listReview: state.review.listReview,
    listProduct: state.tour.listProduct,
    listRegistered: state.account.listAccountPaging,
    paging: state.review.paging,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  // console.log('dispatch: ', dispatch);
  return {
    getAllReview: (filter) => dispatch(getAllReview(filter)),
    getAllProduct: (filter) => dispatch(getAllProduct(filter)),
    getAllRegistered: (filter, type) =>
      dispatch(getAllAccountWithoutPaging(filter, type)),
    updateReview: (id) => dispatch(updateReview(id)),
    createReview: (data) => dispatch(createReview(data)),
    changeStatus: (data) => dispatch(changeStatus(data)),
    publish: (data) => dispatch(publish(data)),
    unpublish: (data) => dispatch(unpublish(data)),
    delete: (data) => dispatch(batchDelete(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(index);
