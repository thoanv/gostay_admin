import React, { Component } from 'react';
import moment from 'moment';
import './message.css';
import Avatar from '@material-ui/core/Avatar';
import { convertTimezone, getTime } from '../../../helpers/helpers';

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
        const friendlyTimestamp = getTime(data.date,"LLLL");
        return (
            <div className={[
                'message',
                `${isMine ? 'mine' : ''}`,
                `${startsSequence ? 'start' : ''}`,
                `${endsSequence ? 'end' : ''}`
            ].join(' ')}>
                {
                    showTimestamp &&
                    <div className="timestamp">
                        {friendlyTimestamp}
                    </div>
                }
                {
                    middle ?
                        <div className="middle-user-message"></div>
                        : null
                }
                <div className="bubble-container">
                    {isMine ?
                        <React.Fragment>
                            <div className="bubble" title={friendlyTimestamp}>
                                {data.message}
                            </div>
                            {endsSequence ?
                                <div className="avt-message-auth" title={firstname + " " + lastname}><Avatar alt="user profile" src={avatar} className="avatar-chat rounded-circle ml-15 " /></div>
                                : <div className="div-avt-message-auth" ></div>}
                        </React.Fragment>
                        :
                        <React.Fragment>
                            {endsSequence ?
                                <div className="div-avt-message-auth" title={firstname + " " + lastname}><Avatar alt="user profile" src={avatar} className="avatar-chat rounded-circle mr-15 " /></div>
                                : <div className="div-avt-message-auth" ></div>}
                            <div className="bubble" title={friendlyTimestamp}>
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