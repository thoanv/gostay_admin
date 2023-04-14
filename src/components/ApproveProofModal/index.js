import React, { useState } from 'react';
import { Modal, Button, Divider } from 'antd';
import { useSelector } from 'react-redux';

export const ApproveProofModal = (props) => {
    const { orderNumber, visible, proof, onCancel, onApprove, onReject, showButtons } = props;
    const config = useSelector(state => state.config);

    return (
        <Modal
            visible={visible}
            title={`Xác nhận minh chứng thanh toán cho đơn hàng ${orderNumber}`}
            onCancel={onCancel}
            footer={
                showButtons ? (
                    <div>
                    <Button onClick={onReject}>Từ chối</Button>
                    <Divider type="vertical" />
                    <Button type="primary" onClick={onApprove}>Duyệt</Button>
                </div>
                ) : null
            }
        >
            <img src={config.url_asset_root + proof} width="100%" />
        </Modal>
    )
}