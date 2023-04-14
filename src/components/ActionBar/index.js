import React, { Component } from "react";
import { connect } from "react-redux";

import { Button, Divider, Modal, Row } from "antd";

import PropTypes from "prop-types";

import { publish, unpublish } from "../../actions/CommonActions";

import IntlMessages from "Util/IntlMessages";

const confirm = Modal.confirm;

class ActionBar extends Component {
    static propTypes = {
        isShowPublishButtons: PropTypes.bool,
        isShowDeleteButton: PropTypes.bool,
        isShowAddButton: PropTypes.bool,
        isShowDuplicateButton: PropTypes.bool,
    };

    static defaultProps = {
        isShowPublishButtons: true,
        isShowDeleteButton: true,
        isShowAddButton: true,
        isShowDuplicateButton: false
    };

    state = {
        loadingPublish: false,
        loadingUnPublish: false,
        loadingDuplicate: false,
    };


    onPublish() {
        this.setState({
            ...this.state,
            loadingPublish: true
        })
        this.props
            .publish({
                rows: this.props.rows,
                table: this.props.table
            })
            .then(() => {
                this.setState({
                    ...this.state,
                    loadingPublish: false
                })
                this.props.onRefresh();
            }).catch(err => {
                this.setState({
                    ...this.state,
                    loadingPublish: false
                })
            })
    }

    onUnpublish() {
        this.setState({
            ...this.state,
            loadingUnPublish: true
        })
        this.props
            .unpublish({
                rows: this.props.rows,
                table: this.props.table
            })
            .then(() => {
                this.setState({
                    ...this.state,
                    loadingUnPublish: false
                })
                this.props.onRefresh();
            }).catch(err => {
                this.setState({
                    ...this.state,
                    loadingUnPublish: false
                })
            })
    }


    onDuplicate() {
        var rows = this.props.rows;
        if (rows && rows.length == 1) {
            var item = rows[0];
            console.log(rows)
            this.setState({
                ...this.state,
                loadingDuplicate: true
            })
            onDuplicate(item)
                .then(() => {
                    this.setState({
                        ...this.state,
                        loadingDuplicate: false
                    })
                    this.props.onRefresh();
                }).catch(err => {
                    this.setState({
                        ...this.state,
                        loadingDuplicate: false
                    })
                })
        }
    }



    openAlert() {
        confirm({
            title: "Bạn có chắn chắn xoá các bản ghi này không?",
            okText: "Có",
            okType: "danger",
            onOk: () => this.delete(),
            onCancel() { }
        });
    }

    delete() {
        this.props.onDelete();
    }

    render() {

        const {
            isShowPublishButtons,
            isShowDeleteButton,
            isShowAddButton,
            isShowDuplicateButton
        } = this.props;

        const style = {
            filterBody: {
                margin: "10px 0"
            }
        };
        return (
            <Row type="flex">
                {isShowAddButton ? (
                    <React.Fragment>
                        <Button
                            type="primary"
                            onClick={() => this.props.onAdd()}
                            size="large"

                        >

                            <IntlMessages id="global.add_new" />
                        </Button>
                    </React.Fragment>
                ) : null}
                {isShowPublishButtons ? (
                    <React.Fragment>
                        <Divider type="vertical" style={{ height: "auto" }} />
                        <Button
                            type="primary"
                            onClick={() => this.onPublish()}
                            disabled={this.props.isDisabled}
                            loading={this.state.loadingPublish}
                            size="large"

                        >
                            <IntlMessages id="global.published" />
                        </Button>
                        <Divider type="vertical" style={{ height: "auto" }} />
                        <Button
                            type="primary"
                            onClick={() => this.onUnpublish()}
                            disabled={this.props.isDisabled}
                            loading={this.state.loadingUnPublish}
                            size="large"

                        >
                            <IntlMessages id="global.unpublished" />
                        </Button>
                    </React.Fragment>
                ) : null}
                {isShowDuplicateButton ? (
                    <React.Fragment>
                        <Divider type="vertical" style={{ height: "auto" }} />
                        <Button
                            size="large"

                            loading={this.state.loadingDuplicate}
                            type="primary"
                            onClick={() => this.onDuplicate()}
                            disabled={!(this.props.rows && this.props.rows.length == 1)}
                        >
                            <IntlMessages id="global.duplicate" />
                        </Button>
                    </React.Fragment>
                ) : null}
                {isShowDeleteButton ? (
                    <React.Fragment>
                        <Divider type="vertical" style={{ height: "auto" }} />
                        <Button
                            size="large"
                            type="danger"
                            onClick={() => this.openAlert()}
                            disabled={this.props.isDisabled}
                        >
                            <IntlMessages id="global.delete" />
                        </Button>
                    </React.Fragment>
                ) : null}
                <span style={{ marginLeft: "10px" }}>{this.props.children}</span>
            </Row>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        publish: data => dispatch(publish(data)),
        unpublish: data => dispatch(unpublish(data)),
    };
}

export default connect(null, mapDispatchToProps)(ActionBar);
