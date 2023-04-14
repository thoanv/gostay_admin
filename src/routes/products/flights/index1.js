import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from 'moment';
import IntlMessages from "Util/IntlMessages";
import { Table, Icon, Input, DatePicker, Button, Form, Row, Col } from "antd";
import SweetAlert from "react-bootstrap-sweetalert";
import TableActionBar from "../../../components/TableActionBar";
import StatusButton from "../../../components/StatusButton";
import AddFlight from "./AddFlight";
import TableFilter from "../../../components/TableFilter/TableFilter";
import BaseSelect from 'Components/Elements/BaseSelect';
import { debounce } from '../../../helpers/helpers';
// actions
import {
    getAllFlight,
    updateFlight,
    createFlight,
    batchDelete,
    changeStatus
} from "../../../actions/FlightActions";
import { publish, unpublish } from "../../../actions/CommonActions";
import { getAllAirlines } from '../../../actions/AirlineActions';
import { getAllDestination } from '../../../actions/DestinationActions';

class Flight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listFlight: [],
            isOpenFilter: false,
            filter: {
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
            getFlight: null,
            activeFilter: false,
            // filters destination and airlines
            destinationFilter: {
                paging: {
                    page: 1
                }
            },
            airlineFilter: {
                paging: {
                    page: 1
                }
            },
            isOpenCreateModal: false
        };
    }

    componentDidMount() {
        this.props.getAllFlight(this.props.listFlight);
        this.props.getAllAirlines();
        this.props.getAllDestination();
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
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
                this.props.getAllFlight(this.state.filter);
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
                    debounce(this.props.getAllFlight(this.state.filter), 1000);
                }
            );
        }
    }

    toggleFilter() {
        this.setState({
            isOpenFilter: !this.state.isOpenFilter,
        })

        // this.setState({
        //     isOpenFilter: !this.state.isOpenFilter,
        //     filter: {
        //         paging: {
        //             perpage: 10,
        //             page: 1
        //         }
        //     },
        // }, () => {
        //     this.props.getAllFlight(this.state.filter);
        // })
    }

    onFilter(name, value) {
        if (name == 'start' || name == 'end') {
            if (value) {
                value = value.toISOString().substr(0, 10);

                this.setState({
                    filter: {
                        ...this.state.filter,
                        [name]: {
                            type: 'compare',
                            value: {
                                from: value,
                                to: `${value} 23:59:59`
                            }
                        }
                    }
                });
            } else {
                this.setState({
                    filter: {
                        ...this.state.filter,
                        [name]: {}
                    }
                });
            }
        } else {
            this.setState({
                filter: {
                    ...this.state.filter,
                    [name]: {
                        type: 'like',
                        value: value
                    }
                }
            });
        }

        setTimeout(() => {
            this.props.getAllFlight(this.state.filter);
        }, 300);
    }

    searchDestination(value) {
        this.setState({
            destinationFilter: {
                paging: {
                    page: 1
                },
                search: value,
            }
        }, () => {
            this.props.getAllDestination(this.state.destinationFilter);
        })
    }

    searchAirline(value) {
        this.setState({
            airlineFilter: {
                paging: {
                    page: 1
                },
                search: value,
            }
        }, () => {
            this.props.getAllAirlines(this.state.airlineFilter);
        })
    }

    handleScrollAirline() {
        this.setState(
            {
                airlineFilter: {
                    ...this.state.airlineFilter,
                    paging: {
                        page: this.state.airlineFilter.paging.page + 1
                    }
                }
            }, () => {
                this.props.getAllAirlines(this.state.airlineFilter, false);
            }
        );
    }

    handleScrollDestination() {
        this.setState(
            {
                destinationFilter: {
                    ...this.state.destinationFilter,
                    paging: {
                        page: this.state.destinationFilter.paging.page + 1
                    }
                }
            }, () => {
                this.props.getAllDestination(this.state.destinationFilter, false);
            }
        );
    }

    render() {
        const { loading, selectedRowKeys, isOpenFilter, isOpenCreateModal } = this.state;
        const { Search } = Input;

        const { listFlight, paging, airlines, destinations } = this.props;

        const columns = [
            {
                title: <IntlMessages id="flight.departure" />,
                dataIndex: "departure",
                key: "departure",
            },
            {
                title: <IntlMessages id="flight.arrival" />,
                dataIndex: "arrival",
                key: "arrival",
            },
            {
                title: <IntlMessages id="flight.duration" />,
                dataIndex: "duration",
                key: "duration",
                render: (text, record) => (
                    <div>{record.duration} mins</div>
                ),
                sorter: true
            },
            {
                title: <IntlMessages id="flight.start" />,
                dataIndex: "start",
                key: "start",
                render: (text, record) => {
                    let timezone = "";
                    let fullTimezone = "";
                    let temp = JSON.parse(JSON.parse(record.fullinfo).fullinfo);
                    if (Array.isArray(temp)) {
                        timezone = temp[0].ArrivalTimeZone.GMTOffset;
                    } else {
                        timezone = temp.ArrivalTimeZone.GMTOffset;
                    }

                    if (timezone > 0) fullTimezone = "GMT+" + timezone;
                    else fullTimezone = "GMT-" + timezone;

                    return (
                        moment(record.start).format("YYYY/MM/DD HH:mm") + " (" + fullTimezone + ")"
                    )
                }
            },
            {
                title: <IntlMessages id="flight.end" />,
                dataIndex: "end",
                key: "end",
                render: (text, record) => {
                    let timezone = "";
                    let fullTimezone = "";
                    let temp = JSON.parse(JSON.parse(record.fullinfo).fullinfo);
                    if (Array.isArray(temp)) {
                        timezone = temp[0].ArrivalTimeZone.GMTOffset;
                    } else {
                        timezone = temp.ArrivalTimeZone.GMTOffset;
                    }

                    if (timezone > 0) fullTimezone = "GMT+" + timezone;
                    else fullTimezone = "GMT-" + timezone;

                    return (
                        moment(record.end).format("YYYY/MM/DD HH:mm") + " (" + fullTimezone + ")"
                    )
                }

            },
            {
                title: <IntlMessages id="flight.flightnumber" />,
                dataIndex: "flightnumber",
                key: "flightnumber",
                sorter: true
            },
            {
                title: <IntlMessages id="flight.airline" />,
                dataIndex: "airline_txt",
                key: "airline_txt"
            },
            {
                title: <IntlMessages id="flight.stop" />,
                dataIndex: "stop",
                key: "stop",
                sorter: true
            },
            {
                title: <IntlMessages id="flight.price" />,
                dataIndex: "price",
                key: "price",
                render: (text, record) => (
                    `$${record.price}`
                ),
                sorter: true
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

        let destinationOptions = destinations.map(item => {
            if (item.code) {
                return { ...item, title: "(" + item.code + ") " + item.title };
            }
        })

        destinationOptions = destinationOptions.filter(item => item);

        let airlineOptions = airlines.map(item => {
            return { ...item, title: "(" + item.code + ") " + item.title };
        })

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.flight" />}
                        match={this.props.match}
                    />
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-xl-12">
                            <RctCollapsibleCard>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <Button type="primary" icon="plus" className="mb-0" onClick={() => this.setState({isOpenCreateModal: true})}>
                                        <IntlMessages id="global.add_new" />
                                    </Button>
                                    <Icon 
                                        type="filter" 
                                        style={{ color: 'rgba(0,0,0,.25)', fontSize: 20 }} 
                                        theme={isOpenFilter ? 'filled' : 'outlined'}
                                        onClick={() => this.toggleFilter()} 
                                    />
                                </div>
                                <div style={!isOpenFilter ? {display: 'none'} : null}>
                                    <Form layout="inline" onSubmit={this.handleSubmit} style={{ alignContent: 'center' }}>
                                        <Form.Item>
                                            <Input
                                                name="flightnumber"
                                                placeholder="Flight number"
                                                onChange={(e) => this.onFilter(e.target.name, e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <BaseSelect
                                                showSearch
                                                options={destinationOptions}
                                                defaultText="Select departure"
                                                optionValue="code"
                                                additionalLabel="code"
                                                onChange={(value) => this.onFilter('departure', value)}
                                                style={{ width: '200px' }}
                                                onScrollEnd={() => this.handleScrollDestination()}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <BaseSelect
                                                showSearch
                                                options={destinationOptions}
                                                defaultText="Select arrival"
                                                optionValue="code"
                                                // additionalLabel="code"
                                                onChange={(value) => this.onFilter('arrival', value)}
                                                style={{ width: '200px' }}
                                                onScrollEnd={() => this.handleScrollDestination()}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <BaseSelect
                                                showSearch
                                                options={airlineOptions}
                                                defaultText="Select airline"
                                                optionValue="code"
                                                onChange={(value) => this.onFilter('airline_code', value)}
                                                style={{ width: '200px' }}
                                                onScrollEnd={() => this.handleScrollAirline()}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <DatePicker
                                                placeholder="Start date"
                                                onChange={(value) => this.onFilter('start', value)}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <DatePicker
                                                placeholder="End date"
                                                onChange={(value) => this.onFilter('end', value)}
                                            />
                                        </Form.Item>
                                    </Form>
                                </div>
                                <div className="mb-20">
                                    <Table
                                        tableLayout="auto"
                                        rowSelection={rowSelection}
                                        columns={columns}
                                        dataSource={listFlight}
                                        onChange={this.onChangTable}
                                        rowKey="id"
                                        size="small"
                                        pagination={{
                                            showSizeChanger: true,
                                            pageSizeOptions: ["10", "20", "30"],
                                            total: paging.count,
                                            onChange: (page, pageSize) =>
                                                this.handleChangePage(page, pageSize),
                                            onShowSizeChange: (page, pageSize) =>
                                                this.handleChangePage(page, pageSize)
                                        }}
                                    />
                                </div>
                            </RctCollapsibleCard>
                        </div>
                    </div>
                </div>
                <AddFlight 
                    visible={isOpenCreateModal}
                    // destinations={destinationOptions}
                    // airlines={airlineOptions}

                />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        listFlight: state.flight.listFlight,
        airlines: state.airline.listAirlines,
        paging: state.flight.paging,
        destinations: state.destination.listDestination
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getAllFlight: (filter) => dispatch(getAllFlight(filter)),
        updateFlight: id => dispatch(updateFlight(id)),
        createFlight: data => dispatch(createFlight(data)),
        changeStatus: data => dispatch(changeStatus(data)),
        publish: data => dispatch(publish(data)),
        unpublish: data => dispatch(unpublish(data)),
        delete: data => dispatch(batchDelete(data)),
        getAllAirlines: (filter, paginate) => dispatch(getAllAirlines(filter, paginate)),
        getAllDestination: (filter, paginate) => dispatch(getAllDestination(filter, paginate))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Flight);
