import React, { useState, useEffect } from 'react';
import { List, Avatar, message } from 'antd';
import { getNewCustomer } from '../../actions/CommonActions';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function NewAccount(props) {
    moment.locale('vi');

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const config = useSelector(state => state.config);
    var url_asset_root = config ? config.url_asset_root : "";

    useEffect(() => {
        getNewCustomer().then(res => {
            setData(res.list);
            setLoading(false)
        }).catch(err => {
            setLoading(false);
            message.error("Có lỗi xảy ra, vui lòng thử lại")
        })
    }, []);

    const getReferralOs = (referral_os) => {
        if (referral_os == "IOS") return (<FontAwesomeIcon icon={["fab", "apple"]} />)
        if (referral_os == "ANDROIDOS") return (<FontAwesomeIcon icon={["fab", "android"]} />)
        return (<FontAwesomeIcon icon={["fas", "desktop"]} />)
    }

    const getName = (item) => {
        if (item.firstname || item.lastname) return item.firstname + " " + item.lastname;
        if (item.phone) return `(${item.phone_code})${item.mobile}`;
        if (item.email) return item.email;
        return "User"
    }

    return (
        <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={`${url_asset_root}${item.image ? item.image : "backup.png"}`} />}
                        title={<b>{getName(item)}</b>}
                        description={<span>{getReferralOs(item.referral_os)} . <span style={{ color: "#999" }}>{moment(item.created_at).fromNow()}</span></span>}
                    />
                </List.Item>
            )}
        />
    )

}

export default NewAccount;