/**
 * Chat Area Component
 */
import React, { Component } from 'react';
import MessageBlock from './MessageBlock';
import { FormGroup } from 'reactstrap';
import { Input, Modal, Icon, Spin, Row, Col } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withRouter } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import ReplyIcon from '@material-ui/icons/Reply';
import InfoIcon from '@material-ui/icons/Info';
import CheckIcon from '@material-ui/icons/Check';
import IntlMessages from "Util/IntlMessages";
// actions
import { getAllMessageChat, reply, setRead, sendMessageToUser } from '../../../actions/ChatAppActions';

import AvatarConversation from './AvataConversation';
import Message from './Message';
import moment from 'moment';
import ConversationInfo from './ConversationInfo';
import config from '../../../../config';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const { TextArea } = Input;

class ChatArea extends Component {

	constructor(props) {
		super(props);
		this.state = {
			visibleCI: false,
			message: '',
			anchorEl: null,
			allMessagesChat: {
				list: [],
				paging: {
					count: 0,
					totalpage: 1,
					perpage: 20,
					page: 1
				},
				attend: false
			},
			filter: {
				paging: {
					perpage: 20,
					page: 1
				}
			},
			selectedUserID: null,
			loadingPage: false,
			loadingReply: false,
			loadingMessage: false,
			firstLoading: true
		}
		// this.changePage = debounce(this.changePage, 500)
	}


	static getDerivedStateFromProps(props, state) {
		if (props.selectedUser && props.selectedUser.id != state.selectedUserID) {
			return {
				selectedUserID: props.selectedUser.id
			}
		}
		return null;
	}

	componentDidMount() {

		if (this.state.selectedUserID) {
			let a = this;
			this.props.getAllMessageChat(this.state.selectedUserID, this.state.filter).then(res => {

				this.setState({
					...this.state,
					allMessagesChat: res.data,
					firstLoading: false
				}, () => {
					a.refs.chatScroll.scrollToBottom();
				})
			})
		}
	}

	componentDidUpdate(prevProps, prevState) {

		if (this.state.selectedUserID && prevState.selectedUserID != this.state.selectedUserID) {
			let a = this;
			this.setState({
				...this.state,
				message: "",
				loadingPage: true,
				firstLoading: true,
				filter: {
					paging: {
						perpage: 20,
						page: 1
					}
				}
			}, () => {
				a.props.getAllMessageChat(a.state.selectedUserID, a.state.filter).then(res => {
					a.setState({
						...a.state,
						allMessagesChat: res.data,
						loadingPage: false,
						firstLoading: false
					}, () => {
						a.refs.chatScroll.scrollToBottom();
					})
				})
					.catch(err => {
						a.setState({
							...a.state,
							loadingPage: false
						})
					})
			})

		}

		if (this.props.newMessage && this.props.newMessage != prevProps.newMessage) {
			let newM = this.props.newMessage;
			if (this.props.selectedUser) {
				if (newM.cid != this.props.authUser.id) {
					if (newM.conversation_id == this.props.selectedUser.id) {

						let newListM = [...this.state.allMessagesChat.list];
						newListM.unshift(newM);
						let a = this;
						this.setState({
							...this.state,
							allMessagesChat: {
								...this.state.allMessagesChat,
								list: newListM
							},
						}, () => a.refs.chatScroll.scrollToBottom())

					}
				}
			}

		}

	}

	chatOptionsHandler = event => {
		this.setState({ anchorEl: event.currentTarget });
	}

	onSubmitMessage = (event) => {
		event.preventDefault();
		let a = this;
		if (this.state.message.trim() !== '') {
			if (!this.state.loadingMessage) {
				this.setState({
					...this.state,
					loadingMessage: true
				})
				let { selectedUser, authUser } = this.props;
				let toArr = [];
				if (selectedUser.partner) {
					let partner = selectedUser.partner
					if (selectedUser.partner.length) {
						for (let i = 0; i < partner.length; i++) {
							if (partner[i].partner_id != authUser.id) {
								let id = partner[i].partner_id
								toArr.push(id)
							}
						}
					}
				}
				let cplData = {
					id: new Date().getTime(),
					content: this.state.message.trim(),
					conversation_id: selectedUser.id,
					cid: authUser.id,
					created_at: new Date().toUTCString(),
					updated_at: new Date().toUTCString(),
					sender_firstname: authUser.firstname,
					sender_lastname: authUser.lastname,
					sender_avatar: authUser.image ? authUser.image : require('../../../assets/img/user.png'),
					avatar_thumb: authUser.image ? config.url_asset_root + authUser.image : require('../../../assets/img/user.png'),

				};
				let data = {
					content: this.state.message.trim(),
					conversation_id: selectedUser.id,
					cid: authUser.id,
					to: toArr
				}

				console.log("message send", data)

				let newListM = [...this.state.allMessagesChat.list];
				newListM.unshift(cplData);
				let a = this;
				this.setState({
					...this.state,
					allMessagesChat: {
						...this.state.allMessagesChat,
						list: newListM
					},
					message: "",
					loadingMessage: false
				}, () => {
					a.refs.chatScroll.scrollToBottom();
					a.props.sendMessageToUser(data, cplData).then(res => {

					})
						.catch(err => {
							let newListM = [];
							newListM = a.state.allMessagesChat.list.filter(item => {
								return item.id != cplData.id
							})
							a.setState({
								...a.state,
								allMessagesChat: {
									...a.state.allMessagesChat,
									list: newListM
								},
							})
						})
				})

			}
		}


	}

