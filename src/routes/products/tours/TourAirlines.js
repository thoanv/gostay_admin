import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Table, Checkbox, Input, Icon, Row, Col, Modal, Spin, Tabs } from 'antd';
import BaseSelect from 'Components/Elements/BaseSelect';
import StatusButton from "Components/StatusButton";
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
// actions
import { getAllAirlines } from '../../../actions/AirlineActions';
import { updateTourAirlines, getTourDetail } from '../../../actions/TourActions';

const { TabPane } = Tabs;

class TourAirlines extends Component {
    state = {
        selectedAirline: {
            id: ""
        },
        selectedDeparture: {
            id: ''
        },
        rows: [],
        isLoading: false,
        activeTab: '1'
    }

    componentDidMount() {
        this.props.getAllAirlines({ paging: 0 });
        // if (this.props.tourAirlines.length) {
        //     this.setState({
        //         rows: this.props.tourAirlines
        //     })
        // }
    }

    // UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    //     if (nextProps.tourAirlines) {
    //         if (nextProps.tourAirlines !== this.props.tourAirlines) {
    //             this.setState({
    //                 rows: nextProps.tourAirlines
    //             })
    //         }
    //     }
    // }

    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.visible && nextProps.visible != this.props.visible) {
            this.setState({ isLoading: true, activeTab: nextProps.defaultTab });
            this.props.getTourDetail(nextProps.tour_id).then((tour) => {
                this.setState({
                    isLoading: false,
                    rows: nextProps.defaultTab =='1' ? tour.onward_airlines : tour.return_airlines
                })
            });
        }
    }

    onChangeDeparture(value) {
        let temp = this.props.tour.departures.find(elem => elem.id.toString() === value.toString());
        this.setState({
            selectedDeparture: temp
        })
    }

    onChangeAirline(value) {
        let temp = this.props.airlines.find(elem => elem.id.toString() === value.toString());
        this.setState({
            selectedAirline: temp
        })
    }

    // onAdd() {
    //     let temp = this.state.rows.find(elem => elem.id.toString() === this.state.selectedAirline.id.toString());
    //     if (temp) NotificationManager.error("This airline is added before!");
    //     else {
    //         this.setState({
    //             rows: [
    //                 ...this.state.rows,
    //                 {
    //                     // id: null,
    //                     id: this.state.selectedAirline.id,
    //                     departure_code: this.state.selectedDeparture.code,
    //                     airline_title: this.state.selectedAirline.title,
    //                     is_default: !this.state.rows.length, // true when this is first element in array
    //                     price: 0,
    //                     status: 1,
    //                 }
    //             ],
    //             selectedAirline: {
    //                 id: ''
    //             },
    //             selectedDeparture: {
    //                 id: ''
    //             }
    //         })
    //     }
    // }

    onChangeData(id, name, value) {
        var data = this.state.rows;
        let element = data.find(item => item.id.toString() == id.toString());
        element[name] = value;

        if (name == 'is_default') {
            if (value) {
                // uncheck all other items have same departure
                
                data = data.map(item => {
                    if (item.departure_code == element.departure_code && item.id.toString() != id.toString()) 
                        item.is_default = false;

                    return item;
                })
            } else {
                // default is first item have same departure
                let defaultElement = data.find(item => item.departure_code == element.departure_code);
                defaultElement.is_default = true;
            }
        }

        this.setState({
            rows: data
        })
    }

    onDelete(id) {
        var data = this.state.rows;
        data = data.filter(item => {
            return item.id.toString() != id.toString();
        });

        this.setState({
            rows: data
        }, () => {
            console.log(this.state.rows);
        })
    }

    onClose() {
        this.props.onClose();
        this.setState({
            rows: [],
            activeTab: '1',
        })
    }

    onChangeTab(key) {
        if(key == '1') {
            this.setState({
                activeTab: '1',
                rows: this.props.tour.onward_airlines
            })
        } else if (key == '2') {
            this.setState({
                activeTab: '2',
                rows: this.props.tour.return_airlines
            })
        }
    }

    submit() {
        let airlines = this.state.rows.map(item => {
            if(!item.surcharge_for_business) {
                item.surcharge_for_business = 0;
            }
            return item;
        });

        if(this.state.activeTab == '1') {
            airlines = [...airlines, ...this.props.tour.return_airlines];
        } else {
            airlines = [...airlines, ...this.props.tour.onward_airlines];
        }

        this.props.updateTourAirlines(this.props.tour_id, { airline: airlines });
    }

    render() {
        var { airlines, tour_id } = this.props;
        var { rows, isLoading, activeTab } = this.state;

        var data = airlines.map(airline => {
            return {
                id: airline.id,
                title: `${airline.title} (${airline.code})`
            }
        });

        var counts = {};
        rows.forEach(function (row) { counts[row.departure_code] = (counts[row.departure_code] || 0) + 1; });
        var values = Object.values(counts);
        var indexes = [0];
        values.forEach((value, i) => {
            indexes.push(value + indexes[i]);
        });
        indexes.pop(); // remove last element

        var columns = [
            {
                title: 'Departure',
                dataIndex: 'departure_code',
                align: 'left',
                render: (value, row, index) => {
                    const obj = {
                        children: value,
                        props: {},
                    };
                    if (index === 0 || indexes.indexOf(index) >= 0) {
                        obj.props.rowSpan = counts[value];
                    }
                    else obj.props.rowSpan = 0;
                    return obj;
                },
            },
            {
                title: 'Title',
                dataIndex: 'airline_title',
                align: 'left',
                render: (text, record) => (
                    <div>{record.airline_title} ({record.airline_code})</div>
                ),
            },
            {
                title: 'Default',
                dataIndex: 'is_default',
                render: (text, record) => (
                    <Checkbox checked={record.is_default} onChange={() => this.onChangeData(record.id, 'is_default', !record.is_default)} />
                ),
                align: 'left'
            },
            {
                title: 'Surcharge',
                dataIndex: 'price',
                render: (text, record) => (
                    <Input type="number" value={record.price} onChange={(e) => this.onChangeData(record.id, 'price', e.target.value)} />
                ),
                width: 200,
                align: 'left'
            },
            {
                title: 'Surcharge for Business',
                dataIndex: 'surcharge_for_business',
                render: (text, record) => (
                    <Input type="number" value={record.surcharge_for_business} onChange={(e) => this.onChangeData(record.id, 'surcharge_for_business', e.target.value)} />
                ),
                width: 200,
                align: 'left'
            },
            {
                title: 'Status',
                dataIndex: 'status',
                render: (text, record) => (
                    <div onClick={() => this.onChangeData(record.id, 'status', !record.status)}>
                        {
                            record.status ? (
                                <Icon type='check-square' theme="twoTone" twoToneColor="#52c41a" />
                            ) : (
                                    <Icon type='close-square' theme="twoTone" twoToneColor="#eb2f96" />
                                )
                        }
                    </div>
                ),
                align: 'center'
            },
            {
                title: 'Actions',
                dataIndex: '',
                render: (text, record) => (
                    <span>
                        <Button size='small' type="danger" onClick={() => this.onDelete(record.id)}>Delete</Button>
                    </span>
                ),
                align: 'left'
            },
        ];

        if (!tour_id || isLoading) {
            return (
                <Modal
                    title="Tour Airlines"
                    visible={this.props.visible}
                    onCancel={() => this.onClose()}
                >
                    <Spin
                        indicator={
                            <Icon type="loading" style={{ fontSize: 40 }} spin />
                        }
                    />
                </Modal>
            )
        }

        return (
            <Modal
                title="Tour Airlines"
                visible={this.props.visible}
                onOk={() => this.submit()}
                onCancel={() => this.onClose()}
                style={{ minWidth: '1000px' }}
                footer={[
                    <Button key="back" onClick={() => this.props.onBack()}>
                        <IntlMessages id="button.back" />
                    </Button>,
                    <Button key="cancel" onClick={() => this.onClose()}>
                        <IntlMessages id="button.cancel" />
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => this.submit()}>
                        <IntlMessages id="global.submit" />
                    </Button>,
                ]}
            >
                <div className="mt-4 mb-4">
                    <Tabs activeKey={activeTab} onChange={(key) => this.onChangeTab(key)}>
                        <TabPane tab="Onward Airlines" key="1"></TabPane>
                        <TabPane tab="Return Airlines" key="2"></TabPane>
                    </Tabs>
                    <Table
                        pagination={false}
                        rowKey="id"
                        columns={columns}
                        dataSource={this.state.rows}
                    />
                </div>

                {/* <Row>
                    <Col span={24} style={{ textAlign: "right" }}>
                        <Button
                            className="ml-4"
                            type='default'
                            onClick={() => this.onClose()}
                        >
                            <IntlMessages id="global.cancel" />
                        </Button>
                        <Button
                            type="primary"
                            style={{ marginLeft: 8 }}
                            onClick={(e) => this.submit(e)}
                        >
                            <IntlMessages id="global.submit" />
                        </Button>
                    </Col>
                </Row> */}
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        airlines: state.airline.listAirlines,
        tour: state.tour.currentTour
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllAirlines: (filter) => dispatch(getAllAirlines(filter)),
        updateTourAirlines: (id, data) => dispatch(updateTourAirlines(id, data)),
        getTourDetail: (id) => dispatch(getTourDetail(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TourAirlines);