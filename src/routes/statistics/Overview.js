import React, { useState, useEffect } from 'react';
import { Card, message, Skeleton, Row, Col } from 'antd';
import { getStatisticGeneral } from '../../actions/StatisticAction';
import IconWithTextCard from '../../components/dashboard/crm/IconWithTextCard';
import { priceInVn } from '../../helpers/helpers';

function Overview(props) {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ customers: 0, orders: 0, revenue: [{ total: 0, discount: 0, supplier_earning: 0 }] });

    useEffect(() => {
        getStatisticGeneral().then(res => {
            setData(res);
            setLoading(false)
        }).catch(err => {
            setLoading(false);
            message.error("Có lỗi xảy ra, vui lòng thử lại")
        })
    }, [])

    if (loading) return <Skeleton></Skeleton>


    return (
        <Card title="Tổng quát" >
            <Row>
                <Col xl={8} lg={8} md={8} sm={12} xs={12}>
                    <IconWithTextCard
                        cardColor="teal"
                        icon="team"
                        title={data.customers}
                        subTitle={"Khách hàng"}
                    />
                </Col>
                <Col xl={8} lg={8} md={8} sm={12} xs={12}>
                    <IconWithTextCard
                        cardColor="orange"
                        icon="shopping-cart"
                        title={data.orders}
                        subTitle={"Đơn hàng"}
                    />
                </Col>
                <Col xl={8} lg={8} md={8} sm={12} xs={12}>
                    <IconWithTextCard
                        cardColor="cyan"
                        icon="dollar"
                        title={priceInVn(data.revenue[0].total)}
                        subTitle={"Doanh thu"}
                    />
                </Col>
            </Row>
        </Card>
    )
}

export default Overview;