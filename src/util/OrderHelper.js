import { Tag } from "antd"
import React, { Component } from "react";

export const OrderHelper = {

   formatStatus: (status) => {

      if(status=='ORDER_PENDING_CONFIRMATION')
       return <Tag color="yellow">{status}</Tag>
       else if(status=='ORDER_CONFIRMED') {
         return <Tag color="blue">{status}</Tag>
       }
       else if(status=='ORDER_REJECTED') {
         return <Tag color="red">{status}</Tag>
       }


     
  },

}