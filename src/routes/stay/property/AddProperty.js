import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Tabs,
  Spin,
  Icon
} from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import CustomPlacesAutoComplete from "../../../components/Elements/CustomPlacesAutoComplete";
import BaseSelect from "Components/Elements/BaseSelect";
import InputChosseFile from "../../fileManager/InputChosseFile";
import { NotificationManager } from "react-notifications";
import BaseCheckBoxList from "Components/Elements/BaseCheckboxes";
import { connect } from "react-redux";
import { _getAllDistricts } from "../../../actions/DistrictsActions";
import { _getAllProvinces } from "../../../actions/ProvincesActions";
import { _getAllWards } from "../../../actions/WardsActions";
import ListDataUtil from './ListDataUtil'
import { getFilterDataUtilities } from "../../../actions/PropertyAction";
// import SunEditor, { buttonList } from "suneditor-react";
import ReactQuill from 'react-quill';
const { TextArea } = Input;

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

const { TabPane } = Tabs;

class AddProperty extends Component {
  formRef = React.createRef();
  static propTypes = {
    open: PropTypes.bool,
    edit: PropTypes.bool,
  };

  static defaultProps = {
    edit: false,
    open: false,
  };

  state = {
    icon: "",
    cover_img: "",
    gallery: [],
    ownership_documents: [],
    propTab: 1,
    latitude: 0,
    longitude: 0,
    currentItem: null,
    listDistricts: [],
    listWards: [],
    utils: [],
    loading: true,
    activeTab: 1
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.item && nextProps.item !== this.props.item) {
      this.setState({
        ...nextProps,
        activeTab: 1,
        currentItem: nextProps.item,
        provinceL: null,
        loading: true,
        cover_img: nextProps.item && nextProps.item.cover_img && nextProps.item.cover_img.length ? nextProps.item.cover_img[0] : "",
        gallery: nextProps.item.gallery ? nextProps.item.gallery : [],
        ownership_documents: nextProps.item.ownership_documents ? nextProps.item.ownership_documents : [],
        utils: nextProps.item.utils ? nextProps.item.utils : []
      });
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (this.state.provinceL === null) {
      if (this.state.currentItem !== null) {

        await this.props._getAllDistricts(this.state.currentItem.province_id).then(res =>
          this.setState({
            provinceL: res.data,
            listDistricts: res.data
          })
        );
        await this.props._getAllWards(this.state.currentItem.district_id).then(res =>
          this.setState({

            listWards: res.data
          })
        )
        this.setState({

          loading: false
        })
      }

    }
  }
  async componentDidMount() {
    await this.props._getAllProvinces()
    await this.props.getFilterDataUtilities()
    this.setState({

      loading: false
    })

  }
  onSetLocation = (position, address, city_name) => {
    this.setState({
      ...this.state,
      latitude: +position.lat,
      longitude: +position.lng,
    });
  };

  onHandleClose = () => {
    this.props.onClose();
    this.setState({
      ...this.state,
      listDistricts: [],
      listWards: [],
      utils: [],
      activeTab: 1
    });
    console.log(this.state.activeTab)
  };


  onChange = (e) => {
    console.log(e.target.checked);
    this.setState({
      checkCompany: e.target.checked,
    });
  };

