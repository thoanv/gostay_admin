import { Button, Table } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import config from "../../../../config";
import {
  addCountry,
  batchDelete,
  getAllCountry,
  updateCountry
} from "../../../actions/CountryActions";
import ImageInTable from "../../../components/ImageInTable";
import StatusButton from "../../../components/StatusButton";
import TableActionBar from "../../../components/TableActionBar";
import AddCountry from "./AddCountry";
const FLAG_IMAGE_URL = config.URL_ASSET;

class ListCountry extends Component {
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
      addCountryState: false,
      selectedRowKeys: [],
      isSubmiting: false,
      current_country: null,
      edit: false
    };
  }
  componentDidMount() {
    this.props.getAllCountry(this.state.filter);
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onAddCountry = () => {
    this.setState({
      addCountryState: true
    });
  };
  onEditCountry(country) {
    this.setState({
      addCountryState: true,
      current_country: country,
      edit: true
    });
  }
  onCountryClose = () => {
    this.setState({
      addCountryState: false,
      current_country: null,
      isSubmiting: false,
      edit: false
    });
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
      () => this.props.getAllCountry(this.state.filter)
    );
  }
  onRefresh() {
    this.props.getAllCountry(this.state.filter);
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
  onChangPage(page, pageSize) {
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
      () => {
        this.props.getAllCountry(this.state.filter);
      }
    );
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
      () => {
        this.props.getAllCountry(this.state.filter);
      }
    );
  }
  onSaveCountry = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateCountry(dataSubmit)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addCountryState: false,
            current_country: null,
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
        .createCountry(data)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            addCountryState: false,
            current_country: null,
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
      () => this.props.getAllCountry(this.state.filter)
    );
  };

  filter = (value, name, type) => {
    console.log(value);
    if (type === "search") {
      this.setState(
        {
          ...this.state,
          filter: {
            ...this.state.filter,
            search: value
          }
        },
        () => this.props.getAllCountry(this.state.filter)
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
        () => this.props.getAllCountry(this.state.filter)
      );
  };
  render() {
    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        render: (text, record) => (
          <StatusButton
            data_id={record.id}
            status={record.status}
            table="country"
          />
        )
      },
      {
        title: <IntlMessages id="country.flag" />,
        dataIndex: "flag",
        render: (text, record) => (
          <div className="image_logo">
            <ImageInTable
              src={FLAG_IMAGE_URL + "/flags/" + record.flag}
              alt={`${record.flag}_logo`}
            ></ImageInTable>
          </div>
        )
      },
      {
        title: <IntlMessages id="country.name" />,
        dataIndex: "title",
        key: "title",
        sorter: true,
        render: (text, record) => (
          <Button
            style={{ padding: 0 }}
            type="link"
            onClick={() => this.onEditCountry(record)}
          >
            {record.title}
          </Button>
        )
      },
      {
        title: <IntlMessages id="country.code" />,
        dataIndex: "code",
        key: "code",
        sorter: true
      },
      {
        title: <IntlMessages id="country.phone_code" />,
        dataIndex: "phone_code",
        key: "phone_code",
        sorter: true
      },
      {
        title: <IntlMessages id="global.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true
      }
    ];
    const { listCountry, paging } = this.props;

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.country" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={false}
                isShowAddButton={false}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                isShowPublishButtons={false}
                isShowDeleteButton={false}
                table="country"
                showFilter={false}
                onFilter={this.filter}
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listCountry}
                tableLayout="auto"
                rowKey="id"
                size="small"
                pagination={{
                  pageSizeOptions: ["10", "20", "30"],
                  total: paging.count,
                  onChange: (page, pageSize) =>
                    this.onChangPage(page, pageSize),
                  showSizeChanger: true,
                  onShowSizeChange: (current, size) =>
                    this.onChangePerpage(current, size)
                }}
                // onChange={this.onChangeTable}
              />
            </RctCollapsibleCard>
          </div>
        </div>
        <AddCountry
          open={this.state.addCountryState}
          onSaveCountry={this.onSaveCountry}
          loading={this.state.isSubmiting}
          edit={this.state.edit}
          country={this.state.current_country}
          onCountryClose={this.onCountryClose}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    listCountry: state.country.listCountry,
    paging: state.country.paging
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllCountry: filter => dispatch(getAllCountry(filter)),
    delete: data => dispatch(batchDelete(data)),
    createCountry: country => dispatch(addCountry(country)),
    updateCountry: country => dispatch(updateCountry(country))
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListCountry)
);
