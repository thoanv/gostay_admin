import React from 'react';
import { Table, Button, Modal, Tabs, Icon, Input } from "antd";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import TableActionBar from '../../components/TableActionBar';
import moment from 'moment'
import { connect } from 'react-redux';
import { getListCampaigns, addCampaign, getListSubscribers, getListMembersSegment, getListSegments } from '../../actions/NewsletterAction';

import Recipents from './Recipents'
import Templates from './Templates'


const { TabPane } = Tabs



class FormCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            subject: "",
            segment_id: null,
            template_id: null,
            isLoading: false,
            selectedRowKey: []
        }
    }

    onSelectRowChange = (rows) => {
        this.setState({
            segment_id: rows[rows.length - 1],
        });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeSegment = (id) => {
        this.setState({
            segment_id: id
        })
    }

    onChangeTemplate = (id) => {
        this.setState({
            template_id: id
        })
    }

    onAdd = () => {
        this.setState({
            isLoading: true
        })
        let { name, subject, template_id, segment_id } = this.state;
        this.props.addCampaign(name, subject, template_id, segment_id).then(data => {
            this.props.onCancel();
            this.props.onRefresh();
            this.setState({
                isLoading: false
            })
        }).catch(err => {
            this.setState({
                isLoading: false
            })
        })
    }

    checkIsEnableCreate = () => {
        let { name, subject, template_id, segment_id } = this.state;
        if (name !== "" && subject !== "" && template_id !== null && segment_id !== null) {
            return true;
        }
        return false;
    }

    componentDidMount() {
        this.props.getListSubscribers();
        this.props.getListSegments();
    }

    render() {
        console.log(this.state, 'state')
        let { isOpen, onSubmit, onCancel } = this.props;
        let columns = [
            {
                title: <IntlMessages id="global.title" />,
                // dataIndex: "name",
                // key: "name",
                className: "center-column",
                render: (text, record) => {
                    return (
                        <b style={{ color: "blue", cursor: "pointer" }} onClick={() => { this.onOpenModalRecipient(record) }} >{record.name} </b>
                    )
                }
            },
            {
                title: <IntlMessages id="newsletter.recipents" />,
                dataIndex: "member_count",
                key: "member_count",
                className: "center-column",
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
                className: "center-column",
            },

        ];

        const { selectedRowKey, segment_id } = this.state;
        const rowSelection = {
            selections: [segment_id],
            onChange: this.onSelectRowChange,
            type: "radio"
        };
        return (
            <React.Fragment>
                <Modal
                    title={<IntlMessages id="global.create" />}
                    visible={isOpen}
                    onOk={() => { this.onAdd() }}
                    onCancel={onCancel}
                    width="1000px"
                    footer={[
                        <Button key="back" onClick={onCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.onAdd} disabled={!this.checkIsEnableCreate()} loading={this.state.isLoading}>
                            Submit
                        </Button>,
                    ]}
                >
                    <Tabs defaultActiveKey="1">
                        <TabPane
                            tab={<span> <Icon type="info" /> <IntlMessages id="global.base_info" /></span>}
                            key="1"

                        >
                            <div style={{ alignItems: "center", justifyContent: "center", display: "flex", flexDirection: 'column' }}>
                                <Input placeholder="Campaign Name" style={{ width: "70%" }} className="mb-4" name="name" onChange={this.onChange} value={this.state.name} />
                                <Input placeholder="Subject" style={{ width: "70%" }} name="subject" onChange={this.onChange} value={this.state.subject} />
                            </div>

                        </TabPane>
                        <TabPane
                            tab={<span> <Icon type="usergroup-add" /> <IntlMessages id="newsletter.recipents" /></span>}
                            key="2"
                        >
                            {/* <Recipents onChange={(id) => { this.onChangeSegment(id) }} /> */}

                            <Table
                                columns={columns}
                                dataSource={[{ id: 0, name: "All Subcriber", member_count: this.props.newsletter.subscribers.length }, ...this.props.newsletter.segments]}
                                rowKey="id"
                                size="small"
                                tableLayout="auto"
                                pagination={false}
                                rowSelection={rowSelection}

                            />
                        </TabPane>
                        <TabPane
                            tab={<span> <Icon type="file-unknown" /> <IntlMessages id="newsletter.template" /></span>}
                            key="3"
                        >
                            <Templates onChange={(id) => { this.onChangeTemplate(id) }} />
                        </TabPane>
                    </Tabs>

                </Modal>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        newsletter: state.newsletter
    }
}

export default connect(mapStateToProps, { addCampaign, getListSubscribers, getListMembersSegment, getListSegments })(FormCreate)