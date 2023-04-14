import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import BaseSelect from 'Components/Elements/BaseSelect';
import BaseRadioList from 'Components/Elements/BaseRadios';
import moment from 'moment';
import IntlMessages from "Util/IntlMessages";
import { Card, Form, InputNumber, DatePicker, Button, Row, Col, Skeleton, List, Icon, Typography, Tabs } from 'antd';
import airports from '../../../assets/json/airports.json';
// actions
import { getAllDestination } from 'Actions/DestinationActions';
import { searchSabreFlights } from 'Actions/FlightActions';
import FlightItem from './FlightItem';

const { TabPane } = Tabs;

class Flight extends Component {
    state = {
        departures: [],
        destinations: [],
        isLoadingStartFlights: false,
        isLoadingReturnFlights: false,
        selectedDeparture: null,
        selectedDestination: null,
        isReturnFlight: false,
        startFlights: [],
        returnFlights: []
    }

    componentDidMount() {
        var defaultArray = airports.slice(0, 20);
        console.log(defaultArray)
        this.setState({
            departures: defaultArray,
            destinations: defaultArray
        })
    }

    onSelectPlace(type, option) {
        if (type == 'departure') this.setState({ selectedDeparture: option.props.children });
        else this.setState({ selectedDestination: option.props.children });
    }

    onSearchPlace(type, keyword) {
        keyword = keyword.toLowerCase();

        var defaultArray = airports.filter(item => {
            let name = item.name.toLowerCase();
            let iataCode = item.iata.toLowerCase();
            if (name.includes(keyword) || iataCode.includes(keyword)) {
                return item;
            }
        });
        defaultArray = defaultArray.splice(0, 20);
        if (type == 'departure') this.setState({ departures: defaultArray });
        else this.setState({ destinations: defaultArray });
    }

