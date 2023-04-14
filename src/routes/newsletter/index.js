import React, { useState } from 'react';
import { Table, Button, Modal, Tabs, Spin, DatePicker } from "antd";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import TableActionBar from '../../components/TableActionBar';
import moment from 'moment'
import { connect } from 'react-redux';
import { getListCampaigns, deleteCampaign, sendCampaign, scheduleCampaign, resendCampaign } from '../../actions/NewsletterAction';
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons';
import FormCreate from './FormCreate'

const confirm = Modal.confirm;


function CampaignPreview(props) {
    let { data, isOpen, handleClick } = props;
    let url = data ? data.archive_url : '';
    return (
        <Modal
            title="Schedule"
            visible={isOpen}
            onOk={handleClick}
            onCancel={handleClick}
            width="1000px"

        >
            <iframe src={url} title="W3Schools Free Online Web Tutorials" style={{ width: "100%", height: "80vh" }} />
        </Modal>
    )
}

function ScheduleForm(props) {
    let { data, isOpen, handleClick, onOk } = props;
    const [datetime, setDateTime] = useState(moment());
    return (
        <Modal
            title="Schedule"
            visible={isOpen}
            onOk={onOk}
            onCancel={handleClick}
            width="50%"

        >
            <DatePicker showTime placeholder="Select Time" onChange={(datetime) => {
                setDateTime(moment(datetime).format('YYYY-MM-DD HH:mm'));
            }} onOk={() => { }} />
        </Modal>
    )
}

function RecipentModal(props) {

    let { data, isOpen, handleClick } = props;
    let data_recips = data ? data.recipients : [];

    if (data_recips.segment_opts) {
        data_recips = data_recips.segment_opts.conditions;
    }
    else {
        data_recips = [];
    }
    let recipients = data_recips.filter(_ => _.value);
    let columns = [
        {
            title: <IntlMessages id="global.email" />,
            dataIndex: "value",
            key: "value",
            className: "center-column",
        }
    ];
    return (
        <Modal
            title="Recipents"
            visible={isOpen}
            onOk={handleClick}
            onCancel={handleClick}
        >
            <Table
                columns={columns}
                dataSource={recipients}
                rowKey="value"
                size="small"
                tableLayout="auto"
                pagination={false}
            />
        </Modal>
    )
}

