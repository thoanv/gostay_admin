import React, { Component } from "react";
import {
  getAllCategory,
  getAllParent,
  batchDelete,
  createACategory,
  updateCategory
} from "../../../actions/CategoryActions";
import {
  changeStatus,
  publish,
  unpublish
} from "../../../actions/CommonActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";

import {
  Table,
  Icon,
} from "antd";
import TableActionBar from "../../../components/TableActionBar";
import StatusButton from "../../../components/StatusButton";
import AddCategory from "./AddCategory";

class ListCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCategory: [],
      filter: {
        sort: {
          type: "desc",
          attr: ""
        },

        title: {
          type: "like",
          value: ""
        },

        search: "",
        paging: {
          perpage: 10,
          page: 1
        }
      },
      isCreateCategory: false,
      isEditCategory: false,
      selectedRowKeys: [],
      addCategoryState: false,
      isSubmiting: false,
      current_category: null,
      edit: false
    };
  }
  componentDidMount() {
    this.props.getAllCategory(this.state.filter, {paging: true}).then(res => { });
    // this.props.getAllParent(this.props.listCategory.map(item => item.parent_id===0));
  }
  showCategory(listCategory) {
    if (listCategory.length) {
      return listCategory.map((item, index) => {
        return null;
      });
    }
  }

  handleChangePage(page, pageSize) {
    if (page != this.state.filter.paging.page || (pageSize != this.state.filter.paging.perpage && pageSize)) {
      this.setState({
        ...this.state,
        filter: {
          ...this.state.filter,
          paging: {
            ...this.state.filter.paging,
            page: page,
            perpage: pageSize
          }
        }
      }, () => {
        this.props.getAllCategory(this.state.filter);
      });
    }
  }

  closeCreateCustomerModal() {
    this.setState({
      ...this.state,
      isCreateCategory: false
    });
  }
  openCreateCategoryModal() {
    this.setState({
      ...this.state,
      isCreateCategory: true
    });
  }
  closeEditCustomerModal() {
    this.setState({
      ...this.state,
      isEditCategory: false
    });
  }
  openEditCategoryModal() {
    this.setState({
      ...this.state,
      isEditCategory: true
    });
  }
  onChangeSearch(event) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          search: event.target.value
        }
      },
      () => this.props.getAllCategory(this.state.filter)
    );
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

  onRefresh() {
    this.props.getAllCategory(this.state.filter, "category");
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
        () => this.props.getAllCategory(this.state.filter)
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
        () => this.props.getAllCategory(this.state.filter)
      );
  };

  getOrder(order) {
    if (order === "ascend") return "asc";
    if (order === "descend") return "desc";
    return "desc";
  }

  // onChangTable = (
  //   pagination,
  //   filters,
  //   sorter,
  //   extra = { currentDataSource: [] }
  // ) => {
  //   this.setState(
  //     {
  //       ...this.state,
  //       filter: {
  //         ...this.state.filter,
  //         sort: {
  //           type: this.getOrder(sorter.order),
  //           attr: sorter.columnKey
  //         },
  //         paging: {
  //           perpage: pagination.pageSize,
  //           page: pagination.curent 
  //         }
  //       }
  //     },
  //     () => {
  //       console.log(this.state.filter);
  //       this.props.getAllCategory(this.state.filter);
  //     }
  //   );
  // };


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
        this.props.getAllCategory(this.state.filter);
      }
    );
  };

  onAddCategory = () => {
    this.setState({
      addCategoryState: true
    });
  };
  onEditCategory(category) {
    this.setState({
      addCategoryState: true,
      current_category: category,
      edit: true
    });
  }
  onCategoryClose = () => {
    this.setState({
      addCategoryState: false,
      current_category: null,
      isSubmiting: false,
      edit: false
    });
  };

  onSaveCategory = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateCategory(dataSubmit)
        .then(res => {
          // this.props.getAllCategory(this.state.filter);
          this.setState({
            ...this.state,
            isSubmiting: false,
            addCategoryState: false,
            current_category: null,
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
      if (!data.parent_id) data.parent_id = 0;
      await this.props
        .createCategory(data)
        .then(res => {
          // this.props.getAllCategory(this.state.filter);
          this.setState({
            ...this.state,
            isSubmiting: false,
            addCategoryState: false,
            current_category: null,
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

    const { selectedRowKeys } = this.state;

    const { listCategory, paging } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const hasSelected = selectedRowKeys.length > 0;


    const columns = [
      {
        title: <IntlMessages id="global.status" />,
        dataIndex: "status",
        key: "status"
      },
      {
        title: <IntlMessages id="global.title" />,
        dataIndex: "title",
        key: "title"
      },
      {
        title: <IntlMessages id="global.type" />,
        dataIndex: "type",
        key: "type"
      },
      {
        title: <IntlMessages id="category.id" />,
        dataIndex: "id",
        key: "id",
        sorter: true
      }
    ];

    // console.log(this.props.getAllCategory(this.setState({
    //   filter: {paging: 0}
    // })));
    
    // var parent = this.props.listParent.filter(item => {
    //   return item.parent_id === 0;
    // });

    // console.log('pr',this.props.listParent);
    
    // var parent = this.props.listParent.map(item => {
    //   console.log(item.parent_id === 0 ? item.parent_id : '');
      
    //   return ({
    //     id: item.id,
    //     title: item.parent_id === 0
    //   })
    // })

    // var listParent = this.props.listCategory.map(item => {
    //   return ({
    //     id: item.id,
    //     title: item.parent_id === 0 ? item.title : null
    //   })
    // })

    var data = this.props.listCategory.map(item => {
      return {
        ...item,
        title: (
          <div style={{ textAlign: "left" }}>
            <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.onEditCategory(item)}>
              {item.parent_id !== 0 ? (
                <div style={{ paddingLeft: "10px" }}>
                  <Icon type="enter" style={{ paddingRight: "5px", transform: 'scaleX(-1)' }} />
                  <span>{item.title}</span>
                </div>
              ) : (
                  item.title
                )}
            </span>
          </div>
        ),
        status: (
          <StatusButton
            data_id={item.id}
            status={item.status}
            table="category"
          />
        )
      };
    });

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.category" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <div className="mb-20">
                <div className="">
                  <TableActionBar
                    onAdd={() => this.onAddCategory()}
                    onDelete={() => this.onDelete()}
                    onRefresh={() => this.onRefresh()}
                    isDisabled={!hasSelected}
                    rows={this.state.selectedRowKeys}
                    isShowPublishButtons={true}
                    table="category"
                    onFilter={this.filter}
                  >
                    {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                  </TableActionBar>
                </div>
                <Table
                  tableLayout="auto"
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={data}
                  size='middle'
                  rowKey="id"
                  onChange={this.onChangTable}
                  pagination={{
                    total: paging.count,
                    defaultCurrent: +paging.page,
                    pageSize: +paging.perpage,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "30"],
                  }}
                />
              </div>
              <AddCategory
                open={this.state.addCategoryState}
                onSaveCategory={this.onSaveCategory}
                loading={this.state.isSubmiting}
                edit={this.state.edit}
                category={this.state.current_category}
                onCategoryClose={this.onCategoryClose}
                // categories={listParent}
              />
            </RctCollapsibleCard>
          </div>
        </div>

      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    listCategory: state.category.listCategory,
    listParent: state.category.listParent,
    paging: state.category.paging
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllCategory: filter => dispatch(getAllCategory(filter)),
    // getAllParent: parent_id => dispatch(getAllParent(parent_id)),
    changeStatus: data => dispatch(changeStatus(data)),
    publish: data => dispatch(publish(data)),
    unpublish: data => dispatch(unpublish(data)),
    delete: data => dispatch(batchDelete(data)),
    createCategory: category => dispatch(createACategory(category)),
    updateCategory: category => dispatch(updateCategory(category))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ListCategory)
);
