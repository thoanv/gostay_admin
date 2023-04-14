import React, { Component } from "react";
import { Button, message } from "antd";
import { reSendMail } from "../../actions/CommonActions";

class BtnResendMail extends Component {

    state = {
        loading: false
    }

    static defaultProps = {
        order_id: null
    };

    async   send() {
        const { order_id } = this.props;

        if (order_id)
            try {
                this.setState({ loading: true })
                await reSendMail({ order_id: order_id });
                this.setState({ loading: false });
                message.success('Gửi mail thành công');
            } catch (error) {
                this.setState({ loading: false });
                message.error('Có lỗi xảy ra khi gửi mail!');
            }

    }


    render() {
        var { loading } = this.state;
        return (
            <Button size="small" onClick={() => this.send()} loading={loading} >Gửi mail</Button>
        );
    }
}
export default BtnResendMail

