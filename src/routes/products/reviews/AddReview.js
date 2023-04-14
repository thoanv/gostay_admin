import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import BaseSelect from "Components/Elements/BaseSelect";
import { Form, Input, Row, Col, Button, Modal, Radio, Tabs, Rate } from "antd";
import InputChosseFile from "../../fileManager/InputChosseFile";
import SunEditor, { buttonList } from "suneditor-react";
import { NotificationManager } from "react-notifications";

class AddReview extends Component {
  static propTypes = {
    review: PropTypes.object,
    onSaveReview: PropTypes.func,
    open: PropTypes.bool,
    onReviewClose: PropTypes.func,
    edit: PropTypes.bool
  };

  state = {
    currentReview: null,
    rank: 1,
    filter: {
      paging: {
        page: 1
      }
    },
    images: []
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.review && nextProps.review !== this.props.review) {
      this.setState({
        ...nextProps,
        rank: nextProps.review.rank,
        images: nextProps.review.images ? nextProps.review.images : []
      });
    }
  }

  getValueChosseFile = data => {
    this.setState({
      ...this.state,
      images: data.length ? data.map(item => item.path_relative) : []
    });
  };

  getValueImage = data => {
    this.setState({
      ...this.state,
      images: data.length ? data.map(item => item.path_relative) : []
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form
      .validateFields((err, values) => {
        if (!err) {
          var review = { ...values };
          review.rank = this.state.rank;
         
          if (review.comment === '<p><br></p>') {
            NotificationManager.error("Please select comment review");
          } else {


            review.images = this.state.images;
            console.log(review);

            this.props.onSaveReview(
              review,
              this.props.review ? this.props.review.id : null
            );
          }
        }
      })
      .then(this.setState({ images: [] }));
  };

  handleChange = value => {
    this.setState({
      ...this.state,
      rank: value
    });
  };

  onClose() {
    this.setState({
      review: null,
      images: [],
      rank: 1
    });
    this.props.onReviewClose();
  }

  searchTour(value) {
    this.setState(
      {
        filter: {
          paging: {
            page: 1
          },
          search: value
        }
      },
      () => {
        this.props.getAllTour(this.state.filter);
      }
    );
  }

  render() {
    const { review } = this.props;

    const { open, onReviewClose, edit, tourName, accountName } = this.props;

    const desc = ["terrible", "bad", "normal", "good", "wonderful"];

    const { getFieldDecorator } = this.props.form;
    const defaultImage = review
      ? review.images.length && review.images[0] !== ""
        ? this.state.images.map(item => ({
          name: item,
          path_relative: item
        }))
        : []
      : [];
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
                <IntlMessages id="review.editReview" />
              ) : (
                  <IntlMessages id="review.addReview" />
                )
            }
            toggle={onReviewClose}
            visible={open}
            closable={true}
            destroyOnClose={true}
            onCancel={() => this.onClose()}
            footer={null}
            width="50%"
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Tabs defaultActiveKey="1">
                <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
                  <Form.Item label={<IntlMessages id="global.title" />}>
                    {getFieldDecorator("title", {
                      initialValue: review ? review.title || "" : ""
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="review.tour_name" />}>
                    {getFieldDecorator("sub_id", {
                      rules: [
                        {
                          required: true,
                          message: "Please select tour name!"
                        }
                      ],
                      initialValue: review ? review.sub_id : ""
                    })(
                      <BaseSelect
                        showSearch
                        options={tourName}
                        selected={review ? review.sub_id : ""}
                        defaultText="Select one..."
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="review.user_review" />}>
                    {getFieldDecorator("created_by", {
                      rules: [
                        {
                          required: true,
                          message: "Please select user review!"
                        }
                      ],
                      initialValue: review ? review.created_by : ""
                    })(
                      <BaseSelect
                        options={accountName}
                        selected={review ? review.created_by : ""}
                        defaultText="Select one..."
                        onChange={value => console.log(value)}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="review.rank" />}>
                    <span>
                      <Rate
                        tooltips={desc}
                        onChange={this.handleChange}
                        value={this.state.rank}
                      />
                      {this.state.rank ? (
                        <span className="ant-rate-text">
                          {desc[this.state.rank - 1]}
                        </span>
                      ) : (
                          ""
                        )}
                    </span>
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: review
                        ? review.status === 1
                          ? 1
                          : review.status === 0
                            ? 0
                            : 2
                        : 1
                    })(
                      <Radio.Group name="radiogroup">
                        <Radio value={1}>
                          <IntlMessages id="global.publish" />
                        </Radio>
                        <Radio value={0}>
                          <IntlMessages id="global.unpublish" />
                        </Radio>
                        <Radio value={2}>
                          <IntlMessages id="global.pending" />
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane tab={<IntlMessages id="global.comment" />} key="2">
              
                   <Form.Item {...formDesc}>
                    {getFieldDecorator("comment", {
                        rules: [
                          {
                            required: true,
                            message: "Please select comment review!"
                          }
                        ],
                        initialValue: review ? review.comment || "" : ""
                    })(<TextArea rows={4} />)}
                  </Form.Item>
                </TabPane>
                <TabPane tab={<IntlMessages id="review.images" />} key="3">
                  <Form.Item>
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
                  <Button type="default" onClick={() => this.onClose()}>
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
    // getAllTour: (filter, paginate) => dispatch(getAllTour(filter, paginate)),
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Form.create({ name: "review" })(AddReview));
