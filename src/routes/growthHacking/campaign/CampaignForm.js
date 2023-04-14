import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import { Card, DatePicker, Form, Input, InputNumber, Row, Col, Table, Icon, Button } from 'antd';
import BaseSelect from "Components/Elements/BaseSelect";
import moment from 'moment';
// actions
import { getAllRules } from 'Actions/GrowthHackingTypeAction';
import { createCampaign } from 'Actions/GrowthHackingCampaignAction';
import { getAllTour } from 'Actions/TourActions';
import { _getAll } from 'Actions/PropertyAction';


class CampaignForm extends Component {
    state = {
        rule: 1,
        type: 'tour',
        remain: 0,
        min_value: 0,
        max_value: 0,
        show_from_date: new Date(),
        show_until_date: new Date(),
        items: []
    }

    componentDidMount() {
        this.props.getAllRules();
        this.props.getAllTour();
        this.props.getAllProperties();
    }

    onChangeData(name, value) {
        this.setState({ [name]: value });
    }

    onSearchTour(keyword) {
        this.props.getAllTour({
            title: {
                type: "like",
                value: keyword,
            }
        });
    }

    onSearchProperty(keyword) {
        this.props.getAllProperties({
            title: {
                type: "like",
                value: keyword,
            }
        });
    }

    onSelect(value, option) {
        var { items } = this.state;

        var index = items.findIndex(item => item.object_id == option.props.value);

        if (index < 0) {
            items.push({
                object_id: option.props.value,
                name: option.props.children,
                min_value: this.state.min_value,
                max_value: this.state.max_value,
                remain: this.state.remain,
                show_from_date: this.state.show_from_date.toISOString().substr(0, 10),
                show_until_date: this.state.show_until_date.toISOString().substr(0, 10)
            });
        }

        this.setState({ items })
    }

