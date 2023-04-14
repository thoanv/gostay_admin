import React from 'react';
import { useSelector } from 'react-redux';

const CarTypeData = () => {
    const config = useSelector((state) => {
        return state.config;
    })
    var car_type = config && config.car_type ? config.car_type : [];

    return car_type;
}

const CarType = ({ type }) => {
    const car_type = CarTypeData();

    for (let i = 0; i < car_type.length; i++) {
        if (type == car_type[i].ma) return car_type[i].title;
    }
    return '';
}


export { CarType, CarTypeData };