    searchFlights(e) {
        e.preventDefault();

        // reset returnFlights
        this.setState({ returnFlights: [] });

        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({ isLoadingStartFlights: true });
                var data = {
                    ...values,
                    start: moment(values.start).format('YYYY-MM-DD')
                };


                this.props.searchSabreFlights(data).then(startFlights => {
                    this.setState({ startFlights: startFlights, isLoadingStartFlights: false });
                }).catch(err => {
                    this.setState({ startFlights: [], isLoadingStartFlights: false });
                })
            }
        });
    }

    async searchReturnedFlights() {
        var values = this.props.form.getFieldsValue();

        this.setState({ isLoadingReturnFlights: true })
        if (this.state.isReturnFlight) {
            this.props.searchSabreFlights({
                ...values,
                start: moment(values.end).format('YYYY-MM-DD'),
                departure: values.destination,
                destination: values.departure
            }).then(returnFlights => {
                this.setState({ returnFlights: returnFlights, isLoadingReturnFlights: false });
            }).catch(err => {
                this.setState({ returnFlights: [], isLoadingReturnFlights: false });
            })
        }
    }

    async changeTab(key) {
        if (key == 'return' && this.state.returnFlights.length) {
            await this.searchReturnedFlights();
        }
    }

    render() {
        var { departures, destinations, isLoadingStartFlights, isLoadingReturnFlights, selectedDeparture, selectedDestination, isReturnFlight, startFlights, returnFlights } = this.state;
        var { getFieldDecorator } = this.props.form;
        // var { flights } = this.props;

        return (
            <div>
                <PageTitleBar
                    title={<IntlMessages id="sidebar.flight" />}
                    match={this.props.match}
                />
                <Card>
                    <Form
                        labelAlign="left"
                        // layout="vertical"
                        onSubmit={(e) => this.searchFlights(e)}
                    >
                        <Row>
                            <Col span={8}>
                                <Form.Item label={<IntlMessages id="flight.departure" />} className="flight-form">
                                    {getFieldDecorator('departure', {
                                        rules: [{ required: true, message: 'Required' }],
                                    })(
                                        <BaseSelect
                                            options={departures}
                                            optionValue="iata"
                                            optionLabel="name"
                                            showSearch
                                            onSearch={(value) => this.onSearchPlace('departure', value)}
                                            onChange={(value, option) => this.onSelectPlace('departure', option)}
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label={<IntlMessages id="flight.destination" />} className="flight-form">
                                    {getFieldDecorator('destination', {
                                        rules: [{ required: true, message: 'Required' }],
                                    })(
                                        <BaseSelect
                                            options={destinations}
                                            optionValue="iata"
                                            optionLabel="name"
                                            showSearch
                                            onSearch={(value) => this.onSearchPlace('destination', value)}
                                            onChange={(value, option) => this.onSelectPlace('destination', option)}
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label={<IntlMessages id="flight.adult_passengers" />} className="flight-form">
                                    {getFieldDecorator('adult', {
                                        rules: [{ required: false, message: 'Required' }],
                                        initialValue: 1
                                    })(
                                        <InputNumber style={{ width: '100%' }} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label={<IntlMessages id="flight.children_passengers" />} className="flight-form">
                                    {getFieldDecorator('children', {
                                        rules: [{ required: false, message: 'Required' }],
                                        initialValue: 0
                                    })(
                                        <InputNumber style={{ width: '100%' }} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label={<IntlMessages id="flight.start_date" />} className="flight-form">
                                    {getFieldDecorator('start', {
                                        rules: [{ required: true, message: 'Required' }],
                                        initialValue: moment().add(7, 'days')
                                    })(
                                        <DatePicker style={{ width: '100%' }} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label={<IntlMessages id="flight.end_date" />} className="flight-form">
                                    {getFieldDecorator('end', {
                                        rules: [{ required: isReturnFlight, message: 'Required' }],
                                    })(
                                        <DatePicker style={{ width: '100%' }} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label={<IntlMessages id="flight.cabin" />} className="flight-form">
                                    {getFieldDecorator('cabin', {
                                        rules: [{ required: false, message: 'Required' }],
                                    })(
                                        <BaseSelect
                                            /**
                                             * Read more about cabin type: http://files.developer.sabre.com/doc/providerdoc/shopping/BargainFinderMax_Help/Content/FAQ/CabinType/CabinTypeIntro.htm
                                             */
                                            options={[
                                                { value: 'Y', label: 'Economy' },
                                                { value: 'S', label: 'Premium Economy' },
                                                { value: 'C', label: 'Business' },
                                                { value: 'J', label: 'Premium Business' },
                                                { value: 'F', label: 'First' },
                                                { value: 'P', label: 'Premium First' }
                                            ]}
                                            optionValue="value"
                                            optionLabel="label"
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label={<IntlMessages id="flight.type" />} className="flight-form">
                                    {getFieldDecorator('type', {
                                        rules: [{ required: false, message: 'Required' }],
                                        initialValue: 'one_way'
                                    })(
                                        <BaseRadioList
                                            options={[
                                                { value: 'one_way', label: <IntlMessages id="flight.one_way" /> },
                                                { value: 'return', label: <IntlMessages id="flight.return" /> }
                                            ]}
                                            optionValue="value"
                                            optionLabel="label"
                                            onChange={(value) => this.setState({ isReturnFlight: value == 'return' })}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label={<IntlMessages id="flight.direct" />} className="flight-form">
                                    {getFieldDecorator('direct', {
                                        rules: [{ required: false, message: 'Required' }],
                                        initialValue: '1'
                                    })(
                                        <BaseRadioList
                                            options={[
                                                { value: '1', label: <IntlMessages id="flight.direct_flight" /> },
                                                { value: '0', label: <IntlMessages id="flight.multi_stops" /> }
                                            ]}
                                            optionValue="value"
                                            optionLabel="label"
                                        // onChange={(value) => this.onChangeData('direct', value)}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button htmlType="submit" type="primary" loading={isLoadingStartFlights || isLoadingReturnFlights}>
                            <IntlMessages id="flight.find" />
                        </Button>
                    </Form>
                </Card>

                {
                    selectedDeparture && selectedDestination ? (
                        <Tabs defaultActiveKey="start" tabPosition={'left'} onTabClick={(key) => this.changeTab(key)}>
                            <TabPane tab={<span>{selectedDeparture} <Icon type="double-right" /> {selectedDestination}</span>} key='start'>
                                <div>
                                    {
                                        isLoadingStartFlights ? (
                                            <React.Fragment>
                                                <Card>
                                                    <Skeleton />
                                                </Card>
                                                <Card>
                                                    <Skeleton />
                                                </Card>
                                                <Card>
                                                    <Skeleton />
                                                </Card>
                                            </React.Fragment>
                                        ) : (
                                                <List
                                                    itemLayout="horizontal"
                                                    dataSource={startFlights}
                                                    pagination={true}
                                                    renderItem={(flight, index) => {
                                                        return <FlightItem flight={flight} key={index} selectedDeparture={selectedDeparture} selectedDestination={selectedDestination} />
                                                    }}
                                                />
                                            )
                                    }
                                </div>
                            </TabPane>
                            {
                                isReturnFlight ? (
                                    <TabPane tab={<span>{selectedDestination} <Icon type="double-right" /> {selectedDeparture}</span>} key='return'>
                                        <div>
                                            {
                                                isLoadingReturnFlights ? (
                                                    <React.Fragment>
                                                        <Card>
                                                            <Skeleton />
                                                        </Card>
                                                        <Card>
                                                            <Skeleton />
                                                        </Card>
                                                        <Card>
                                                            <Skeleton />
                                                        </Card>
                                                    </React.Fragment>
                                                ) : (
                                                        <List
                                                            itemLayout="horizontal"
                                                            dataSource={returnFlights}
                                                            pagination={true}
                                                            renderItem={(flight, index) => {
                                                                return <FlightItem flight={flight} key={index} selectedDeparture={selectedDestination} selectedDestination={selectedDeparture} />
                                                            }}
                                                        />
                                                    )
                                            }
                                        </div>
                                    </TabPane>
                                ) : null
                            }

                        </Tabs>
                    ) : null
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        // flights: state.flight.sabreFlights
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllDestination: (filter) => dispatch(getAllDestination(filter)),
        searchSabreFlights: (filter) => dispatch(searchSabreFlights(filter)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'flight_form' })(Flight));