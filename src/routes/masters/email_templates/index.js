import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getAllEmail,
  updateEmail,
  createEmail,
  batchDelete,
  changeStatus
} from "../../../actions/Email_templatesActions";
import { publish, unpublish } from "../../../actions/CommonActions";

import IntlMessages from "Util/IntlMessages";
// import FormCreateEmail from "./FormCreateEmail";
import {
  Table,
  Input,
  Tag,
  Button,
} from "antd";
import TableActionBar from "../../../components/TableActionBar";
import StatusButton from "../../../components/StatusButton";
import AddEmail from "./AddEmail";
import { PreviewEmail } from "./Preview";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listEmail: [],
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
      getEmail: null,
      currentItem: null
    };
  }

  componentDidMount() {
    this.props.getAllEmail(this.state.filter);
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

  onChangeSearch(event) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          search: event.target.value
        }
      },
      () => this.props.getAllEmail(this.state.filter)
    );
  }

  onRefresh() {
    this.props.getAllEmail(this.state.filter, "message_tmpl");
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

  onCreateEmail = () => {
    this.setState({
      open: true,
      getEmail: null
    });
  };

  onEditEmail = email_template => {
    this.setState({
      open: true,
      getEmail: email_template,
      edit: true
    });
  };

  onEmailClose = () => {
    this.setState({
      open: false,
      getEmail: null,
      edit: false,
      isSubmiting: false
    });
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
            page: pagination.current
          }
        }
      },
      () => {
        console.log(this.state.filter.sort.type);
        this.props.getAllEmail(this.state.filter);
      }
    );
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
        () => this.props.getAllEmail(this.state.filter)
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
        () => this.props.getAllEmail(this.state.filter)
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
          this.props.getAllEmail(this.state.filter);
        }
      );
    }
  }

  onSaveEmail = async (data, id) => {
    await this.setState({
      ...this.state,
      isSubmiting: true
    });
    if (this.state.edit) {
      var dataSubmit = { ...data, id: id };
      await this.props
        .updateEmail(dataSubmit)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getEmail: null,
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
        .createEmail(data)
        .then(res => {
          this.setState({
            ...this.state,
            isSubmiting: false,
            open: false,
            getEmail: null,
            email_template: null,
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

    const { listEmail, paging } = this.props;

    const columns = [
      {
        title: <IntlMessages id="email_template.code" />,
        dataIndex: "code",
        key: "code"
      },
      {
        title: <IntlMessages id="email_template.title" />,
        dataIndex: "title",
        key: "title",
        sorter: true
      },
      {
        title: <IntlMessages id="email_template.subject" />,
        dataIndex: "customer_subject",
        key: "customer_subject",
      },

      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter: true
      },

      {
        title: "Hành động",
        render: (text, record) => (
          <Button onClick={() => this.setState({ ...this.state, currentItem: record })}>Xem trước</Button>
        )
      }
    ];

    var data = this.props.listEmail.map(item => {
      return {
        ...item,
        title: (
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.onEditEmail(item)}>
            {item.title}
          </span>
        ),
        status: (
          <React.Fragment>
            {
              <StatusButton
                data_id={item.id}
                status={item.status}
                table="message_tmpl"
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
            title={<IntlMessages id="sidebar.email_template" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <TableActionBar
                onAdd={() => this.onCreateEmail()}
                onDelete={() => this.onDelete()}
                onRefresh={() => this.onRefresh()}
                isDisabled={!hasSelected}
                rows={this.state.selectedRowKeys}
                table="message_tmpl"
                isShowPublishButtons={false}
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

        <AddEmail
          open={this.state.open}
          onSaveEmail={this.onSaveEmail}
          edit={this.state.edit}
          loading={this.state.isSubmiting}
          email_template={this.state.getEmail}
          onEmailClose={this.onEmailClose}
        />

        <PreviewEmail
          data={this.state.currentItem}
          onEmailClose={() => this.setState({ ...this.state, currentItem: null })}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    listEmail: state.email_template.listEmail,
    paging: state.email_template.paging
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllEmail: listEmail => dispatch(getAllEmail(listEmail)),
    updateEmail: id => dispatch(updateEmail(id)),
    createEmail: data => dispatch(createEmail(data)),
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
