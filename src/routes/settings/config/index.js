import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view';
import IntlMessages from 'Util/IntlMessages';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { Button, Modal, Divider, Row, Col, Form, Input, Select, InputNumber, Tabs } from 'antd';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import BaseRadios from '../../../components/Elements/BaseRadios';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
// actions
import { getConfig, setConfig, resetConfig, getBlogCategories } from '../../../actions/ConfigActions';
import BaseSelect from '../../../components/Elements/BaseSelect';
const { TabPane } = Tabs;

const confirm = Modal.confirm;

class Config extends Component {
    state = {
        config: {},
        fileSystem: 's3',
        customCode: '',
        blogCategories: []
    }

    async componentDidMount() {
        let categories = await this.props.getBlogCategories();
        this.setState({blogCategories: categories});
        await this.props.getConfig().then(response => {
            if (response.custom_js_code) {
                this.setState({ customCode: response.custom_js_code })
            }
        });
    }

    onUpdate(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                confirm({
                    title: 'Bạn chắc chắn muốn cập nhật cài đặt hệ thống không?',
                    okText: 'OK',
                    cancelText: 'Huỷ',
                    onOk: () => {
                        this.props.setConfig({ ...this.props.config, ...values, custom_js_code: this.state.customCode });
                    },
                    onCancel() { },
                })
            }
        });

    }

    render() {
        var { fileSystem, customCode, blogCategories } = this.state;
        var { config } = this.props;
        var { getFieldDecorator } = this.props.form;
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
            <div className="formelements-wrapper">
                <PageTitleBar title={<IntlMessages id="sidebar.config" />} match={this.props.match} />
                <div className="row">
                    <RctCollapsibleCard colClasses='col-12'>
                        {/* <Row type="flex" align="middle" >
                            <Col sm={{ span: 18 }} xs={{ span: 24 }} >
                                <Button type="primary" onClick={() => this.onUpdate()}>
                                    <IntlMessages id="global.update" />
                                </Button>
                                <Divider type="vertical" />
                                <Button type="default" onClick={() => this.props.resetConfig()} >
                                    <IntlMessages id="global.reset" />
                                </Button>
                            </Col>
                        </Row>
                        <div className="mt-4">
                            <ReactJson
                                src={config}
                                onAdd={(e) => this.onAddConfig(e)}
                                onEdit={(e) => this.onEditConfig(e)}
                                onDelete={(e) => this.onDeleteConfig(e)}
                                iconStyle="circle"
                                displayObjectSize={false}
                                displayDataTypes={false}
                            />
                        </div> */}
                        <Form {...formItemLayout} onSubmit={(e) => this.onUpdate(e)}>


                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Cài đặt chung" key="1">

                                    <Form.Item label={<IntlMessages id="config.discount" />} >
                                        {getFieldDecorator('discount', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.discount
                                        })(
                                            <InputNumber min={0} max={100} style={{ display: "inline-block", width: '50%' }} />
                                        )}

                                        <span style={{ fontWeight: "bold", fontSize: "18px" }}> %</span>

                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="config.merchant_transport_fee" />} >
                                        {getFieldDecorator('merchant_host_transport_fee', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.discount
                                        })(
                                            <InputNumber min={0} max={100} style={{ display: "inline-block", width: '50%' }} />
                                        )}

                                        <span style={{ fontWeight: "bold", fontSize: "18px" }}> %</span>

                                    </Form.Item>



                                    <Form.Item label={<IntlMessages id="config.cutofftime" />} >
                                        {getFieldDecorator('cutofftime', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.cutofftime
                                        })(
                                            <InputNumber min={0} max={100} style={{ display: "inline-block", width: '50%' }} />
                                        )}

                                        <span style={{ fontWeight: "bold", fontSize: "18px" }}> hour</span>

                                    </Form.Item>



                                    <Form.Item label={<IntlMessages id="config.flight_markup" />} >
                                        {getFieldDecorator('flight_markup', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.flight_markup
                                        })(
                                            <InputNumber min={0} style={{ display: "inline-block", width: '50%' }} />
                                        )}

                                        <span style={{ fontWeight: "bold", fontSize: "18px" }}> đ</span>

                                    </Form.Item>


                                    <Form.Item label={<IntlMessages id="No reply email" />} >
                                        {getFieldDecorator('no_reply_email', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.no_reply_email
                                        })(
                                            <Input />
                                        )}

                                    </Form.Item>


                                    <Form.Item label={<IntlMessages id="From sender name" />} >
                                        {getFieldDecorator('from_name', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.from_name
                                        })(
                                            <Input />
                                        )}

                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="Admin email" />} >
                                        {getFieldDecorator('admin_email', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.admin_email
                                        })(
                                            <Input />
                                        )}



                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="CS Email" />} >
                                        {getFieldDecorator('cs_email', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.cs_email
                                        })(
                                            <Input />
                                        )}



                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="Hotline" />} >
                                        {getFieldDecorator('hotline', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.hotline
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="Điện thoại liên hệ" />} >
                                        {getFieldDecorator('contact_phone', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.contact_phone
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </TabPane>

                                <TabPane tab="Website" key="web">
                                    <Form.Item label={<IntlMessages id="Site Title" />} >
                                        {getFieldDecorator('title', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.title
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item label={<IntlMessages id="Site Description" />} >
                                        {getFieldDecorator('description', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.description
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item label={<IntlMessages id="Keyword" />} >
                                        {getFieldDecorator('keyword', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.flight_markup
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Menu nội dung của Header" >
                                        {getFieldDecorator('custom_header_menu', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.custom_header_menu || []
                                        })(
                                            <BaseSelect 
                                                options={blogCategories}
                                                optionLabel="name"
                                                optionValue="id"
                                                mode="multiple"
                                            />
                                        )}
                                    </Form.Item>
                                </TabPane>


                                <TabPane tab="Hệ thống" key="2">

                                    <Form.Item label={<IntlMessages id="config.file_system" />}>
                                        {getFieldDecorator('fileSystem', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.fileSystem || 's3'
                                        })(
                                            <BaseRadios
                                                options={[
                                                    { id: 's3', title: 'Amazon S3' },
                                                    { id: 'local', title: 'Local' },
                                                ]}
                                                onChange={(value) => this.setState({ fileSystem: value })}
                                            />
                                        )}
                                    </Form.Item>
                                    {
                                        fileSystem == 's3' ? (
                                            <React.Fragment>
                                                <Form.Item label={<IntlMessages id="config.aws_s3_key" />}>
                                                    {getFieldDecorator('aws_s3_key', {
                                                        rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                                        initialValue: config.aws_s3_key
                                                    })(
                                                        <Input />
                                                    )}
                                                </Form.Item>
                                                <Form.Item label={<IntlMessages id="config.aws_s3_secret" />}>
                                                    {getFieldDecorator('aws_s3_secret', {
                                                        rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                                        initialValue: config.aws_s3_secret
                                                    })(
                                                        <Input />
                                                    )}
                                                </Form.Item>
                                                <Form.Item label={<IntlMessages id="config.aws_s3_bucket" />}>
                                                    {getFieldDecorator('aws_s3_bucket', {
                                                        rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                                        initialValue: config.aws_s3_bucket
                                                    })(
                                                        <Input />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Asset Root URL">
                                                    {getFieldDecorator('url_asset_root', {
                                                        rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                                        initialValue: config.url_asset_root
                                                    })(
                                                        <Input />
                                                    )}
                                                </Form.Item>

                                            </React.Fragment>
                                        ) : null
                                    }

                                    <Form.Item label={<IntlMessages id="SMTP" />}>
                                        {getFieldDecorator('smtp_server', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.smtp_server
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item label={<IntlMessages id="SMTP Username" />}>
                                        {getFieldDecorator('smtp_username', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.smtp_username
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="SMTP Protocol" />}>
                                        {getFieldDecorator('smtp_protocol', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.smtp_protocol
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>


                                    <Form.Item label={<IntlMessages id="SMTP Password" />}>
                                        {getFieldDecorator('smtp_password', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.smtp_password
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="SMTP Port" />}>
                                        {getFieldDecorator('smtp_port', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.smtp_port
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="Pusher App ID" />}>
                                        {getFieldDecorator('pusher_app_id', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.pusher_app_id
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>


                                    <Form.Item label={<IntlMessages id="Pusher App Key" />}>
                                        {getFieldDecorator('pusher_app_key', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.pusher_app_key
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="Pusher Secret" />}>
                                        {getFieldDecorator('pusher_secret', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.pusher_secret
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>



                                    <Form.Item label={<IntlMessages id="OneSignal App ID" />}>
                                        {getFieldDecorator('onesignal_app_id', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.onesignal_app_id
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item label={<IntlMessages id="OneSignal Secret" />}>
                                        {getFieldDecorator('onesignal_app_key', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.onesignal_app_key
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="Google Map Key" />}>
                                        {getFieldDecorator('googlemap_key', {
                                            rules: [{ required: false, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.googlemap_key
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="CRM CSKH Endpoint" />}>
                                        {getFieldDecorator('crm_cskh_endpoint', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.crm_cskh_endpoint
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </TabPane>

                                <TabPane tab="Cổng thanh toán Epay" key="3">

                                    <Form.Item label={<IntlMessages id="Epay Host" />}>
                                        {getFieldDecorator('epay_domain', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.epay_domain
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="Merchant ID" />}>
                                        {getFieldDecorator('epay_merchant_id', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.epay_merchant_id
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item label={<IntlMessages id="Encode Key" />}>
                                        {getFieldDecorator('epay_encode_key', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.epay_encode_key
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item label={<IntlMessages id="Cancel password" />}>
                                        {getFieldDecorator('epay_cancel_password', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.epay_cancel_password
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item label={<IntlMessages id="3DES Encrypt Key" />}>
                                        {getFieldDecorator('epay_key3des_encrypt', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.epay_key3des_encrypt
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>

                                    <Form.Item label={<IntlMessages id="3DES Decrypt Key" />}>
                                        {getFieldDecorator('epay_key3des_decrypt', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.epay_key3des_decrypt
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item label={<IntlMessages id="Callback URL" />}>
                                        {getFieldDecorator('epay_callback_url', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.epay_callback_url
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </TabPane>
                                <TabPane tab="Custom Code" key="4">
                                    <div className="code-container__area mb-4">
                                        <div className="mb-1">Custom JavaScript Code: </div>
                                        <Editor
                                            value={customCode}
                                            onValueChange={code => this.setState({ customCode: code })}
                                            highlight={code => highlight(code, languages.js)}
                                            padding={10}
                                            style={{
                                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                                fontSize: 12,
                                                height: 300,
                                            }}
                                            className="code-container__editor"
                                        />
                                        <small>Chỉ cần viết nội dung. Không cần viết cặp thẻ &lt;script&gt;&lt;/script&gt; </small>
                                    </div>
                                </TabPane>
                                <TabPane tab="Thông tin thanh toán chuyển khoản" key="5">
                                    <Form.Item label={<IntlMessages id="Tên tài khoản" />}>
                                        {getFieldDecorator('bank_account_name', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.bank_account_name
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item label={<IntlMessages id="Số tài khoản" />}>
                                        {getFieldDecorator('bank_account_number', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.bank_account_number
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <Form.Item label={<IntlMessages id="Tên ngân hàng - chi nhánh" />}>
                                        {getFieldDecorator('bank_name', {
                                            rules: [{ required: true, message: <IntlMessages id="config.required" /> }],
                                            initialValue: config.bank_name
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </TabPane>
                            </Tabs>


                            <div className="d-flex justify-content-end">
                                <Button htmlType="submit" type="primary">
                                    <IntlMessages id="global.update" />
                                </Button>
                            </div>
                        </Form>
                    </RctCollapsibleCard>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        config: state.config
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getConfig: () => dispatch(getConfig()),
        setConfig: (data) => dispatch(setConfig(data)),
        resetConfig: () => dispatch(resetConfig()),
        getBlogCategories: () => dispatch(getBlogCategories())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'config' })(Config));