	setAvtArr() {
		let data = [];
		let user = this.props.selectedUser, authId = this.props.authUser.id;
		if (user.partner) {
			let partner = user.partner
			if (user.partner.length) {
				for (let i = 0; i < partner.length; i++) {
					if (!partner[i].is_admin) {
						let img = partner[i].partner_avatar ? partner[i].partner_avatar : "backup.png";
						data.push(img)
					}
				}
				return data;
			}
		}
		return data;
	}



	setName() {
		let data = [];
		let user = this.props.selectedUser, authId = this.props.authUser.id;
		let n = "";
		if (user.partner) {
			let partner = user.partner
			if (user.partner.length) {
				for (let i = 0; i < partner.length; i++) {
					if (!partner[i].is_admin) {
						let name = (partner[i].partner_firstname ? partner[i].partner_firstname : "") + " " + (partner[i].partner_lastname ? partner[i].partner_lastname : "");
						data.push(name.trim())
					}
				}
				for (let i = 0; i < data.length; i++) {
					if (data[i]) {
						if (i) {
							n = n + `, ${data[i]}`;
						}
						else n = n + data[i]
					}
				}
				return n.trim();
			}
		}
		return "";
	}


	//set data message

	createDataMessage(chats) {
		let lg = chats.length;
		if (lg === 0) return [];
		else {
			let i = 0;
			let dataMessages = [];
			for (i = 0; i < lg; i++) {
				let message = {
					id: chats[i].id,
					author: chats[i].cid,
					message: chats[i].content,
					timestamp: new Date(chats[i].created_at).getTime(),
					// avatar: chats[i].avatar_thumb ? chats[i].avatar_thumb : "https://app.gopanda.asia/public/backup.png",
					// firstname: chats[i].sender_firstname,
					// lastname: chats[i].sender_lastname,
					date: chats[i].updated_at,

					avatar: chats[i].sender.avatar ? `${this.props.config.url_asset_root}${chats[i].sender.avatar}` : `${this.props.config.url_asset_root}backup.png`,
					firstname: chats[i].sender_firstname,
					lastname: chats[i].sender_lastname,
				}
				dataMessages.unshift(message);
			}
			// console.log(dataMessages)
			return dataMessages;
		}
	}

	renderMessages(auth) {
		let dataMessages = this.createDataMessage(this.state.allMessagesChat.list)
		let i = 0;
		let messageCount = dataMessages.length;
		let messages = [];

		while (i < messageCount) {
			let previous = dataMessages[i - 1];
			let current = dataMessages[i];
			let next = dataMessages[i + 1];
			let isMine = current.author === this.props.selectedUser.partner[0].partner_id;
			let currentMoment = moment(current.timestamp);
			let prevBySameAuthor = false;
			let nextBySameAuthor = false;
			let startsSequence = true;
			let endsSequence = true;
			let showTimestamp = true;
			let middle = false;
			if (previous) {
				if (previous.author != current.author) middle = true;
			}

			if (previous) {
				let previousMoment = moment(previous.timestamp);
				let previousDuration = moment.duration(currentMoment.diff(previousMoment));
				prevBySameAuthor = previous.author === current.author;

				if (prevBySameAuthor && previousDuration.as('hours') < 1) {
					startsSequence = false;
				}

				if (previousDuration.as('hours') < 1) {
					showTimestamp = false;
				}
			}

			if (next) {
				let nextMoment = moment(next.timestamp);
				let nextDuration = moment.duration(nextMoment.diff(currentMoment));
				nextBySameAuthor = next.author === current.author;

				if (nextBySameAuthor && nextDuration.as('hours') < 1) {
					endsSequence = false;
				}
			}

			messages.push(
				<Message
					key={current.id}
					isMine={isMine}
					startsSequence={startsSequence}
					endsSequence={endsSequence}
					showTimestamp={showTimestamp}
					data={current}
					avatar={current.avatar}
					firstname={current.firstname}
					lastname={current.lastname}
					middle={middle}
				/>
			);

			// Proceed to the next message.
			i += 1;
		}

		return messages;
	}

