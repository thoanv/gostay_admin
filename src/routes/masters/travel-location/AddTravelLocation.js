import { Button, Col, Form, Input, Modal, Row, Select, Tabs } from "antd";
import BaseSelect from "Components/Elements/BaseSelect";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import SunEditor, { buttonList } from "suneditor-react";
import IntlMessages from "Util/IntlMessages";
import CustomPlacesAutoComplete from "../../../components/Elements/CustomPlacesAutoComplete";
import datatimezone from "../../../components/share/dataTimezone";
import InputChosseFile from "../../fileManager/InputChosseFile";
// actions
import { getAllTravelLocationParent, getAllTravelLocation } from "../../../actions/TravelLocationActions";
import Cropper from "react-easy-crop";

import 'react-image-crop/dist/ReactCrop.css';
import './style.css';
import {getAllDestination} from "Actions/DestinationActions";
const { Option } = Select;

class AddTravelLocation extends Component {
    state = {
        square: {
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 100 / 50,
        }
    };

    async componentDidMount() {
        this.props.getAllDestination({
            ...this.state.filter,
            type: {
                value : 'airport',
                type : '=',
            }
        });

    }

    static propTypes = {
        travellocation: PropTypes.object,
        onSaveTravelLocation: PropTypes.func,
        open: PropTypes.bool,
        onTravelLocationClose: PropTypes.func,
        edit: PropTypes.bool,
        country: PropTypes.array
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var travellocation = {
                    ...values
                };
                const formData = new FormData();
                formData.append("code", travellocation.code);
                formData.append("airport_name", this.state.airport_name);
                formData.append("airport_code", travellocation.airport_code);
                formData.append("name", travellocation.name);
                if(this.state.picturePreview) formData.append("avatar", this.state.pictureAsFile);
                if(this.props.travellocation) formData.append("id", this.props.travellocation.id);

                this.props.onSaveTravelLocation(
                    formData,
                    this.props.travellocation ? this.props.travellocation.id : null
                ).then(res => this.setState({
                    image: ""
                }))
                
            }
        }).then(this.setState({ gallery: [] }));
    }

    onChangeData = (name, value) => {
        this.setState({ [name]: value });
    }

    onChangeData2 = (name, value) => {
        console.log(value,name)
        this.setState({ airport_name : value.find(e => e.value == name).label });
    }

    uploadPicture = (e) => {
        this.setState({
            /* contains the preview, if you want to show the picture to the user
                 you can access it with this.state.currentPicture
             */
            picturePreview: URL.createObjectURL(e.target.files[0]),
            /* this contains the file we want to send */
            pictureAsFile: e.target.files[0],
        });
    };

    onCropChange = (crop) => {
            let square = {...this.state.square}
            this.setState({ square: {...square, crop} })

    }

    onCropComplete = (croppedArea, croppedAreaPixels) => {
        this.getCroppedImg(this.state.picturePreview,
            croppedAreaPixels
        )
    }
    createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', (error) => reject(error))
            image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
            image.src = url
        })
    getCroppedImg = async (src, pixelCrop) => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
        const image = await this.createImage(src)
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                blob.name = 'avatar';
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
                    this.setState({ blobRect: blob})
            }, "image/jpeg");
        });
    }

    render() {
        const { open, onTravelLocationClose, listDestination, travellocation } = this.props;
        const { getFieldDecorator } = this.props.form;
        let renderlistDestination = []
        if(listDestination) {
            renderlistDestination = listDestination.map(e => {
                const b = {}
                b.value = e.id.toString();
                b.label = e.title;
                return b;
            })
        }
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

        return (
            <React.Fragment>
                {open ? (
                    <Modal
                        title={<IntlMessages id="global.add_new" />}
                        toggle={onTravelLocationClose}
                        visible={open}
                        closable={true}
                        destroyOnClose={true}
                        onCancel={this.props.onTravelLocationClose}
                        footer={null}
                        width="70%"
                        centered={true}
                    >
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            {/* <Tabs defaultActiveKey="1"> */}
                            {/* <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1"> */}
                            <Form.Item label={<IntlMessages id="global.title" />}>
                                {getFieldDecorator("name", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please input  title !"
                                        }
                                    ],
                                    initialValue: travellocation ? travellocation.name || "" : ""
                                })(<Input />)}
                            </Form.Item>
                            <Form.Item label={<IntlMessages id="global.code" />}>
                                {getFieldDecorator("code", {
                                    initialValue: travellocation ? travellocation.code || "" : ""
                                })(<Input />)}
                            </Form.Item>


                            <Form.Item label='Sân bay'>
                                {getFieldDecorator('airport_code', {
                                    rules: [],
                                    initialValue: travellocation && travellocation.airport_code ? travellocation.airport_code.toString() || "" : ""
                                })(
                                    <BaseSelect
                                        selected={travellocation && travellocation.airport_code ? travellocation.airport_code.toString() || "" : ""}
                                        options={renderlistDestination}
                                        optionValue="value"
                                        optionLabel="label"
                                        onChange={(value) => this.onChangeData2( value,renderlistDestination)}
                                    />
                                )}

                            </Form.Item>
                            <Form.Item label={'Ảnh đại diện'}>
                                <input type="file" name="myImage" onChange={this.uploadPicture} />
                            </Form.Item>
                            <Form.Item>
                                <div className="image-popup">
                                    {this.state.picturePreview &&
                                        <Cropper
                                            cropShape="rect"
                                            image={this.state.picturePreview}
                                            crop={this.state.square.crop}
                                            zoom={this.state.square.zoom}
                                            aspect={this.state.square.aspect}
                                            onCropChange={(c) => this.onCropChange(c)}
                                            onCropComplete={(c,c1) => this.onCropComplete(c,c1)}
                                        />}
                                </div>
                            </Form.Item>
                            <Row>
                                <Col span={24} style={{ textAlign: "right" }}>
                                    <Button
                                        type="default"
                                        onClick={() => this.props.onTravelLocationClose()}
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
        listDestination: state.destination.listDestination,
        travellocations: state.travellocation.listTravelLocationParent
    };
};
function mapDispatchToProps(dispatch) {
    return {
        getAllDestination: (filter) => dispatch(getAllDestination(filter,false)),
        getAllTravelLocation: (filter, isPaginate, isDispatch) => dispatch(getAllTravelLocation(filter, isPaginate, isDispatch))
    };
}

export default Form.create({ name: "travellocation" })(
    connect(mapStateToProps, mapDispatchToProps)(AddTravelLocation)
);
