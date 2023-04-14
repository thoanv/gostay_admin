import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import IntlMessages from "Util/IntlMessages";
import { Card, Steps, Divider, Button, Row, Col, Descriptions, Alert, Icon, Typography, Badge } from 'antd';

const { Step } = Steps;

export default class FlightItem extends Component {
    state = {
        showDetail: false
    }

    render() {
        var { showDetail } = this.state;
        var { flight, selectedDeparture, selectedDestination, ...restProps } = this.props;

        let airlines = [];
        flight.items.forEach(item => {
            if (airlines.indexOf(item.airline) < 0) airlines.push(item.airline);
        })
        let durationHours = parseInt(flight.duration / 60);
        let durationMinutes = flight.duration - 60 * durationHours;

        var items = [];
        flight.items.forEach((item, index) => {
            if (index == (flight.items.length - 1)) {
                items.push(
                    <Step
                        status="process"
                        title={item.departure}
                        subTitle={`${item.departure_time} (GMT${flight.departure_timezone > 0 ? '+' : ''}${flight.departure_timezone})`}
                        description={
                            <Alert
                                className="flight-info-card"
                                description={
                                    <Descriptions column={1}>
                                        <Descriptions.Item span={1} label="Airline">{item.airline} ({item.airline_code})</Descriptions.Item>
                                        <Descriptions.Item span={1} label="Flight Number">{item.flight_number}</Descriptions.Item>
                                        <Descriptions.Item span={1} label="Estimate Time">{item.duration} mins</Descriptions.Item>
                                    </Descriptions>
                                }
                                type="info"
                                showIcon
                            />
                        }
                    />
                );
                items.push(
                    <Step
                        status="process"
                        title={item.arrival}
                        subTitle={`${item.arrival_time} (GMT${flight.arrival_timezone > 0 ? '+' : ''}${flight.arrival_timezone})`}
                    />
                );
            } else {
                items.push(
                    <Step
                        status="process"
                        title={item.departure}
                        subTitle={`${item.departure_time} (GMT${flight.departure_timezone > 0 ? '+' : ''}${flight.departure_timezone})`}
                        description={
                            <Alert
                                className="flight-info-card"
                                description={
                                    <Descriptions column={1}>
                                        <Descriptions.Item span={1} label="Airline">{item.airline} ({item.airline_code})</Descriptions.Item>
                                        <Descriptions.Item span={1} label="Flight Number">{item.flight_number}</Descriptions.Item>
                                        <Descriptions.Item span={1} label="Estimate Time">{item.duration} mins</Descriptions.Item>
                                    </Descriptions>
                                }
                                type="info"
                                showIcon
                            />
                        }
                    />
                );
            }
        })

        return (
            <Card {...restProps} className="flight-details-item">
                <Row>
                    <Col md={6} className="d-flex flex-column justify-content-between">
                        <div>
                            {airlines.join(" | ")}
                        </div>
                        <div>
                            <Button type="primary" className="m-0" onClick={() => this.setState({ showDetail: !showDetail })} icon="info-circle">
                                <IntlMessages id="flight.detail" />
                            </Button>
                        </div>
                    </Col>
                    <Col md={14}>
                        <Row>
                            <Col md={6} className="d-flex flex-column justify-content-between align-items-center">
                                <div>
                                    <div><b>{moment(flight.departure_time).format('HH:mm')} (GMT{flight.departure_timezone > 0 ? '+' : ''}{flight.departure_timezone})</b></div>
                                    <div><b>{moment(flight.departure_time).format('YYYY-MM-DD')}</b></div>
                                </div>
                                <div className="mt-3">{selectedDeparture}</div>
                            </Col>
                            <Col md={6} className="text-center">
                                <Icon type="double-right" />
                                <Icon type="double-right" />
                                <Icon type="double-right" />
                            </Col>
                            <Col md={6} className="d-flex flex-column justify-content-between align-items-center">
                                <div><b>{moment(flight.arrival_time).format('HH:mm')} (GMT{flight.arrival_timezone > 0 ? '+' : ''}{flight.arrival_timezone})</b></div>
                                <div><b>{moment(flight.arrival_time).format('YYYY-MM-DD')}</b></div>
                                <div className="mt-3">{selectedDestination}</div>
                            </Col>
                            <Col md={6} className="text-center">
                                <div><Icon type="clock-circle" /><b className="ml-2">{durationHours}h{durationMinutes}m</b></div>

                                {
                                    flight.items.length > 1 ? (
                                        <div className="mt-3">
                                            <Badge status="warning" className="mr-0 mb-0" /> <span>{flight.items.length} stops</span>
                                        </div>
                                    ) : (
                                            <div className="mt-3">
                                                <Badge status="success" /> <span><IntlMessages id="flight.direct_flight" /></span>
                                            </div>
                                        )
                                }

                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} className="d-flex align-items-center">
                        <Typography.Title className="m-0" level={3} type="warning">
                            <Icon type="credit-card" />
                            <span className="ml-2">{flight.price} {flight.currency}</span>
                        </Typography.Title>
                    </Col>
                </Row>
                {
                    showDetail ? (
                        <div>
                            <Divider />
                            <Steps progressDot current={flight.items.length} direction="vertical">
                                {
                                    items.map(item => item)
                                }
                            </Steps>
                        </div>
                    ) : null
                }
            </Card>
        )
    }
}
