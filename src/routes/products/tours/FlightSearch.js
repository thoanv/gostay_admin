import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Input, Checkbox, Button, Icon, Spin, Table, DatePicker, Tabs } from 'antd';
import BaseSelect from "Components/Elements/BaseSelect";
import IntlMessages from "Util/IntlMessages";
import moment from 'moment';
import { NotificationManager } from 'react-notifications';
// import _ from 'lodash';
// actions
import { getTourDetail } from 'Actions/TourActions';
import { getAllAirlines } from 'Actions/AirlineActions';
import { searchSabreFlights, createFlight } from 'Actions/FlightActions';

const { TabPane } = Tabs;

const ExpandedRowRender = ({ data }) => {
    const columns = [
        {
            title: 'Departure',
            dataIndex: 'DepartureAirport',
            key: 'DepartureAirport',
            render: (text, record) => (
                <div>{record.DepartureAirport.LocationCode}</div>
            )
        },
        {
            title: 'Arrival',
            dataIndex: 'ArrivalAirport',
            key: 'ArrivalAirport',
            render: (text, record) => (
                <div>{record.ArrivalAirport.LocationCode}</div>
            )
        },
        {
            title: 'Start time',
            dataIndex: 'DepartureDateTime',
            key: 'DepartureDateTime',
            render: (text, record) => (
                <div>{moment(record.DepartureDateTime).format('YYYY/MM/DD HH:mm')} (GMT {record.DepartureTimeZone.GMTOffset})</div>
            )
        },
        {
            title: 'End time',
            dataIndex: 'ArrivalDateTime',
            key: 'ArrivalDateTime',
            render: (text, record) => (
                <div>{moment(record.ArrivalDateTime).format('YYYY/MM/DD HH:mm')} (GMT {record.ArrivalTimeZone.GMTOffset})</div>
            )
        },
        {
            title: 'Flight',
            dataIndex: 'OperatingAirline',
            key: 'OperatingAirline',
            render: (text, record) => (
                <div>{record.OperatingAirline.Code} {record.OperatingAirline.FlightNumber}</div>
            )
        },
    ];

    return (
        <Table
            rowKey={(record) => `${record.DepartureAirport.LocationCode}_${record.ArrivalAirport.LocationCode}`}
            columns={columns}
            dataSource={data}
            pagination={false}
        />
    );
};


class FlightSearch extends Component {
    state = {
        filter: {},
        rows: [],
        isLoading: true,
        isSearching: false,
        addedRows: [],
        activeTab: '1'
    }

