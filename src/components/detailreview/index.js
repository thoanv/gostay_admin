import React, { Component } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { connect } from 'react-redux';
import { Col, Rate, Row } from 'antd';
import moment from "moment";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextareaAutosize from 'react-textarea-autosize';

import config from '../../../config';
import IntlMessages from "Util/IntlMessages";
const TOUR_URL = config.URL_ASSET;
const REVIEW_URL = config.URL_ASSET
class DetailReview extends Component {
    state = {
        images: [],
        modalIsOpen: false,
        selectedIndex: 0,
    }
    showImage = (data, index) => {


        var a = this
        this.setState({
            images: data.map(e => ({
                src: this.props.config.url_asset_root + e,
                caption: "",
            }
            )),
            selectedIndex: index
        }, () => a.setState({
            modalIsOpen: true,
        })
        );
    }
    toggleModal = () => {
        this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
    };


    render() {

        const desc = ["terrible", "bad", "normal", "good", "wonderful"];
        const { review, config } = this.props
        return (
            <div>

                {
                    review && review.length ? review.map(item => (
                        <Row gutter={16} className="rv-content" key={item.id + 'all'}>

                            <Col className="pdtop-20" sm={20}>

                                <div className="review-box">
                                    {
                                        item.status === 1 ?
                                            <div className="published">
                                                Published
                                                   </div>
                                            :
                                            <div className="unpublished">
                                                Pending
                                                    </div>
                                    }
                                    <div className="review-box-child1">
                                        <div className="review-box-child2">
                                            <div className="activity-rating">
                                                Activity Rating
                                            </div>
                                            <span>
                                                <Rate
                                                    value={item.rank}
                                                    disabled={true}
                                                />
                                            </span>
                                        </div>
                                        <span>{moment(item.created_at).format("DD/MM/YYYY")}</span>
                                    </div>

                                    <TextareaAutosize
                                        className="comments"
                                        style={{ width: '100%', border: 'none', overflow: 'hidden', resize: 'none', backgroundColor: '#f9fafa' }}

                                        maxRows={30}
                                        value={item.comment ? item.comment : null}
                                    />
                                    <div >
                                        <Row gutter={[16, 16]}>
                                            {
                                                item.images.length && item.images[0] !== '' ?
                                                    item.images.map((a, index) => (
                                                        <Col xs={12} md={6} lg={4} key={index} className="img-review">
                                                            <img src={config.url_asset_root + a} style={{ width: '100%', cursor: 'pointer' }} onClick={() => this.showImage(item.images, index)} />
                                                        </Col>
                                                    ))
                                                    : null
                                            }
                                        </Row>

                                    </div>
                                </div>
                            </Col>
                        </Row>))
                        :
                        <React.Fragment>
                            <div className="review-empty">
                                {/* <FontAwesomeIcon className="icon-comment" icon={['fal', 'comment-alt-lines']} /> */}
                                <div> <IntlMessages id="global.no_review" /></div>
                            </div>
                        </React.Fragment>
                }
                <ModalGateway>
                    {this.state.modalIsOpen ? (
                        <Modal onClose={this.toggleModal}>
                            <Carousel
                                views={this.state.images}
                                currentIndex={this.state.selectedIndex}
                            />
                        </Modal>
                    ) : null}
                </ModalGateway>
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        config: state.config
    }
}
export default connect(mapStateToProps)(DetailReview);