import { Button, Form, Select, Table } from "antd";
import BaseSelect from "Components/Elements/BaseSelect";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import {
  exportExcelCustomer,
  getCustomerByTour,
  getTourDepartDate,
} from "../../../actions/ReportActions";
import { getAllProduct } from "../../../actions/TourActions";

class Customer_Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        paging: 0,
        type: {
          type: "=",
          value: null,
        },
      },
      selectedRowKeys: [],
      open: false,
      startDate: new Date(),
      listCustomer: [],
    };
  }

  componentDidMount() {
    this.props.getAllProduct(this.state.filter);
  }

  handleChangeDate = (date) => {
    let data = { date, tour_id: this.state.tour_id };
    this.setState({
      date,
    });
    this.props.getCustomerByTour(data).then((res) => {
      console.log(res.data);
      this.setState({
        listCustomer: res.data,
      });
    });
  };

  checkValueDateArr(arrDate) {
    for (let i = 0; i < arrDate.length; i++) {
      if (this.state.date == arrDate[i].title) return true;
    }
    this.setState({
      listCustomer: [],
    });
    return false;
  }

  sortDate(arrDate) {
    return arrDate
      .map((item) => {
        return new Date(item.date);
      })
      .sort((a, b) => b - a);
  }

  onFilter(value) {
    const getType = this.props.listProduct.find((item) => {
      return value === item.id;
    });

    this.props.getTourDepartDate(value).then((res) => {
      const newDate = this.sortDate(res.data);

      const arrDate = newDate.map((item, index) => {
        return {
          id: index,
          title: moment(item).format("YYYY-MM-DD"),
        };
      });
      this.setState({
        arrDate,
        tour_id: value,
        date: this.checkValueDateArr(arrDate) ? this.state.date : "",
        type: getType.type,
      });
    });
    if (value === "") {
      this.setState({
        tour_id: null,
        arrDate: [],
        listCustomer: [],
      });
    }
  }

  onChangeColumn = (value) => {
    console.log(value);
    this.setState({
      column: value,
    });
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  exportExcel(data) {
    this.props.exportExcelCustomer(data).then((res) => window.open(res.data));
  }

  render() {
    const { column, arrDate, tour_id, listCustomer } = this.state;

    const { listProduct } = this.props;

    const date = arrDate ? arrDate : [];

    const customerDetail = listCustomer.map((item, index) => {
      return {
        ...item,
        id: index,
      };
    });

    console.log(customerDetail);

    const attractionColumns = [
      {
        id: 0,
        title: <IntlMessages id="global.firstname" />,
        key: "firstname",
        dataIndex: "firstname",
      },
      {
        id: 1,
        title: <IntlMessages id="global.lastname" />,
        key: "lastname",
        dataIndex: "lastname",
      },
      {
        id: 2,
        title: <IntlMessages id="global.email" />,
        key: "email",
        dataIndex: "email",
      },
      {
        id: 3,
        title: <IntlMessages id="global.mobile" />,
        key: "mobile",
        dataIndex: "mobile",
      },
      {
        id: 4,
        title: <IntlMessages id="global.customer_address" />,
        key: "customer_address",
        dataIndex: "customer_address",
      },
      {
        id: 5,
        title: <IntlMessages id="global.quantity" />,
        key: "qty",
        dataIndex: "qty",
      },
    ];

    const allColumns = [
      {
        id: 0,
        title: <IntlMessages id="global.firstname" />,
        key: "firstname",
        dataIndex: "firstname",
      },
      {
        id: 1,
        title: <IntlMessages id="global.lastname" />,
        key: "lastname",
        dataIndex: "lastname",
      },
      {
        id: 2,
        title: <IntlMessages id="global.gender" />,
        key: "gender",
        render: (record) => {
          return record.gender === "1" ? "Male" : "Female";
        },
      },
      {
        id: 3,
        title: <IntlMessages id="global.age" />,
        dataIndex: "age",
        key: "age",
      },
      {
        id: 4,
        title: <IntlMessages id="global.expired_passport" />,
        key: "expired_passport",
        render: (record) => {
          return record.expired_passport
            ? moment(record.expired_passport).format("YYYY/MM/DD")
            : null;
        },
      },
      {
        id: 5,
        title: <IntlMessages id="global.birthday" />,
        key: "birthday",
        render: (record) => {
          return record.birthday
            ? moment(record.birthday).format("DD/MM/YYYY")
            : null;
        },
      },
      {
        id: 6,
        title: <IntlMessages id="global.country" />,
        key: "country",
        dataIndex: "country",
      },
      {
        id: 7,
        title: <IntlMessages id="global.email" />,
        key: "email",
        dataIndex: "email",
      },
      {
        id: 8,
        title: <IntlMessages id="global.mobile" />,
        key: "mobile",
        dataIndex: "mobile",
      },
      {
        id: 9,
        title: <IntlMessages id="global.passport_no" />,
        key: "passport_no",
        dataIndex: "passport_no",
      },
    ];

    const columns =
      this.state.type === 2
        ? attractionColumns.filter((el) => {
            return column ? column.includes(el.id) : [];
          })
        : allColumns.filter((el) => {
            return column ? column.includes(el.id) : [];
          });

    const fieldColumns =
      this.state.type === 2
        ? attractionColumns.filter((el) => {
            return column ? column.includes(el.id) : [];
          })
        : allColumns.map((item, index) => {
            return {
              id: index,
              title: item.title,
            };
          });

    const fields =
      columns.length !== 0
        ? columns.map((item) => item.key)
        : allColumns.map((item) => item.key);

    const dataToExcel = {
      date: this.state.date,
      tour_id: this.state.tour_id,
      fields: fields,
    };

    return (
      <React.Fragment>
        <div className="formelements-wrapper">
          <PageTitleBar
            title={<IntlMessages id="sidebar.customer_report" />}
            match={this.props.match}
          />
          <div className="row">
            <RctCollapsibleCard colClasses="col-12">
              <Form
                layout="inline"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>
                  {tour_id && this.state.date ? (
                    <Button
                      type="primary"
                      onClick={() => this.exportExcel(dataToExcel)}
                    >
                      <IntlMessages id="global.export_excel" />
                    </Button>
                  ) : (
                    <Button disabled>
                      <IntlMessages id="global.export_excel" />
                    </Button>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Form.Item>
                    <BaseSelect
                      showSearch
                      options={listProduct}
                      defaultText="Select a tour"
                      optionValue="id"
                      onChange={(value) => this.onFilter(value)}
                      style={{ width: "200px" }}
                    />
                  </Form.Item>
                  {tour_id ? (
                    <Form.Item>
                      {/* <ReactDatePicker
                        style={{
                          width: "200px",
                          position: "relative",
                          zIndex: "100",
                        }}
                        selected={this.state.startDate}
                        onChange={this.handleChangeDate}
                        highlightDates={arrDate}
                      /> */}
                      <BaseSelect
                        showSearch
                        options={date}
                        defaultText="Select a depart date"
                        style={{ width: "200px" }}
                        optionValue="title"
                        onChange={this.handleChangeDate}
                        value={this.state.date ? this.state.date : ""}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item>
                      <Select
                        defaultValue="Select a depart date"
                        style={{ width: "200px" }}
                        disabled
                      ></Select>
                    </Form.Item>
                  )}
                  <Form.Item>
                    <BaseSelect
                      mode="multiple"
                      options={fieldColumns}
                      placeholder="Select column for table"
                      onChange={(value) => this.onChangeColumn(value)}
                      style={{ minWidth: "200px", maxWidth: "320px" }}
                      defaultValue={[]}
                    />
                  </Form.Item>
                </div>
              </Form>
              <Table
                columns={columns.length ? columns : allColumns}
                dataSource={customerDetail}
                rowKey="id"
                size="small"
                pagination={false}
              />
            </RctCollapsibleCard>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    listTourDepartDate: state.report.listTourDepartDate,
    listCustomerByTour: state.report.listCustomerByTour,
    listProduct: state.tour.listProduct,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerByTour: (filter) => dispatch(getCustomerByTour(filter)),
    getTourDepartDate: (id) => dispatch(getTourDepartDate(id)),
    getAllProduct: (filter) => dispatch(getAllProduct(filter)),
    exportExcelCustomer: (data) => dispatch(exportExcelCustomer(data)),
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Customer_Report)
);
