import React from "react";
import { Button, Form, Input, Select } from "antd";
import Widget from "../../Widget/index";
import '../../../../public/style.css';
const Option = Select.Option;
const FormItem = Form.Item;
const CurrencyCalculator = () => {
  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <Widget
      title={<h2 className="h4 gx-mb-0 gx-text-capitalize">Currency Calculator</h2>}>
      <p className="gx-mb-2">2345 AUD equals</p>
      <h1 className="gx-mb-2 gx-text-primary gx-font-weight-medium gx-fs-xxl">1608,32 USD</h1>
      <p className="gx-text-grey gx-fs-sm gx-mb-3 gx-mb-lg-4">@ 1 AUD = 0,69 USD</p>
      <Form layout="inline" className="gx-form-inline-label-up gx-form-inline-currency">
        <FormItem label="From" className="gx-form-item-one-fourth">
          <Select defaultValue="AUD" onChange={handleChange}>
            <Option value="AUD">AUD</Option>
            <Option value="USD">USD</Option>
          </Select>
        </FormItem>
        <FormItem label="To" className="gx-form-item-one-fourth">
          <Select defaultValue="USD" onChange={handleChange}>
            <Option value="AUD">AUD</Option>
            <Option value="USD">USD</Option>
          </Select>
        </FormItem>
        <FormItem label="Amount (AUD)" className="gx-form-item-two-fourth">
          <Input placeholder="0.0" />
        </FormItem>
        <FormItem className="gx-d-block gx-mb-1">
          <Button className="gx-mb-0" type="primary">Transfer Now</Button>
        </FormItem>
      </Form>
    </Widget>
  );
};

export default CurrencyCalculator;
