import { Table, Tag, Button, Form } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Link, withRouter } from "react-router-dom";
import {
  createItem,
  deleteItem,
  getAllItems,
  updateItem,
} from "../../../actions/RestaurantActions";
import { getAllCountry } from "../../../actions/CountryActions";
import ImageInTable from "../../../components/ImageInTable";
import TableActionBar from "../../../components/TableActionBar";
import AddRestaurant from "./AddRestaurant";
import BaseSelect from "Components/Elements/BaseSelect";

class Restaurant extends Component {
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
      filterCountry: { paging: 0 },
      isOpenFilter: false,
    };
    this.columns = [
      {
        title: <IntlMessages id="global.title" />,
        key: "title",
        dataIndex: "title",
        render: (text, record) => {
          return (
            <Button type="link" className="p-0" onClick={() => this.onEditItem(record)}>
              {record.title}
            </Button>
          );
        },
      },

      {
        title: <IntlMessages id="global.image" />,
        dataIndex: "image",
        key: "image",
        render: (text, record) => {
          return (
            <div className="image_logo">
              <ImageInTable
                src={
                  record.image.length  ? this.props.config.url_asset_root + record.image : require('../../../assets/img/restaurant.png')
                }
                alt={`${record.image.length ? record.image : ""}_image`}
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
                    <IntlMessages id="global.published" />
                  </Tag>
                ) : (
                    <Tag color="red">
                      <IntlMessages id="global.unpublished" />
                    </Tag>
                  )
              ) : null}
            </React.Fragment>
          );
        },
      },
      {
        title: <IntlMessages id="global.country" />,
        dataIndex: "country_name",
        key: "country",
      },
      {
        title: <IntlMessages id="global.address" />,
        dataIndex: "address",
        key: "address",
      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true,
      },
    ];
  }

  componentDidMount() {
    this.props.getAllItems(this.state.filter);
    this.props.getAllCountry(this.state.filterCountry);
  }

  toggleFilter() {
    this.setState({
      isOpenFilter: !this.state.isOpenFilter,
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

  onChangTable = async (
    pagination,
    filters,
    sorter,
    extra = { itemDataSource: [] }
  ) => {
    await this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        sort: {
          type: this.getOrder(sorter.order),
          attr: sorter.columnKey || "",
        },
        paging: {
          perpage: +pagination.pageSize,
          page: +pagination.current,
        },
      },
    });
    console.log(this.state.filter);
    await this.props.getAllItems(this.state.filter);
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
    const { loading, selectedRowKeys, isOpenFilter } = this.state;
    const { listItem, countries, paging, config } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const statusFilter = [
      { id: 0, title: "Deactivated" },
      { id: 1, title: "Active" },
    ];

    const orderFilter = [
      { id: 0, title: "Deactivated" },
      { id: 1, title: "Active" },
    ];

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.restaurant" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              {/* <div style={{ display: "inline-block", width: "98%" }}> */}
              <TableActionBar
                onAdd={() => this.onCreateItem()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                table="restaurant"
                onFilter={this.filter}
                data={[
                  {
                    name: "country_id",
                    data: countries,
                    placeholder: "Select country",
                  },
                  {
                    name: "status",
                    data: statusFilter,
                    placeholder: "Select status",
                  },
                  {
                    name: "ordering",
                    data: orderFilter,
                    placeholder: "Select order",
                  },
                ]}
                justify="end"
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>
              {/* </div> */}
              {/* <div style={{ float: "right", lineHeight: "60px" }}>
                <Icon
                  type="filter"
                  style={
                    isOpenFilter
                      ? { color: "blue", fontSize: 20 }
                      : { color: "rgba(0,0,0,.25)", fontSize: 20 }
                  }
                  onClick={() => this.toggleFilter()}
                />
              </div>
              {isOpenFilter ? (
                <Form
                  layout="inline"
                  onSubmit={this.handleSubmit}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Form.Item>
                    <BaseSelect
                      showSearch
                      options={countries}
                      defaultText="Select country"
                      optionValue="id"
                      onChange={(value) => this.filter("country_id", value)}
                      style={{ width: "200px" }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <BaseSelect
                      showSearch
                      options={statusFilter}
                      defaultText="Select status"
                      optionValue="id"
                      onChange={(value) => this.filter("status", value)}
                      style={{ width: "200px" }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <BaseSelect
                      showSearch
                      options={orderFilter}
                      defaultText="Select order"
                      optionValue="id"
                      onChange={(value) => this.filter("ordering", value)}
                      style={{ width: "200px" }}
                    />
                  </Form.Item>
                </Form>
              ) : null} */}
              <Table
                tableLayout="auto"
                rowSelection={rowSelection}
                columns={this.columns}
                dataSource={listItem}
                onChange={this.onChangTable}
                rowKey="id"
                size="small"
                rowClassName={this.isStyledHighlightRow}
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "30"],
                  total: +paging.count,
                  defaultCurrent: +paging.page,
                  pageSize: +paging.perpage,
                }}
              />
            </RctCollapsibleCard>
          </div>
        </div>
        <AddRestaurant
          open={this.state.open}
          edit={this.state.edit}
          item={this.state.item}
          countries={countries}
          onSaveItem={this.onSaveItem}
          onItemClose={() => this.onItemClose()}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listItem: state.restaurant.listItem,
    countries: state.country.listCountry,
    paging: state.restaurant.paging,
    config: state.config
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllItems: (filter) => dispatch(getAllItems(filter)),
    updateItem: (id) => dispatch(updateItem(id)),
    createItem: (data) => dispatch(createItem(data)),
    deleteItem: (data) => dispatch(deleteItem(data)),
    getAllCountry: (filter) => dispatch(getAllCountry(filter)),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Restaurant)
);