	onFocusInput = (e) => {
		this.setSeen()
	}

	onChangeArea = (e) => {
		this.setState({
			...this.state,
			message: e.target.value
		})
	}

	changePage() {
		let a = this;
		this.setState({
			...this.state,
			filter: {
				paging: {
					perpage: 20,
					page: this.state.filter.paging.page + 1
				}
			},
			loadingPage: true
		}, () => {
			a.props.getAllMessageChat(a.state.selectedUserID, a.state.filter).then(res => {
				let { list, paging } = res.data;
				let newList = [...a.state.allMessagesChat.list];
				newList.push(...list);
				a.setState({
					...a.state,
					allMessagesChat: {
						...a.state.allMessagesChat,
						list: newList,
						paging: paging
					},
					loadingPage: false
				})
			}).catch(err => {
				a.setState({
					...a.state,
					loadingPage: false
				})
			})
		})
	}

	onScrollSidebar = (e) => {
		if (this.state.filter.paging.page < this.state.allMessagesChat.paging.totalpage) {
			let t = this.refs.chatScroll.getScrollTop();
			if (t < 100) {
				if (!this.state.loadingPage) {
					this.changePage()
				}
			}
		}
	}

	toggleModal = () => {
		this.setState({ ...this.state, visibleCI: !this.state.visibleCI })
	}

	openModal = () => {
		this.setState({ ...this.state, visibleCI: !this.state.visibleCI, anchorEl: null })
	}


	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	setReply = () => {
		if (!this.state.loadingReply) {
			let { selectedUser, authUser } = this.props;
			let data = {
				type: selectedUser.type,
				aid: authUser.id,
				object_id: selectedUser.entity
			};
			let a = this;
			this.setState({ ...this.state, loadingReply: true }, () => {
				a.props.reply(data).then(res => {
					a.setState({
						...a.state, loadingReply: false,
						allMessagesChat: {
							...a.state.allMessagesChat,
							attend: true,
						},
						anchorEl: null
					})
				})
					.catch(err => {
						a.setState({
							...a.state, loadingReply: false
						})
					})
			})
		}
	}

	setSeen = () => {
		let { selectedUser, authUser } = this.props;
		if (selectedUser.unread) {
			let data = {
				cid: authUser.id,
				conversation_id: selectedUser.id
			}
			this.props.setSeen(data);
			this.handleClose()
		}
	}


	handleKeyDown(event) {
		if (event.keyCode === 13 && !event.shiftKey) {
			return this.onSubmitMessage(event);
		}
	}



