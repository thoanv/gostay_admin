import React from "react";
import { Avatar, Checkbox, Tag, Tooltip, Table } from "antd";
import "../../../../public/style.css";
import Aux from "../../../util/Auxiliary";
import IntlMessages from "Util/IntlMessages";

const TaskItem = ({ data, onChange }) => {
  // const {data} = this.props;
  const { id, name, status, email, depart_title } = data;
  console.log("d", data);

  const accounts = ((data.cid_firstname
  ? `${data.cid_firstname} ${data.cid_lastname}`
  : data.cid_email)
    ? data.cid_firstname
      ? `${data.cid_firstname} ${data.cid_lastname}`
      : data.cid_email
    : `${data.cid_phone}`
  ).split("null", 1);

  const columns = [
    {
      title: <IntlMessages id="inquiry.name" />,
      key: "name",
      render: record => {
        return <b>{record.name}</b>;
      }
    },
    {
      title: <IntlMessages id="inquiry.cid" />,
      key: "cid",
      render: record => {
        return ((record.cid_firstname
        ? `${record.cid_firstname} ${record.cid_lastname}`
        : record.cid_email)
          ? record.cid_firstname
            ? `${record.cid_firstname} ${record.cid_lastname}`
            : record.cid_email
          : `${record.cid_phone}`
        ).split("null", 1);
      }
    },
    {
      title: <IntlMessages id="inquiry.phone" />,
      key: "phone",
      dataIndex: "phone"
    },
    {
      title: <IntlMessages id="inquiry.email" />,
      key: "email",
      dataIndex: "email"
    },
    {
      title: <IntlMessages id="inquiry.depart_city" />,
      key: "depart_city",
      dataIndex: "depart_title"
    },
    {
      title: <IntlMessages id="global.status" />,
      key: "status",
      render: record => {
        return record.status === 1 ? (
          <Tag color="red">
            <IntlMessages id="global.waiting" />
          </Tag>
        ) : record.status === 2 ? (
          <Tag color="blue">
            <IntlMessages id="global.doing" />
          </Tag>
        ) : (
          <Tag color="green">
            <IntlMessages id="global.done" />
          </Tag>
        );
      }
    },
    {
      title: <IntlMessages id="global.id" />,
      dataIndex: "id",
      key: "id",
      sorter: true
    }
  ];

  return (
    <Aux>
      {/* <div className="gx-media gx-task-list-item gx-flex-nowrap">
        <div className="gx-mr-3">
        </div>
        <div className="gx-media-body gx-task-item-content">
          <div className="gx-task-item-content-left">
            <p className={`gx-text-truncate gx-mb-0`}>{name}</p>
          </div>
          <div className="gx-task-item-content-left">
            <Tag
              className="gx-bg-grey gx-text-grey gx-ml-8 gx-mr-0 gx-mb-0 gx-rounded-xxl gx-order-sm-2"
              style={{ marginTop: "0px" }}
            >
              {accounts}
            </Tag>
          </div>
          <div className="gx-task-item-content-left">
            
            {status === 1 ? (
              <Tag
                color="red"
                className="gx-ml-3 gx-mr-0 gx-mb-0 gx-rounded-xxl gx-order-sm-2"
                style={{ marginTop: "0px" }}
              >
                <IntlMessages id="global.waiting" />
              </Tag>
            ) : status === 2 ? (
              <Tag
                color="blue"
                className="gx-ml-3 gx-mr-0 gx-mb-0 gx-rounded-xxl gx-order-sm-2"
                style={{ marginTop: "0px" }}
              >
                <IntlMessages id="global.doing" />
              </Tag>
            ) : (
              <Tag
                color="green"
                className="gx-ml-3 gx-mr-0 gx-mb-0 gx-rounded-xxl gx-order-sm-2"
                style={{ marginTop: "0px" }}
              >
                <IntlMessages id="global.done" />
              </Tag>
            )}

            <span className="gx-fs-sm gx-text-grey gx-ml-3 gx-task-date gx-order-sm-4">
              {depart_title}
            </span>
          </div>
        </div>
      </div>
     */}

      {/* <Table
        tableLayout="auto"
        columns={columns}
        dataSource={data}
        // onChange={this.onChangTable}
        rowKey="id"
        size="small"
      /> */}
    </Aux>
  );
};

export default TaskItem;
