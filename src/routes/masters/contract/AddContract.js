// import React, { Component } from "react";
// import {connect} from 'react-redux';
// import PropTypes from "prop-types";
// import IntlMessages from "Util/IntlMessages";
// import PicturesWall from '../../../components/Elements/UploadImage';
// import BaseSelect from 'Components/Elements/BaseSelect';
// import BaseIntegerList from 'Components/Elements/BaseIntegerList';
// import {
//   Form,
//   Input,
//   InputNumber ,
//   Row,
//   Col,
//   Button,
//   Modal,
//   Radio,
//   Tabs,
//   Rate
// } from "antd";
// import InputChosseFile from "../../fileManager/InputChosseFile";

// class AddContract extends Component {
//   static propTypes = {
//     contract: PropTypes.object,
//     onSaveContract: PropTypes.func,
//     open: PropTypes.bool,
//     onContractClose: PropTypes.func,
//     edit: PropTypes.bool
//   };

//   state = {
//       contract:null,
//     rank: 1
//   }
//   static getDerivedStateFromProps(props, state) {
//     if (props.contract !== state.contract) {
//       return {
//         ...state,
//         contract: props.contract,
//         rank: props.contract ? props.contract.rank:1
//       }
//     }
//     return null;
//   }

//   handleSubmit = e => {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         var contract = { ...values}
//         contract.rank=this.state.rank
//         // console.log('contract',contract);
//         this.props.onSaveContract( contract,this.props.contract ? this.props.contract.id : null
//         );
//       }
//     });
//   };

//   handleChange = (value) => {

//     this.setState({
//       ...value,
//       rank: value
//     });
//   };

//   render() {
//     const { contract, open, onContractClose, edit } = this.props;

//     const modules = {
//       toolbar: [
//         [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//         [{ 'font': [] }],
//         ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//         [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
//         ['link', 'image'],
//         ['clean'],
//         [{ 'align': [] }],
//         ['code-block']
//       ],
//     };

//     const formats = [
//       'header',
//       'font',
//       'bold', 'italic', 'underline', 'strike', 'blockquote',
//       'list', 'bullet', 'indent',
//       'link', 'image', 'align',
//       'code-block'
//     ];

//     const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
//     // const {value} = this.state;
//     const { getFieldDecorator } = this.props.form;
//     const { TabPane } = Tabs;
//     const { TextArea } = Input;
//     const formItemLayout = {
//       labelCol: {
//         xs: { span: 24 },
//         sm: { span: 4 }
//       },
//       wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 20 }
//       }
//     };
//     const formDesc = {
//       labelCol: {
//         xs: {span: 24},
//         sm: {span: 0}
//       },
//       wrapperCol: {
//         xs: {span: 24},
//         sm: {span: 24}
//       }
//     }
//     return (
//       <React.Fragment>
//         {open ?
//           <Modal
//             title={
//               edit ? (
//                 <IntlMessages id="global.edit" />
//               ) : (
//                   <IntlMessages id="global.create" />
//                 )
//             }
//             toggle={onContractClose}
//             visible={open}
//             closable={false}
//             footer={null}
//             width="50%"
//           >
//             <Form {...formItemLayout} onSubmit={this.handleSubmit}>
//               <Tabs defaultActiveKey="1" >
//                 <TabPane tab={<IntlMessages id="global.tabbasic" />} key="1">
//                   <Form.Item label={<IntlMessages id="global.name" />}>
//                     {getFieldDecorator("contact_name", {
//                       rules: [
//                         {
//                           required: true,
//                           message: "Please input contact_name !"
//                         }
//                       ],
//                       initialValue: contract ? contract.contact_name || "" : ""
//                     })(<Input />)}
//                   </Form.Item>

