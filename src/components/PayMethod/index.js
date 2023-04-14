import React, { useState } from 'react';
import { Tag, Icon, Typography } from 'antd';

const { Text } = Typography;

export const PayMethod = (props) => {
    const { methodCode, hasPaymentProof, paymentProofApproved, onClickProofStatus } = props;
    var method = null;
    var paymentProofApprovedStatus = null;

    switch (methodCode) {
        case 'IC': {
            method = <Tag color="magenta">Thẻ visa</Tag>;
            break;
        }
        case 'DC': {
            method = <Tag color="cyan">Thẻ ATM</Tag>;
            break;
        }
        case 'EW': {
            method = <Tag color="red">Ví điện tử</Tag>;
            break;
        }
        case 'OF': {
            method = <Tag color="orange">Chuyển khoản</Tag>;
            break;
        }
        default: break;
    }

    switch (paymentProofApproved) {
        case 1: {
            paymentProofApprovedStatus = <small>Xem minh chứng <Icon type="check-circle" /></small>;
            break;
        }
        case 2: {
            paymentProofApprovedStatus = <Text type="danger"><small>Duyệt lại minh chứng <Icon type="reload" /></small></Text>;
            break;
        }
        default: {
            paymentProofApprovedStatus = <Text type="warning"><small>Duyệt minh chứng <Icon type="clock-circle" /></small></Text>;
            break;
        }
    }

    return (
        <div>
            {method}
            {
                methodCode == 'OF' && hasPaymentProof ? (
                    <div onClick={onClickProofStatus} style={{cursor: 'pointer'}}>
                        {paymentProofApprovedStatus}
                    </div>
                ) : null
            }
        </div>
    )
}