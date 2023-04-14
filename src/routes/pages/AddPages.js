import { Button, Col, Form, Input, Modal, Radio, Row, Tabs } from "antd";
import BaseSelect from "Components/Elements/BaseSelect";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import InputChosseFile from "../fileManager/InputChosseFile";
import SunEditor, { buttonList } from "suneditor-react";

class AddPages extends Component {
  static propTypes = {
    pages: PropTypes.object,
    onSavePages: PropTypes.func,
    open: PropTypes.bool,
    onPagesClose: PropTypes.func,
    edit: PropTypes.bool
  };

  state = {
    images: []
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.pages && nextProps.pages !== this.props.pages) {
      this.setState({
        ...nextProps,
        images: nextProps.pages.images ? JSON.parse(nextProps.pages.images) : []
      });
    }
  }

  getValueImage = data => {
    this.setState({
      ...this.state,
      images: data.length ? data.map(item => item.path_relative) : []
    });
  };

  onPagesClose() {
    this.setState({
      images: []
    });
    this.props.onPagesClose();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form
      .validateFields((err, values) => {
        if (!err) {
          var pages = { ...values };
          pages.images = JSON.stringify(this.state.images);
          this.props.onSavePages(
            pages,
            this.props.pages ? this.props.pages.id : null
          );
        }
      })
      .then(this.setState({ images: [] }));
  };

  render() {
    const {
      pages,
      open,
      onPagesClose,
      edit,
      accountName,
      categories
    } = this.props;
    const { TextArea } = Input;
    var category_ids = pages
      ? pages.cat_ids.map(item => parseInt(item))
      : [];

    const { getFieldDecorator } = this.props.form;

    const defaultImage = pages
      ? pages.images
        ? this.state.images.map(item => ({
          name: item,
          path_relative: item
        }))
        : []
      : [];
    const { TabPane } = Tabs;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const formItemLayoutContent = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 }
      }
    };
    const formDesc = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 0 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 }
      }
    };

    return (
      <React.Fragment>
        {open ? (
          <Modal
            title={
              edit ? (
                <IntlMessages id="global.edit" />
              ) : (
                  <IntlMessages id="global.create" />
                )
            }
            toggle={onPagesClose}
            visible={open}
            closable={false}
            footer={null}
            width="60%"
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Tabs defaultActiveKey="1">
                <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                  <Form.Item label={<IntlMessages id="global.title" />}>
                    {getFieldDecorator("title", {
                      rules: [
                        {
                          required: true,
                          message: "Please input title!"
                        }
                      ],
                      initialValue: pages ? pages.title || "" : ""
                    })(<Input />)}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="global.category" />}>
                    {getFieldDecorator("cat_ids", {
                      rules: [
                        {
                          required: true,
                          message: "Please input categorys!"
                        }
                      ],
                      initialValue: category_ids
                    })(<BaseSelect mode="multiple" options={categories} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.alias" />}>
                    {getFieldDecorator("alias", {
                      rules: [
                        {
                          required: true,
                          message: "Please input alias!"
                        }
                      ],
                      initialValue: pages ? pages.alias || "" : ""
                    })(<Input />)}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="global.user" />}>
                    {getFieldDecorator("created_by", {
                      rules: [
                        {
                          required: false,
                          message: "Please select user "
                        }
                      ],
                      initialValue: pages ? pages.created_by : null
                    })(
                      <BaseSelect
                        defaultTextValue={null}
                        options={accountName}
                        selected={pages ? pages.created_by : ""}
                        defaultText="Select one user..."
                      // onChange={value => console.log(value)}
                      />
                    )}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: pages ? (pages.status ? 1 : 0) : 1
                    })(
                      <Radio.Group name="radiogroup">
                        <Radio value={1}>
                          <IntlMessages id="global.public" />
                        </Radio>
                        <Radio value={0}>
                          <IntlMessages id="global.unpublic" />
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane tab={<IntlMessages id="global.intro" />} key="2">
                  <Form.Item {...formItemLayoutContent}>
                    {getFieldDecorator("introtext", {
                      rules: [
                        {
                          required: false,
                          message: "Please input intro!"
                        }
                      ],
                      initialValue: pages ? pages.introtext || "" : ""
                    })(
                      <SunEditor
                        setContents={pages ? pages.introtext || "" : ""}
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>

                <TabPane tab={<IntlMessages id="global.content" />} key="3">
                  <Form.Item {...formItemLayoutContent}>
                    {getFieldDecorator("content", {
                      rules: [
                        {
                          required: true,
                          message: "Please input content!"
                        }
                      ],
                      initialValue: pages ? pages.content || "" : ""
                    })(
                      <SunEditor
                        setContents={pages ? pages.content || "" : ""}
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane tab={<IntlMessages id="global.metadata" />} key="4">
                  <Form.Item label={<IntlMessages id="global.metakey" />}>
                    {getFieldDecorator("metakey", {
                      rules: [
                        {
                          required: false,
                          message: "Please input metakey!"
                        }
                      ],
                      initialValue: pages ? pages.metakey || "" : ""
                    })(<TextArea />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.metadesc" />}>
                    {getFieldDecorator("metadesc", {
                      rules: [
                        {
                          required: false,
                          message: "Please input metadesc!"
                        }
                      ],
                      initialValue: pages ? pages.metadesc || "" : ""
                    })(<TextArea />)}
                  </Form.Item>
                </TabPane>

                <TabPane tab={<IntlMessages id="global.images" />} key="5">
                  <Form.Item {...formDesc}>
                    <InputChosseFile
                      key="images"
                      onChange={this.getValueImage}
                      defautValue={defaultImage}
                    ></InputChosseFile>
                  </Form.Item>
                </TabPane>
              </Tabs>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    type="danger"
                    ghost
                    onClick={() => this.props.onPagesClose()}
                  >
                    <IntlMessages id="global.cancel" />
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    htmlType="submit"
                    loading={this.props.loading}
                  >
                    <IntlMessages id="global.submit" />
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Form.create({ name: "pages" })(AddPages);
