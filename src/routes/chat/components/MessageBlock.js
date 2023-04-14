/**
 * Message Block Component
 */
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';

class Message extends React.Component {


	render() {
		const { even, data } = this.props;
		if (!even) {
			return (
				<div className="d-flex flex-nowrap mb-3">
					<Avatar alt="user profile" src={data.avatar_thumb ? data.avatar_thumb : "https://app.gopanda.asia/public/backup.png"} className="avatar-chat rounded-circle mr-15 align-self-start" />
					<div className="chat-bubble-wrap">
						<div className="chat-bubble even bg-aqua">
							<p className="mb-0">{data.content}</p>
						</div>
						<span className="text-left d-block font-xs text-muted mt-1">{data.updated_at ? moment(data.updated_at).format("HH:mm") : ""}</span>
					</div>
				</div>
			);
		}
		return (
			<div className="d-flex flex-nowrap flex-row-reverse mb-3">
				<Avatar alt="user profile" src={data.avatar_thumb ? data.avatar_thumb : "https://app.gopanda.asia/public/backup.png"} className="avatar-chat  rounded-circle ml-15 align-self-start" />
				<div className="chat-bubble-wrap">
					<div className="chat-bubble odd bg-primary text-white">
						<p className="mb-0">{data.content}</p>
					</div>
					<span className="text-right d-block font-xs text-muted mt-1">{data.updated_at ? moment(data.updated_at).format("HH:mm") : ""}</span>
				</div>
			</div>
		)
	};
}


export default Message;
