import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { publish, unpublish } from "../../../actions/CommonActions";
import {getAllOffice, updateOffice, createOffice, batchDelete} from "../../../actions/OfficeAction";
import IntlMessages from "Util/IntlMessages";
import {
  Table,
  Input,
  Tag,
} from "antd";
import "antd/dist/antd.css";
import TableActionBar from "../../../components/TableActionBar";
import StatusButton from "../../../components/StatusButton";
import ImageInTable from "../../../components/ImageInTable";
import AddOffice from "./AddOffice";
import { getAllCountry } from "../../../actions/CountryActions";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOffice: [],
      filter: {
        search: "",
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
      getOffice: null,
      filterCountry: {paging: 0}
    };
  }

  componentDidMount() {
    this.props.getAllOffice(this.state.filter);
    this.props.getAllCountry(this.state.filterCountry)
    // .then(res => {
    //     let countries = res.data.list.map(item => {
    //         return {
    //             id: item.id,
    //             title: item.title
    //         }
    //     });
    //     this.setState({
    //         countries: countries
    //     })
    //     }
    // );
  }

  onCancel() {
    this.setState({
      ...this.state,
      open: false
    });
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
      () => this.props.getAllOffice(this.state.filter)
    );
  }

  onRefresh() {
    this.props.getAllOffice(this.state.filter, "office");
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

  onCreateOffice = () => {
    this.setState({
      open: true,
      getOffice: null
    });
  };

  onEditOffice = office => {
    this.setState({
      open: true,
      getOffice: office,
      edit: true
    });
  };

  onOfficeClose = () => {
    this.setState({
      open: false,
      getOffice: null,
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
        () => this.props.getAllOffice(this.state.filter)
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
        () => this.props.getAllOffice(this.state.filter)
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
        console.log(this.state.filter);
        this.props.getAllOffice(this.state.filter);
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
          this.props.getAllOffice(this.state.filter);
        }
      );
    }
  }

  onSaveOffice = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateOffice(dataSubmit)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getOffice: null,
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
        .createOffice(data)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getOffice: null,
            office: null,
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
    const { loading, selectedRowKeys,  } = this.state;
    const { Search } = Input;
    const style = {
        color: 'blue',
        cursor: 'pointer'
    }
    const { listOffice, paging, listCountry } = this.props;

    const country = listCountry ? listCountry.map(item => {
        return {
            id: item.id,
            title: item.title
        }
    }) : ''

    const columns = [
      {
        title: <IntlMessages id="global.title" />,
        key: "title",
        render: record => {
            return <span style={style} onClick={() => this.onEditOffice(record)}>
                {record.title}
            </span>
        }
      },
      {
        title: <IntlMessages id="global.status" />,
        key: "status",
        render: record => {
            return (
              <React.Fragment>
                {record ? (
                  <StatusButton
                    data_id={record.id}
                    status={record.status}
                    table="office"
                  />
                ) : null}
              </React.Fragment>
            );
          }
      },
      {
        title: <IntlMessages id="global.address" />,
        dataIndex: "address",
        key: "address"
      },
      {
        title: <IntlMessages id="global.phone" />,
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: <IntlMessages id="global.country" />,
        dataIndex: "country_txt",
        key: "country",
        sorter: true
      },
      {
        title: <IntlMessages id="global.tax_code" />,
        dataIndex: "tax_code",
        key: "tax_code"
      },
      {
        title: "ID",
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
            title={<IntlMessages id="sidebar.office" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={() => this.onCreateOffice()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                table="office"
                onFilter={this.filter}
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>
              <Table
                tableLayout="auto"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listOffice}
                onChange={this.onChangTable}
                rowKey="id"
                size="small"
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
        <AddOffice
          open={this.state.open}
          edit={this.state.edit}
          office={this.state.getOffice}
          onSaveOffice={this.onSaveOffice}
          onOfficeClose={() => this.onOfficeClose()}
          countries={country}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    listOffice: state.office.listOffice,
    listCountry: state.country.listCountry,
    paging: state.office.paging
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllOffice: filter => dispatch(getAllOffice(filter)),
    getAllCountry: filter => dispatch(getAllCountry(filter)),
    createOffice: data => dispatch(createOffice(data)),
    updateOffice: id => dispatch(updateOffice(id)),
    delete: data => dispatch(batchDelete(data)),
    publish: data => dispatch(publish(data)),
    unpublish: data => dispatch(unpublish(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(index);
