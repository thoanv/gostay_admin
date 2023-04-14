import React from 'react';
import { Modal, Tabs } from 'antd';

const { TabPane } = Tabs;

export const PreviewEmail = (props) => {

    const { onEmailClose, data } = props;

    return (
        <Modal
            title="Xem trước"
            onCancel={onEmailClose}
            visible={!!data}
            closable={true}
            destroyOnClose={true}
            footer={null}
            width="1000px"
        >
            <Tabs defaultActiveKey="1" >
                <TabPane tab={"Khách hàng"} key="1">
                    <div contentEditable='false' dangerouslySetInnerHTML={{ __html: data && data.customer_body ? data.customer_body : "" }}></div>
                </TabPane>
                <TabPane tab={"Admin"} key="2">
                    <div contentEditable='false' dangerouslySetInnerHTML={{ __html: data && data.admin_body ? data.admin_body : "" }}></div>
                </TabPane>
                <TabPane tab={"Host"} key="3">
                    <div contentEditable='false' dangerouslySetInnerHTML={{ __html: data && data.host_body ? data.host_body : "" }}></div>
                </TabPane>
            </Tabs>
        </Modal>
    )
}