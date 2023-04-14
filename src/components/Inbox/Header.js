import React, { Component } from "react";
import closeIcon from "./assets/close-icon.png";
import { Icon } from "antd";

class Header extends Component {
  render() {
    return (
      <div className="sc-header-inbox-custom">
        <img
          className="sc-header--img-inbox-custom"
          src={this.props.imageUrl}
          alt=""
        />
        <div className="sc-header--team-name-inbox-custom">
          {this.props.teamName}
        </div>
        <div
          className="sc-header--close-button-inbox-custom"
          onClick={this.props.onClose}
        >
          <Icon type="minus" />
        </div>
        <div
          className="sc-header--close-button-inbox-custom"
          onClick={this.props.onRemove}
        >
          <img src={closeIcon} alt="" />
        </div>
      </div>
    );
  }
}

export default Header;
