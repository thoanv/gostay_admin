import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { _searchAccount } from '../../actions/AccountAction';
import debounce from 'lodash.debounce';

const { Option } = Select;

export const SelectCustomer = React.forwardRef((props, ref) => {

    const {onchange = ()=>{}} = props;

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState({ search: "" })

    useEffect(() => {
        setLoading(true)
        _searchAccount(filter, "registered").then(res => {
            setData(res.list);
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            console.log(err.response)
        })
    }, [filter])

    const changeFilter = debounce((v) => {
        setFilter({ search: v })
    }, 500)

    return (
        <Select
            loading={loading}
            style={{ width: "100%" }}
            // value={props.supplier_id}
            ref={ref}
            placeholder={"Chọn khách hàng"}
            onSelect={(v) => { onchange(v); setFilter({ search: "" }) }}
            onSearch={(v) => changeFilter(v)}
            showSearch
            filterOption={false}
            allowClear
            {...props}
        >
            {data.map(item => (
                <Option value={item.id} key={item.id}>
                    {item.email || item.phone || (item.firstname + " " + item.lastname)}
                </Option>
            ))}
        </Select>
    )
})