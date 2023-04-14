import React, { useState, useEffect } from 'react';
import { List, Avatar, message } from 'antd';
import { getNewRoom } from '../../actions/CommonActions';
import { useSelector } from 'react-redux';
import moment from 'moment';

function NewRoom(props) {
    moment.locale('vi');

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const config = useSelector(state => state.config);
    var url_asset_root = config ? config.url_asset_root : "";

    useEffect(() => {
        getNewRoom().then(res => {
            setData(res);
            setLoading(false)
        }).catch(err => {
            setLoading(false);
            message.error("Có lỗi xảy ra, vui lòng thử lại")
        })
    }, []);


    return (
        <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar shape="square" src={item.cover_img && item.cover_img.length ? `${url_asset_root}${item.cover_img[0]}` : require('../../assets/img/stay.png')} />}
                        title={<b>{item.title}</b>}
                        description={<span> D/c: {item.address} .  <span style={{ color: "#999" }}>{moment(item.created_at).fromNow()}</span></span>}
                    />
                </List.Item>
            )}
        />
    )

}

export default NewRoom;