	render() {
		var { selectedUser, authUser, config } = this.props;
		var { allMessagesChat } = this.state;
		var { list } = allMessagesChat;
		if (selectedUser === null) {
			return (
				<div className="chat-box-main">
					<div className="text-center">
						<i className="zmdi zmdi-comments mb-2" style={{ color: "#8c8c8c", fontSize: "6em" }}></i>
						<h1 className="select-user-toggle" style={{ color: "#8c8c8c" }}><IntlMessages id="global.select_user_chat" /></h1>
						<Button className="d-none sidebar-toggler" onClick={this.props.onMenuIconPress}><h1 style={{ color: "#8c8c8c" }}><IntlMessages id="global.select_user_chat" /></h1></Button>
					</div>
				</div>
			);
		}

		const { anchorEl } = this.state;
		var chatOptions = [<MenuItem key="show info" onClick={this.openModal}><InfoIcon style={{ color: "#5d92f4" }}></InfoIcon>&nbsp;<IntlMessages id="global.show_info" /></MenuItem>];
		if (selectedUser.unread) chatOptions.unshift(<MenuItem key="read" onClick={this.setSeen}><CheckIcon style={{ color: "#5d92f4" }}></CheckIcon>&nbsp;<IntlMessages id="global.mark_as_read" /></MenuItem>)
		if (!allMessagesChat.attend) chatOptions.unshift(<MenuItem key="reply" onClick={this.setReply}>{this.state.loadingReply ? <Spin indicator={antIcon}><React.Fragment><ReplyIcon style={{ color: "#5d92f4" }}></ReplyIcon>&nbsp;Reply</React.Fragment></Spin> : <React.Fragment><ReplyIcon style={{ color: "#5d92f4" }}></ReplyIcon>&nbsp;Reply</React.Fragment>} </MenuItem>)


		return (
			<React.Fragment>

				{/* header */}
				<div className="chat-main-body">
					<div className="chat-head">
						<div className="d-flex justify-content-between align-items-center">
							<div className="media align-items-center">
								<IconButton
									className="mr-3 chat-sidebar-toggler d-none"
									color="inherit"
									aria-label="open drawer"
									onClick={this.props.onMenuIconPress}
								>
									<MenuIcon />
								</IconButton>
								<div className="mr-10">
									<AvatarConversation detailChat={true} data={this.setAvtArr()}></AvatarConversation>
								</div>
								<div className="media-body mt-1">
									<h5 className="mb-0" style={{ textTransform: "capitalize" }} >{this.setName()}</h5>
									<span className="font-xs text-muted">{selectedUser.status}</span>
								</div>
							</div>
							<div>
								{/* <IconButton className="bg-primary text-white video-icon">
								<i className="zmdi zmdi-videocam"></i>
							</IconButton>
							<IconButton className="bg-primary text-white">
								<i className="zmdi zmdi-attachment-alt"></i>
							</IconButton> */}
								{/* <IconButton
									aria-owns={anchorEl ? 'simple-menu' : null}
									aria-haspopup="true"
									onClick={this.chatOptionsHandler}
								>
									<i className="zmdi zmdi-more-vert"></i>
								</IconButton> */}
								<Menu
									id="simple-menu"
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={this.handleClose}
								>
									{chatOptions}
								</Menu>
							</div>
						</div>
					</div>

					{/* chat area */}

					{this.state.firstLoading ?
						<Scrollbars
							className="rct-scroll"
							autoHide
							ref="chatScroll"
							style={{ height: 'calc(100vh - 200px)' }}
							onScroll={this.onScrollSidebar}
						>
							<Row type="flex" justify="space-around" align="middle" style={{ height: "100%" }}>
								<Col className="text-center">
									<Icon type="loading" style={{ fontSize: "30px" }} />
								</Col>
							</Row>
						</Scrollbars> :

						<React.Fragment>

							<Scrollbars
								className="rct-scroll"
								autoHide
								ref="chatScroll"
								style={{ height: 'calc(100vh - 200px)' }}
								onScroll={this.onScrollSidebar}
							>
								<div className="chat-body p-30">
									{/* {list.map((item, index) => (
							<MessageBlock
								even={item.cid == authUser.id}
								key={item.id}
								selectedUserPhotoUrl={selectedUser.photo_url}
								data={item}
							/>
						))} */}
									{this.state.loadingPage ?
										<div align="center"><Icon type="loading" /></div>
										:
										null}
									{this.renderMessages(authUser.id)}
								</div>
							</Scrollbars>

							{/* chat footer */}

							<div className="chat-footer d-flex px-4 align-items-center py-3 mb-30">
								{/* {allMessagesChat.attend ? */}
								{/* <React.Fragment>
									<form className="mr-3 w-100" onSubmit={this.onSubmitMessage}>
										<div className="form-group">
											<textarea
												type="text"
												id="search-msg"
												placeholder="Type your message"
												value={this.state.message}
												className="msg-input form-control"
												style={{ height: "50px", width: "100%", lineHeight: "36px" }}
												onChange={this.onChangeArea}
												onFocus={this.onFocusInput}
												autoFocus={true}
												onKeyDown={this.handleKeyDown.bind(this)}
											/>
										</div>
									</form>
									<Button
										variant="contained"
										color="primary"
										onClick={this.onSubmitMessage}
										className="submit-btn bg-primary mb-20"
									>
										Send
												<i className="zmdi zmdi-mail-send ml-2"></i>
									</Button>

								</React.Fragment> */}
								{/* :
									(
										this.state.loadingReply ?
											<Spin indicator={antIcon} wrapperClassName="dat-spin-footer-chat">
												<a onClick={this.setReply} style={{ margin: "auto", color: "#038fde" }}>You are not attended to reply this conversation. Click here to join.</a>
											</Spin>
											: <a onClick={this.setReply} style={{ margin: "auto", color: "#038fde" }}>You are not attended to reply this conversation. Click here to join.</a>
									)


								} */}
							</div>
						</React.Fragment>
					}
				</div>

				<Modal
					title="Conversation Information"
					visible={this.state.visibleCI}
					footer={false}
					onCancel={this.toggleModal}
					centered={true}
					maskClosable={true}
					destroyOnClose={true}
				>
					<ConversationInfo data={selectedUser}></ConversationInfo>
				</Modal>

			</React.Fragment>
		);
	}
}

function mapStateToProps(state) {
	return {
		selectedUser: state.chatAppReducer.selectedUser,
		authUser: state.authUser.data,
		newMessage: state.chatAppReducer.newMessage,
		config: state.config
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getAllMessageChat: (id, filter) => dispatch(getAllMessageChat(id, filter)),
		reply: (data) => dispatch(reply(data)),
		setSeen: (data) => dispatch(setRead(data)),
		sendMessageToUser: (data, cplData) => dispatch(sendMessageToUser(data, cplData))
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatArea));
