import React, { useState } from 'react';
import { Form, Input, Button, Modal, Row, Col, Radio, message } from "antd";


function ModalApproved(props) {

    const {
        onClose,
        open,
        record,
        title,
        onUpdate,
    } = props;


    const handleSubmit = (e) => {
        e.preventDefault();
        props.form
            .validateFields(async (err, values) => {
                if (!err) {
                    if (record && record.id) {
                        var data = {
                            ...values,
                            id: record.id
                        }
                        try {
                            setSubmiting(true);
                            await onUpdate(data);
                            setSubmiting(false);
                            message.success("Cập nhật thành công");
                            onClose();
                        } catch (error) {
                            setSubmiting(false);
                            message.error("Có lỗi xảy ra, vui lòng thử lại")
                        }
                    }
                }
            })
    }

    const [isSubmiting, setSubmiting] = useState(false);

    const { getFieldDecorator } = props.form;

    return (
        <Modal
            title={title}
            toggle={onClose}
            visible={open}
            destroyOnClose={true}
            closable={true}
            onCancel={() => onClose()}
            footer={null}
            centered
        >
            <Form
                onSubmit={handleSubmit}
                layout="vertical"
            >
                <Form.Item label={<b>Duyệt</b>}>
                    {getFieldDecorator("approved", {
                        rules: [
                            {
                                required: true,
                            },
                        ],
                        initialValue: record && record.approved ? record.approved : 0
                    })(
                        <Radio.Group>
                            <Radio value={1}>Duyệt</Radio>
                            <Radio value={0}>Không duyệt</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label={<b>Ghi chú</b>}>
                    {getFieldDecorator("admin_note", {
                        rules: [
                            {
                                required: true,
                            },
                        ],
                        initialValue: record && record.admin_note ? record.admin_note : ''
                    })(
                        <Input.TextArea rows={4}></Input.TextArea>
                    )}
                </Form.Item>
                <Row>
                    <Col span={24} style={{ textAlign: "right" }}>
                        <Button
                            style={{ marginLeft: 8 }}
                            type='default'
                            onClick={() => onClose()}
                        >
                            Huỷ
                        </Button>
                        <Button
                            type="primary"
                            style={{ marginLeft: 8 }}
                            htmlType="submit"
                            loading={isSubmiting}
                        >
                            Lưu
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default Form.create({ name: "approved" })(ModalApproved);
