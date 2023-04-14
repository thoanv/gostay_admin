import React from 'react';
import { Tag } from 'antd';


export const VehicleType = (props) => {
    const { type } = props;
    switch (type) {
        case 1:
            return <Tag color="magenta">Van</Tag>;
        case 2:
            return <Tag color="green">Standard</Tag>;
        case 3:
            return <Tag color="geekblue">Bus</Tag>;
        default:
            return "";
    }
}

export const VehicleTypeText = (props) => {
    const { type } = props;
    switch (type) {
        case 1:
            return "Van";
        case 2:
            return "Standard";
        case 3:
            return "Bus";
        default:
            return "";
    }
}

