import React, { Component } from 'react';
import "./index.css";

class ExtraLargeModalHeader extends Component {

    onClose() {
        this.props.toggle();
    }

    render() {
        return (
            <React.Fragment>
                <div className="extraLargeModal-header">
                    <span className="closeExtraLargeModal" id="closeExtraLargeModal" onClick={() => this.onClose()}>&times;</span>
                    {this.props.children}
                </div>
            </React.Fragment>
        )
    }
}

export default ExtraLargeModalHeader;