//                   <Form.Item label={<IntlMessages id="global.rank" />}>
//                     {getFieldDecorator("rank", {
//                       rules: [
//                         {
//                           required: true,
//                           message: "Please select rank!"
//                         }
//                       ],
//                       initialValue: contract ? contract.rank || 1 : 1
//                     })(
//                       <span>
//                         <Rate
//                           tooltips={desc}
//                           onChange={this.handleChange}
//                           value={this.state.rank}
//                         />
//                          {this.state.rank ? <span className="ant-rate-text">{desc[this.state.rank -1]}</span> : ''}
//                       </span>
//                     )}

//                   </Form.Item>
//                   <Form.Item label={<IntlMessages id="contract.checkin" />}>
//                     {getFieldDecorator("checkin", {
//                       initialValue: contract ? (contract.checkin === "TRUE" ? "TRUE" : "FALSE") : "TRUE"
//                     })(
//                       <Radio.Group name="radiogroup">
//                         <Radio value={"TRUE"}>
//                           <IntlMessages id="global.yes" />
//                         </Radio>
//                         <Radio value={"FALSE"}>
//                           <IntlMessages id="global.no" />
//                         </Radio>
//                       </Radio.Group>
//                     )}
//                   </Form.Item>
//                   <Form.Item label={<IntlMessages id="global.address" />}>
//                     {getFieldDecorator("address", {
//                       rules: [
//                         {
//                           required: true,
//                           message: "Please input address !"
//                         }
//                       ],
//                       initialValue: contract ? contract.address || "" : ""
//                     })(<Input />)}
//                   </Form.Item>
//                   <Form.Item label={<IntlMessages id="contract.checkout" />}>
//                     {getFieldDecorator("checkout", {
//                       initialValue: contract ? (contract.checkout === "TRUE" ? "TRUE" : "FALSE") : "TRUE"
//                     })(
//                       <Radio.Group name="radiogroup">
//                         <Radio value={"TRUE"}>
//                           <IntlMessages id="global.yes" />
//                         </Radio>
//                         <Radio value={"FALSE"}>
//                           <IntlMessages id="global.no" />
//                         </Radio>
//                       </Radio.Group>
//                     )}
//                   </Form.Item>
//                   <Form.Item label={<IntlMessages id="global.status" />}>
//                     {getFieldDecorator("status", {
//                       initialValue:
//                       contract ? (contract.status ? 1 : 0) : 1
//                     })(
//                       <Radio.Group name="radiogroup">
//                         <Radio value={1}>
//                           <IntlMessages id="global.public" />
//                         </Radio>
//                         <Radio value={0}>
//                           <IntlMessages id="global.unpublic" />
//                         </Radio>
//                       </Radio.Group>
//                     )}
//                   </Form.Item>
//                 </TabPane>
//                 <TabPane
//                   tab={<IntlMessages id="global.notes_client" />}
//                   key="2"
//                 >
//                   <Form.Item {...formDesc}>
//                     {getFieldDecorator("notes_client", {
//                       rules: [
//                         {
//                           required: true,
//                           message: "Please input notes_client!"
//                         }
//                       ],
//                       initialValue: contract ? contract.notes_client || "" : ""
//                     })(<ReactQuill modules={modules} formats={formats} placeholder="Enter notes_client..." />)}
//                   </Form.Item>
//                 </TabPane>

//               </Tabs>
//               <Row>
//                 <Col span={24} style={{ textAlign: "right" }}>
//                   <Button
//                     type="default"
//                     onClick={() => this.props.onContractClose()}
//                   >
//                     <IntlMessages id='global.cancel' />
//                   </Button>
//                   <Button
//                     type="primary"
//                     style={{ marginLeft: 8 }}
//                     htmlType="submit"
//                     loading={this.props.loading}
//                   >
//                     <IntlMessages id='global.submit' />
//                   </Button>
//                 </Col>
//               </Row>
//             </Form>
//           </Modal>
//           : null}
//       </React.Fragment>
//     );
//   }
// }

// export default Form.create({ name: "contract" })(AddContract);
