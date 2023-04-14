import React, { Component } from 'react';
import "./index.css";

class ExtraLargeModalFooter extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="extraLargeModal-footer">
                    {this.props.children}
                </div>
            </React.Fragment>
        )
    }
}

export default ExtraLargeModalFooter;