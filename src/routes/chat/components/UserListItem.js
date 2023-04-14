/**
 * User List Item
 */
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import classnames from 'classnames';

// helpers
import { textTruncate } from 'Helpers/helpers';
import AvatarConversation from './AvataConversation';
import moment from 'moment';
import { Tag } from 'antd';
import { OrderStatus } from '../../../components/OrderStatus';


class UserListItem extends React.Component {

    static defaultProps = {
        user: {}
    }

    setAvtArr() {
        let data = [];
        let { user, authId } = this.props;
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
        let { user, authId } = this.props;
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

    setSenderName() {
        let { user, authId } = this.props;
        let n = "";
        let last_message = user.last_message ? user.last_message[0] ? user.last_message[0] : {} : {};
        if (last_message.cid == authId) return "You: "
        n = last_message.firstname || last_message.lastname;
        n = n ? `${n}: ` : "no name: ";
        return n;
    }

    setDate() {
        let { user } = this.props;
        let last_message = user.last_message ? user.last_message[0] ? user.last_message[0] : {} : {};
        let v = last_message.updated_at ? last_message.updated_at : "";
        if (v) {
            var m = moment.utc(v); // parse input as UTC
            if (m.clone().local().format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
                return m.clone().local().fromNow();
            }
            else return m.clone().local().format("YYYY/MM/DD, HH:mm")

        }
        return "";

    }

    setTypeConversation = () => {
        let { user } = this.props;
        let type = null;
        if (user.type == 'STAY' || user.type == "RESERVATION") {
            type = 'STAY';
        }
        if (user.type == 'CAR') {
            type = "CAR";
        }
        return (
            <p>{type && <Tag color={type == 'CAR' ? '#2db7f5' : '#87d068'}>{type}</Tag>} {<OrderStatus status={user.status_order} />}</p>
        )
    }

    render() {

        var { selectedUser, user, config } = this.props;
        var last_message = user.last_message ? user.last_message[0] ? user.last_message[0] : {} : {};
        var content = last_message.content ? last_message.content : ""
        return (
            <ListItem
                onClick={() => this.props.onClickListItem()}
                className={classnames('user-list-item',
                    { 'item-active': selectedUser && selectedUser.id == user.id }
                )}
            >
                <div className="d-flex justify-content-between w-100 align-items-center">
                    <div className="media align-items-center w-95">
                        <div className="media-left position-relative mr-15">
                            <AvatarConversation data={this.setAvtArr()}></AvatarConversation>
                            {/* {user.isActive && (<span className="badge badge-success badge-xs p-5 rct-notify">&nbsp;</span>)} */}
                        </div>
                        <div className="media-body pt-5">
                            <h5 className="mb-0" style={{ fontWeight: "500" }}>{textTruncate(this.setName(), 20)}</h5>
                            {/* {user.type && user.type == "order" ? <Tag color="#108ee9">order</Tag> : null}
                            {user.type && user.type == "inquiry" ? <Tag color="#87d068">inquiry</Tag> : null} */}
                            {/* {
                                user.unread ?
                                    <span className="font-xs d-block" style={{ fontWeight: "bold" }}><span style={{ textTransform: "capitalize" }} >{this.setSenderName()}</span>{textTruncate(content, 50)}{this.setDate() ? <span style={{ color: "#c9c9c9", fontWeight: "normal" }}> . {this.setDate()}</span> : null}</span>
                                    :
                                    <span className="font-xs d-block" ><span style={{ textTransform: "capitalize" }} >{this.setSenderName()}</span>{textTruncate(content, 50)}{this.setDate() ? <span style={{ color: "#c9c9c9", fontWeight: "normal" }}> . {this.setDate()}</span> : null}</span>
                            } */}
                            {this.setTypeConversation()}
                        </div>
                    </div>
                    {/* {
                        user.unread ?
                            <div className="text-right msg-count">
                                <span className="badge badge-primary rounded-circle" style={{ width: "10px", height: "10px" }}> </span>
                            </div>
                            : null
                    } */}

                </div>
            </ListItem>
        );

    }
}
export default UserListItem;
