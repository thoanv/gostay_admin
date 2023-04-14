import {
  Button,
  Col,
  Modal,
  Row,
  Table,
  Tabs,
  Tag
} from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
// actions

const NOT_FOUND = 'https://bitsofco.de/content/images/2018/12/broken-1.png'

class ComboDetails extends Component {
  state = {
    
  };
  static propTypes = {
    infoBasic: PropTypes.object,
    comboDate: PropTypes.array,
    comboPlan: PropTypes.array,
    open: PropTypes.bool,
  };

  cssRow = () => {
    return {
      borderBottom: "1px solid #e8e8e8",
      padding: "0 !important",
      marginBottom: "1em ",
    };
  };

  getComboStatus = (value) => {
    switch(value) {
      case 0: 
      return <Tag style={{ marginTop: "0" }} color='#ed7014'>
      CHỜ XÁC NHẬN
    </Tag>
      case 1:
        return <Tag style={{ marginTop: "0" }} color='green'>
        ĐÃ XÁC NHẬN
      </Tag>
      case 2:
        return <Tag style={{ marginTop: "0" }} color='red'>
        HUỶ COMBO
      </Tag>
      default: 
      return ""
    }
  }

  render() {
    const { onOrderClose, open, infoBasic, comboDate, comboPlan } = this.props;

    const { TabPane } = Tabs;

    const columnsDate = [
      {
        title: <IntlMessages id="combo.start_date" />,
        key: "start_date",
        render: (record) => {
          return record.start_date;
        },
      },
      {
        title: <IntlMessages id="combo.end_date" />,
        key: "end_date",
        render: (record) => {
          return record.end_date;
        },
      },
      {
        title: <IntlMessages id="combo.price" />,
        key: "price",
        render: (record) => {
          return record.price;
        },
      },
      {
        title: <IntlMessages id="combo.price_child" />,
        key: "price_child",
        render: (record) => {
          return record.price_child;
        },
      },
      {
        title: <IntlMessages id="combo.departure" />,
        key: "departure",
        render: (record) => {
          return record.destination;
        },
      },
      {
        title: <IntlMessages id="combo.slot" />,
        key: "slot",
        render: (record) => {
          return record.slot;
        },
      },
      {
        title: <IntlMessages id="combo.cost" />,
        key: "cost",
        render: (record) => {
          return record.cost;
        },
      },
    ];

    const columnsPlan = [
      {
        title: <IntlMessages id="combo.plan.date" />,
        key: "date",
        render: (record) => {
          return record.date || '';
        },
      },
      {
        title: <IntlMessages id="combo.plan.place_from" />,
        key: "place_from",
        render: (record) => {
          return record.place_from || '';
        },
      },
      {
        title: <IntlMessages id="combo.plan.title" />,
        key: "title",
        render: (record) => {
          return record.title || '';
        },
      },
      {
        title: <IntlMessages id="combo.plan.content" />,
        key: "content",
        render: (record) => {
          const content = JSON.parse(record.content)
          const list = Object.keys(content).map(key => content[key])
          return <div>
            {list.map((item, index) => <Row key={index}>
              <Col span={6}>{item.time}</Col>
              <Col span={18}>{item.description}</Col>
            </Row> )}
          </div>
        },
      },
      
    ];

    let condition = null

    if(infoBasic) {
      condition = JSON.parse(infoBasic.condition)
    }

    const contentStyle = {
      height: '160px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };

    return (
      <React.Fragment>
        <Modal
          toggle={onOrderClose}
          visible={open}
          closable={false}
          onCancel={this.props.onOrderClose}
          footer={null}
          width="65%"
          centered={true}
        >
          <Row style={{ height: '20px' }}>
            <Col span={24} style={{ textAlign: "right", marginBottom: "20px" }}>
              
              <Button type="default" onClick={() => this.props.onOrderClose()}>
                <IntlMessages id="global.cancel" />
              </Button>
            </Col>
          </Row>
          <Tabs defaultActiveKey="1">
            <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
              {/*  Combo code - title */}
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="git.combo_code" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{infoBasic ? infoBasic.code : ""}</p>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="order.combo" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{infoBasic ? infoBasic.title : ""}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/*  Combo status */}
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="global.status" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{infoBasic && this.getComboStatus(infoBasic.status)}</p>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="combo.create_date" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{infoBasic && infoBasic.created_at}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/*  Combo condition */}
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="combo.consists_of" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>
                        {(condition && condition.length > 0 && condition[0].consists_of)
                          ? `${condition[0].consists_of.reduce((a,b) => `${a}, ${b}`, '')}`
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="combo.un_consists_of" />:
                      </p>
                    </Col>
                    <Col span={17}>
                    <p>
                    {(condition && condition.length > 0 && condition[1].un_consists_of)
                          ? `${condition[1].un_consists_of.reduce((a,b) => a + b, '')}`
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/*  Combo price */}
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="combo.description" />:
                      </p>
                    </Col>
                    <Col span={17}>{infoBasic ? infoBasic.description : ""}</Col>
                  </Row>
                </Col>
              </Row>
              {/* Combo days - nights */}
              <Row>
                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="combo.days" />:
                      </p>
                    </Col>
                    <Col span={17}>
                      <p>{infoBasic ? infoBasic.days : ""}</p>
                    </Col>
                  </Row>
                </Col>

                <Col span={12}>
                  <Row style={this.cssRow()}>
                    <Col span={7}>
                      <p>
                        <IntlMessages id="combo.nights" />:
                      </p>
                    </Col>
                    <Col span={17}>
                    <p>{infoBasic ? infoBasic.nights : ""}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* Image */} 
              {/* <Row>
                <div style={{ height: 300, width: '100%' }}>
                      <Col span={6}>
                        <img  src={infoBasic ? infoBasic.avatar : NOT_FOUND} />
                      </Col>
                </div>
              </Row> */}
              <Row>
                <Col span={24}>
                  <Table
                    columns={columnsPlan}
                    dataSource={comboPlan}
                    rowKey="id"
                    pagination={true}
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={<IntlMessages id="combo.date" />} key="2">
              <Row>
                <Col span={24}>
                  <Table
                    columns={columnsDate}
                    dataSource={comboDate}
                    rowKey="id"
                    pagination={false}
                  />
                </Col>
              </Row>
            </TabPane>
            {/* <TabPane tab={<IntlMessages id="combo.plan" />} key="3">
              
            </TabPane> */}
          </Tabs>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ComboDetails