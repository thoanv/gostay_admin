import { Form, Modal, Tabs, Icon } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

class Givecoupon extends Component {
    render() {

        const { ongivecouponClose, open, handleOk, count_listactivecoupon, detailAccount } = this.props;
        const { TabPane } = Tabs;
        var nameCustomer = detailAccount && detailAccount.firstname && detailAccount.lastname ? detailAccount.firstname + " " + detailAccount.lastname : detailAccount && detailAccount.email ? detailAccount.email : "Gopanda User"

        return (
            <React.Fragment>
                <Modal
                    toggle={ongivecouponClose}
                    visible={open}
                    closable={true}
                    onCancel={ongivecouponClose}
                    maskClosable={false}
                    onOk={handleOk}
                    centered={true}
                    width="35%"
                >
                    <div className='d-flex'>


                        <ErrorOutlineIcon
                            style={{ color: "rgb(228, 194, 10)", height: "30px", width: "30px", marginTop:'10px' }}
                        />
                        <p style={{ padding: '10px 10px 0px 10px', fontSize: '16px' }}>
                            {
                                count_listactivecoupon ?

                                    `${nameCustomer} owns ${count_listactivecoupon} ${count_listactivecoupon > 1 ? `coupons` : `coupon`}. Give a gift AUD 100 to ${nameCustomer}?`
                                    :
                                    `Give a gift AUD 100 to ${nameCustomer}?`
                            }
                        </p>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}


export default Form.create({ name: "give coupon" })(
    connect(
        null,
        null
    )(Givecoupon)
);