class Newsletter extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    state = {
        selectedRowKeys: [],
        openModalRecipents: false,
        cItem: null,
        openModalPreview: false,
        openModalForm: false,
        isLoading: false,
        openModalSchedule: false
    }

    onCloseModalRecipents = () => {
        this.setState({
            openModalRecipents: false,
            cItem: null
        })
    }

    onOpenModalRecipents = (item) => {
        this.setState({
            openModalRecipents: true,
            cItem: item
        })
    }

    onCloseModalPreview = () => {
        this.setState({
            openModalPreview: false,
            cItem: null
        })
    }

    onOpenModalPreview = (item) => {
        this.setState({
            openModalPreview: true,
            cItem: item
        })
    }

    onCloseModalForm = () => {
        this.setState({
            openModalForm: false,
        })
    }

    onOpenModalForm = () => {
        this.setState({
            openModalForm: true,
        })
    }

    onCloseModalSchedule = () => {
        this.setState({
            openModalSchedule: false,
        })
    }

    onOpenModalSchedule = (item) => {
        this.setState({
            cItem: item,
            openModalSchedule: true,
        })
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };

    componentDidMount() {
        this.setState({
            isLoading: true
        })
        this.props.getListCampaigns().then(res => {
            this.setState({
                isLoading: false
            })
        }).catch(err => {
            this.setState({
                isLoading: false
            })
        });
    }

    onDeleteCampaign = (item) => {
        this.setState({
            isLoading: true
        })
        this.props.deleteCampaign(item.id).then((data) => {
            this.setState({
                isLoading: false
            })
            this.props.getListCampaigns();
        }).catch(err => {
            this.setState({
                isLoading: false
            })
        });

    }

    onSendCampaign = (item) => {
        this.setState({
            isLoading: true
        })
        this.props.sendCampaign(item.id).then((data) => {
            this.setState({
                isLoading: false
            })
            this.props.getListCampaigns();
        }).catch(err => {
            this.setState({
                isLoading: false
            })
        });

    }
    onScheduleCampaign = (datetime) => {
        this.setState({
            isLoading: true
        })
        this.props.scheduleCampaign(this.state.cItem.id, datetime).then((data) => {
            this.setState({
                isLoading: false,
                openModalSchedule: false
            })
            this.props.getListCampaigns();
        }).catch(err => {
            this.setState({
                isLoading: false,
                openModalSchedule: false
            })
        });

    }
    openSendAlert(item) {
        confirm({
            title: "Bạn có muốn gửi chiến dịch này?",
            okText: 'Có',
            cancelText: 'Huỷ',
            onOk: () => this.onSendCampaign(item),
            onCancel() { }
        });
    }


    openAlert(item) {
        confirm({
            title: "Bạn có muốn xóa bản ghi này không?",
            okText: 'Có',
            cancelText: 'Huỷ',
            okType: "danger",
            onOk: () => this.onDeleteCampaign(item),
            onCancel() { }
        });
    }

    confirmResend(item) {
        confirm({
            title: "Bạn có muốn gửi lại chiến dịch này không?",
            okText: "Có",
            cancelText: "Huỷ",
            okType: "danger",
            onOk: () => this.onResendCampaign(item),
            onCancel() { }
        });
    }

    onResendCampaign = (item) => {
        this.setState({
            isLoading: true
        })
        this.props.resendCampaign(item.id).then((data) => {
            this.setState({
                isLoading: false,
            })
            this.props.getListCampaigns();
        }).catch(err => {
            this.setState({
                isLoading: false,
            })
        });
    }

    render() {
        const columns = [
            {
                title: <IntlMessages id="global.title" />,
                key: 'title',
                render: (text, record) => {
                    let { settings } = record;
                    return (
                        <b style={{ color: "blue", cursor: "pointer" }} onClick={() => { this.onOpenModalPreview(record) }} >{settings.title ? settings.title : settings.subject_line} </b>
                    )
                }
            },
            {
                title: <IntlMessages id="global.status" />,
                dataIndex: "status",
                key: "status"
            },
            {
                title: <IntlMessages id="newsletter.recipents" />,
                className: "center-column",
                key: 'recipents',
                render: (text, record) => (
                    <b style={{ color: "blue", cursor: "pointer" }}
                    // onClick={() => this.onOpenModalRecipents(record)}
                    >
                        {record.recipients ? record.recipients.recipient_count : 0}
                    </b>
                )
            },
            {
                title: <IntlMessages id="global.created" />,
                // dataIndex: "id",
                key: "created",
                className: "center-column",
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(record.create_time).format("DD/MM/YYYY HH:mm")}</div>
                    </React.Fragment>
                )
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
                className: "center-column",
                sorter: true
            },
            {
                title: <IntlMessages id="global.actions" />,
                className: "center-column",
                key: 'action',
                render: (text, record) => {
                    return (
                        <React.Fragment>
                            <Button
                                type="primary" className="mr-4" size="small" onClick={() => {
                                    this.openSendAlert(record)
                                }}><IntlMessages id="newsletter.send" /></Button>
                            <Button type="primary" className="mr-4" size="small" onClick={() => {
                                this.onOpenModalSchedule(record)
                            }}><IntlMessages id="newsletter.schedule" /></Button>
                            <Button type="primary" className="mr-4" size="small" onClick={() => {
                                this.confirmResend(record)
                            }}><IntlMessages id="newsletter.resend" /></Button>
                            <Button
                                size="small"
                                type="danger" onClick={() =>
                                    this.openAlert(record)
                                }><IntlMessages id="newsletter.delete" /></Button>
                        </React.Fragment>
                    )
                }
            },
        ];

        const { selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <React.Fragment>
                <Spin tip="" spinning={this.state.isLoading}>
                    <div className="formelements-wrapper">
                        <PageTitleBar
                            title={<IntlMessages id="sidebar.newsletter.campaign" />}
                            match={this.props.match}
                        />
                        <div className="row">
                            <RctCollapsibleCard colClasses="col-12">
                                <TableActionBar
                                    onAdd={() => { this.onOpenModalForm() }}
                                    onDelete={() => { }}
                                    onRefresh={() => { }}
                                    isDisabled={!hasSelected}
                                    rows={this.state.selectedRowKeys}
                                    table=""
                                    isShowPublishButtons={false}
                                    isShowDeleteButton={false}
                                    textSearch={false}
                                // onFilter={this.filter}
                                >
                                    {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                                </TableActionBar>

                                <Table
                                    // rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={this.props.newsletter.campaigns}
                                    rowKey="id"
                                    size="small"
                                    pagination={{
                                        pageSize: 10
                                    }}
                                    tableLayout="auto"
                                    onChange={this.onChangTable}
                                // scroll={{ x: 1500 }}
                                />
                            </RctCollapsibleCard>
                        </div>
                    </div>

                    <RecipentModal isOpen={this.state.openModalRecipents} handleClick={this.onCloseModalRecipents} data={this.state.cItem} />
                    <CampaignPreview isOpen={this.state.openModalPreview} handleClick={this.onCloseModalPreview} data={this.state.cItem} />

                    {/* form create  */}
                    <FormCreate isOpen={this.state.openModalForm} onRefresh={this.props.getListCampaigns} onCancel={this.onCloseModalForm} />
                    <ScheduleForm isOpen={this.state.openModalSchedule} handleClick={this.onCloseModalSchedule} onOk={(time) => this.onScheduleCampaign(time)} />
                </Spin>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        newsletter: state.newsletter
    }
}

export default connect(mapStateToProps, { getListCampaigns, deleteCampaign, sendCampaign, scheduleCampaign, resendCampaign })(Newsletter);