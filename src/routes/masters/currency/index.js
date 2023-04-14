// import FormCreateCurrency from "./FormCreateCurrency";
import { Input, Table } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { publish, unpublish } from "../../../actions/CommonActions";
import { batchDelete, changeStatus, createCurrency, getAllCurrency, updateCurrency } from "../../../actions/CurrencyAction";
import StatusButton from "../../../components/StatusButton";
import TableActionBar from "../../../components/TableActionBar";
import AddCurrency from "./AddCurrency";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCurrency: [],
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
      getCurrency: null
    };
  }

  componentDidMount() {
    this.props.getAllCurrency(this.state.filter);
    console.log("life circle: ", this);
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

  openEditCurrencyModal = () => {
    this.setState({
      ...this.state,
      isEditCurrency: true
    });
  };

  closeEditCurrencyModal = () => {
    this.setState({
      ...this.state,
      isEditCurrency: false
    });
  };

  openCreateCurrencyModal = () => {
    this.setState({
      ...this.state,
      isCreateCurrency: true,
      getCurrency: null
    });
  };

  closeCreateCurrencyModal = () => {
    this.setState({
      ...this.state,
      isCreateCurrency: false
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
      () => this.props.getAllCurrency(this.state.filter)
    );
  }

  onRefresh() {
    this.props.getAllCurrency(this.state.filter, "currency");
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

  onCreateCurrency = () => {
    this.setState({
      open: true,
      getCurrency: null
    });
  };

  onEditCurrency = currency => {
    this.setState({
      open: true,
      getCurrency: currency,
      edit: true
    });
  };

  onCurrencyClose = () => {
    this.setState({
      open: false,
      getCurrency: null,
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
        () => this.props.getAllCurrency(this.state.filter)
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
        () => this.props.getAllCurrency(this.state.filter)
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
        this.props.getAllCurrency(this.state.filter);
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
          this.props.getAllCurrency(this.state.filter);
        }
      );
    }
  }

  onSaveCurrency = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateCurrency(dataSubmit)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getCurrency: null,
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
        .createCurrency(data)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getCurrency: null,
            currency: null,
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
    const { Search } = Input;

    const { listCurrency, paging } = this.props;

    const columns = [
      {
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        key: "status"
      },
      {
        title: <IntlMessages id="currency.title" />,
        dataIndex: "title",
        key: "title"
      },
      {
        title: <IntlMessages id="currency.name" />,
        dataIndex: "name",
        key: "name"
      },
      {
        title: <IntlMessages id="currency.exchange" />,
        dataIndex: "exchange_rate",
        key: "exchange_rate",
        sorter: true
      },
      {
        title: <IntlMessages id="currency.symbol" />,
        dataIndex: "symbol",
        key: "symbol"
      },
      {
        title: <IntlMessages id="currency.thousand" />,
        dataIndex: "thousand",
        key: "thousand"
      },
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter: true
      }
    ];

    var data = this.props.listCurrency.map(item => {
      return {
        ...item,
        title: (
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.onEditCurrency(item)}>
            {item.title}
          </span>
        ),
        status: (
          <React.Fragment>
            {
              <StatusButton
                data_id={item.id}
                status={item.status}
                table="currency"
              />
            }
          </React.Fragment>
        )
      };
    });

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const hasSelected = selectedRowKeys.length > 0;


    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.currency" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={() => this.onCreateCurrency()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                table="currency"
                onFilter={this.filter}
              >
                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
              </TableActionBar>
              <Table
                tableLayout="auto"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
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

        <AddCurrency
          open={this.state.open}
          onSaveCurrency={this.onSaveCurrency}
          edit={this.state.edit}
          loading={this.state.isSubmiting}
          currency={this.state.getCurrency}
          onCurrencyClose={this.onCurrencyClose}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    listCurrency: state.currency.listCurrency,
    paging: state.currency.paging
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllCurrency: listCurrency => dispatch(getAllCurrency(listCurrency)),
    updateCurrency: id => dispatch(updateCurrency(id)),
    createCurrency: data => dispatch(createCurrency(data)),
    changeStatus: data => dispatch(changeStatus(data)),
    publish: data => dispatch(publish(data)),
    unpublish: data => dispatch(unpublish(data)),
    delete: data => dispatch(batchDelete(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(index);
