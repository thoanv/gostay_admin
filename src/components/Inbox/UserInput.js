import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SendIcon from './SendIcon';


class UserInput extends Component {

  constructor() {
    super();
    this.state = {
      inputActive: false,
    };
  }


  handleKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      return this._submitText(event);
    }
  }


  _submitText(event) {
    event.preventDefault();
    const text = this.userInput.textContent;
    if (text && text.trim().length > 0) {
      this.props.onSubmit(text.trim());
      this.userInput.innerHTML = '';
    }
  }

  onFocusInput = () => {
    this.setState({ inputActive: true }, () => {
      this.props.setSeen()
    })
  }



  render() {
    const { inputActive } = this.state;
    return (
      <form className={`sc-user-input-inbox-custom ${(inputActive ? 'active' : '')}`}>
        <div
          role="button"
          tabIndex="0"
          onFocus={this.onFocusInput}
          onBlur={() => { this.setState({ inputActive: false }); }}
          ref={(e) => { this.userInput = e; }}
          onKeyDown={this.handleKeyDown.bind(this)}
          contentEditable="true"
          placeholder="Write a reply..."
          className="sc-user-input--text-inbox-custom"
        >
        </div>
        <div className="sc-user-input--buttons-inbox-custom">
          <div className="sc-user-input--button-inbox-custom"></div>
          <div className="sc-user-input--button-inbox-custom">
            <SendIcon onClick={this._submitText.bind(this)} />
          </div>
        </div>
      </form>
    );
  }
}


export default UserInput;
