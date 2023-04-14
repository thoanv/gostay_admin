import React, { Component } from "react";
import { Col, Row, Card } from "antd";
import { connect } from "react-redux";
import Auxiliary from "../../util/Auxiliary";
import IconWithTextCard from "../../components/dashboard/crm/IconWithTextCard";
import { getconsumer } from "../../actions/CommonActions";
import { withRouter, Link } from "react-router-dom";
import stringHelper from '../../util/StringHelper';
import NewAccount from "./NewAccount";
import NewRoom from "./NewRoom";
import NewOrder from "./NewOrder";


class CRM extends Component {
  state = {
    filter: {
      paging: {
        perpage: 10,
        page: 1,
      },
    },
  };
  componentDidMount() {
    this.props.getconsumer();
  }
  render() {
    const { consumer } = this.props;
    // console.log(listInquiry);

    return (
      <React.Fragment>
        <Auxiliary>
          <Row>
            <Col span={24}>
              <div className="gx-card">
                <div className="gx-card-body">
                  {consumer ?
                    <Row>
                      <Col xl={4} lg={4} md={6} sm={12} xs={12}>
                        <Link to="/app/statistic/revenue" style={{ width: "100%" }}>
                          <IconWithTextCard
                            cardColor="orange"
                            icon="dollar"
                            title={stringHelper.formatCurrency(consumer.gmv, 'M')}
                            subTitle={"Doanh thu"}
                          />
                        </Link>
                      </Col>
                      <Col xl={4} lg={4} md={6} sm={12} xs={12}>
                        <Link to="/app/statistic/revenue" style={{ width: "100%" }}>
                          <IconWithTextCard
                            cardColor="orange"
                            icon="wallet"
                            title={stringHelper.formatCurrency(consumer.earning, 'M')}
                            subTitle={"Hoa hồng"}
                          />
                        </Link>
                      </Col>
                      <Col xl={4} lg={4} md={6} sm={12} xs={12}>
                        <Link to="/app/stay/property" style={{ width: "100%" }}>
                          <IconWithTextCard
                            cardColor="orange"
                            icon="home"
                            title={consumer.property}
                            subTitle={"Căn hộ"}
                          />
                        </Link>
                      </Col>

                      <Col xl={4} lg={4} md={6} sm={12} xs={12}>
                        <Link to="/app/orders/stay" style={{ width: "100%" }}>
                          <IconWithTextCard
                            cardColor="orange"
                            icon="shopping-cart"
                            title={consumer.order}
                            subTitle={"Đơn hàng"}
                          />
                        </Link>
                      </Col>
                      <Col xl={4} lg={4} md={6} sm={12} xs={12}>
                        <Link to="/app/account/registered" style={{ width: "100%" }}>
                          <IconWithTextCard
                            cardColor="teal"
                            icon="team"
                            title={consumer.account}
                            subTitle="Tài khoản"
                          />
                        </Link>
                      </Col>
                      <Col xl={4} lg={4} md={6} sm={12} xs={12}>
                        <Link to="/app/reviews" style={{ width: "100%" }}>
                          <IconWithTextCard
                            cardColor="red"
                            icon="solution"
                            title={consumer.review}
                            subTitle={"Đánh giá"}
                          />
                        </Link>
                      </Col>
                    </Row>
                    : null}
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xl={8} lg={12} md={24} sm={24} xs={24}>
              <Card title="Căn hộ chờ duyệt">
                <NewRoom />
              </Card>
            </Col>
            <Col xl={8} lg={12} md={24} sm={24} xs={24}>
              <Card title="Đơn hàng mới">
                <NewOrder />
              </Card>
            </Col>
            <Col xl={8} lg={12} md={24} sm={24} xs={24}>
              <Card title="Khách hàng mới">
                <NewAccount />
              </Card>
            </Col>
          </Row>
        </Auxiliary>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    consumer: state.common.consumer,
    // listInquiry: state.inquiry.listInquiry
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getconsumer: () => dispatch(getconsumer()),

  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CRM)
);
