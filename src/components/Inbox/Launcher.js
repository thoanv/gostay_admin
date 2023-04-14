import React, { Component } from 'react';
import ChatWindow from './ChatWindow';
import launcherIcon from './assets/logo-no-bg.svg';
import ListCurrentChat from './ListCurrentChat';
import './styles';
import { removeCurrentInbox, removeCVinListInbox, openInbox } from '../../actions/InboxAction';
import { connect } from 'react-redux';

class Launcher extends Component {

  constructor(props) {
    super(props);
    this.state = {
      launcherIcon,
    };
  }



  render() {
    const isOpen = this.props.isOpen;
    return (
      <div id="sc-launcher">
        {isOpen ?
          <ChatWindow
            messageList={this.props.messageList}
            onUserInputSubmit={this.props.onMessageWasSent}
            agentProfile={this.props.agentProfile}
            isOpen={isOpen}
          />
          : null}
        <ListCurrentChat></ListCurrentChat>
      </div>
    );
  }
}


Launcher.defaultProps = {
  newMessagesCount: 0,
  showEmoji: true,
  isOpen: false,
};

function mapStateToProps(state) {
  return {
    isOpen: state.inboxReducer.isOpen,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    removeCurrentInbox: (data) => dispatch(removeCurrentInbox(data)),
    removeCVinListInbox: (data) => dispatch(removeCVinListInbox(data)),
    openInbox: data => dispatch(openInbox(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Launcher);