  onFinish = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
      if (!err) {
        var value = {
          ...values,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          room_type: +values.room_type,
          property_type: +values.property_type,
          gallery: this.state.gallery,
          cover_img: [this.state.cover_img],
          host_languages: this.state.host_languages,
          province_id: this.state.province_id,
          district_id: this.state.district_id,
          ward_id: this.state.ward_id,
          bed_type: this.state.bed_type,
          utils: this.state.utils,
          ownership_documents: this.state.ownership_documents
        };

        this.props.onSave(value, this.props.item ? this.props.item.id : null);
      } else {
        // let listErr = Object.keys(err).join(", ");
        NotificationManager.error(`Vui lòng điền hết các trường bắt buộc`);
      }
    });
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  getValueChosseFile = data => {
    this.setState({
      ...this.state,
      cover_img: data[0] ? data[0].path_relative : ""
    });
  };



  getValueChosseGallery = (data) => {
    this.setState({
      ...this.state,
      gallery: data.length ? data.map((item) => item.path_relative) : [],
    });
  };

  getValueChosseOwnership = (data) => {

    this.setState({
      ...this.state,
      ownership_documents: data.length ? data.map((item) => item.path_relative) : [],
    });
  };
  handleSizeChange = (e) => {
    this.setState({ propTab: e.target.value });
  };

  onChangeHostLanguages = (name, values) => {
    this.setState({
      host_languages: values,
    });
  };
  handleSelectProvince = (v, opition) => {

    this.setState({
      ...this.state,
      province_id: v


    });
    this.props._getAllDistricts(v).then(res =>
      this.setState({
        listDistricts: res.data
      })
    )

  }
  handleSelectDistrict = (v, opition) => {

    this.setState({
      ...this.state,
      district_id: v


    });
    this.props._getAllWards(v).then(res =>
      this.setState({
        listWards: res.data
      })
    )

  }
  handleSelectWard = (v, opition) => {

    this.setState({
      ...this.state,
      ward_id: v

    });


  }
  onChangeBedType = (name, values) => {


    this.setState({
      bed_type: values,
    }

    );
  };
  onChangeUtil = (data) => {

    this.setState({
      ...this.state,
      utils: data,
    })

  }

  clickTab(key, event) {
    if (this.props.edit) {
      this.setState({ activeTab: parseInt(key) })
    } else {
      event.preventDefault();
    }

  }

  onChangeTab(type) {
    var current = this.state.activeTab;
    if (type == 'next') current += 1;
    else if (type == 'prev') current -= 1;

    this.setState({ activeTab: current })
  }

  render() {
    const { open, edit, item, listType, listRoomType, account, listCancelPolicy, listProvinces, listDataUtil } = this.props;

    const { propTab, listDistricts, listWards, utils, activeTab } = this.state;

    const { getFieldDecorator } = this.props.form;
    var types = listType.map((item) => {
      return {
        id: item.id.toString(),
        title: item.title,
      };
    });
    var room_types = listRoomType.map((item) => {
      return {
        id: item.id.toString(),
        title: item.title,
      };
    });
    var CancelPolicy = listCancelPolicy.map((item) => {
      return {
        id: item.id.toString(),
        title: item.title,
      };
    });
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
    const dedfaultImage = item
      ? item.cover_img && item.cover_img.length
        ? [{ name: item.cover_img, path_relative: item.cover_img }]
        : []
      : [];

    const dedfaultOwnership = item
      ? item.ownership_documents
        ? this.state.ownership_documents.map((el) => ({
          name: el,
          path_relative: el,
        }))
        : []
      : [];
    const dedfaultGallery = item
      ? item.gallery
        ? this.state.gallery.map((el) => ({
          name: el,
          path_relative: el,
        }))
        : []
      : [];
    const listHostLanguages = [
      { title: "English", id: "EN" },
      { title: "Vietnamese", id: "VN" },

    ];
    var Province = listProvinces.map((item) => {
      return {
        id: item.id,
        title: item.title,
      };
    });
    var District = listDistricts.map((item) => {
      return {
        id: item.id,
        title: item.title,
      };
    });
    var Ward = listWards.map((item) => {
      return {
        id: item.id,
        title: item.title,
      };
    });
    const listbedtype = [

      { title: <span> <IntlMessages id="global.single_bed" /></span>, id: "1" },
      { title: <span> <IntlMessages id="global.double_bed" /></span>, id: "2" },

    ];
    return (
      <React.Fragment>
        {open ? (
          <Modal
            title={
              edit ? (
                <IntlMessages id="global.edit" />
              ) : (
                <IntlMessages id="global.add_new" />
              )
            }
            visible={open}
            closable={true}
            onCancel={this.onHandleClose}
            footer={null}
            width="85%"
          >
            {
              this.state.loading ?
                <div style={{ textAlign: 'center' }}>
                  <Spin size="large" tip="Loading..." />
                </div>

                :
                <Form
                  onSubmit={this.onFinish}
                  layout="vertical"
                  style={{ width: "100%" }}
                  ref={this.formRef}
                >
                  <Tabs activeKey={activeTab.toString()} onTabClick={(key, event) => this.clickTab(key, event)}>
                    <TabPane key={1} tab={<IntlMessages id="global.base_info" />}>
                      <Form.Item label={<IntlMessages id="global.title" />}>
                        {getFieldDecorator("title", {
                          rules: [
                            {
                              required: true,
                              message: "Please input title!",
                            },
                          ],
                          initialValue: item ? item.title || "" : "",
                        })(<Input />)}
                      </Form.Item>
                      <Row gutter={16} type="flex">
                        <Col span={12}>
                          <Form.Item label={<IntlMessages id="global.supplier" />}>
                            {getFieldDecorator("cid", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input supplier!",
                                },
                              ],
                              initialValue: item ? item.cid || "" : "",
                            })(
                              <BaseSelect
                                options={account}
                                selected={item ? item.cid : ""}
                                defaultText="Select a supplier"
                                showSearch={true}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label={<IntlMessages id="global.type" />}>
                            {getFieldDecorator("property_type", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input type!",
                                },
                              ],
                              initialValue: item
                                ? item.property_type.toString() || ""
                                : "",
                            })(
                              <BaseSelect
                                options={types}
                                selected={item ? item.property_type : ""}
                                defaultText="Select a type"
                                showSearch={true}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label={<IntlMessages id="global.room_type" />}>
                            {getFieldDecorator("room_type", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input room type!",
                                },
                              ],
                              initialValue: item ? item.room_type.toString() || "" : "",
                            })(
                              <BaseSelect
                                options={room_types}
                                selected={item ? item.room_type : ""}
                                defaultText="Select a type"
                                showSearch={true}
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} type="flex">
                        <Col span={6}>
                          <Form.Item label={<IntlMessages id="property.host_languages" />}>
                            <BaseCheckBoxList
                              data={listHostLanguages}
                              name="host_languages"
                              onChange={this.onChangeHostLanguages}
                              defaultValue={item ? item.host_languages : null}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label={<IntlMessages id="global.instant_bookable" />}
                          >
                            {getFieldDecorator("instant_bookable", {
                              initialValue: item
                                ? item.instant_bookable === 1
                                  ? 1
                                  : 0
                                : 0,
                            })(
                              <Radio.Group name="radiogroup">
                                <Radio value={1}>
                                  <IntlMessages id="global.yes" />
                                </Radio>
                                <Radio value={0}>
                                  <IntlMessages id="global.no" />
                                </Radio>
                              </Radio.Group>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label={<IntlMessages id="global.status" />}>
                            {getFieldDecorator("status", {
                              initialValue: item ? (item.status === 1 ? 1 : item.status === 2 ? 2 : 0) : 1,
                            })(
                              <Radio.Group name="radiogroup">
                                <Radio value={1}>
                                  <IntlMessages id="global.published" />
                                </Radio>
                                <Radio value={0}>
                                  <IntlMessages id="global.unpublished" />
                                </Radio>
                                <Radio value={2}>
                                  <IntlMessages id="global.trashed" />
                                </Radio>
                              </Radio.Group>
                            )}
                          </Form.Item>
                        </Col>

                      </Row>
                    </TabPane>
                    <TabPane key={2} tab={<IntlMessages id="global.place" />}>
                      <Row type="flex" gutter={16}>
                        <Col span={8}>
                          <Form.Item label={<IntlMessages id="global.province" />}>
                            {getFieldDecorator("province_id", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input province!",
                                },
                              ],
                              initialValue: item
                                ? item.province_id || ""
                                : "",
                            })(
                              <BaseSelect
                                options={Province}
                                selected={item ? item.province_id : ""}
                                defaultText="Select a province "
                                showSearch={true}
                                onSelect={this.handleSelectProvince}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>

                          <Form.Item label={<IntlMessages id="global.district" />}>
                            {getFieldDecorator("district_id", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input district!",
                                },
                              ],
                              initialValue: item
                                ? item.district_id || ""
                                : "",
                            })(
                              <BaseSelect
                                options={District}
                                selected={item ? item.district_id : ""}
                                defaultText="Select a district "
                                showSearch={true}
                                onSelect={this.handleSelectDistrict}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label={<IntlMessages id="global.ward" />}>
                            {getFieldDecorator("ward_id", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input ward!",
                                },
                              ],
                              initialValue: item
                                ? item.ward_id || ""
                                : "",
                            })(
                              <BaseSelect
                                options={Ward}
                                selected={item ? item.ward_id : ""}
                                defaultText="Select a ward "
                                showSearch={true}
                                onSelect={this.handleSelectWard}
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row type="flex" gutter={16}>
                        <Col span={12}>
                          <Form.Item label={<IntlMessages id="global.street" />}>
                            {getFieldDecorator("street", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input street!",
                                },
                              ],
                              initialValue: item ? item.street || "" : "",
                            })(<Input />)}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label={<IntlMessages id="global.no_house" />}>
                            {getFieldDecorator("no_house", {
                              rules: [
                                {
                                  required: false,
                                  message: "Please input no_house!",
                                },
                              ],
                              initialValue: item ? item.no_house || "" : "",
                            })(<Input />)}
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item label={<IntlMessages id="global.location" />}>
                        {edit ? (
                          <CustomPlacesAutoComplete
                            onChange={this.onSetLocation}
                            defaultPosition={{
                              lat: +item.latitude,
                              lng: +item.longitude,
                            }}
                          ></CustomPlacesAutoComplete>
                        ) : (
                          <CustomPlacesAutoComplete
                            onChange={this.onSetLocation}
                          ></CustomPlacesAutoComplete>
                        )}
                      </Form.Item>
                    </TabPane>
                    <TabPane key={3} tab={<IntlMessages id="global.room" />}>
                      <Row
                        gutter={{ xs: 8, sm: 16, md: 24 }}
                        style={{ flexDirection: "row" }}
                      >
                        <Col span={12}>
                          <Form.Item
                            label={<IntlMessages id="global.square_feet" />}
                          >
                            {getFieldDecorator("square_feet", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input square feet!",
                                },
                              ],
                              initialValue: item ? item.square_feet || "" : "",
                            })(<Input type="number" suffix="m²" />)}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label={<IntlMessages id="global.bedrooms" />}>
                            {getFieldDecorator("bedrooms", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input bedrooms!",
                                },
                              ],
                              initialValue: item ? item.bedrooms || 1 : 1,
                            })(<InputNumber style={{ width: "100%" }} min={1} />)}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label={<IntlMessages id="global.bathrooms" />}>
                            {getFieldDecorator("bathrooms", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input bathrooms!",
                                },
                              ],
                              initialValue: item ? item.bathrooms || 1 : 1,
                            })(<InputNumber style={{ width: "100%" }} min={1} />)}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label={<IntlMessages id="global.beds" />}>
                            {getFieldDecorator("beds", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input beds!",
                                },
                              ],
                              initialValue: item ? item.beds || 1 : 1,
                            })(<InputNumber style={{ width: "100%" }} min={1} />)}
                          </Form.Item>
                        </Col>
                        <Col span={24}>

                          <Form.Item
                            label={<IntlMessages id="global.bed_type" />}
                            name='bed_type'

                          >
                            <BaseCheckBoxList
                              data={listbedtype}
                              name='bed_type'
                              onChange={this.onChangeBedType}
                              defaultValue={item ? item.bed_type : null}
                            />

                          </Form.Item>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane key="4" tab={<IntlMessages id="global.amenities" />}>
                      <Form.Item {...formDesc}>


                        <ListDataUtil
                          data={listDataUtil}

                          valueAdd={utils}
                          onChangeUtil={this.onChangeUtil}
                        />
                      </Form.Item>
                    </TabPane>
                    <TabPane key="5" tab={<IntlMessages id="global.gallery" />}>
                      {/* <Form {...formItemLayout}> */}
                      <Form.Item
                        label={<IntlMessages id="global.cover_img" />}>
                        <InputChosseFile
                          onChange={this.getValueChosseFile}
                          limit={1}
                          defautValue={dedfaultImage}
                        ></InputChosseFile>
                      </Form.Item>
                      <Form.Item
                        label={<IntlMessages id="global.gallery" />}
                      >
                        <InputChosseFile
                          limit={8}
                          key="gallery"
                          onChange={this.getValueChosseGallery}
                          defautValue={dedfaultGallery}
                        ></InputChosseFile>
                      </Form.Item>
                      {/* </Form> */}
                    </TabPane>
                    <TabPane tab={<IntlMessages id="global.price_policy" />} key="6">
                      <Row type="flex" gutter={16}>
                        <Col span={6}>
                          <Form.Item label={<IntlMessages id="global.price" />}>
                            {getFieldDecorator("price", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input price!",
                                },
                              ],
                              initialValue: item ? item.price : 0,
                            })(
                              <InputNumber
                                formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className="w-100"
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label={<IntlMessages id="global.weekend_price" />}
                          >
                            {getFieldDecorator("weekend_price", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input weekend price!",
                                },
                              ],
                              initialValue: item ? item.weekend_price : 0,
                            })(
                              <InputNumber
                                formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className="w-100"
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label={<IntlMessages id="global.extra_price" />}
                          >
                            {getFieldDecorator("extra_price", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input extra price!",
                                },
                              ],
                              initialValue: item ? item.extra_price : 0,
                            })(
                              <InputNumber
                                formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className="w-100"
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label={<IntlMessages id="global.week_term_promo" />}>
                            {getFieldDecorator("week_term_promo", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input week term promo!",
                                },
                              ],
                              initialValue: item ? item.week_term_promo : 0,
                            })(
                              <InputNumber
                                formatter={value => `% ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className="w-100"
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label={<IntlMessages id="global.month_term_promo" />}
                          >
                            {getFieldDecorator("month_term_promo", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input month term promo!",
                                },
                              ],
                              initialValue: item ? item.month_term_promo : 0,
                            })(
                              <InputNumber
                                formatter={value => `% ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className="w-100"
                              />
                            )}
                          </Form.Item>
                        </Col>
                        {/* <Col span={6}>
                          <Form.Item
                            label={<IntlMessages id="global.security_deposit" />}
                          >
                            {getFieldDecorator("security_deposit", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input security deposit!",
                                },
                              ],
                              initialValue: item ? item.security_deposit || 1 : 1,
                            })(
                              <InputNumber
                                formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className="w-100"
                              />
                            )}
                          </Form.Item>
                        </Col> */}
                        <Col span={6}>
                          <Form.Item
                            label={<IntlMessages id="global.cleaning_fee" />}
                          >
                            {getFieldDecorator("cleaning_fee", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input cleaning fee!",
                                },
                              ],
                              initialValue: item ? item.cleaning_fee : 0,
                            })(
                              <InputNumber
                                formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className="w-100"
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label={<IntlMessages id="global.guests_standard" />}
                          >
                            {getFieldDecorator("guests_standard", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input guests standard!",
                                },
                              ],
                              initialValue: item ? item.guests_standard || 1 : 1,
                            })(<InputNumber style={{ width: "100%" }} min={1} />)}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label={<IntlMessages id="global.guests_max" />}
                          >
                            {getFieldDecorator("guests_max", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input guests max !",
                                },
                              ],
                              initialValue: item ? item.guests_max || 1 : 1,
                            })(<InputNumber style={{ width: "100%" }} min={1} />)}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label={<IntlMessages id="global.minimum_nights" />}
                          >
                            {getFieldDecorator("minimum_nights", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input minimum nights!",
                                },
                              ],
                              initialValue: item ? item.minimum_nights || 1 : 1,
                            })(<InputNumber style={{ width: "100%" }} min={1} />)}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label={<IntlMessages id="global.maximum_nights" />}
                          >
                            {getFieldDecorator("maximum_nights", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input maximum nights!",
                                },
                              ],
                              initialValue: item ? item.maximum_nights || 1 : 1,
                            })(<InputNumber style={{ width: "100%" }} min={1} />)}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label={<IntlMessages id="global.cancel_policy" />}>
                            {getFieldDecorator("cancel_policy_id", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input cancel policy!",
                                },
                              ],
                              initialValue: item && item.cancel_policy_id ? item.cancel_policy_id.toString() || "" : "",
                            })(
                              <BaseSelect
                                options={CancelPolicy}
                                selected={item ? item.cancel_policy_id : ""}
                                defaultText="Select a cancel policy "
                                showSearch={true}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label={<IntlMessages id="global.discount" />}
                          >
                            {getFieldDecorator("discount", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input month term promo!",
                                },
                              ],
                              initialValue: item ? item.discount : 0,
                            })(
                              <InputNumber
                                formatter={value => `% ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                className="w-100"
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tab={<IntlMessages id="global.note" />} key="7">
                      <Form.Item {...formDesc}>
                        {getFieldDecorator("note", {
                          rules: [{ required: false }],
                          initialValue: item ? item.note : "",
                        })(
                          <ReactQuill />
                        )}
                      </Form.Item>
                    </TabPane>
                    <TabPane tab={<IntlMessages id="global.ownership_document" />} key="8" >
                      <InputChosseFile
                        limit={2}
                        key="gallery"
                        onChange={this.getValueChosseOwnership}
                        defautValue={dedfaultOwnership}
                      ></InputChosseFile>
                    </TabPane>
                  </Tabs>
                  <Row>
                    <Col span={24} style={{ textAlign: "right" }}>
                      <Button type="default" onClick={() => this.onHandleClose()}>
                        <IntlMessages id="global.cancel" />
                      </Button>
                      {
                        activeTab > 1 ? (
                          <Button type="default" onClick={() => this.onChangeTab('prev')} className="ml-2">
                            <Icon type="double-left" /> <IntlMessages id="global.back" />
                          </Button>
                        ) : null
                      }
                      {
                        activeTab < 8 ? (
                          (
                            <Button htmlType="button" type="default" onClick={() => this.onChangeTab('next')} className="ml-2">
                              <IntlMessages id="global.next" /> <Icon type="double-right" />
                            </Button>
                          )
                        ) : null
                      }
                      {
                        activeTab == 8 ? (
                          <Button
                            type="primary"
                            className="ml-2"
                            htmlType="submit"
                            loading={this.props.loading}
                          >
                            <IntlMessages id="global.submit" />
                          </Button>
                        ) : null
                      }
                    </Col>
                  </Row>
                </Form>
            }

          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}


function mapStateToProps(state) {
  return {
    listDistricts: state.district.list,
    listProvinces: state.province.list,
    listWards: state.ward.list,
    listDataUtil: state.property.listDataUtilities,
  }
}

function mapDispatchToProps(dispatch) {
  return {

    _getAllDistricts: (id) => dispatch(_getAllDistricts(id)),
    _getAllProvinces: () => dispatch(_getAllProvinces()),
    _getAllWards: (id) => dispatch(_getAllWards(id)),
    getFilterDataUtilities: () => dispatch(getFilterDataUtilities()),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddProperty));