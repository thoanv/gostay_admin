import React, { Component } from 'react'
import { Button, Col, Form, Input, InputNumber, Modal, Radio, Row, Tabs, Checkbox, Spin, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";


import { updateUtilNearby, _getAll } from '../../../actions/PropertyAction';
const { TextArea } = Input;
const formDesc = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 0 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};
const { TabPane } = Tabs;
class NearbyUtils extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmiting: false,
            filter: {
                sort: {
                  type: "desc",
                  attr: "",
                },
                paging: {
                  perpage: 10,
                  page: 1,
                },
                search: "",
              },
        }
    }

    onHandleClose = () => {
        this.props.onClose();
    };
    onFinish = (e) => {
        e.preventDefault();
        this.props.form
            .validateFields((err, values) => {
                if (!err) {
                   
                    
                    var dataSub = Object.keys(values).map((item, index) => {
                        return {
                            id: item,
                            data: values[item]
                        }
                    });
                    
                    this.props.updateUtilNearby(dataSub, this.props.propertydetail.id).then(res =>
                        this.props._getAll(this.state.filter),
                        this.setState({
                            isSubmiting: false
                        })
            
                    )
            
                    this.props.onClose()
                }
            })

    };
  


    render() {
        const { getFieldDecorator } = this.props.form;
        const { open, listUtilNearby, propertydetail } = this.props;
        let dd = propertydetail && propertydetail.nearby_utils ? propertydetail.nearby_utils : null

        return (
            <Modal
                title={<IntlMessages id="global.nearbyUtils" />
                }
                visible={open}
                closable={true}
                onCancel={this.onHandleClose}
                footer={null}
                destroyOnClose={true}
                width="60%"
            >
                <Form
                    onSubmit={this.onFinish}

                >
                    <Tabs defaultActiveKey={"1"}>
                        {
                            listUtilNearby && listUtilNearby.length ?
                                listUtilNearby.map(item => {
                                    let datainit = dd && dd.length ? dd.filter(e => e.id === item.id) : null
                                    let init = datainit && datainit.length ? datainit[0].data : null
                                    let dtinit = init ? init.replaceAll(',', '\n') : null
                                    return (
                                        <TabPane key={item.id} tab={item.title}>
                                        <Form.Item {...formDesc}>
                                            {getFieldDecorator(`${item.id}`, {

                                                initialValue: dtinit ? dtinit : null
                                            })(<TextArea
                                                rows={4}
                                                placeholder="vd: abc, xyz"
                                            />)}
                                        </Form.Item>
                                        </TabPane>
                                    )
                                }
                                  

                                )
                                : null
                        }


                    </Tabs>
                    <Row>
                        <Col span={24} style={{ textAlign: "right" }}>
                            <Button type="default" onClick={() => this.onHandleClose()}>
                                <IntlMessages id="global.cancel" />
                            </Button>
                            <Button
                                type="primary"
                                style={{ marginLeft: 8 }}
                               
                                htmlType="submit"
                                loading={this.state.loading}
                            >
                                <IntlMessages id="global.submit" />
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUtilNearby: (data, id) => dispatch(updateUtilNearby(data, id)),
        _getAll: (filter) => dispatch(_getAll(filter)),

    };
};
export default connect(null, mapDispatchToProps)(Form.create({ name: "NearbyUtils" })(NearbyUtils));