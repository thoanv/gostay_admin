import React, { Component } from 'react';
import ImagePreview from '../ImagePreview';
import { Row } from "antd";

class ListImagePreview extends Component {

    static defaultProps = {
        data: [],
        removeImage: () => { }
    }

    render() {
        const { data } = this.props;
        return (
            <div className="d-flex justify-content-start" style={{flexWrap: 'wrap'}}>
                {
                    data.map((item,index) => {
                        return (
                            <ImagePreview image={item} key={index} removeImage={(image) => this.props.removeImage(image)}></ImagePreview>
                        )
                    })
                }
            </div>
            // <Row gutter={16} type="flex">
            //     {
            //         data.map((item,index) => {
            //             return (
            //                 <ImagePreview image={item} key={index} removeImage={(image) => this.props.removeImage(image)}></ImagePreview>
            //             )
            //         })
            //     }
            // </Row>
        )
    }
}

export default ListImagePreview;

