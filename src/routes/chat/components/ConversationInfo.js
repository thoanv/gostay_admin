import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Divider } from 'antd';
import { convertTimezone } from '../../../helpers/helpers';

class ConversationInfo extends React.Component {

    setDataPeople(cv) {
        let data = [];
        if (cv.attend_customer) {
            data.push({ ...cv.attend_customer, isAdmin: false });
            let ad = cv.attend_admin.map(item => {
                return {
                    ...item, isAdmin: true, firstname: item.partner_firstname
                }
            });
            data.push(...ad)
            return data;
        }
        if (cv.partner) {
            return cv.partner.map(item => {
                return {
                    firstname: item.partner_firstname,
                    lastname: item.partner_lastname,
                    avatar: item.partner_avatar,
                    id: item.partner_id,
                    isAdmin: item.is_admin
                }
            })
        }
        return data;
    }

    render() {
        const { data } = this.props;
        if (data) {
            var arrP = this.setDataPeople(data)
            return (
                <Row gutter={[10, 10]}>
                    <Col span={24}>
                        <p><span style={{ fontWeight: "500" }}>Type:</span>&nbsp;{data.type}</p>
                        {data.type == "order" ? <p><span style={{ fontWeight: "500" }}>Tour:</span>&nbsp;{data.tour_title}</p> : null}
                        <p><span style={{ fontWeight: "500" }}>Create at:</span>&nbsp;{convertTimezone(data.created_at, "LLLL")}</p>
                        <p><span style={{ fontWeight: "500" }}>Last update:</span>&nbsp;{convertTimezone(data.updated_at, "LLLL")}</p>
                    </Col>
                    <Divider />
                    <Col span={24}>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#c6c6c6" }}>PEOPLE</p>
                    </Col>
                    {arrP && arrP.map(item => {
                        return (
                            <Col key={item.id} span={24}>
                                <img src={item.avatar ? `${config.url_asset_root}${item.avatar}` : `${config.url_asset_root}/backup.png`} className="avatar-chat mr-10 rounded-circle" alt="user profile" width="30" height="30" />
                                <span style={{ fontWeight: "500", textTransform: "capitalize" }}>{item.firstname ? item.firstname : ""}&nbsp;{item.lastname ? item.lastname : ""}</span>
                                {item.isAdmin ? <span style={{ color: "#c6c6c6", float: "right", fontSize: "12px" }}>Admin</span> : null}
                            </Col>
                        )
                    })}

                </Row>
            )
        }
        else return null;
    }
}

function mapStateToProps(state) {
    return {
        config: state.config
    }
}

export default connect(mapStateToProps)(ConversationInfo);

