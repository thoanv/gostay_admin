import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getAllAirlines,
  updateAirline,
  createAirline,
  batchDelete,
  changeStatus
} from "../../../actions/AirlineActions";
import { publish, unpublish } from "../../../actions/CommonActions";

import IntlMessages from "Util/IntlMessages";
// import FormCreateAirline from "./FormCreateAirline";
import {
  Table,
  Input,
  Tag,
} from "antd";
import "antd/dist/antd.css";
import TableActionBar from "../../../components/TableActionBar";
import StatusButton from "../../../components/StatusButton";
import AddAirline from "./AddAirline";
import ImageInTable from "../../../components/ImageInTable";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listAirlines: [],
      filter: {
        sort: {
          type: "desc",
          attr: "",
      },
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
      getAirine: null
    };
  }

  componentDidMount() {
    this.props.getAllAirlines(this.state.filter);
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

  openEditAirlineModal = () => {
    this.setState({
      ...this.state,
      isEditAirline: true
    });
  };

  closeEditAirlineModal = () => {
    this.setState({
      ...this.state,
      isEditAirline: false
    });
  };

  openCreateAirlineModal = () => {
    this.setState({
      ...this.state,
      isCreateAirline: true,
      getAirine: null
    });
  };

  closeCreateAirlineModal = () => {
    this.setState({
      ...this.state,
      isCreateAirline: false
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
      () => this.props.getAllAirlines(this.state.filter)
    );
  }

  onRefresh() {
    this.props.getAllAirlines(this.state.filter, "airline");
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

  onCreateAirline = () => {
    this.setState({
      open: true,
      getAirine: null
    });
  };

  onEditAirline = airline => {
    this.setState({
      open: true,
      getAirine: airline,
      edit: true
    });
  };

  onAirlineClose = () => {
    this.setState({
      open: false,
      getAirine: null,
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
        () => this.props.getAllAirlines(this.state.filter)
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
        () => this.props.getAllAirlines(this.state.filter)
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
        this.props.getAllAirlines(this.state.filter);
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
          this.props.getAllAirlines(this.state.filter);
        }
      );
    }
  }

  onSaveAirline = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateAirline(dataSubmit)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getAirine: null,
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
        .createAirline(data)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getAirine: null,
            airline: null,
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

    const { listAirlines, paging, config } = this.props;

    const columns = [
      {
        title: <IntlMessages id="global.title" />,
        dataIndex: "title",
        key: "title",
        sorter: true
      },
      {
        title: <IntlMessages id="global.short_title" />,
        dataIndex: "short_title",
        key: "short_title"
      },
      {
        title: <IntlMessages id="global.logo" />,
        dataIndex: "logo",
        key: "logo"
      },
      {
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        key: "status",
        align: 'center'
      },
      // {
      //   title: <IntlMessages id="airline.signed" />,
      //   dataIndex: "signed",
      //   key: "signed"
      // },
      {
        title: <IntlMessages id="airline.code" />,
        dataIndex: "code",
        key: "code",
        sorter: true
      },
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter: true
      }
    ];

    var data = this.props.listAirlines.map(item => {
      return {
        ...item,
        title: (
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.onEditAirline(item)}>
            {item.title}
          </span>
        ),
        logo: item.logo ? (
          <div className='image'>
            <ImageInTable src={config.url_asset_root + item.logo} style={{ width: "100%", height: "auto" }}></ImageInTable>
          </div>
        ) : null,
        status: (
          <React.Fragment>
            {
              <StatusButton
                data_id={item.id}
                status={item.status}
                table="airline"
              />
            }
          </React.Fragment>
        ),
        signed: (
          <div>
            {item.signed === 1 ? (
              <Tag color="green">
                <IntlMessages id="airline.signed.yes" />
              </Tag>
            ) : (
                <Tag color="red">
                  <IntlMessages id="airline.signed.no" />
                </Tag>
              )}
          </div>
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
            title={<IntlMessages id="sidebar.airlines" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={() => this.onCreateAirline()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                table="airline"
                onFilter={this.filter}

                // data={[
                //   {
                //     name: "signed",
                //     data: [
                //       {
                //         id: 1,
                //         title: (
                //           <IntlMessages id="airline.signed.yes" />
                //         )
                //       },
                //       {
                //         id: 0,
                //         title: <IntlMessages id="airline.signed.no" />
                //       }
                //     ],
                //     placeholder: "Select signature..."
                //   },
                //   {
                //     name: "status",
                //     data: [
                //       {
                //         id: 0,
                //         title: <IntlMessages id="global.unpublic" />
                //       },
                //       {
                //         id: 1,
                //         title: <IntlMessages id="global.public" />
                //       }
                //     ],
                //     placeholder: "Select status..."
                //   }
                // ]}
                // justify="end"
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

        <AddAirline
          open={this.state.open}
          onSaveAirline={this.onSaveAirline}
          edit={this.state.edit}
          loading={this.state.isSubmiting}
          airline={this.state.getAirine}
          onAirlineClose={this.onAirlineClose}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    listAirlines: state.airline.listAirlines,
    paging: state.airline.paging,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllAirlines: listAirlines => dispatch(getAllAirlines(listAirlines)),
    updateAirline: id => dispatch(updateAirline(id)),
    createAirline: data => dispatch(createAirline(data)),
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
