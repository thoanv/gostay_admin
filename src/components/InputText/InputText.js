import React, { PureComponent } from "react";

class InputText extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            value: ""
        }
    }
  static defaultProps = {
    onChange: () => {}
  };
  
  handleChange = event => {
    const { value } = event.target;
    this.setState({
      value
    });
    this.props.onChange(value);
  };
  render() {
    const { props } = this;
    const { value } = this.state;

    return (
      <div>
        <input
          type="text"
          {...props}
          value={value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
export default InputText

