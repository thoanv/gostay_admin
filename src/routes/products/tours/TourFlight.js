import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Input, Checkbox, Button, Icon, Spin, Table, DatePicker, Tabs } from 'antd';
import BaseSelect from 'Components/Elements/BaseSelect';
import IntlMessages from "Util/IntlMessages";
import moment from 'moment';
// actions
import { getFlightsByTour } from '../../../actions/FlightActions';

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

class TourFlight extends Component {
    state = {
        isSearching: true,
        rows: [],
        activeTab: '1'
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.tour_id && nextProps.tour_id != this.props.tour_id) {
            this.setState({ isSearching: true, activeTab: '1' });
            this.props.getFlightsByTour(nextProps.tour_id).then((data) => {
                this.setState({
                    isSearching: false,
                    rows: data.onwardFlights
                })
            });
        }
    }

    onChangeTab(key) {
        this.setState({
            activeTab: key,
            rows: key == '1' ? this.props.flights.onwardFlights : this.props.flights.returnFlights
        })
    }

    onCancel() {
        this.props.onClose();
        this.setState({
            activeTab: '1',
            rows: []
        })
    }

    render() {
        var { isSearching, rows, activeTab } = this.state;
        var { visible } = this.props;

        const columns = [
            {
                title: 'Airline',
                dataIndex: 'airline_code',
                key: 'airline_code',
                render: (text, record) => {
                    return (
                        <div>{record.airline_title} ({record.airline_code})</div>
                    )
                }
            },
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
            }
        ];

        return (
            <Modal
                title={<IntlMessages id="tour.flight" />}
                visible={visible}
                onCancel={() => this.onCancel()}
                style={{ minWidth: '1000px' }}
                footer={[
                    <Button key="back" onClick={() => this.onCancel()}>
                        <IntlMessages id="button.cancel" />
                    </Button>,
                ]}
            >
                <Tabs activeKey={activeTab} onChange={(key) => this.onChangeTab(key)}>
                    <TabPane tab="Onward flights" key="1"></TabPane>
                    <TabPane tab="Return flights" key="2"></TabPane>
                </Tabs>
                <Table
                    rowKey={(record) => record.id}
                    loading={isSearching}
                    columns={columns}
                    dataSource={rows}
                    expandedRowRender={record => {
                        let subflights = JSON.parse(JSON.parse(record.fullinfo).fullinfo);
                        if (Array.isArray(subflights)) {
                            return (<ExpandedRowRender data={subflights} />);
                        } else {
                            return (<ExpandedRowRender data={[subflights]} />);
                        }
                    }}
                />
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        flights: state.flight.flightsByTour
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getFlightsByTour: (tour) => dispatch(getFlightsByTour(tour))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TourFlight)