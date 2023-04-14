import { Button, Col, Form, Input, InputNumber, Modal, Row, Tabs } from "antd";
import BaseSelect from "Components/Elements/BaseSelect";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { getAllWishListAccount } from "../../../actions/AccountAction";
import { getAllGroups } from "../../../actions/GroupActions";
import BaseCheckBoxList from "Components/Elements/BaseCheckboxes";
import ImageInTable from "../../../components/ImageInTable";
import InputChosseFile from "../../fileManager/InputChosseFile";
import { _getAll } from "../../../actions/PermissionAction";

class AddRegistered extends Component {
  static propTypes = {
    account: PropTypes.object,
    onSaveAccount: PropTypes.func,
    open: PropTypes.bool,
    onAccountClose: PropTypes.func
  };

  static defaultProps = {
    account: {
      roleid: []
    },
    edit: false,
    open: false
  };

  state = {
    filter: {
      paging: {
        perpage: 10,
        page: 1
      }
    },
    roleids: [],
    account: null,
    image: "",
    wishlist: []
  };

  getValueChosseFile = data => {
    this.setState({
      ...this.state,
      image: data[0] ? data[0].path_relative : ""
    });
  };
  // async componentDidMount() {
  //   await this.props.getListGroup();
  //   let register = this.props.listGroup.filter(
  //     item => item.slug === "registered"
  //   );
  //   this.setState({
  //     ...this.state,
  //     groupid: this.props.edit
  //       ? this.props.account.groupid
  //       : register.map(item => item.id),
  //     account: this.props.account
  //   });
  // }
  componentDidMount() {
    this.props._getAll();
    this.setState({
      ...this.state,
      account: this.props.account
    });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.account !== state.account) {
      return {
        ...state,
        account: props.account
      };
    }
    return null;
  }

  onSetGroup = (name, value) => {
    this.setState({
      groupid: value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var account = {
          ...values,
          roleids: [2],
          image: this.state.image
        };

        this.props.onSaveAccount(
          account,
          this.props.account ? this.props.account.id : null
        ).then(res => this.setState({
          image: ""
        }))
      }
      this.setState({
        account: null
      })
    });
  };

  changeTab = activeKey => {
    if (activeKey === "2") {
      this.props.getwishlist(this.props.account.id, this.state.filter);

      // console.log('id account', this.props.account.id);
    }
  };
  render() {
    const {
      onAccountClose,
      open,
      account,
      edit,
      country,
      wishlist,
      config
    } = this.props;
    // console.log('wishlist', this.props.wishlist);
    const { getFieldDecorator } = this.props.form;
    const { TabPane } = Tabs;
    const dedfaultImage = account
      ? account.image
        ? [{ name: account.image, path_relative: account.image }]
        : []
      : [];
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
    const formwishlist = {
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
                    <IntlMessages id="global.create"/>
                )
            }
            toggle={onAccountClose}
            visible={open}
            destroyOnClose={true}
            closable={true}
            onCancel={() => this.props.onAccountClose()}
            footer={null}
            width="50%"
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Tabs defaultActiveKey="1" onChange={this.changeTab}>
                <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                  <Form.Item label={<IntlMessages id="global.email" />}>
                    {getFieldDecorator("email", {
                      rules: [
                        {
                          type: "email",
                          message: "The input is not valid E-mail!"
                        },
                        {
                          required: true,
                          message: "Please input your E-mail!"
                        }
                      ],
                      initialValue: account ? account.email || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  {edit ? null : (
                    <Form.Item
                      label={<IntlMessages id="global.password" />}
                      hasFeedback
                    >
                      {getFieldDecorator("password", {
                        rules: [
                          {
                            required: true,
                            message: "Please input your password!"
                          },
                          {
                            validator: this.validateToNextPassword
                          }
                        ],
                        initialValue: account ? account.password || "" : ""
                      })(<Input.Password />)}
                    </Form.Item>
                  )}

                  <Form.Item label={<IntlMessages id="global.firstname" />}>
                    {getFieldDecorator("firstname", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your firstname!"
                        }
                      ],
                      initialValue: account ? account.firstname || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="global.lastname" />}>
                    {getFieldDecorator("lastname", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your last name !"
                        }
                      ],
                      initialValue: account ? account.lastname || "" : ""
                    })(<Input style={{ width: "100%" }} />)}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="global.mobile" />}>
                    {getFieldDecorator("mobile", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your phone number!"
                        }
                      ],
                      initialValue: account ? account.mobile || "" : ""
                    })(<InputNumber style={{ width: "100%" }} />)}
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="global.country" />}>
                    {getFieldDecorator("country_id", {
                      initialValue: account ? account.country_id : ""
                    })(
                      <BaseSelect
                        options={country}
                        selected={account ? account.country_id : ""}
                        defaultText="Select a country"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch={true}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.avatar" />}>
                    <InputChosseFile
                      onChange={this.getValueChosseFile}
                      limit={1}
                      defautValue={dedfaultImage}
                    ></InputChosseFile>
                  </Form.Item>
                  {/* {edit ? (
                    <Form.Item label="Group">
                      <BaseCheckBoxList
                        data={this.props.listGroup}
                        name="groupid"
                        value={this.state.groupid}
                        onChange={this.onSetGroup}
                      />
                    </Form.Item>
                  ) : null} */}
                </TabPane>
                {edit ? (
                  <TabPane tab={<IntlMessages id="global.wishlist" />} key="2">
                    <Form.Item {...formwishlist}>
                      <div style={{ maxHeight: "80vh", overflow: "auto" }}>
                        {wishlist.length ? (
                          wishlist.map(item => (
                            <div key={item.id}>
                              <ImageInTable
                                src={config.url_asset_root + item.image}
                                alt={`${item.title}_logo`}
                              ></ImageInTable>

                              <Link
                                to="/app/products/tours"
                                style={{ marginLeft: "20px" }}
                              >
                                {item.title}
                              </Link>
                            </div>
                          ))
                        ) : (
                          <div><IntlMessages id="global.nowishlist" /></div>
                        )}
                      </div>
                    </Form.Item>
                  </TabPane>
                ) : null}
              </Tabs>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    style={{ marginLeft: 8 }}
                    type='default'
                    onClick={() => this.props.onAccountClose()}
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
const mapStateToProps = state => {
  return {
    list: state.permission.list_role,
    wishlist: state.account.wishlist,
    config: state.config
  };
};
function mapDispatchToProps(dispatch) {
  return {
    _getAll: () => dispatch(_getAll()),
    getwishlist: data => dispatch(getAllWishListAccount(data))
  };
}

export default Form.create({ name: "register" })(
  connect(mapStateToProps, mapDispatchToProps)(AddRegistered)
);
