import React, { Component } from 'react';
import { Avatar, Col } from 'antd';
import './image.css';
import config from '../../../../config'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
class Image extends Component {

    render() {
        const image = this.props.image;
        const { config } = this.props
        const src = config.url_asset_root+'images/'+image.path_relative;
        return (
            <div className="gallery-item-wrapper">
                <i className="zmdi zmdi-close-circle delete-image" onClick={() => this.props.removeImage(image)} ></i>
                <Avatar
                     // src={`${config.url_asset_root}${image.path_relative}`}
                    src={src}
                    shape="square"
                    size={150}
                    className="mr-2 mb-2 gallery-item"
                    
                />
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        config: state.config
    }
}


export default withRouter(connect(mapStateToProps, null)(Image));

