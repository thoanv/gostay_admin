import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Select, Form, Table, Button, Input, Icon, Divider } from 'antd';
import IntlMessages from 'Util/IntlMessages';
import { NotificationManager } from 'react-notifications';
import BaseSelect from 'Components/Elements/BaseSelect';
// actions
import { getAllCountry } from '../../../actions/CountryActions';
import { getAllDestination } from '../../../actions/DestinationActions';
import { updateDepartureInTour, getTourDetail } from '../../../actions/TourActions';

class DepartureModal extends Component {
    state = {
        selectedDestination: '',
        currentDestination: null,
        rows: []
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.tour !== this.props.tour && nextProps.tour) {
            this.props.getTourDetail(nextProps.tour).then(tour => {
                this.setState({
                    rows: tour.departures,
                    selectedDestination: '',
                    currentDestination: null,
                });

                this.props.getAllDestination({
                    country_id: {
                        type: '=',
                        value: tour.country_id
                    },
                    paging: 0
                });
            })
        }

    }

    onChangeDestination(value) {
        let temp = this.props.destionations.find(elem => elem.id.toString() === value.toString());

        this.setState({
            selectedDestination: value,
            currentDestination: temp
        })
    }

    addRow() {
        if (this.state.currentDestination) {
            let temp = this.state.rows.find(elem => elem.id.toString() == this.state.currentDestination.id.toString());
            if (!temp) {
                this.setState({
                    rows: [
                        ...this.state.rows,
                        {
                            id: this.state.currentDestination.id,
                            destination_txt: this.state.currentDestination.title,
                            price: 0,
                            single_price: 0
                        }
                    ]
                }, () => {
                    this.setState({
                        currentDestination: null,
                        selectedDestination: ''
                    })
                })
            } else {
                NotificationManager.error("This city is existed in list!")
            }
        }
    }

    onChangeData(id, property_name, value) {
        let newRows = this.state.rows;
        let currentRow = newRows.find(elem => elem.id == id);
        currentRow[property_name] = value;

        this.setState({
            rows: newRows
        });
    }

    onDelete(id) {
        let newRows = this.state.rows.filter(elem => {
            return elem.id != id
        });

        this.setState({
            rows: newRows
        });
    }

    onSave() {
        this.props.updateDepartureInTour(
            this.props.tour,
            {
                departure: this.state.rows
            }
        ).then(() => {
            this.props.onCloseModal();
            this.setState({
                selectedDestination: '',
                currentDestination: null
            });
        })
    }

    onCancel() {
        this.props.onCloseModal();
        this.setState({
            selectedDestination: '',
            currentDestination: null
        });
    }

    render() {
        var { tour, destionations } = this.props;

        return (
            <div>
                <Modal
                    title={<IntlMessages id="global.status" />}
                    visible={this.props.isVisible}
                    onCancel={this.props.onCloseModal}
                    footer={[
                        <Button key="back" onClick={this.props.onCloseModal}>
                            <IntlMessages id="global.cancel" />
                        </Button>,
                        <Button key="normal" type="primary" onClick={() => this.onSave()}>
                            <IntlMessages id="global.submit" />
                        </Button>
                    ]}
                    width={800}
                >
                    <div>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                            <Form.Item>
                                {/* <Select
                                    value={this.state.selectedDestination}
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="Select a destination"
                                    optionFilterProp="children"
                                    onChange={(value) => this.onChangeDestination(value)}
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Option value=''>Select a destination</Option>
                                    {
                                        destionations.map((destionation, index) => {
                                            return (
                                                <Option key={index} value={destionation.id}>{destionation.title}</Option>
                                            )
                                        })
                                    }
                                </Select> */}
                                <BaseSelect
                                    options={destionations}
                                    value={this.state.selectedDestination}
                                    showSearch
                                    style={{ width: 200 }}
                                    defaultText="Select a destination"
                                    optionFilterProp="children"
                                    onChange={(value) => this.onChangeDestination(value)}
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    disabled={!this.state.currentDestination}
                                    type="primary"
                                    icon="plus"
                                    onClick={() => this.addRow()}
                                >
                                    Add
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="mt-4">
                        <Table
                            pagination={false}
                            rowKey="id"
                            columns={[
                                {
                                    title: 'City',
                                    dataIndex: 'destination_txt',
                                    align: 'left'
                                },
                                // {
                                //     title: 'Price',
                                //     dataIndex: 'price',
                                //     render: (text, record) => (
                                //         <Input placeholder="Price" value={record.price} onChange={(e) => this.onChangeData(record.id, 'price', e.target.value)} />
                                //     ),
                                //     align: 'left'
                                // },
                                {
                                    title: 'Single price',
                                    dataIndex: 'single_price',
                                    render: (text, record) => (
                                        <Input placeholder="Single price" value={record.single_price} onChange={(e) => this.onChangeData(record.id, 'single_price', e.target.value)} />
                                    ),
                                    align: 'left'
                                },
                                {
                                    title: 'Actions',
                                    dataIndex: '',
                                    render: (text, record) => (
                                        <span>
                                            {/* <Button size='small' type="primary">Edit</Button>
                                            <Divider type="vertical" /> */}
                                            <Button size='small' type="danger" onClick={() => this.onDelete(record.id)}>Delete</Button>
                                        </span>
                                    ),
                                    align: 'left'
                                },
                            ]}
                            dataSource={this.state.rows}
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        // countries: state.country.listCountry,
        destionations: state.destination.listDestination
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllCountry: () => dispatch(getAllCountry({ paging: 0 })),
        getAllDestination: (filter) => dispatch(getAllDestination(filter)),
        updateDepartureInTour: (id, data) => dispatch(updateDepartureInTour(id, data)),
        getTourDetail: (id) => dispatch(getTourDetail(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepartureModal);