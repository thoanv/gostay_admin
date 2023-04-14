import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import debounce from 'lodash.debounce';
import { _requestGetAll } from '../../actions/PropertyAction';


const { Option } = Select;

export function SearchRoom(props) {
    const { style = {} } = props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState({ search: "", cid: { type: "=", value: props.supplier_id }, approved: { type: '=', value: "1" } });

    useEffect(() => {
        setFilter(filter => { return { ...filter, cid: { type: "=", value: props.supplier_id }, } })
    }, [props.supplier_id])

    useEffect(() => {
        setLoading(true)
        _requestGetAll(filter).then(res => {
            setData(res.list);
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            console.log(err)
        })
    }, [filter])

    const changeFilter = debounce((v) => {
        setFilter({ search: v, cid: { type: "=", value: props.supplier_id }, approved: { type: '=', value: "1" } })
    }, 500)

    return (
        <Select
            loading={loading}
            style={{ width: "100%", ...style }}
            value={props.object_id}
            placeholder={"Chọn phòng"}
            onSelect={(v) => { props.onChange(v); setFilter({ search: "", cid: { type: "=", value: props.supplier_id }, approved: { type: '=', value: "1" } }) }}
            onSearch={(v) => changeFilter(v)}
            showSearch
            filterOption={false}
            allowClear
        >
            <Option value={''}>{"Tất cả phòng"}</Option>
            {data.map(item => (
                <Option value={item.id} key={item.id}>
                    <div style={{ fontWeight: "500" }}>({item.id}) {item.title}</div>
                    <div>{item.email}</div>
                </Option>
            ))}
        </Select>
    )
}