import React, { Component } from "react";
import { Icon } from "antd";
import { connect } from 'react-redux';
import '../../../../public/style.css';
import { getAllReview } from "../../../actions/ReviewAction";
import { Link, withRouter } from "react-router-dom";
class WelComeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        sort: {
          type: "desc",
          attr: "",
        },
        search: "",
        paging: {
          perpage: 10,
          page: 1,
        },
      },

      filterReview: {

        paging: 0,
      },
    };
  }
  componentDidMount() {
    this.props.getAllReview(this.state.filterReview)
  }

  render() {
    const user = this.props.authUser.data
    const { count_unread } = this.props
    const count_review = this.props.paging.count
    return (
      <div className="gx-wel-ema gx-pt-xl-2">
        <h1 className="gx-mb-3">{user && user.firstname ? user.firstname : 'Panda User'}</h1>
        <p className="gx-fs-sm gx-text-uppercase">{user && user.company ? user.company : null}</p>
        <ul className="gx-list-group">
          {count_unread ?
            <Link to="/app/conversation">
              <li>
                <Icon type="message" />
                <span>{count_unread} {count_unread > 1 ? `Unread messages` : `Unread message`}</span>
              </li>
            </Link>
            : null
          }

          <li>
            <Icon type="mail" />
            <span>2 Pending invitations</span>
          </li>
          <li>
            <Icon type="profile" />
            <span>7 Due payment</span>
          </li>
          {count_review ?
            <Link to="/app/products/reviews">
              <li>
                <Icon type="edit" />
                <span>
                  {count_review > 1 ? `${count_review} Reviews` : `${count_review} review`}
                </span>
              </li>
            </Link>
            : null
          }

        </ul>
      </div>

    );
  };
}
const mapStateToProps = (state) => {
  return {
    authUser: state.authUser,
    count_unread: state.send_messages.count_unread,
    paging: state.review.paging,
  }
}
function mapDispatchToProps(dispatch) {

  return {
    getAllReview: (filter) => dispatch(getAllReview(filter)),

  };
}
export default connect(mapStateToProps, mapDispatchToProps)(WelComeCard);
