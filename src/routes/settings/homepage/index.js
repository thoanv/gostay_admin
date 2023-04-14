import React, { Component } from 'react';
import { connect } from 'react-redux';
import Board from 'react-trello';
import IntlMessages from 'Util/IntlMessages';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import _ from 'lodash';
import { Button, Modal, Spin, Upload, Icon, Row, Col, Typography, Divider, Input } from 'antd';
import { NotificationManager } from 'react-notifications';
import InputChosseFile from "../../fileManager/InputChosseFile";
// actions
import { getAllWidgets } from '../../../actions/WidgetActions';
import { getHomepageWidgets, updateHomepageWidgets } from '../../../actions/HomepageWidgetActions';
import { uploadFiles } from '../../../actions/FileManagerActions';
import { setConfig } from '../../../actions/ConfigActions';

const { Title } = Typography;
const { TextArea } = Input;

class HomepageSetting extends Component {
    state = {
        isLoading: true,
        showedWidgets: [],
        showedCards: [],
        restCards: [],
        banners: [],
        backgroundImages: [],
        popupImages: [],
        partnerLogos: []
    }

    async componentDidMount() {
        let homepageWidgetResponse = await this.props.getHomepageWidgets();
        let showedCards = homepageWidgetResponse.map(item => {
            return {
                id: item.id.toString(),
                title: item.title,
                description: item.code
            }
        });
        let widgetResponse = await this.props.getAllWidgets({ paging: 0, status: 1 });
        let cards = widgetResponse.list.map(widget => {
            return {
                id: widget.id.toString(),
                title: widget.title,
                description: widget.code
            }
        });

        cards = cards.filter((card) => {
            let index = showedCards.findIndex(item => item.id == card.id);
            if (index < 0) return true;
            else return false;
        });

        // banner

        var banners = [];
        var backgroundImages = [];
        var popupImages = [];
        var partnerLogos = [];
        if (this.props.config.homepage_promotion_banners) {
            banners = this.props.config.homepage_promotion_banners.map((item, index) => {
                return {
                    name: item,
                    path_relative: item
                }
            });
        }
        if (this.props.config.homepage_background_images) {
            backgroundImages = this.props.config.homepage_background_images.map((item, index) => {
                return {
                    name: item,
                    path_relative: item
                }
            });
        }
        if (this.props.config.homepage_popup_images) {
            popupImages = this.props.config.homepage_popup_images.map((item, index) => {
                return {
                    name: item,
                    path_relative: item
                }
            });
        }
        if (this.props.config.homepage_partner_logos) {
            partnerLogos = this.props.config.homepage_partner_logos.map((item, index) => {
                return {
                    name: item,
                    path_relative: item
                }
            });
        }

        this.setState({
            showedCards: showedCards,
            restCards: cards,
            isLoading: false,
            banners: banners,
            backgroundImages: backgroundImages,
            popupImages: popupImages,
            partnerLogos: partnerLogos
        });
    }

    onDataChange(newData) {
        var { showedCards, restCards } = this.state;

        if (!_.isEqual(newData.lanes[0].cards, showedCards) || !_.isEqual(newData.lanes[1].cards, restCards)) {
            var data = newData.lanes[0].cards.map((card, index) => {
                return {
                    widget_id: card.id,
                    code: card.description,
                    position: index
                }
            });

            this.setState({
                showedWidgets: data,
                showedCards: newData.lanes[0].cards,
                restCards: newData.lanes[1].cards
            })
        }

    }

    onSubmit() {
        Modal.confirm({
            title: "Bạn chắc chắn đã hoàn thành việc thiết lập widget trang chủ?",
            onOk: () => {
                var { showedWidgets } = this.state;

                if (showedWidgets.length) {
                    this.props.updateHomepageWidgets(showedWidgets);
                } else {
                    NotificationManager.error("Bạn chưa thay đổi gì hoặc cần phải có ít nhất một widget ở trang chủ");
                }
            }
        })
    }

    onChangeGallery(data, type) {
        try {
            var currentConfig = this.props.config;
            // remove dynamic config
            delete currentConfig.property_type;
            delete currentConfig.room_type;
            delete currentConfig.cancel_policy;
            delete currentConfig.airports;
            delete currentConfig.widgets;
            delete currentConfig.order_statuses;

            if (type == 'banner') {
                currentConfig.homepage_promotion_banners = data.map(item => {
                    return encodeURI(item.path_relative);
                });
            } else if (type == 'background') {
                currentConfig.homepage_background_images = data.map(item => {
                    return encodeURI(item.path_relative);
                });
            } else if (type == 'popup') {
                currentConfig.homepage_popup_images = data.map(item => {
                    return encodeURI(item.path_relative);
                });
            } else if (type == 'partnerLogos') {
                currentConfig.homepage_partner_logos = data.map(item => {
                    return encodeURI(item.path_relative);
                });
            }

            this.props.setConfig(currentConfig);
        } catch (error) {
            console.log(error);
        }
    };

