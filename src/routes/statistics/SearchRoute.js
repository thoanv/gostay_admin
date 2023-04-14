import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import debounce from 'lodash.debounce';
import { _requestGetAllRoute } from '../../actions/CarAction';

const { Option } = Select;

export function SearchRoute(props) {
    const { style = {} } = props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState({ search: "", cid: { type: "=", value: props.supplier_id }, approved: { type: '=', value: "1" } });

    useEffect(() => {
        setFilter(filter => { return { ...filter, cid: { type: "=", value: props.supplier_id } } })
    }, [props.supplier_id])

    useEffect(() => {
        setLoading(true)
        _requestGetAllRoute(filter).then(res => {
            setData(res.list);
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            console.log(err)
        })
    }, [filter])

    const changeFilter = debounce((v) => {
        setFilter(filter => { return { ...filter, search: v } })
    }, 500)

    return (
        <Select
            loading={loading}
            style={{ width: "100%", ...style }}
            value={props.object_id}
            placeholder={"Chọn tuyến đường"}
            onSelect={(v) => { props.onChange(v); setFilter({ search: "", cid: { type: "=", value: props.supplier_id }, approved: { type: '=', value: "1" } });}}
            onSearch={(v) => changeFilter(v)}
            showSearch
            filterOption={false}
            allowClear
        >
            <Option value={''}>{"Tất cả tuyến đường"}</Option>
            {data.map(item => (
                <Option value={item.id} key={item.id}>
                    <div style={{ fontWeight: "500" }}>{item.title}</div>
                    <div>{item.email}</div>
                </Option>
            ))}
        </Select>
    )
}