    componentDidMount() {
        this.props.getAllAirlines({ paging: 0 });
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.tour_id && nextProps.tour_id != this.props.tour_id) {
            this.setState({ isLoading: true });
            this.props.getTourDetail(nextProps.tour_id).then((tour) => {
                this.setState({
                    isLoading: false,
                    // filter: {
                    //     destination: tour.itinerary[0].destination_code
                    // }
                })
            });
        }
    }

    onChangeFilter(name, value) {
        this.setState({
            filter: {
                ...this.state.filter,
                [name]: value
            }
        })
    }

    onSearch() {
        this.setState({ isSearching: true });

        let availableAirlineCodes = this.props.airlines.map(airline => airline.code);
        let itineraries = this.props.tour.itinerary;
        let filter = this.state.filter;
        if (this.state.activeTab == '1') {
            filter = {
                ...filter,
                destination: itineraries[0].destination_code,
                date: moment(this.state.filter.date).format("YYYY-MM-DD")
            }
        } else {
            filter = {
                ...filter,
                departure: itineraries[itineraries.length - 1].destination_code,
                date: moment(this.state.filter.date).format("YYYY-MM-DD")
            }
        }

        this.props.searchSabreFlights(filter).then((flights) => {
            let rows = flights.filter((flight, index) => {
                return availableAirlineCodes.indexOf(flight.airline_code) >= 0;
            })

            rows = rows.map((item, index) => {
                return { ...item, id: index }
            })
            this.setState({
                isSearching: false,
                rows: rows,
                addedRows: [],
            });
        }).catch(err => {
            NotificationManager.error(err.response.data.message);
            this.setState({
                isSearching: false,
                addedRows: [],
            });
        })
    }

    addFlight(record) {
        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        let data = {
            departure: record.departure,
            arrival: record.arrival,
            start: record.start,
            end: record.end,
            duration: record.duration.trim(),
            flightnumber: record.flightnumber.trim(),
            airline_code: record.airline_code,
            seat: 0,
            status: 1,
            stop: record.stop,
            fullinfo: JSON.stringify(record),
            price: record.price,
            created_at: now,
            updated_at: now
        };

        this.props.createFlight({
            tour_id: this.props.tour_id,
            flight: data,
            return: this.state.activeTab == '1' ? 'false' : 'true'
        }).then(() => {
            this.setState({
                addedRows: [
                    ...this.state.addedRows,
                    record.id
                ]
            }, () => {
                console.log(this.state.addedRows, record)
            })
        })
    }

    onCancel() {
        this.props.onClose();
        this.setState({
            isLoading: false,
            isSearching: false,
            rows: [],
            addedRows: [],
            activeTab: '1',
        })
    }

    onOk() {
        this.props.onOk();
        this.setState({
            isLoading: false,
            isSearching: false,
            rows: [],
            addedRows: []
        })
    }

    onChangeTab(key) {
        this.props.onChangeType(key);
        this.setState({ activeTab: key, rows: [], addedRows: [], })
    }

    render() {
        var { visible, tour, airlines, flights } = this.props;
        var { isLoading, rows, isSearching, addedRows, activeTab } = this.state;

        var data = airlines.map(airline => {
            return {
                id: airline.code,
                title: `(${airline.code}) ${airline.title}`
            }
        });

        const columns = [
            {
                title: 'Airline',
                dataIndex: 'airline_code',
                key: 'airline_code',
                render: (text, record) => {
                    let airline = airlines.find(item => item.code === text);
                    if (airline) {
                        return (
                            <div>{airline.title} ({text})</div>
                        )
                    } else {
                        return (
                            <div>{text}</div>
                        )
                    }
                }
            },
            // {
            //     title: 'Flight Number',
            //     dataIndex: 'flightnumber',
            //     key: 'flightnumber',
            // },
            {
                title: 'Stop',
                dataIndex: 'stop',
                key: 'stop',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                render: (text, record) => (
                    <div>{text} $</div>
                )
            },
            {
                title: 'Start time',
                dataIndex: 'start',
                key: 'start',
            },
            {
                title: 'End time',
                dataIndex: 'end',
                key: 'end',
            },
            {
                title: 'Option',
                dataIndex: 'option',
                render: (text, record) => {
                    if (addedRows.indexOf(record.id) >= 0) {
                        return (
                            <Button type="link" style={{ color: 'green' }}>Added</Button>
                        )
                    } else {
                        return (<Button type="primary" onClick={() => this.addFlight(record)}>Add</Button>)
                    }
                }
            },
        ];

        // if (!isLoading) {
        //     if (!tour.departures || !tour.itinerary) {
        //         return (
        //             <Modal
        //                 title="Alert"
        //                 visible={visible}
        //                 onOk={() => this.props.onClose()}
        //                 onCancel={() => this.props.onClose()}
        //                 style={{ minWidth: '1000px' }}
        //             >
        //                 <p>This tour doesn't have any departure or itinerary. Please check again.</p>
        //             </Modal>
        //         )
        //     }
        // }

        return (
            <Modal
                title="Flight Searching"
                visible={visible}
                onOk={() => this.onOk()}
                onCancel={() => this.onCancel()}
                style={{ minWidth: '1000px' }}
                footer={[
                    <Button key="back" onClick={() => this.onCancel()}>
                        <IntlMessages id="button.cancel" />
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => this.onOk()}>
                        <IntlMessages id="flightsearch.submit" />
                    </Button>,
                ]}
            >
                {
                    isLoading ? (
                        <div className="text-center">
                            <Spin
                                indicator={
                                    <Icon type="loading" style={{ fontSize: 40 }} spin />
                                }
                            />
                        </div>
                    ) : (
                            <React.Fragment>
                                <Tabs defaultActiveKey={activeTab} onChange={(key) => this.onChangeTab(key)}>
                                    <TabPane tab="Onward Flight" key="1">
                                        <Row style={{ padding: '5px' }}>
                                            <Col xs={24} sm={12} md={4}>
                                                <BaseSelect
                                                    options={tour.departures}
                                                    defaultText="Select departure"
                                                    optionValue="code"
                                                    showSearch
                                                    onChange={(value) => this.onChangeFilter('departure', value)}
                                                />
                                            </Col>
                                            <Col xs={24} sm={12} md={4}>
                                                <Input value={tour.itinerary[0] ? tour.itinerary[0].destination_txt : ""} disabled style={{ width: '100%' }} />
                                            </Col>
                                            <Col xs={24} sm={12} md={4}>
                                                <DatePicker onChange={(value) => this.onChangeFilter('date', value)} />
                                            </Col>
                                            <Col xs={24} sm={12} md={5}>
                                                <BaseSelect
                                                    options={data}
                                                    defaultText="Select airline"
                                                    showSearch
                                                    onChange={(value) => this.onChangeFilter('airline', value)}
                                                    style={{ width: '100%' }}
                                                />
                                            </Col>
                                            <Col xs={24} sm={12} md={4}>
                                                <Checkbox onChange={(e) => this.onChangeFilter('direct', e.target.checked)}>
                                                    Direct flights?
                                                </Checkbox>
                                            </Col>
                                            <Col xs={24} sm={12} md={3}>
                                                <Button type="primary" icon="search" onClick={() => this.onSearch()}>
                                                    {/* <IntlMessages id="widgets.search" /> */}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane tab="Return Flight" key="2">
                                        <Row style={{ padding: '5px' }}>
                                            <Col xs={24} sm={12} md={4}>
                                                <Input value={tour.itinerary[tour.itinerary.length - 1] ? tour.itinerary[tour.itinerary.length - 1].destination_txt : ""} disabled style={{ width: '100%' }} />
                                            </Col>
                                            <Col xs={24} sm={12} md={4}>
                                                <BaseSelect
                                                    options={tour.departures}
                                                    defaultText="Select destination"
                                                    optionValue="code"
                                                    showSearch
                                                    onChange={(value) => this.onChangeFilter('destination', value)}
                                                />
                                            </Col>
                                            <Col xs={24} sm={12} md={4}>
                                                <DatePicker onChange={(value) => this.onChangeFilter('date', value)} />
                                            </Col>
                                            <Col xs={24} sm={12} md={5}>
                                                <BaseSelect
                                                    options={data}
                                                    defaultText="Select airline"
                                                    showSearch
                                                    onChange={(value) => this.onChangeFilter('airline', value)}
                                                    style={{ width: '100%' }}
                                                />
                                            </Col>
                                            <Col xs={24} sm={12} md={4}>
                                                <Checkbox onChange={(e) => this.onChangeFilter('direct', e.target.checked)}>
                                                    Direct flights?
                                                </Checkbox>
                                            </Col>
                                            <Col xs={24} sm={12} md={3}>
                                                <Button type="primary" icon="search" onClick={() => this.onSearch()}>
                                                    {/* <IntlMessages id="widgets.search" /> */}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                </Tabs>
                                <Table
                                    // rowKey={(record) => `${record.flightnumber}${record.price}${record.start}${record.end}`}
                                    rowKey={(record) => record.id}
                                    loading={isSearching}
                                    columns={columns}
                                    dataSource={rows}
                                    expandedRowRender={record => {
                                        let flights = JSON.parse(record.fullinfo);
                                        if (Array.isArray(flights)) {
                                            return (<ExpandedRowRender data={flights} />);
                                        } else {
                                            return (<ExpandedRowRender data={[flights]} />);
                                        }
                                    }}
                                />
                            </React.Fragment>
                        )
                }
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        tour: state.tour.currentTour,
        airlines: state.airline.listAirlines,
        flights: state.flight.sabreFlights
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getTourDetail: (id) => dispatch(getTourDetail(id)),
        getAllAirlines: (filter) => dispatch(getAllAirlines(filter)),
        searchSabreFlights: (query) => dispatch(searchSabreFlights(query)),
        createFlight: (data) => dispatch(createFlight(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlightSearch);