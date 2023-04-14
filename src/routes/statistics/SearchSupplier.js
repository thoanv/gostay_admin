import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { _searchAccount } from '../../actions/AccountAction';
import debounce from 'lodash.debounce';

const { Option } = Select;

export function SearchSupplier(props) {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState({ search: "" })

    useEffect(() => {
        setLoading(true)
        _searchAccount(filter, "supplier").then(res => {
            setData(res.list);
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            console.log(err)
        })
    }, [filter])

    const changeFilter = debounce((v) => {
        setFilter({ search: v })
    }, 500)

    return (
        <Select
            loading={loading}
            style={{ width: "300px" }}
            value={props.supplier_id}
            placeholder={"Chọn nhà cung cấp"}
            onSelect={(v) => { props.onChange(v); setFilter({ search: "" }) }}
            onSearch={(v) => changeFilter(v)}
            showSearch
            filterOption={false}
        >
            <Option value={''}>{"Tất cả nhà cung cấp"}</Option>
            {data.map(item => (
                <Option value={item.id} key={item.id}>
                    {item.email || item.phone || (item.firstname + " " + item.lastname)}
                </Option>
            ))}
        </Select>
    )
}