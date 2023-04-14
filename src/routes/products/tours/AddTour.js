import React, { Component } from "react";
import { connect } from "react-redux";
import BaseIntegerList from "Components/Elements/BaseIntegerList";
import BaseSelect from "Components/Elements/BaseSelect";
import {
  Form,
  Input,
  Row,
  Col,
  Tabs,
  Modal,
  Icon,
  Button,
  Spin,
  InputNumber,
} from "antd";
import PropTypes from "prop-types";
import IntlMessages from "Util/IntlMessages";
import BaseRadioList from "../../../components/Elements/BaseRadios";
import { NotificationManager } from "react-notifications";
// actions
import { getAllACCOUNT } from "../../../actions/AccountAction";
import {
  createTour,
  updateTour,
  getTourDetail,
} from "../../../actions/TourActions";
import { getAllCountry } from "../../../actions/CountryActions";
import { getAllCategory } from "../../../actions/CategoryActions";
import InputChosseFile from "../../fileManager/InputChosseFile";
import SunEditor, { buttonList } from "suneditor-react";
const { TabPane } = Tabs;

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

const inputCol = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const stype = [
  { id: "package", title: "Full Package" },
  { id: "land", title: "Land" },
];

class AddTour extends Component {
  static propTypes = {
    onSaveItem: PropTypes.func,
    open: PropTypes.bool,
    onItemClose: PropTypes.func,
  };

  static defaultProps = {
    edit: false,
    open: false,
  };

  state = {
    currentTour: null,
    isLoading: false,
    activeTab: 1,
    airlines: [],
    gallery: [],
    image: "",
  };

