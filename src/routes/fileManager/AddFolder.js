import React, { Component } from 'react';
import IntlMessages from 'Util/IntlMessages';
import PropTypes from 'prop-types';

import {
    Form,
    Input,
    Row,
    Col,
    Button,
    Modal,
} from 'antd';



class AddFolder extends Component {

    static propTypes = {
        onSave: PropTypes.func,
        open: PropTypes.bool,
        onClose: PropTypes.func
    }

    static defaultProps = {
        open: false,
        onSave: () => { },
        loading: false
    }


    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var folder = {
                    ...values
                }
                this.props.onSave(folder);
            }
        });
    };


    render() {
        const { onClose, open, folderbase } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        return (
            <React.Fragment >
                {open ?
                    <Modal
                        title={<IntlMessages id="fileManager.createfolder" />}
                        toggle={onClose} visible={open}
                        closable={false}
                        footer={null}
                        width="50%"
                    >
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            <Form.Item label="foldername">
                                {getFieldDecorator('foldername', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input foldername!',
                                        },
                                    ],
                                })(<Input style={{ width: '100%' }} />)}
                            </Form.Item>
                            <Form.Item label="folderbase">
                                {getFieldDecorator('folderbase', {
                                    rules: [{ required: true, message: 'Please input folderbase!' }],
                                    initialValue: folderbase ? folderbase || "" : ""
                                })(<Input style={{ width: '100%' }} />)}
                            </Form.Item>
                            <Row>
                                <Col span={24} style={{ textAlign: 'right' }}>
                                    <Button style={{ marginLeft: 8 }} type="danger" ghost onClick={() => this.props.onClose()}>
                                        Cancel
                            </Button>
                                    <Button type="primary" style={{ marginLeft: 8 }} htmlType="submit" loading={this.props.loading}>
                                        Submit
                            </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    : null}
            </React.Fragment>
        )
    }
}


export default Form.create({ name: "horizontal_createfile" })(
    AddFolder
);
