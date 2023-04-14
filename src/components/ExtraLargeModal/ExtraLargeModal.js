import React, { Component } from 'react';
import "./index.css";

class ExtraLargeModal extends Component {

    constructor(props) {
        super(props);
        this.extraLargeModal = React.createRef();
        this.extraLargeModal_content = React.createRef();
        this.state = {
            isOpen: this.props.isOpen
        }
    }

    componentDidMount() {
        if (this.props.isOpen) {
            let modal = this.extraLargeModal.current;
            modal.style.display = "block";
        }
        if (this.props.width) {
            let modal = this.extraLargeModal_content.current;
            modal.style.width = this.props.width;
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isOpen !== prevState.isOpen) {
            return {
                isOpen: nextProps.isOpen
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isOpen != prevState.isOpen) {
            var modal = this.extraLargeModal.current;
            if (this.state.isOpen) {
                modal.style.display = "block";
            }
            if (!this.state.isOpen) {
                modal.style.display = "none";
            }
        }
    }



    toggle(event) {
        let modal = this.extraLargeModal.current;
        if (event.target == modal) {
            if (this.props.toggle) {
                this.props.toggle();
            }
        }
    }



    render() {
        return (
            <React.Fragment>
                <div ref={this.extraLargeModal} className="extraLargeModal" onClick={(event) => this.toggle(event)}>
                    <div className="extraLargeModal-content" ref={this.extraLargeModal_content} >
                        {this.props.isOpen ? this.props.children : null}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ExtraLargeModal;