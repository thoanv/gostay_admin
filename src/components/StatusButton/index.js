import React, { Component } from 'react';
import { Tag, Icon } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// action
import { changeStatus } from 'Actions/CommonActions';


/**
 * Button change status when click
 */
class StatusButton extends Component {
    state = {
        status: 0
    }

    static propTypes = {
        /** ID of object need to update */
        data_id: PropTypes.number.isRequired,
        /** Table name */
        table: PropTypes.string.isRequired,
        /** Initial status of object */
        // status: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.setState({
            status: this.props.status
        })
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.status != this.state.status) {
            this.setState({
                status: nextProps.status
            })
        }
    }

    click() {
        let newStatus = !this.state.status;

        this.props.changeStatus({
            id: this.props.data_id,
            table: this.props.table,
            status: newStatus
        }).then(() => {
            this.setState({
                status: newStatus
            });
        })
    }

    render() {
        var twoToneColor = '#52c41a';
        var type = 'check-square';

        if (this.state.status) {
            twoToneColor = '#52c41a';
            type = 'check-square';
        } else {
            twoToneColor = '#eb2f96';
            type = 'close-square';
        }

        return (
            <div onClick={() => this.click()}>
                {/* <Tag color={color}>{text}</Tag> */}
                <Icon type={type} theme="twoTone" twoToneColor={twoToneColor} />
            </div>
        )
    }
}

StatusButton.defaultProps = {
    status: 0,
}

function mapDispatchToProps(dispatch) {
    return {
        changeStatus: (data) => dispatch(changeStatus(data))
    }
}

export default connect(null, mapDispatchToProps)(StatusButton);