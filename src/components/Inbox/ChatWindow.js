import UserInput from "./UserInput";
import Header from "./Header";

/**
 * Chat Area Component
 */
import React, { Component } from "react";
import { Icon, Spin, Row, Col } from "antd";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import config from "../../../config";

// actions
import {
  getAllMessageChat,
  setRead,
  sendMessageToUser,
  removeCurrentInbox,
  removeCVinListInbox,
  reply
} from "../../actions/InboxAction";

import Message from "./Message";
import moment from "moment";
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleCI: false,
      message: "",
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
    };
    // this.changePage = debounce(this.changePage, 500)
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedUser) {
      if (props.selectedUser.id != state.selectedUserID) {
        return {
          selectedUserID: props.selectedUser.id
        };
      }
    }
    return null;
  }

  componentDidMount() {
    if (this.state.selectedUserID) {
      let a = this;
      this.props
        .getAllMessageChat(this.state.selectedUserID, this.state.filter)
        .then(res => {
          this.setState(
            {
              ...this.state,
              allMessagesChat: res.data,
              firstLoading: false
            },
            () => {
              a.refs.chatScrollInbox.scrollToBottom();
            }
          );
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.selectedUserID &&
      prevState.selectedUserID != this.state.selectedUserID
    ) {
      let a = this;
      this.setState(
        {
          ...this.state,
          loadingPage: true,
          filter: {
            paging: {
              perpage: 20,
              page: 1
            }
          }
        },
        () => {
          a.props
            .getAllMessageChat(a.state.selectedUserID, a.state.filter)
            .then(res => {
              a.setState(
                {
                  ...a.state,
                  allMessagesChat: res.data,
                  loadingPage: false
                },
                () => {
                  a.refs.chatScrollInbox.scrollToBottom();
                }
              );
            })
            .catch(err => {
              a.setState({
                ...a.state,
                loadingPage: false
              });
            });
        }
      );
    }

    if (
      this.props.newMessage &&
      this.props.newMessage != prevProps.newMessage
    ) {
      let newM = this.props.newMessage;
      if (this.props.selectedUser) {
        if (newM.cid != this.props.authUser.id) {
          if (newM.conversation_id == this.props.selectedUser.id) {
            let newListM = [...this.state.allMessagesChat.list];
            newListM.unshift(newM);
            let a = this;
            this.setState(
              {
                ...this.state,
                allMessagesChat: {
                  ...this.state.allMessagesChat,
                  list: newListM
                }
              },
              () => a.refs.chatScrollInbox.scrollToBottom()
            );
          }
        }
      }
    }
  }

  onSubmitMessage = message => {
    let a = this;
    if (message.trim() !== "") {
      if (!this.state.loadingMessage) {
        this.setState({
          ...this.state,
          loadingMessage: true
        });
        let { selectedUser, authUser } = this.props;
        let toArr = [];
        if (selectedUser.partner) {
          let partner = selectedUser.partner;
          if (selectedUser.partner.length) {
            for (let i = 0; i < partner.length; i++) {
              if (partner[i].partner_id != authUser.id) {
                let id = partner[i].partner_id;
                toArr.push(id);
              }
            }
          }
        }
        if (selectedUser.newMessage) {
          toArr.push(selectedUser.newMessage[0].cid);
          let admin = selectedUser.attend_admin;
          if (admin) {
            for (let i = 0; i < admin.length; i++) {
              if (admin[i].id != authUser.id) toArr.push(admin[i].id);
            }
          }
        }
        let cplData = {
          id: new Date().getTime(),
          content: message.trim(),
          conversation_id: selectedUser.id,
          cid: authUser.id,
          created_at: new Date().toUTCString(),
          updated_at: new Date().toUTCString(),
          sender_firstname: authUser.firstname,
          sender_lastname: authUser.lastname,
          sender_avatar: authUser.image
            ? authUser.image
            : "https://app.gopanda.asia/public/backup.png",
          avatar_thumb: authUser.image
            ? this.props.config.url_asset_root + authUser.image
            : "https://app.gopanda.asia/public/backup.png"
        };
        let data = {
          content: message.trim(),
          conversation_id: selectedUser.id,
          cid: authUser.id,
          to: toArr
        };

        console.log("message send", data);

        let newListM = [...this.state.allMessagesChat.list];
        newListM.unshift(cplData);
        let a = this;
        this.setState(
          {
            ...this.state,
            allMessagesChat: {
              ...this.state.allMessagesChat,
              list: newListM
            },
            message: "",
            loadingMessage: false
          },
          () => {
            a.refs.chatScrollInbox.scrollToBottom();
            a.props
              .sendMessageToUser(data, cplData)
              .then(res => {})
              .catch(err => {
                let newListM = [];
                newListM = a.state.allMessagesChat.list.filter(item => {
                  return item.id != cplData.id;
                });
                a.setState({
                  ...a.state,
                  allMessagesChat: {
                    ...a.state.allMessagesChat,
                    list: newListM
                  }
                });
              });
          }
        );
      }
    }
  };

  setName = item => {
    let name = "";
    if (item.attend_customer) {
      let firstname = item.attend_customer.firstname || "";
      let lastname = item.attend_customer.lastname || "";
      name = firstname + " " + lastname;
    }
    if (item.firstname) {
      name = item.firstname;
    }
    if (item.lastname) {
      name = name + " " + item.lastname;
    }
    return name;
  };

  setAvt = item => {
    let avt = require('../../assets/img/user.png');
    if (item.attend_customer) {
      if (item.attend_customer.avatar) avt = item.attend_customer.avatar;
    }
    if (item.avatar) {
      avt = `${this.props.config.url_asset_root}${item.avatar}`;
    }
    return avt;
  };

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
          timestamp: new Date(chats[i].updated_at).getTime(),
          avatar: chats[i].avatar_thumb
            ? chats[i].avatar_thumb
            : require('../../assets/img/user.png'),
          firstname: chats[i].sender_firstname,
          lastname: chats[i].sender_lastname,
          date: chats[i].updated_at
        };
        dataMessages.unshift(message);
      }
      // console.log(dataMessages)
      return dataMessages;
    }
  }

  renderMessages(auth) {
    let dataMessages = this.createDataMessage(this.state.allMessagesChat.list);
    let i = 0;
    let messageCount = dataMessages.length;
    let messages = [];

    while (i < messageCount) {
      let previous = dataMessages[i - 1];
      let current = dataMessages[i];
      let next = dataMessages[i + 1];
      let isMine = current.author === auth;
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
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
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

  onFocusInput = e => {
    this.setSeen();
  };

  onChangeArea = e => {
    this.setState({
      ...this.state,
      message: e.target.value
    });
  };

  changePage() {
    let a = this;
    this.setState(
      {
        ...this.state,
        filter: {
          paging: {
            perpage: 20,
            page: this.state.filter.paging.page + 1
          }
        },
        loadingPage: true
      },
      () => {
        a.props
          .getAllMessageChat(a.state.selectedUserID, a.state.filter)
          .then(res => {
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
            });
          })
          .catch(err => {
            a.setState({
              ...a.state,
              loadingPage: false
            });
          });
      }
    );
  }

  onScrollSidebar = e => {
    if (
      this.state.filter.paging.page <
      this.state.allMessagesChat.paging.totalpage
    ) {
      let t = this.refs.chatScrollInbox.getScrollTop();
      if (t < 100) {
        if (!this.state.loadingPage) {
          this.changePage();
        }
      }
    }
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
        a.props
          .reply(data)
          .then(res => {
            a.setState({
              ...a.state,
              loadingReply: false,
              allMessagesChat: {
                ...a.state.allMessagesChat,
                attend: true
              }
            });
          })
          .catch(err => {
            a.setState({
              ...a.state,
              loadingReply: false
            });
          });
      });
    }
  };

  setSeen = () => {
    let { selectedUser, authUser } = this.props;
    if (selectedUser.unread) {
      let data = {
        cid: authUser.id,
        conversation_id: selectedUser.id
      };
      this.props.setSeen(data);
    }
  };

  removeInbox = data => () => {
    this.props.removeCVinListInbox(data);
  };

  closeInbox = data => () => {
    if (this.props.selectedUser) {
      if (this.props.selectedUser.id == data.id)
        this.props.removeCurrentInbox(data);
      else this.props.openInbox(data);
    } else this.props.openInbox(data);
  };

  render() {
    var { selectedUser, authUser, config } = this.props;
    var { allMessagesChat } = this.state;

    let classList = [
      "sc-chat-window-inbox-custom",
      this.props.isOpen ? "opened" : "closed"
    ];

    if (selectedUser === null) {
      return (
        <div className={classList.join(" ")}>
          <Header
            teamName={""}
            imageUrl={"https://app.gopanda.asia/public/backup.png"}
            onClose={() => {}}
            onRemove={() => {}}
          />
          <div className="chat-box-main">
            <div className="text-center">
              <Icon type="loading" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={classList.join(" ")}>
        <Header
          teamName={this.setName(selectedUser)}
          imageUrl={this.setAvt(selectedUser)}
          onClose={this.closeInbox(selectedUser)}
          onRemove={this.removeInbox(selectedUser)}
        />

        {this.state.firstLoading ? (
          <Scrollbars
            className="rct-scroll"
            autoHide
            ref="chatScrollInbox"
            onScroll={this.onScrollSidebar}
          >
            <Row
              type="flex"
              justify="space-around"
              align="middle"
              style={{ height: "100%" }}
            >
              <Col className="text-center">
                <Icon type="loading" style={{ fontSize: "30px" }} />
              </Col>
            </Row>
          </Scrollbars>
        ) : (
          <React.Fragment>
            <Scrollbars
              className="rct-scroll"
              autoHide
              ref="chatScrollInbox"
              onScroll={this.onScrollSidebar}
            >
              <div className="chat-body p-10">
                {this.state.loadingPage ? (
                  <div align="center">
                    <Icon type="loading" />
                  </div>
                ) : null}
                {this.renderMessages(authUser.id)}
              </div>
            </Scrollbars>

            {allMessagesChat.attend ? (
              <UserInput
                onSubmit={this.onSubmitMessage}
                setSeen={this.setSeen}
              />
            ) : (
              <div className="chat-footer d-flex px-4 align-items-center py-3 mb-30">
                {this.state.loadingReply ? (
                  <Spin
                    indicator={antIcon}
                    wrapperClassName="dat-spin-footer-chat"
                  >
                    <a style={{ margin: "auto", color: "#038fde" }}>
                      You are not attended to reply this conversation. Click
                      here to join.
                    </a>
                  </Spin>
                ) : (
                  <a
                    onClick={this.setReply}
                    style={{ margin: "auto", color: "#038fde" }}
                  >
                    You are not attended to reply this conversation. Click here
                    to join.
                  </a>
                )}
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedUser: state.inboxReducer.selectedUser,
    authUser: state.authUser.data,
    newMessage: state.inboxReducer.newMessage,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllMessageChat: (id, filter) => dispatch(getAllMessageChat(id, filter)),
    setSeen: data => dispatch(setRead(data)),
    sendMessageToUser: (data, cplData) =>
      dispatch(sendMessageToUser(data, cplData)),
    removeCurrentInbox: data => dispatch(removeCurrentInbox(data)),
    removeCVinListInbox: data => dispatch(removeCVinListInbox(data)),
    reply: data => dispatch(reply(data))
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChatWindow)
);
