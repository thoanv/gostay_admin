import AppBar from '@material-ui/core/AppBar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import { login } from 'Actions/AuthActions';
import { Button, Form, Icon, Input } from 'antd';
import QueueAnim from 'rc-queue-anim';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../helpers/session';
import config from '../../config';
const SIGNIN_IMAGE_URL = config.URL_ASSET + '/logo_signin.png';
import IntlMessages from "Util/IntlMessages";

const formItemLayout = {
   labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
   },
   wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
   },
};
class Login extends Component {
   state = {
      data: {
         email: "",
         password: "",
      },
      option: {
         type: "email",
      }
   }


   handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
         if (!err) {
            this.setState({
               ...this.state,
               data: {
                  ...this.state.data,
                  email: values.email,
                  password: values.password,
               }

            }, () => {
               this.props.login(this.state).then(res => {
                  this.props.history.push('/app/dashboard');
               })
            });



         }
      });
   };


   render() {
      const { getFieldDecorator } = this.props.form;
      const token = getCookie('2stay_token');
      if (token) { return (<Redirect to={'app/dashboard'} />); }
      const { authUserRes } = this.props;
      return (
         <QueueAnim type="bottom">
            <div className="rct-session-wrapper">
               {authUserRes.isLoading &&
                  <LinearProgress />
               }
               <AppBar position="static" className="session-header">
                  <Toolbar>
                     <div className="container">
                        <div className="d-flex justify-content-between">
                           <div className="session-logo">


                           </div>

                        </div>
                     </div>
                  </Toolbar>
               </AppBar>
               <div className="session-inner-wrapper">
                  <div className="container">
                     <div className="row ">
                        <div className="col-md-6 offset-3">
                           <div className="session-body text-center">
                              <div className="session-head mb-30" align="center">
                                 {/* <img src={require('../')} alt="signin logo" style={{ height: "40px" }} /> */}
                                 <h1 className="font-weight-bold text-center">goStay - Smart Travel System</h1>
                              </div>
                              <Form  {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
                                 <Form.Item>
                                    {getFieldDecorator('email', {
                                       rules: [{ required: true, message:  <IntlMessages id="global.message_mail_required" /> }],
                                    })(
                                       <Input
                                          prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                          placeholder="Email"
                                       />,
                                    )}
                                 </Form.Item>
                                 <Form.Item>
                                    {getFieldDecorator('password', {
                                       rules: [{ required: true, message: <IntlMessages id="global.message_password_required" /> }],
                                    })(
                                       <Input
                                          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                          type="password"
                                          placeholder="Password"
                                       />,
                                    )}
                                 </Form.Item>
                                 <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} >
                                    <IntlMessages id="global.signin" />
                                   </Button>

                                 </Form.Item>
                              </Form>

                           </div>

                        </div>
                        {/* <div className="col-md-4">
                           <div className="row h-300">
                              <div className="col  my-auto">
                                 <div className=" w-500">
                                    <h1 className="display-3 text-white font-weight-bold text-center">GoPanda </h1>
                                    <h1 className=" text-white font-weight-bold text-center"> Discover a different world </h1>
                                 </div>
                              </div>
                           </div>
                        </div> */}
                     </div>
                  </div>
               </div>
            </div>
         </QueueAnim>
      )
   }
}

function mapStateToProps({ authUser }) {
   return {
      authUserRes: authUser
   }
}

function mapDispatchToProps(dispatch) {
   return {
      login: (data) => dispatch(login(data))
   }
}
export default Form.create({ name: "login" })(
   connect(mapStateToProps, mapDispatchToProps)(Login)
);
