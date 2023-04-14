import { Table, Tag } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Link, withRouter } from "react-router-dom";
import config from "../../../../config";
import {
  createItem,
  deleteItem,
  getAllItems,
  updateItem,
} from "../../../actions/AmenityActions";
import { publish, unpublish } from "../../../actions/CommonActions";
// import AddReview from "./AddReview.js";
import ImageInTable from "../../../components/ImageInTable";
import StatusButton from "../../../components/StatusButton";
import TableActionBar from "../../../components/TableActionBar";
import AddAmenity from "./AddAmenity";

class Amenity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItem: [],
      filter: {
        sort: {
          type: "desc",
          attr: "",
        },
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
      item: null,
    };
  }

  componentDidMount() {
    this.props.getAllItems(this.state.filter);
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

  onChangeSearch(event) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          search: event.target.value,
        },
      },
      () => this.props.getAllItems(this.state.filter)
    );
  }

  onRefresh() {
    this.props.getAllItems(this.state.filter);
    this.setState({
      selectedRowKeys: [],
    });
  }

  onDelete() {
    this.props.deleteItem({ id: this.state.selectedRowKeys }).then(() => {
      this.setState({
        selectedRowKeys: [],
      });
    });
  }

  onCreateItem = () => {
    this.setState({
      open: true,
      item: null,
    });
  };

  onEditItem = (item) => {
    this.setState({
      open: true,
      item: item,
      edit: true,
    });
  };

  onItemClose = () => {
    this.setState({
      open: false,
      item: null,
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
        () => this.props.getAllItems(this.state.filter)
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
        () => this.props.getAllItems(this.state.filter)
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
    extra = { itemDataSource: [] }
  ) => {
    console.log(pagination);
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          sort: {
            type: this.getOrder(sorter.order),
            attr: sorter.columnKey || "",
          },
          paging: {
            perpage: pagination.pageSize,
            page: pagination.current,
          },
        },
      },
      () => {
        console.log(this.state.filter);
        this.props.getAllItems(this.state.filter);
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
          this.props.getAllItems(this.state.filter);
        }
      );
    }
  }

  setStateFalse() {
    this.setState({
      ...this.state,
      isSubmiting: false,
      open: false,
      item: null,
      edit: false,
    });
  }

  onSaveItem = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true,
    });
    if (this.state.edit) {
      try {
        var dataSubmit = { ...data, id: id };
        await this.props.updateItem(dataSubmit);
        this.setStateFalse();
      } catch (error) {
        this.setState({
          ...this.state,
          isSubmiting: false,
        });
      }
    } else {
      try {
        await this.props.createItem(data);
        this.setStateFalse();
      } catch (error) {
        this.setState({
          ...this.state,
          isSubmiting: false,
        });
      }
    }
  };

  render() {
    const { loading, selectedRowKeys } = this.state;
    const { listItem, paging, config } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: <IntlMessages id="global.amenitie" />,
        key: "title",
        dataIndex: "title",
        render: (text, record) => {
          return (
            <b
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => this.onEditItem(record)}
            >
              {record.title}
            </b>
          );
        },
      },

      {
        title: <IntlMessages id="global.icon" />,
        dataIndex: "icon",
        render: (text, record) => {
          return (
            <div className="image_logo">
              <ImageInTable
                src={record.icon != null ? config.url_asset_root + record.icon : ""}
                alt={`${record.icon != null ? record.icon : ""}_icon`}
              ></ImageInTable>
            </div>
          );
        },
      },
      {
        key: "status",
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        render: (text, record) => {
          return (
            <React.Fragment>
              {record ? (
                record.status === 1 ? (
                  <Tag color="green">
                    <IntlMessages id="global.active" />
                  </Tag>
                ) : (
                    <Tag color="red">
                      <IntlMessages id="global.deactivate" />
                    </Tag>
                  )
              ) : null}
            </React.Fragment>
          );
        },
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
            title={<IntlMessages id="sidebar.amenity" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={() => this.onCreateItem()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                table="amentity"
                // onChangTable={this.onChangTable}
                onFilter={this.filter}
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>
              <Table
                tableLayout="auto"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listItem}
                onChange={this.onChangTable}
                rowKey="id"
                size="small"
                rowClassName={this.isStyledHighlightRow}
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
        <AddAmenity
          open={this.state.open}
          edit={this.state.edit}
          item={this.state.item}
          onSaveItem={this.onSaveItem}
          onItemClose={() => this.onItemClose()}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log(state);
  return {
    listItem: state.amenity.listItem,
    paging: state.amenity.paging,
    config: state.config
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllItems: (filter) => dispatch(getAllItems(filter)),
    updateItem: (id) => dispatch(updateItem(id)),
    createItem: (data) => dispatch(createItem(data)),
    changeStatus: (data) => dispatch(changeStatus(data)),
    publish: (data) => dispatch(publish(data)),
    unpublish: (data) => dispatch(unpublish(data)),
    deleteItem: (data) => dispatch(deleteItem(data)),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Amenity)
);
