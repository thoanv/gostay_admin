import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import debounce from 'lodash.debounce';


const { Option } = Select;

export function FilterManager(props) {
    const { style = {} } = props;
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({ search: "", status: props.status  });

    useEffect(() => {
        setFilter(filter => { return { ...filter,  status: props.status  } })
    }, [props.status])

    useEffect(() => {
        setLoading(true)

    }, [filter])


    return (
        <Select
            loading={loading}
            style={{ width: "100%", ...style }}
            value={props.status}
            placeholder={"Chọn trạng thái"}
            onSelect={(v) => { props.onChange(v); console.log(v); setFilter({ ...filter, status : v}) }}
            filterOption={false}
            allowClear
        >
            {props.data.map(item => (
                <Option value={item.value} key={item.value}>
                    <div style={{ fontWeight: "500" }}>{item.label}</div>
                </Option>
            ))}
        </Select>
    )
}