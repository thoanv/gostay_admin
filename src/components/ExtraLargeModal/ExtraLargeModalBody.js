import React, { Component } from 'react';
import "./index.css";

class ExtraLargeModalBody extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="extraLargeModal-body">
                    {this.props.children}
                </div>
            </React.Fragment>
        )
    }
}

export default ExtraLargeModalBody;