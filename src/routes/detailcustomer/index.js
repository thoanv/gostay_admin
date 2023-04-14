import { IconButton } from '@material-ui/core';
import AndroidIcon from "@material-ui/icons/Android";
import AppleIcon from "@material-ui/icons/Apple";
import CreateIcon from '@material-ui/icons/Create';
import LanguageIcon from "@material-ui/icons/Language";
import PaymentIcon from '@material-ui/icons/Payment';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Card, Col, Form, Icon, Input, Row, Spin, Tabs, Tag, Typography } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import moment from "moment";
import React, { Component } from 'react';
import { connect } from "react-redux";
import Truncate from 'react-truncate';
import IntlMessages from "Util/IntlMessages";
import { getCustomerDetail } from '../../actions/AccountAction';
import { giveCoupon } from '../../actions/CouponAction';
import AvatarInTable from '../../components/AvatarInTable';
import OrderDetail from '../loyalty/coupon/OrderDetail';
import Givecoupon from './givecoupon';
import Activities from './activities';

class DetailCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                sort: {
                    type: "desc",
                    attr: ""
                },
                title: {
                    type: "like",
                    value: ""
                },
                paging: {
                    perpage: 10,
                    page: 1
                }
            },
            loading: true,
            opendetail: false,
            opengivecoupon: false
        }
    }
    componentDidMount() {
        this.props.getCustomerDetail(this.props.match.params.id).then(res => (
            this.setState({
                loading: false,
                orders: res.data.booked.list,
                countlistOrderTour: res.data.booked.count,
                allReview: res.data.review.list,
                count_review: res.data.review.count,
                rencent_activity: res.data.rencent_activity,
                listactivecoupon: res.data.active_coupon.list,
                count_listactivecoupon: res.data.active_coupon.count
            })
        ))

    }
    setDate(data) {

        let v = data ? data : "";
        if (v) {
            var m = moment.utc(v); // parse input as UTC
            if (m.clone().local().format("DD-MM-YYYY") == moment().format("DD-MM-YYYY")) {
                return m.clone().local().fromNow();
            }
            else return m.clone().local().format("ddd, MMM DD, YYYY, HH:mm")

        }
        return "";

    }
    onOrderClose = () => {
        this.setState({
            opendetail: false,
        });
    };
    detailOrder = data => {
        this.props.getDetailOrderTour(this.state.filter, data).then(res => (
            this.setState({
                opendetail: true,
                orderdetail: res.data
            })
        ))

    }
    handleOk = () => {
        this.setState({
            opengivecoupon: false,
        });

        var data = {}
        data.cid = this.state.cid
        this.props.giveCoupon(data).then(res => (
            this.props.getCustomerDetail(this.state.cid).then(res => (
                this.setState({
                    orders: res.data.booked.list,
                    countlistOrderTour: res.data.booked.count,
                    allReview: res.data.review.list,
                    count_review: res.data.review.count,
                    rencent_activity: res.data.rencent_activity,
                    listactivecoupon: res.data.active_coupon.list,
                    count_listactivecoupon: res.data.active_coupon.count
                })
            ))
        ))
    }
    ongivecouponClose = () => {
        this.setState({
            opengivecoupon: false,
        });
    };
    clickgift = data => {
        this.setState({
            opengivecoupon: true,
            cid: data
        })

    }
    setTitle(title) {
        if (title && title.length) {
            return (
                <Truncate lines={1}>{title}</Truncate>
            )
        }
        return "";
    }
    setAmountTotal(data) {
        if (!data) return 0;
        let index = data.indexOf(".");
        return data.slice(0, index + 3);

    }
    render() {
        var { config } = this.props;


        const { detailAccount } = this.props
        console.log('detailAccount', detailAccount);
        const { orders, countlistOrderTour, count_review, count_listactivecoupon, listactivecoupon, rencent_activity } = this.state
        const { getFieldDecorator } = this.props.form;
        const { TabPane } = Tabs;
        const { Title } = Typography;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 }
            }
        };
        const formDesc = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 }
            }
        };
        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.detailcustomer" />}
                        match={this.props.match}
                    />
                    {
                        this.state.loading ?
                            <div className='loading'>
                                <Spin
                                    size='large'
                                />
                            </div>
                            :
                            <React.Fragment>
                                <Row>
                                    <Col span={13}>
                                        <div className="basicinfo-customer">
                                            <Card style={{ width: "100%" }}>
                                                <div>
                                                    <div className='mt-5 ml-2'>
                                                        <Row>
                                                            <Col span={4}>
                                                                <AvatarInTable
                                                                    style={{ height: '70px', width: '70px' }}
                                                                    src={detailAccount.image ? config.url_asset_root + detailAccount.image : require('../../assets/img/user.png')}>

                                                                </AvatarInTable>
                                                            </Col>
                                                            <Col span={20} className='mt-5'>
                                                                <Row >
                                                                    <Col span={12} >
                                                                        <h1>
                                                                            {detailAccount.firstname && detailAccount.lastname ? detailAccount.firstname + " " + detailAccount.lastname : detailAccount.email ? detailAccount.email : ""}
                                                                        </h1>
                                                                    </Col>
                                                                    <Col span={12} style={{ textAlign: 'end' }}>
                                                                        {/* <IconButton className="shake"
                                                                            style={{ backgroundColor: 'white', padding: '0px' }}
                                                                            onClick={() => this.clickgift(detailAccount.id)}
                                                                        >
                                                                            <Icon type="gift"
                                                                                style={{ color: "rgba(244, 4, 4, 0.98)", fontSize: '36px', cursor: 'pointer' }}
                                                                            />
                                                                        </IconButton> */}
                                                                    </Col>
                                                                </Row>
                                                                <div style={{ alignItems: 'flex-end', display: 'flex' }}>
                                                                    <IntlMessages id="global.last_login" />: {moment(detailAccount.last_login).format("DD/MM/YYYY   HH:mm")}
                                                                    {
                                                                        detailAccount.referral_os === "android" ? (
                                                                            <AndroidIcon style={{ color: "rgb(128, 228, 26)", height: "20px", width: "30px" }} />
                                                                        )
                                                                            : detailAccount.referral_os === "ios" ? (
                                                                                <AppleIcon style={{ height: "20px", width: "30px" }} />
                                                                            ) : (
                                                                                    <LanguageIcon style={{ color: "rgb(15, 167, 217)", height: "20px", width: "30px" }} />
                                                                                )

                                                                    }
                                                                </div>

                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className=' mt-4'>
                                                        <Form {...formDesc}>
                                                            {
                                                                detailAccount.firstname ?
                                                                    <Form.Item
                                                                        style={{ marginBottom: "10px" }}
                                                                        label={<IntlMessages id="global.firstname" />}>
                                                                        {getFieldDecorator("firstname", {

                                                                            initialValue: detailAccount.firstname ? detailAccount.firstname : ""
                                                                        })(<Input disabled={true} />)}
                                                                    </Form.Item>
                                                                    :
                                                                    null
                                                            }
                                                            {
                                                                detailAccount.lastname ?
                                                                    <Form.Item
                                                                        style={{ marginBottom: "10px" }}
                                                                        label={<IntlMessages id="global.lastname" />}>
                                                                        {getFieldDecorator("lastname", {

                                                                            initialValue: detailAccount.lastname ? detailAccount.lastname : ""
                                                                        })(<Input disabled={true} />)}
                                                                    </Form.Item>
                                                                    :
                                                                    null
                                                            }
                                                            {
                                                                detailAccount.mobile ?
                                                                    <Form.Item
                                                                        style={{ marginBottom: "10px" }}
                                                                        label={<IntlMessages id="global.mobile" />}>
                                                                        {getFieldDecorator("mobile", {

                                                                            initialValue: detailAccount.mobile ? detailAccount.mobile : ""
                                                                        })(<Input disabled={true} />)}
                                                                    </Form.Item>
                                                                    :
                                                                    null

                                                            }
                                                            {
                                                                detailAccount.email ?
                                                                    <Form.Item
                                                                        style={{ marginBottom: "10px" }}
                                                                        label={<IntlMessages id="global.email" />}>
                                                                        {getFieldDecorator("email", {
                                                                            initialValue: detailAccount.email ? detailAccount.email : ""
                                                                        })(<Input disabled={true} />)}
                                                                    </Form.Item>
                                                                    :
                                                                    null
                                                            }
                                                        </Form>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </Col>
                                    <Col span={11}>
                                        <div className='recent-activity'>
                                            <Title level={2}><IntlMessages id="global.recent_activities" /></Title>
                                            <div className='activiti'>

                                                {
                                                    rencent_activity && rencent_activity.length ?
                                                        rencent_activity.map(item => (
                                                            item.type === 1 ?
                                                                <Card
                                                                    key={item.id}
                                                                    style={{ width: '100%', backgroundColor: '#e6f7ff' }}
                                                                    size={"small"}
                                                                >
                                                                    <Row>
                                                                        <Col span={2}>
                                                                            <VisibilityIcon style={{ color: 'rgb(17, 82, 147)' }} />
                                                                        </Col>
                                                                        <Col span={22}>
                                                                            <div>
                                                                                View :
                                                                            <span className='title-tour-activity'>
                                                                                    {item.detail ?
                                                                                        item.detail.title
                                                                                        : ""
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div>
                                                                                {this.setDate(item.updated_at)}
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </Card>
                                                                :
                                                                item.type === 2 ?
                                                                    <Card
                                                                        key={item.id}
                                                                        style={{ width: '100%', backgroundColor: '#fff2f0' }}
                                                                        size={"small"}
                                                                    >
                                                                        <Row>
                                                                            <Col span={2}>
                                                                                <ShoppingCartIcon style={{ color: 'rgb(17, 82, 147)' }} />
                                                                            </Col>
                                                                            <Col span={22}>
                                                                                <div>
                                                                                    Already booked
                                                                                <span className='title-tour-activity'>
                                                                                        {item.detail.title}
                                                                                    </span>
                                                                                </div>
                                                                                <div>
                                                                                    {this.setDate(item.updated_at)}
                                                                                </div>


                                                                            </Col>
                                                                        </Row>
                                                                    </Card>
                                                                    :
                                                                    item.type === 3 ?
                                                                        <Card
                                                                            key={item.id}
                                                                            style={{ width: '100%', backgroundColor: '#f6ffed' }}
                                                                            size={"small"}
                                                                        >
                                                                            <Row>
                                                                                <Col span={2}>
                                                                                    <CreateIcon style={{ color: 'rgb(17, 82, 147)' }} />
                                                                                </Col>
                                                                                <Col span={22}>
                                                                                    <div>
                                                                                        Review about
                                                                                <span className='title-tour-activity'>
                                                                                            {item.detail.title}
                                                                                        </span>

                                                                                    </div>
                                                                                    <div>
                                                                                        {this.setDate(item.updated_at)}
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card>
                                                                        :
                                                                        <Card
                                                                            key={item.id}
                                                                            style={{ width: '100%', backgroundColor: 'rgb(176, 250, 233)' }}
                                                                            size={"small"}
                                                                        >
                                                                            <Row>
                                                                                <Col span={2}>
                                                                                    <PaymentIcon style={{ color: 'rgb(17, 82, 147)' }} />
                                                                                </Col>
                                                                                <Col span={22}>
                                                                                    <div>
                                                                                        Confirmed payment
                                                                                <span className='title-tour-activity'>
                                                                                            {this.setAmountTotal(item.detail.total) + `${item.detail.currency} `}
                                                                                        </span>
                                                                                for order number
                                                                            <span className='title-tour-activity'>
                                                                                            {item.detail.order_number}
                                                                                        </span>

                                                                                    </div>
                                                                                    <div>
                                                                                        {this.setDate(item.updated_at)}
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Card>


                                                        ))
                                                        :
                                                        <div><IntlMessages id="global.no_recent_activities" /></div>
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>

                                        <div >

                                            <Card style={{ width: '100%' }} >
                                                <Activities
                                                    count_review={count_review}
                                                    countlistOrderTour={countlistOrderTour}
                                                    orders={orders}
                                                    count_listactivecoupon={count_listactivecoupon}
                                                    listactivecoupon={listactivecoupon}
                                                    allReview={this.state.allReview}
                                                />
                                            </Card>

                                        </div>
                                    </Col>
                                </Row>
                            </React.Fragment>
                    }
                </div>
                <OrderDetail
                    open={this.state.opendetail}
                    onOrderClose={this.onOrderClose}
                    orderTour={this.state.orderdetail}
                />
                <Givecoupon
                    ongivecouponClose={this.ongivecouponClose}
                    open={this.state.opengivecoupon}
                    handleOk={this.handleOk}
                    count_listactivecoupon={count_listactivecoupon}
                    detailAccount={detailAccount}
                ></Givecoupon>
            </React.Fragment>
        );
    }
}


const mapStateToProps = state => {
    return {
        detailAccount: state.account.detailAccount,
        config: state.config
    };
};
function mapDispatchToProps(dispatch) {
    return {
        getCustomerDetail: id => dispatch(getCustomerDetail(id)),
        getDetailOrderTour: (filter, id) => dispatch(getDetailOrderTour(filter, id)),
        giveCoupon: data => dispatch(giveCoupon(data))
    }
}

export default Form.create({ name: "DetailCustomer" })(
    connect(mapStateToProps, mapDispatchToProps)(DetailCustomer)
);