    onDeleteItem(id) {
        var { items } = this.state;
        items = items.filter(item => item.object_id != id);

        this.setState({ items });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var { items } = this.state

                var data = {
                    campaign: {
                        name: values.name,
                        rule: values.rule,
                        type: values.type,
                        show_from_date: values.show_from_date.format('YYYY-MM-DD HH:mm:ss'),
                        show_until_date: values.show_until_date.format('YYYY-MM-DD HH:mm:ss')
                    },
                    items: items
                }

                this.props.createCampaign(data).then(() => {
                    this.props.history.push('/app/growth-hacking/campaigns')
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        var { rule, type, items } = this.state;
        console.log('items',items);
        const { rules, tours, properties } = this.props;

        const columns = [
            {
                title: <IntlMessages id="global.title" />,
                key: "name",
                dataIndex: "name",
                width: '20%'
            },
            {
                title: <IntlMessages id="global.min_value" />,
                key: "min_value",
                dataIndex: "min_value",
                render: (text) => (
                    <InputNumber defaultValue={text} required />
                )
            },
            {
                title: <IntlMessages id="global.max_value" />,
                key: "max_value",
                dataIndex: "max_value",
                render: (text) => (
                    <InputNumber defaultValue={text} required />
                )
            },
            {
                title: <IntlMessages id="global.show_from_date" />,
                key: "show_from_date",
                dataIndex: "show_from_date",
                render: (text) => (
                    <DatePicker defaultValue={moment(text)} required />
                )
            },
            {
                title: <IntlMessages id="global.show_ulti_date" />,
                key: "show_until_date",
                dataIndex: "show_until_date",
                render: (text) => (
                    <DatePicker defaultValue={moment(text)} required />
                )
            },
            {
                title: <IntlMessages id="global.delete" />,
                key: "object_id",
                dataIndex: "object_id",
                render: (text) => (
                    <Button shape="circle" type="danger" onClick={() => this.onDeleteItem(text)}>
                        <Icon type="delete" />
                    </Button>
                )
            }
        ];

        if (rule == 1) {
            columns[1] = {
                title: <IntlMessages id="global.remain" />,
                key: "remain",
                dataIndex: "remain",
                render: (text) => (
                    <InputNumber defaultValue={text} required />
                )
            }
            delete columns[2];
        }

        return (
            <div>
                <PageTitleBar
                    title={<IntlMessages id="campaign.form" />}
                    match={this.props.match}
                />
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                    labelAlign="left"
                    onSubmit={(e) => this.handleSubmit(e)}
                >
                    <Row gutter={16}>
                        <Col sm={24} md={24} lg={24}>
                            <Card>

                                <Form.Item label={<IntlMessages id="global.title" />}>
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: 'Required' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.type" />}>
                                    {getFieldDecorator('type', {
                                        rules: [{ required: true, message: 'Required' }],
                                    })(
                                        <BaseSelect
                                            options={[
                                                { value: 'tour', label: 'Tour' },
                                                { value: 'property', label: 'Property' }
                                            ]}
                                            optionValue="value"
                                            optionLabel="label"
                                            onChange={(value) => this.onChangeData('type', value)}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.rule" />}>
                                    {getFieldDecorator('rule', {
                                        rules: [{ required: true, message: 'Required' }],
                                    })(
                                        <BaseSelect
                                            options={rules}
                                            optionValue="id"
                                            optionLabel="name"
                                            onChange={(value) => this.onChangeData('rule', value)}
                                        />
                                    )}
                                </Form.Item>

                                {
                                    rule == 1 ? (
                                        <Form.Item label={<IntlMessages id="global.remain_product" />}>
                                            {getFieldDecorator('remain', {
                                                rules: [{ required: true, message: 'Required' }],
                                            })(
                                                <InputNumber style={{ width: '100%' }} onChange={(value) => this.onChangeData('remain', value)} />
                                            )}
                                        </Form.Item>
                                    ) : (
                                            <React.Fragment>
                                                <Form.Item label={<IntlMessages id="global.min_value" />}>
                                                    {getFieldDecorator('min_value', {
                                                        rules: [{ required: true, message: 'Required' }],
                                                    })(
                                                        <InputNumber style={{ width: '100%' }} onChange={(value) => this.onChangeData('min_value', value)} />
                                                    )}
                                                </Form.Item>
                                                <Form.Item label={<IntlMessages id="global.max_value" />}>
                                                    {getFieldDecorator('max_value', {
                                                        rules: [{ required: true, message: 'Required' }],
                                                    })(
                                                        <InputNumber style={{ width: '100%' }} onChange={(value) => this.onChangeData('max_value', value)} />
                                                    )}
                                                </Form.Item>
                                            </React.Fragment>
                                        )
                                }
                                <Form.Item label={<IntlMessages id="global.show_from_date" />}>
                                    {getFieldDecorator('show_from_date', {
                                        rules: [{ required: true, message: 'Required' }],
                                    })(
                                        <DatePicker style={{ width: '100%' }} onChange={(value) => this.onChangeData('show_from_date', value)} />
                                    )}
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.show_ulti_date" />}>
                                    {getFieldDecorator('show_until_date', {
                                        rules: [{ required: true, message: 'Required' }],
                                    })(
                                        <DatePicker style={{ width: '100%' }} onChange={(value) => this.onChangeData('show_until_date', value)} />
                                    )}
                                </Form.Item>
                            </Card>
                        </Col>
                        <Col sm={24} md={24} lg={24}>
                            <Card>
                                <div>
                                    <span className="mr-2">{<IntlMessages id="global.choose_item" />}:</span>
                                    {
                                        type == 'tour' ? (
                                            <BaseSelect
                                                options={tours}
                                                optionValue="id"
                                                optionLabel="title"
                                                defaultText="Choose a Tour"
                                                showSearch
                                                onChange={(value, option) => this.onSelect(value, option)}
                                                onSearch={(value) => this.onSearchTour(value)}
                                                style={{ width: '600px', marginBottom: '30px' }}
                                            />
                                        ) : (
                                                <BaseSelect
                                                    options={properties}
                                                    optionValue="id"
                                                    optionLabel="title"
                                                    defaultText="Choose a Property"
                                                    showSearch
                                                    onChange={(value, option) => this.onSelect(value, option)}
                                                    onSearch={(value) => this.onSearchTour(value)}
                                                    style={{ width: '600px', marginBottom: '30px' }}
                                                />
                                            )
                                    }

                                </div>
                                <Table
                                    columns={columns}
                                    dataSource={items}
                                    // onChange={this.onChangTable}
                                    rowKey="object_id"
                                    size="small"

                                />
                            </Card>
                        </Col>
                    </Row>
                    <Button htmlType="submit" type="primary"><IntlMessages id="global.create" /></Button>
                </Form>
            </div >
        )
    }
}

function mapStateToProps(state) {
    return {
        rules: state.growthHackingRule.rules,
        tours: state.tour.listTour,
        properties: state.property.list
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllRules: () => dispatch(getAllRules()),
        getAllTour: (filter) => dispatch(getAllTour(filter)),
        createCampaign: (data) => dispatch(createCampaign(data)),
        getAllProperties: (filter) => dispatch(_getAll(filter))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'campaign_form' })(CampaignForm));