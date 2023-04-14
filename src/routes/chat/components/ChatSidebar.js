/**
 * Chat Sidebar
 */
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
// components
import UserList from './UserList';
import { withRouter } from 'react-router-dom';
import { getUserConversationChat, getAllConversationChat } from '../../../actions/ChatAppActions'

const { TabPane } = Tabs;

function findItem(arr, id) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].id == id) return i;
	}
	return -1;
}

class ChatSidebar extends Component {

	state = {
		filterAll: {
			paging: {
				perpage: 20,
				page: 1
			},
		},
		filterUser: {
			paging: {
				perpage: 20,
				page: 1
			},
		},
		authId: null,
		dataUser: {
			list: [],
			count_unread: 0

		},
		dataAll: {
			list: [],
			paging: {
				count: 0,
				totalpage: 1,
				perpage: 20,
				page: 1
			}
		},
		loadingPageAll: true,
		loadingPageUser: true

	}

	static getDerivedStateFromProps(props, state) {
		if (props.authUser.id && props.authUser.id != state.authId) {
			return {
				authId: props.authUser.id
			}
		}
		return null;
	}

	componentDidMount() {
		if (this.state.authId) {
			this.props.getUserConversationChat(this.state.authId, this.state.filterUser).then(res => {
				this.setState({
					...this.state,
					dataUser: res.data,
					loadingPageUser: false
				})
			})
				.catch(err => {
					this.setState({
						...this.state,
						loadingPageUser: false
					})
				})

		}
		this.props.getAllConversationChat(this.state.filterAll).then(res => {
			this.setState({
				...this.state,
				dataAll: res.data,
				loadingPageAll: false
			})
		})
			.catch(err => {
				this.setState({
					...this.state,
					loadingPageUser: false
				})
			})
	}


	componentDidUpdate(prevProps, prevState) {
		if (prevState.authId != this.state.authId && this.state.authId) {
			this.props.getUserConversationChat(this.state.authId, this.state.filterUser).then(res => {
				this.setState({
					...this.state,
					dataUser: res.data,
					loadingPageUser: false
				})
			}).catch(err => {
				this.setState({
					...this.state,
					loadingPageUser: false
				})
			})
		}


		if (prevProps.currSetRead != this.props.currSetRead && this.props.currSetRead) {
			let { conversation_id } = this.props.currSetRead;
			let indexA = findItem(this.state.dataAll.list, conversation_id);
			let indexU = findItem(this.state.dataUser.list, conversation_id);
			let newA = [...this.state.dataAll.list];
			if (indexA != -1) {

				newA[indexA] = { ...this.state.dataAll.list[indexA], unread: false }
			}
			let newU = [...this.state.dataUser.list];
			if (indexU != -1) {

				newU[indexU] = { ...this.state.dataUser.list[indexU], unread: false }
			}
			this.setState({
				...this.state,
				dataAll: {
					...this.state.dataAll,
					list: newA
				},
				dataUser: {
					...this.state.dataUser,
					list: newU,
					count_unread: this.state.dataUser.count_unread - 1
				}
			})
		}


		if (this.props.newMessage && this.props.newMessage != prevProps.newMessage) {
			let a = this;
			this.setState({
				...this.state,
				filterAll: {
					paging: {
						perpage: 20,
						page: 1
					},
				},
				filterUser: {
					paging: {
						perpage: 20,
						page: 1
					},
				},
			}, async () => {
				let dataUser = await a.props.getUserConversationChat(a.state.authId, a.state.filterUser);
				let dataAll = await a.props.getAllConversationChat(a.state.filterAll);
				a.setState({
					...a.state,
					dataAll: dataAll.data,
					dataUser: dataUser.data,
				})
			})

		}

	}

