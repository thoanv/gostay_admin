import React, { Component } from "react";
import { Select } from "antd";
import PropTypes from "prop-types";
const { Option } = Select;

export default class BaseSelect extends Component {
  static propTypes = {
    defaultText: PropTypes.string,
    options: PropTypes.array.isRequired,
    attr: PropTypes.object,
    onChange: PropTypes.func,
    onScrollEnd: PropTypes.func,
  };

  static defaultProps = {
    optionValue: "id",
    optionLabel: "title",
    onScrollEnd: () => {},
    defaultTextValue: "",
  };

  handleScroll(e) {
    var element = e.target;
    // Khi element.scrollHeight == element.clientHeight + element.scrollTop thì đó là scroll tới bottom
    if (element.scrollHeight == element.clientHeight + element.scrollTop) {
      this.props.onScrollEnd();
    }
  }

  render() {
    var {
      defaultText,
      selected,
      options,
      attr,
      optionValue, // name of value field
      optionLabel, // name of label field
      additionalLabel,
      onChange,
      defaultTextValue,
      arrDefault = [],
      ...rest
    } = this.props;
    let value = selected ? selected : "";

    if (options.length) {
      let temp = options.find((option) => option[optionValue] == selected);
      if (!temp) value = ""; else {
        value = temp[optionValue]
      }
    }
  console.log(selected,value)
    return (
      <Select
        defaultValue={value}
        {...rest}
        onChange={(value, option) => onChange(value, option)}
        filterOption={(input, option) => {
          return (
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          );
        }}
        onPopupScroll={(e) => this.handleScroll(e)}
      >
        {defaultText ? (
          <Option value={defaultTextValue}>{defaultText}</Option>
        ) : null}
        {arrDefault ? (
          arrDefault.map(x => <Option value={x.value}>{x.text}</Option>)
        ) : null}
        {options.map((option, index) => {
          let label = option[optionLabel];
          if (additionalLabel) {
            label = "(" + additionalLabel + ") " + option[optionLabel];
          }
          return (
            <Option
              key={`${option[optionValue]}_${index}`}
              value={option[optionValue]}
            >
              {option[optionLabel]}
            </Option>
          );
        })}
      </Select>
    );
  }
}
