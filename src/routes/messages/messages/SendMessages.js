import React, { Component } from "react";
import { Form, Row, Col, Modal, Button, Card, Select } from "antd";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import BaseSelect from "Components/Elements/BaseSelect";
import { connect } from "react-redux";
import { getAllACCOUNT } from "../../../actions/AccountAction";
import { xoa_dau } from "../../../util/string_helper";
const { Option } = Select;
import { SelectCustomer } from "../../../components/SelectCustomer";

class SendMessages extends Component {
  static propTypes = {
    messages: PropTypes.object,
    onSaveMessages: PropTypes.func,
    openSend: PropTypes.bool,
    onMessagesClose: PropTypes.func
  };

  static defaultProps = {
    edit: false,
    openSend: false,

  };

  state = {
    openSend: false,
    filterAll: { paging: 0 },
    uids: [],
    loading: false
  };

  componentDidMount() {
    this.props.getAllCustomer(this.state.filterAll, "registered");
  }

  onHandleClose = () => {
    this.props.onMessagesClose();
    this.setState({
      ...this.state,
      openSend: !this.state.openSend
    });
  };

  handleOk = event => {
    if (this.state.uids.length < 1) return;
    event.preventDefault();
    this.setState({ loading: true })
    this.props.onSendMessages(this.props.messages.id, this.state.uids).then(res => {
      this.props.onMessagesClose();
      this.setState({ loading: false })
    });


  };
  handleChangeOption = (value) => {
    this.setState({
      uids: value
    })
  }

  onSearch = (str) => {

  }

  render() {
    const { openSend, listCustomer } = this.props;

    const customers = [];
    listCustomer.map(item => {
      customers.push(<Option key={item.id}>{(item.email
        ? `${item.email} - ${item.firstname} ${item.lastname}`
        : `${item.mobile}`
      )
        .split("null", 1)
        .toString()}</Option>)
    });


    return (
      <React.Fragment>
        {openSend ? (
          <Modal
            title="Gửi thông báo"
            visible={openSend}
            closable={true}
            onOk={this.handleOk}
            onCancel={this.onHandleClose}
            okText="Gửi"
            cancelText="Huỷ"
            width="80%"
            okButtonProps={{ loading: this.state.loading }}
          >
            <Row gutter={12}>
              <Col span={14}>
                <Card title="Chọn người nhận">
                  {/* <Select
                    mode="multiple"
                    placeholder="Please select"
                    defaultValue={[]}
                    onChange={this.handleChangeOption}
                    style={{ width: '100%' }}
                    showSearch={false}
                    allowClear={true}
                    filterOption={(input, option) => {
                      input = xoa_dau(input);
                      let title = xoa_dau(option.props.children)
                      return (
                        title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {customers}
                  </Select> */}
                  <SelectCustomer  mode="multiple" placeholder="Please select" onChange={this.handleChangeOption}/>
                </Card>

                <Card>
                  {`Người nhận (${this.state.uids.length})`}
                </Card>
              </Col>
              <Col span={10}>
                <Card title="Thông báo">
                  <p><strong>Tiêu đề: </strong>{this.props.messages.title}</p>
                  <p><strong>Nội dung: </strong> {this.props.messages.content}</p>
                </Card>
              </Col>
            </Row>
          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    listMessages: state.messages.listMessages,
    listCustomer: state.account.listAccount,
    paging: state.messages.paging
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllCustomer: (filter, type) => dispatch(getAllACCOUNT(filter, type))
  };
}

const WrappedNormalLoginForm = Form.create({ name: "SendMessages" })(
  SendMessages
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalLoginForm);
