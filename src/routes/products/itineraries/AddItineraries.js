import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes, { string } from "prop-types";
import IntlMessages from "Util/IntlMessages";
import { Form, Input, Row, Col, Button, Modal, Radio, Tabs, Rate } from "antd";
import SunEditor, { buttonList } from "suneditor-react";
import BaseSelect from "../../../components/Elements/BaseSelect";
import BaseCheckBoxList from "Components/Elements/BaseCheckboxes";
import { getTicketItineraries } from "../../../actions/TicketItineraries Action";
import InputChosseFile from "../../fileManager/InputChosseFile";

class AddItineraries extends Component {
  static propTypes = {
    itinerary: PropTypes.object,
    onSaveItineraries: PropTypes.func,
    open: PropTypes.bool,
    onItinerariesClose: PropTypes.func,
    edit: PropTypes.bool,
  };

  state = {
    meal: [],
    image: "",
    currentItinerary: null,
  };
  static getDerivedStateFromProps(props, state) {
    if (state.currentItinerary !== props.itinerary) {
      return {
        currentItinerary: props.itinerary,
        meal: props.itinerary ? props.itinerary.meal : [],
        image: props.itinerary
          ? props.itinerary.image
            ? props.itinerary.image
            : ""
          : "",
      };
    }
    return null;
  }
  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.itinerary && nextProps.itinerary !== this.props.itinerary) {
      this.setState({
        ...nextProps,
        image: nextProps.itinerary ? nextProps.itinerary.image : "",
      });
    }
  }

  handleClose() {
    this.setState({
      itinerary: null,
      image: "",
    });
    this.props.onItinerariesClose();
  }

  getValueChosseFile = (data) => {
    this.setState({
      ...this.state,
      image: data.length ? data[0].path_relative : "",
    });
  };
  getValueImage = (data) => {
    this.setState({
      ...this.state,
      image: data[0] ? data[0].path_relative : "",
    });
  };
  checkContent = (data) => {};
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      var itinerary = { ...values };

      if (
        itinerary.content === "" ||
        itinerary.content === "<p><br> </p>" ||
        itinerary.content === "<p></p>"
      ) {
        itinerary.content = null;
      } else {
        if (itinerary.content.indexOf("<br>") > 0) {
          const str = itinerary.content.split("<br>").join("");
          itinerary.content = str;
          console.log(str);
        }
      }
      itinerary.image = this.state.image;
      itinerary.meal = this.state.meal;
      this.props
        .onSaveItineraries(
          itinerary,
          this.props.itinerary ? this.props.itinerary.id : null
        )
        .then((res) =>
          this.setState({
            image: "",
          })
        );
    });
  };

  onChangeMeal = (name, values) => {
    this.setState({
      meal: values,
    });
  };

  render() {
    var { itinerary } = this.props;
    const {
      open,
      onItinerariesClose,
      edit,
      tourName,
      destinationName,
      currentItinerary,
    } = this.props;

    const desc = ["terrible", "bad", "normal", "good", "wonderful"];

    const { getFieldDecorator } = this.props.form;
    const { TabPane } = Tabs;
    const { TextArea } = Input;
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

    const listMeal = [
      { title: "Breakfast", id: "B" },
      { title: "Lunch", id: "L" },
      { title: "Dinner", id: "D" },
      { title: "Flight Meal", id: "F" },
    ];
    const dedfaultImage = itinerary
      ? itinerary.image
        ? [{ name: itinerary.image, path_relative: itinerary.image }]
        : []
      : [];

    return (
      <React.Fragment>
        {open ? (
          <Modal
            title={
              edit ? (
                <IntlMessages id="itineraries.editItineraries" />
              ) : (
                <IntlMessages id="itineraries.addItineraries" />
              )
            }
            onCancel={onItinerariesClose}
            visible={open}
            closable={true}
            destroyOnClose={true}
            footer={null}
            width="70%"
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Tabs defaultActiveKey="1">
                <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                  <Form.Item label={<IntlMessages id="global.title" />}>
                    {getFieldDecorator("title", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your title !",
                        },
                      ],
                      initialValue: itinerary ? itinerary.title || "" : "",
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item
                    label={<IntlMessages id="itineraries.dest_name" />}
                  >
                    {getFieldDecorator("dest_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please select destination name!",
                        },
                      ],
                      initialValue: itinerary ? itinerary.dest_id : "",
                    })(
                      <BaseSelect
                        showSearch
                        options={destinationName}
                        selected={itinerary ? itinerary.dest_id : ""}
                        defaultText="Select one..."
                        // onChange={value => console.log(value)}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="itineraries.meal" />}>
                    <BaseCheckBoxList
                      data={listMeal}
                      name="meal"
                      onChange={this.onChangeMeal}
                      defaultValue={itinerary ? itinerary.meal : null}
                    />
                  </Form.Item>

                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: itinerary ? (itinerary.status ? 1 : 0) : 1,
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
                <TabPane tab={<IntlMessages id="global.content" />} key="2">
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("content", {
                      initialValue: itinerary ? itinerary.content || "" : "",
                    })(
                      <SunEditor
                        setContents={itinerary ? itinerary.content || "" : ""}
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex,
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
              </Tabs>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button type="default" onClick={() => this.handleClose()}>
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

function mapDispatchToProps(dispatch) {
  return {
    getAllItineraries: (filter) => dispatch(getTicketItineraries(filter)),
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Form.create({ name: "itineraries" })(AddItineraries));
