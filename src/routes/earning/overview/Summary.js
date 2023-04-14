import React, { Component } from 'react';
import { Card, Row, Col, Icon } from 'antd';
import IntlMessages from "Util/IntlMessages";
import NumberFormat from 'react-number-format';

// actions


class Todo extends Component {

    render() {
        const { listOverview, onSelect, current_tab } = this.props
        return (
            <Row gutter={20} justify="space-between">

                <Col span={8}>
                    <Card className="widget-cards" style={{ backgroundColor: "#0050b3", cursor: "pointer", border: current_tab == "PENDING" ? "3px solid #ffd666" : "none" }} onClick={() => onSelect("PENDING")}>
                        <Icon type="dollar" className="widget-icon" />
                        <span>
                            <div className="text-right widget-big-text">
                                <NumberFormat value={listOverview.pending && listOverview.pending.total ? listOverview.pending.total : 0} thousandSeparator={true} displayType="text" />
                                <span style={{ fontSize: '14px' }}>
                                    VND
                                </span>
                            </div>
                            <div className="text-right"><IntlMessages id='global.earning_available' /></div>
                        </span>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card className="widget-cards" style={{ width: '100%', backgroundColor: "rgb(54,51,129)", cursor: "pointer", border: current_tab == "AVAILABLE" ? "3px solid #ffd666" : "none" }} onClick={() => onSelect("AVAILABLE")}>
                        <Icon type="dollar" className="widget-icon" />
                        <span>
                            <div className="text-right widget-big-text">
                                <NumberFormat value={listOverview.in_wallet && listOverview.in_wallet.total ? listOverview.in_wallet.total : 0} thousandSeparator={true} displayType="text" />
                                <span style={{ fontSize: '14px' }}>
                                    VND
                                </span>
                            </div>
                            <div className="text-right"><IntlMessages id='global.earning_pending' /></div>
                        </span>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card className="widget-cards" style={{ cursor: "pointer", backgroundColor: "#4742bd", border: current_tab == "PAID" ? "3px solid #ffd666" : "none" }} onClick={() => onSelect("PAID")} bordered={true}>
                        <Icon type="dollar" className="widget-icon" />
                        <span>
                            <div className="text-right widget-big-text">
                                <NumberFormat value={listOverview.paid_out && listOverview.paid_out.total ? listOverview.paid_out.total : 0} thousandSeparator={true} displayType="text" />
                                <span style={{ fontSize: '14px' }}>
                                    VND
                                </span>
                            </div>

                            <div className="text-right"><IntlMessages id='global.earning_paid' /></div>
                        </span>
                    </Card>
                </Col>

            </Row>
        )
    }
}


export default Todo;