	onChangePageAll = () => {
		if (this.state.filterAll.paging.page < this.state.dataAll.paging.totalpage) {
			let a = this;
			if (!a.state.loadingPageAll) {
				a.setState({
					...a.state,
					filterAll: {
						paging: {
							perpage: 20,
							page: a.state.filterAll.paging.page + 1
						}
					},
					loadingPageAll: true
				}, () => {
					a.props.getAllConversationChat(a.state.filterAll).then(res => {
						let { list, paging } = res.data;
						let newList = [...a.state.dataAll.list];
						newList.push(...list)
						a.setState({
							...a.state,
							dataAll: {
								list: newList,
								paging: paging
							},
							loadingPageAll: false
						})
					})
						.catch(err => {
							a.setState({
								...a.state,
								loadingPageAll: false
							})
						})
				})
			}
		}
	}

	onChangePageUser = () => {
		if (this.state.filterUser.paging.page < this.state.dataUser.paging.totalpage) {
			let a = this;
			if (!this.state.loadingPageUser) {
				this.setState({
					...this.state,
					filterAll: {
						paging: {
							perpage: 20,
							page: this.state.filterUser.paging.page + 1
						}
					},
					loadingPageAll: true
				}, () => {
					a.props.getUserConversationChat(a.state.authId, a.state.filterUser).then(res => {
						let { list, paging } = res.data;
						let newList = [...a.state.dataUser.list];
						newList.push(...list)
						a.setState({
							...a.state,
							dataUser: {
								list: newList,
								paging: paging
							},
							loadingPageUser: false
						})
					})
						.catch(err => {
							a.setState({
								...a.state,
								loadingPageUser: false
							})
						})
				})
			}
		}
	}


	render() {

		var { dataUser, dataAll } = this.state;

		var { authUser, config } = this.props;

		var tabMyName = <IntlMessages id="global.all" var="ok" />;

		return (
			<div className="chat-sidebar">
				<div className="user-wrap d-flex justify-content-between">
					<div className="media align-items-center">
						<img
							src={authUser ? authUser.image ? `${config.url_asset_root}${authUser.image}` : `${config.url_asset_root}backup.png` : `${config.url_asset_root}backup.png`}
							alt="user-profile"
							className="rounded-circle mr-3 avatar-chat"
							width="50"
							height="50"
						/>
						<div className="media-body mt-1">
							<h3 className="text-white mb-0" style={{ textTransform: "capitalize" }}>{(!!authUser.firstname && !!authUser.lastname) ? `${authUser.firstname} ${authUser.lastname}` : ""}</h3>
						</div>
						{/* <IconButton className="btn-sm text-white">
							<i className="zmdi zmdi-more-vert text-white"></i>
						</IconButton> */}
					</div>
				</div>
				<div className="search-wrapper mb-0 position-relative">
					{/* <Input
						type="text"
						name="search-users"
						id="search"
						className="search-input rounded-0 py-2 px-3"
						placeholder="Search"
					/>
					<i className="zmdi zmdi-search search-icon"></i> */}
				</div>
				<div>
					{/* <Tabs className="gx-tabs-half" > */}
					{/* <Tabs > */}
						{/* <TabPane tab={<IntlMessages id="global.all" />} > */}
							<UserList onChangePage={this.onChangePageAll} loadingPage={this.state.loadingPageAll} data={dataAll} config={this.props.config} />
						{/* </TabPane> */}
						{/* <TabPane tab={<IntlMessages id="chat.my" values={{ unread: dataUser.count_unread }} />} key="2">
							<UserList onChangePage={() => { }} loadingPage={this.state.loadingPageUser} data={dataUser} />
						</TabPane> */}
					{/* </Tabs> */}
				</div>

			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		authUser: state.authUser.data,
		allConversationChat: state.chatAppReducer.allConversationChat,
		userConversationChat: state.chatAppReducer.userConversationChat,
		currSetRead: state.chatAppReducer.currSetRead,
		newMessage: state.chatAppReducer.newMessage,
		config: state.config
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getAllConversationChat: (filter) => dispatch(getAllConversationChat(filter)),
		getUserConversationChat: (id, filter) => dispatch(getUserConversationChat(id, filter))
	}
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatSidebar));
