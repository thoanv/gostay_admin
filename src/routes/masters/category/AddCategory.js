import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import SunEditor, { buttonList } from "suneditor-react";
import PicturesWall from "../../../components/Elements/UploadImage";
import { getAllCategory, getAllParent } from "../../../actions/CategoryActions";
import BaseSelect from "Components/Elements/BaseSelect";
import { Form, Input, Row, Col, Button, Modal, Radio, Tabs } from "antd";
import InputChosseFile from "../../fileManager/InputChosseFile";

class AddCategory extends Component {
  static propTypes = {
    category: PropTypes.object,
    onSaveCategory: PropTypes.func,
    open: PropTypes.bool,
    onCategoryClose: PropTypes.func,
    edit: PropTypes.bool
  };

  state = {
    items: [],
    image: "",
    listParent: []
  };

  getValueChosseFile = data => {
    this.setState({
      ...this.state,
      image: data[0] ? data[0].path_relative : ""
    });
  };

  componentDidMount() {
    this.props.getAllParent();
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.category && nextProps.category !== this.props.category) {
      this.setState({
        ...nextProps,
        image: nextProps.category.image
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var category = { ...values };
        category.image = this.state.image;

        this.props.onSaveCategory(
          category,
          this.props.category ? this.props.category.id : null
        ).then(res => this.setState({
          image: ""
        }))
      }
    });
  };

  render() {
    const { category, open, onCategoryClose, edit, categories } = this.props;

    const dedfaultImage = category
      ? category.image
        ? [{ name: category.image, path_relative: category.image }]
        : []
      : [];

    var listParent = categories.filter(item => {
      return item.parent_id == 0;
    });
    if (categories.length > 0 && categories[0].id !== 0) {
      categories.unshift({
        id: 0,
        parent_id: 0,
        title: "No parent"
      });
    }

    const { getFieldDecorator } = this.props.form;
    const { TabPane } = Tabs;
    const { TextArea } = Input;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
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
                <IntlMessages id="category.editCategory" />
              ) : (
                <IntlMessages id="category.addCategory" />
              )
            }
            toggle={onCategoryClose}
            visible={open}
            closable={true}
            destroyOnClose={true}
            onCancel={onCategoryClose}
            footer={null}
            width="50%"
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Tabs defaultActiveKey="1" type="card">
                <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                  <Form.Item label={<IntlMessages id="global.title" />}>
                    {getFieldDecorator("title", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your title !"
                        }
                      ],
                      initialValue: category ? category.title || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.parent" />}>
                    {getFieldDecorator("parent_id", {
                      initialValue: category ? category.parent_id : ""
                    })(
                      <BaseSelect
                        options={listParent}
                        selected={category ? category.parent_id : ""}
                        defaultText="Select one..."
                        onChange={value => console.log(value)}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.type" />}>
                    {getFieldDecorator("type", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your type!"
                        }
                      ],
                      initialValue: category ? category.type || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: category ? (category.status ? 1 : 0) : 1
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
                  <Form.Item label={<IntlMessages id="global.image" />}>
                    <InputChosseFile
                      onChange={this.getValueChosseFile}
                      limit={1}
                      defautValue={dedfaultImage}
                    ></InputChosseFile>
                  </Form.Item>
                </TabPane>
                <TabPane
                  tab={<IntlMessages id="global.tabdescription" />}
                  key="2"
                >
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("description", {
                      initialValue:
                        category != null ? category.description || "" : ""
                    })(
                      <SunEditor
                        setContents={category != null ? category.description || "" : ""}
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
              </Tabs>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    type="default"
                    // ghost
                    onClick={() => this.props.onCategoryClose()}
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

function mapStateToProps(state) {
  return {
    categories: state.category.listParent
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // getAllCategory: (filter) => dispatch(getAllCategory(filter)),
    getAllParent: () => dispatch(getAllParent())
  };
}

const AddCategoryForm = Form.create({ name: "AddTour" })(AddCategory);

export default connect(mapStateToProps, mapDispatchToProps)(AddCategoryForm);
