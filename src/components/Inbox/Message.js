import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { convertTimezone } from '../../helpers/helpers';

class Message extends Component {
    render() {
        const {
            data,
            isMine,
            startsSequence,
            endsSequence,
            showTimestamp,
            avatar,
            firstname,
            lastname,
            middle
        } = this.props;
             
        const friendlyTimestamp = convertTimezone(data.date,"LLLL");
        return (
            <div className={[
                'message-inbox-custom',
                `${isMine ? 'mine-inbox-custom' : ''}`,
                `${startsSequence ? 'start-inbox-custom' : ''}`,
                `${endsSequence ? 'end-inbox-custom' : ''}`
            ].join(' ')}>
                {
                    showTimestamp &&
                    <div className="timestamp-inbox-custom">
                        {friendlyTimestamp}
                    </div>
                }
                {
                    middle ?
                        <div className="middle-user-message-inbox-custom"></div>
                        : null
                }
                <div className="bubble-container-inbox-custom">
                    {isMine ?
                        <React.Fragment>
                            <div className="bubble-inbox-custom" title={friendlyTimestamp}>
                                {data.message}
                            </div>
                            {endsSequence ?
                                <div className="avt-message-auth-inbox-custom" title={firstname + " " + lastname}><img alt="user profile" src={avatar} className="avatar-chat-inbox-custom-auth rounded-circle ml-5" /></div>
                                : <div className="div-avt-message-auth-inbox-custom" ></div>}
                        </React.Fragment>
                        :
                        <React.Fragment>
                            {endsSequence ?
                                <div className="div-avt-message-auth-inbox-custom" title={firstname + " " + lastname}><img alt="user profile" src={avatar} className="avatar-chat-inbox-custom rounded-circle mr-5" /></div>
                                : <div className="div-avt-message-auth-inbox-custom" ></div>}
                            <div className="bubble-inbox-custom" title={friendlyTimestamp}>
                                {data.message}
                            </div>
                        </React.Fragment>
                    }
                </div>
            </div>
        );
    }
}

export default Message;