  componentDidMount() {
    this.props.getAllCategory();
    this.props.getAllCountry({ paging: false });
    this.props.getAllSupplier({}, "supplier");
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.edit != this.props.edit) {
      if (nextProps.edit) this.setState({ isLoading: true });
    }
    if (nextProps.item && nextProps.item != this.props.item) {
      this.props.getTourDetail(nextProps.item).then((tour) => {
        this.setState({
          ...this.state,
          currentTour: tour,
          isLoading: false,
          gallery: JSON.parse(tour.gallery),
          image: tour.image,
        });
      });
    }
  }

  getValueChosseFile = (data) => {
    this.setState({
      ...this.state,
      gallery: data.length ? data.map((item) => item.path_relative) : [],
    });
  };

  getValueImage = (data) => {
    this.setState(
      {
        ...this.state,
        image: data.length ? data[0].path_relative : "",
      },
      () => console.log("aaa", this.state.image)
    );
  };

  handleClose() {
    this.props.onClose();
    this.setState({ currentTour: null, isLoading: false });
  }

  handleChange(content) {
    console.log(content);
  }

  submit = (event) => {
    event.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.gallery = this.state.gallery;
        values.image = this.state.image;
        if (this.props.item) {
          values.id = this.props.item;
        }

        if (values.id) {
          this.props.updateTour(values).then(() => {
            this.handleClose();
          });
        } else {
          this.props.createTour(values).then(() => {
            this.handleClose();
          });
        }
      } else {
        NotificationManager.error("Please fill out all inputs and try again!");
      }
    });
  };

  render() {
    var { currentTour, isLoading } = this.state;
    var { open, edit, countries, categories, suppliers, airlines } = this.props;

    const { getFieldDecorator } = this.props.form;

    var category_ids = currentTour
      ? JSON.parse(currentTour.cat_ids).map((item) => parseInt(item))
      : [];
    var days = currentTour ? parseInt(currentTour.days) : null;
    var nights = currentTour ? parseInt(currentTour.nights) : null;
    const dedfaultGallery = currentTour
      ? currentTour.gallery
        ? JSON.parse(currentTour.gallery).map((image) => {
            return { name: image, path_relative: image };
          })
        : []
      : [];
    const dedfaultImage = currentTour
      ? currentTour.image
        ? [{ name: currentTour.image, path_relative: currentTour.image }]
        : []
      : [];
    return (
      <Modal
        title={
          edit ? (
            <IntlMessages id="global.edit" />
          ) : (
            <IntlMessages id="global.create" />
          )
        }
        visible={open}
        closable={true}
        destroyOnClose={true}
        onCancel={() => this.handleClose()}
        footer={null}
        width="70%"
        top={50}
      >
        {open ? (
          !isLoading ? (
            <Form
              onSubmit={this.submit}
              {...formItemLayout}
              style={{ width: "100%" }}
            >
              <Tabs
                defaultActiveKey="1"
                onChange={(key) => this.setState({ activeTab: key })}
              >
                <TabPane tab="Basic" key="basic">
                  <Form.Item label={<IntlMessages id="global.title" />}>
                    {getFieldDecorator("title", {
                      rules: [
                        { required: true, message: "Please input tour title!" },
                      ],
                      initialValue: currentTour ? currentTour.title || "" : "",
                    })(<Input />)}
                  </Form.Item>
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label={<IntlMessages id="tour.alt_title" />}
                        {...inputCol}
                      >
                        {getFieldDecorator("alt_title", {
                          // rules: [
                          //     { required: true, message: "Please input tour alt_title!" }
                          // ],
                          initialValue: currentTour
                            ? currentTour.alt_title || ""
                            : "",
                        })(<Input />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={<IntlMessages id="tour.promo_title" />}
                        {...inputCol}
                      >
                        {getFieldDecorator("promo_title", {
                          // rules: [
                          //     { required: true, message: "Please input tour promo_title!" }
                          // ],
                          initialValue: currentTour
                            ? currentTour.promo_title || ""
                            : "",
                        })(<Input />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label={<IntlMessages id="global.code" />}>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item {...inputCol}>
                          {getFieldDecorator("code", {
                            rules: [
                              {
                                required: true,
                                message: "Please input tour code!",
                              },
                            ],
                            initialValue: currentTour
                              ? currentTour.code || ""
                              : "",
                          })(<Input />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item>
                          {getFieldDecorator("stype", {
                            initialValue: currentTour ? currentTour.stype : "",
                          })(<BaseRadioList options={stype} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.country" />}>
                    {getFieldDecorator("country_id", {
                      initialValue: currentTour ? currentTour.country_id : "",
                    })(
                      <BaseSelect
                        options={countries}
                        selected={currentTour ? currentTour.country_id : ""}
                        defaultText="Select one..."
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="tour.supplier" />}>
                    {getFieldDecorator("cid", {
                      rules: [
                        {
                          required: true,
                          message: "Please input tour supplier!",
                        },
                      ],
                      initialValue: currentTour ? currentTour.cid : "",
                    })(
                      <BaseSelect
                        optionLabel="company"
                        options={suppliers}
                        selected={currentTour ? parseInt(currentTour.cid) : ""}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.category" />}>
                    {getFieldDecorator("cat_ids", {
                      initialValue: category_ids,
                    })(<BaseSelect mode="multiple" options={categories} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.days" />}>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item {...inputCol}>
                          {getFieldDecorator("days", {
                            initialValue: days,
                          })(
                            <BaseIntegerList
                              min={1}
                              max={20}
                              defaultText="Select days..."
                              selected={days}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...inputCol}
                          label={<IntlMessages id="tour.nights" />}
                        >
                          {getFieldDecorator("nights", {
                            initialValue: nights,
                          })(
                            <BaseIntegerList
                              min={1}
                              max={20}
                              defaultText="Select nights..."
                              selected={nights}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="tour.price" />}>
                    {getFieldDecorator("min_price", {
                      rules: [
                        {
                          required: true,
                          message: "Please input tour price!",
                        },
                      ],
                      initialValue: currentTour
                        ? currentTour.min_price || ""
                        : "",
                    })(<InputNumber style={{ width: "100%" }} />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="tour.cutofftime" />}>
                    {getFieldDecorator("cutofftime", {
                      initialValue: currentTour
                        ? currentTour.cutofftime || ""
                        : "",
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.status" />}>
                    {getFieldDecorator("status", {
                      initialValue: currentTour
                        ? currentTour.status
                          ? 1
                          : 0
                        : 1,
                    })(
                      <BaseRadioList
                        options={[
                          {
                            id: 0,
                            title: <IntlMessages id="global.unpublish" />,
                          },
                          {
                            id: 1,
                            title: <IntlMessages id="global.publish" />,
                          },
                        ]}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.featured" />}>
                    {getFieldDecorator("featured", {
                      initialValue: currentTour
                        ? currentTour.featured
                          ? 1
                          : 0
                        : 0,
                    })(
                      <BaseRadioList
                        options={[
                          { id: 0, title: <IntlMessages id="global.normal" /> },
                          {
                            id: 1,
                            title: <IntlMessages id="global.featured" />,
                          },
                        ]}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<IntlMessages id="global.image" />}>
                    <InputChosseFile
                      key="image"
                      onChange={this.getValueImage}
                      defautValue={dedfaultImage}
                    ></InputChosseFile>
                  </Form.Item>
                </TabPane>
                <TabPane tab="Description" key="description">
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("description", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your description!",
                        },
                      ],
                      initialValue:
                        currentTour != null
                          ? currentTour.description || ""
                          : "",
                    })(
                      <SunEditor
                        setContents={currentTour ? currentTour.description : ""}
                        placeholder="Please type here..."
                        onChange={this.handleChange}
                        setOptions={{
                          buttonList: buttonList.complex,
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane tab="Short description" key="short_desc">
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("short_desc", {
                      rules: [
                        {
                          required: false,
                          message: "Please input your short description!",
                        },
                      ],
                      initialValue:
                        currentTour != null ? currentTour.short_desc || "" : "",
                    })(
                      <SunEditor
                        setContents={currentTour ? currentTour.short_desc : ""}
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex,
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane tab="Accommodation" key="accommodation">
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("accommodation", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your accommodation!",
                        },
                      ],
                      initialValue:
                        currentTour != null
                          ? currentTour.accommodation || ""
                          : "",
                    })(
                      <SunEditor
                        setContents={
                          currentTour ? currentTour.accommodation : ""
                        }
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex,
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
                <TabPane tab="Terms" key="terms">
                  <Form.Item {...formDesc}>
                    {getFieldDecorator("condition", {
                      rules: [
                        {
                          required: false,
                          message: "Please input your description!",
                        },
                      ],
                      initialValue:
                        currentTour != null ? currentTour.condition || "" : "",
                    })(
                      <SunEditor
                        setContents={currentTour ? currentTour.condition : ""}
                        placeholder="Please type here..."
                        setOptions={{
                          buttonList: buttonList.complex,
                        }}
                      />
                    )}
                  </Form.Item>
                </TabPane>
                {/* {currentTour ? (
                  <TabPane tab="Airlines" key="airlines">
                    <TourAirlines
                      tour={currentTour ? currentTour : null}
                      tourAirlines={currentTour ? currentTour.airlines : []}
                      onClose={() => this.handleClose()}
                    />
                  </TabPane>
                ) : null} */}
                <TabPane tab="Gallery" key="gallery">
                  <Form.Item {...formDesc}>
                    <InputChosseFile
                      key="gallery"
                      onChange={this.getValueChosseFile}
                      defautValue={dedfaultGallery}
                    ></InputChosseFile>
                  </Form.Item>
                </TabPane>
              </Tabs>
              {this.state.activeTab != "airlines" ? (
                <Row>
                  <Col span={24} style={{ textAlign: "right" }}>
                    <Button
                      className="ml-4"
                      type="default"
                      onClick={() => this.handleClose()}
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
              ) : null}
            </Form>
          ) : (
            <div className="text-center">
              <Spin
                indicator={
                  <Icon type="loading" style={{ fontSize: 40 }} spin />
                }
              />
            </div>
          )
        ) : null}
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    countries: state.country.listCountry,
    categories: state.category.listCategory,
    suppliers: state.account.listAccount,
    currentTour: state.tour.currentTour,
    airlines: state.tour.airlines,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllCountry: (filter) => dispatch(getAllCountry(filter)),
    getAllCategory: (filter) => dispatch(getAllCategory(filter)),
    getAllSupplier: (filter, data) => dispatch(getAllACCOUNT(filter, data)),
    createTour: (data) => dispatch(createTour(data)),
    updateTour: (data) => dispatch(updateTour(data)),
    getTourDetail: (id) => dispatch(getTourDetail(id)),
  };
};

const AddTourForm = Form.create({ name: "AddTour" })(AddTour);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTourForm);