    onChangePopupAction = _.debounce((value) => {
        var currentConfig = this.props.config;
        // remove dynamic config
        delete currentConfig.property_type;
        delete currentConfig.room_type;
        delete currentConfig.cancel_policy;
        delete currentConfig.airports;
        delete currentConfig.widgets;
        delete currentConfig.order_statuses;

        currentConfig.homepage_popup_action_url = value;
        this.props.setConfig(currentConfig);
    }, 1000);

    onChangeBannerActions = _.debounce((value) => {
        var currentConfig = this.props.config;
        // remove dynamic config
        delete currentConfig.property_type;
        delete currentConfig.room_type;
        delete currentConfig.cancel_policy;
        delete currentConfig.airports;
        delete currentConfig.widgets;
        delete currentConfig.order_statuses;

        var urls = value.split(',').map(url => url.trim());

        currentConfig.homepage_banner_action_urls = urls;
        this.props.setConfig(currentConfig);
    }, 1000);

    render() {
        var { config } = this.props;
        var { showedCards, restCards, isLoading, banners, backgroundImages, popupImages, partnerLogos } = this.state;

        const data = {
            lanes: [
                {
                    id: 'lane1',
                    title: 'Widget đang được hiển thị',
                    cards: showedCards,
                    style: {
                        maxHeight: 500
                    }
                },
                {
                    id: 'lane2',
                    title: 'Tất cả widget',
                    cards: restCards,
                    style: {
                        maxHeight: 500
                    }
                }
            ]
        }

        return (
            <div>
                <PageTitleBar title={<IntlMessages id="sidebar.homepage_widgets" />} match={this.props.match} />
                <div className="mt-4">
                    {
                        isLoading ? (
                            <Spin size="large" />
                        ) : (
                            <Row>
                                <Col md={14}>
                                    <Title level={4}>Sắp xếp các widget trang chủ</Title>
                                    <Button type="primary" onClick={() => this.onSubmit()}>Lưu</Button>
                                    <Board
                                        data={data}
                                        onDataChange={(data) => this.onDataChange(data)}
                                        style={{
                                            maxHeight: 540
                                        }}
                                    />
                                </Col>
                                <Col md={10}>
                                    <Title level={4}>Ảnh background trang chủ</Title>
                                    <InputChosseFile
                                        limit={8}
                                        key="gallery"
                                        onChange={(data) => this.onChangeGallery(data, 'background')}
                                        defautValue={backgroundImages}
                                    />
                                    <Divider />
                                    <Title level={4}>Banner quảng bá / quảng cáo</Title>
                                    <InputChosseFile
                                        limit={8}
                                        key="banner"
                                        onChange={(data) => this.onChangeGallery(data, 'banner')}
                                        defautValue={banners}
                                    />
                                    <div className="mt-2">
                                        <div>Action URLs</div>
                                        <div><small>(mỗi URL phân cách nhau bằng dấu phẩy và phải sắp xếp theo đúng thứ tự ảnh banner)</small></div>
                                        <TextArea 
                                            rows={4} 
                                            onChange={(e) => this.onChangeBannerActions(e.target.value)} 
                                            defaultValue={config.homepage_banner_action_urls ? config.homepage_banner_action_urls.join(',') : ''}
                                        />
                                    </div>
                                    <Divider />
                                    <Title level={4}>Popup trang chủ</Title>
                                    <InputChosseFile
                                        limit={1}
                                        key="popup"
                                        onChange={(data) => this.onChangeGallery(data, 'popup')}
                                        defautValue={popupImages}
                                    />
                                    <div className="mt-2">
                                        <div>Action URL</div>
                                        <Input onChange={(e) => this.onChangePopupAction(e.target.value)} defaultValue={config.homepage_popup_action_url || ''} />
                                    </div>
                                    <Divider />
                                    <Title level={4}>Logo đối tác</Title>
                                    <InputChosseFile
                                        limit={8}
                                        key="partnerLogos"
                                        onChange={(data) => this.onChangeGallery(data, 'partnerLogos')}
                                        defautValue={partnerLogos}
                                    />
                                </Col>
                            </Row>
                        )
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        widgets: state.widget.widgets,
        config: state.config
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllWidgets: (filter) => dispatch(getAllWidgets(filter)),
        getHomepageWidgets: () => dispatch(getHomepageWidgets()),
        updateHomepageWidgets: (data) => dispatch(updateHomepageWidgets(data)),
        uploadFiles: (data) => dispatch(uploadFiles(data)),
        setConfig: (data) => dispatch(setConfig(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomepageSetting);