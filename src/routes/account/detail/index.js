import { Spin, Table, Button, Typography, Divider, Card, Tag, Row, Avatar, Descriptions } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import moment from "moment";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import { OrderStatus } from '../../../components/OrderStatus';
import IntlMessages from "Util/IntlMessages";
import {
    updateACCOUNT,
    getCustomerDetail
} from "../../../actions/AccountAction";
import { getAllCountry } from "../../../actions/CountryActions";

import AddRegistered from "../registered/AddRegistered";

const { Title } = Typography;

class AccountDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isOpenEditModal: false,
            isLoadingSubmiting: false
        };
    }
    async componentDidMount() {
        await this.props.getCustomerDetail(this.props.match.params.id);
        await this.props.getAllCountry();

        this.setState({
            isLoading: false
        })
    }


    onEditAccount() {
        this.setState({
            isOpenEditModal: true,
        });
    }
    onAccountClose = () => {
        this.setState({
            isOpenEditModal: false,
            isLoadingSubmiting: false,
        });
    };

    onSaveAccount = async (data, id) => {
        await this.setState({
            ...this.state,
            isLoadingSubmiting: true
        });

        var dataSubmit = { ...data, id: id };
        await this.props
            .updateAccount(dataSubmit)
            .then(async () => {
                await this.props.getCustomerDetail(this.props.match.params.id);

                this.setState({
                    ...this.state,
                    isOpenEditModal: false,
                    isLoadingSubmiting: false,
                });
                
            })
            .catch(err => {
                this.setState({
                    ...this.state,
                    isLoadingSubmiting: false,
                });
            });
    }

    render() {
        const { isLoading, isLoadingSubmiting, isOpenEditModal } = this.state;
        var { config, account, country } = this.props;

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.account_detail" />}
                        match={this.props.match}
                    />
                    <Spin spinning={isLoading}>
                        <div className="row">
                            <RctCollapsibleCard colClasses="col-12">
                                <Row align="middle" justify="space-between" type="flex">
                                    <Row align="middle" justify="start" type="flex">
                                        <Avatar
                                            src={account.image ? config.url_asset_root + account.image : config.url_asset_root + 'backup.png'}
                                            size={80}
                                        />
                                        <Title level={2} className="ml-4">{account.firstname} {account.lastname}</Title>
                                    </Row>
                                    <Button type="primary" onClick={() => this.onEditAccount()}>Sửa tài khoản</Button>
                                </Row>
                                <Descriptions className="mt-4">
                                    <Descriptions.Item label="Email">{account.email}</Descriptions.Item>
                                    <Descriptions.Item label="Số điện thoại">({account.phone_code}) {account.mobile}</Descriptions.Item>
                                    <Descriptions.Item label="Quốc gia">{account.country}</Descriptions.Item>
                                    <Descriptions.Item label="Ngôn ngữ sử dụng">{account.lang == 'VI' ? "Tiếng Việt" : "Tiếng Anh"}</Descriptions.Item>
                                    <Descriptions.Item label="Đăng ký qua">{account.signup_type}</Descriptions.Item>
                                    <Descriptions.Item label="OS">{account.referral_os}</Descriptions.Item>
                                    <Descriptions.Item label="Bitrix ID">{account.bitrix24_contact_id}</Descriptions.Item>
                                    <Descriptions.Item label="Sync Bitrix ID">{account.bitrix24_sync_status ? <Tag color="success">Đã sync</Tag> : <Tag color="red">Chưa sync</Tag>}</Descriptions.Item>
                                    <Descriptions.Item label="Tạo tài khoản lúc">{moment(account.created_at).format("DD/MM/YYYY HH:mm")}</Descriptions.Item>
                                </Descriptions>
                            </RctCollapsibleCard>
                            <RctCollapsibleCard colClasses="col-12">
                                <Title level={2} >Đơn hàng đã đặt</Title>
                                <Table
                                    columns={
                                        [
                                            {
                                                title: "Order Number",
                                                key: "order_number",
                                                render: (record) => (
                                                    <Link to={`/app/orders/${record.type.toLowerCase()}/${record.id}`}>
                                                        {record.order_number}
                                                    </Link>
                                                )
                                            },
                                            {
                                                title: "Loại",
                                                key: "type",
                                                render: (record) => (
                                                    <div>{record.type}</div>
                                                )
                                            },
                                            {
                                                title: "Tổng tiền",
                                                key: "total",
                                                render: (record) => (
                                                    <NumberFormat value={+record.total} thousandSeparator={true} displayType="text" suffix=" đ" />
                                                )
                                            },
                                            {
                                                title: <IntlMessages id="global.commission" />,
                                                dataIndex: "discount",
                                                key: "discount",
                                                render: (text, record) => {
                                                    let discount = record.discount ? record.discount : 0;
                                                    return (
                                                        <NumberFormat value={+ discount} thousandSeparator={true} displayType="text" suffix=" đ" />
                                                    );
                                                },
                                            },
                                            {
                                                title: <IntlMessages id="global.status" />,
                                                key: "status",
                                                dataIndex: 'status',
                                                align: "center",
                                                render: (status, record) => (
                                                    <React.Fragment>
                                                        <OrderStatus status={status}></OrderStatus>
                                                        {
                                                            status == 'ORDER_CANCELLED' ? (
                                                                <div>
                                                                    {record.refund_status ? <small>{record.refund_status == 1 ? `Đã hoàn ${priceInVn(record.refund_amount)}` : `Hoàn tiền thất bại`}</small> : null}
                                                                </div>
                                                            ) : null
                                                        }
                                                        {status == "ORDER_COMPLETED" ? record.delivery_status == "DELIVERY_STATUS_SUCCESS" ? <React.Fragment><br />Có sử dụng dịch vụ</React.Fragment> : record.delivery_status == "DELIVERY_STATUS_NOT_COME" ? <React.Fragment><br />Không sử dụng dịch vụ</React.Fragment> : null : null}
                                                    </React.Fragment>
                                                ),
                                            },
                                            {
                                                title: <IntlMessages id="global.created" />,
                                                dataIndex: "created_at",
                                                key: "created_at",
                                                className: "center-column",
                                                render: (text, record) => (
                                                    <React.Fragment>
                                                        <div>{moment(record.created_at).format("DD/MM/YYYY")}</div>
                                                        <div>{moment(record.created_at).format("HH:mm")}</div>
                                                    </React.Fragment>
                                                ),
                                            },
                                            {
                                                title: "Chi tiết đơn hàng",
                                                dataIndex: "id",
                                                key: "id",
                                                render: (text, record) => {
                                                    return (
                                                        <Link to={`/app/orders/${record.type.toLowerCase()}/${record.id}`}>
                                                            <Button type="primary">Xem chi tiết</Button>
                                                        </Link>
                                                    )
                                                },
                                            },
                                        ]
                                    }
                                    dataSource={account.booked ? account.booked.list : []}
                                />
                            </RctCollapsibleCard>
                        </div>
                    </Spin>

                </div>

                <AddRegistered
                    open={isOpenEditModal}
                    onSaveAccount={this.onSaveAccount}
                    onAccountClose={this.onAccountClose}
                    loading={isLoadingSubmiting}
                    edit={true}
                    account={account}
                    country={country}
                />
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    return {
        account: state.account.detailAccount,
        country: state.country.listCountry,
        config: state.config
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCustomerDetail: (id) => dispatch(getCustomerDetail(id)),
        updateAccount: account => dispatch(updateACCOUNT(account)),
        getAllCountry: () => dispatch(getAllCountry({ paging: 0 })),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AccountDetail)
);
