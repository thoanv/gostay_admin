import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Input, Tooltip, Button, Divider } from 'antd';
import Gallery from "react-photo-gallery";
import Carousel, { Modal as ImageModal, ModalGateway } from "react-images";
import qs from 'qs';
// actions
import { searchPhotos } from '../../actions/UnplashAction';
import { downloadFromUrl, getAll } from '../../actions/FileManagerActions';
import IntlMessages from 'Util/IntlMessages';
class InstantSearchModal extends Component {
    state = {
        photos: [],
        currentImage: 0,
        viewerIsOpen: false,
        isLoading: false
    }

    openLightbox(photo, index) {
        console.log(index)
        this.setState({
            currentImage: index,
            viewerIsOpen: true
        })
    }

    closeLightbox = () => {
        this.setState({
            currentImage: 0,
            viewerIsOpen: false
        })
    }

    downloadImage(src) {
        var query = qs.parse(src.split('?')[1]);
        var arr = src.split('/');
        var fileName = arr[arr.length - 1].split('?')[0];

        this.props.downloadFromUrl({
            path: this.props.path,
            url: src,
            extension: query['fm'],
            file_name: fileName
        });
        this.props.onDownload();
    }

    async onSearch(value) {
        this.setState({ isLoading: true })
        var response = await searchPhotos({ query: value, per_page: 20 });
        var photos = response.map(photo => {
            return {
                src: photo.urls.regular,
                width: photo.width,
                height: photo.height
            }
        })
        this.setState({ photos: photos, isLoading: false });
    }

    render() {
        var { visible, onCancel } = this.props;
        var { photos, viewerIsOpen, currentImage, isLoading } = this.state;

        return (
            <Modal
                title={<IntlMessages id='global.search_image_from_Unplash' />}
                visible={visible}
                onCancel={() => onCancel()}
                okButtonProps={{
                    hidden: true
                }}
                width='80%'
            >
                <div>
                    <Input.Search
                        placeholder="Search anything..."
                        enterButton
                        onSearch={value => this.onSearch(value)}
                        loading={isLoading}
                    />
                </div>
                <Gallery
                    photos={photos}
                    renderImage={({ index, photo, margin, direction, top, left, selected }) => {
                        return (
                            <div
                                key={index}
                                style={{ margin, height: photo.height, width: photo.width }}
                            >
                                <Tooltip
                                    title={
                                        <div>
                                            <Button size="small" type="primary" className="mb-0" onClick={() => this.downloadImage(photo.src)}>Download</Button>
                                            <Divider type="vertical" />
                                            <Button size="small" type="default" className="mb-0" onClick={() => this.openLightbox(photo, index)}>View</Button>
                                        </div>
                                    }
                                    trigger="click"
                                >
                                    <img
                                        alt={photo.title}
                                        {...photo}
                                    />
                                </Tooltip>
                            </div>
                        )
                    }}
                />
                <ModalGateway>
                    {viewerIsOpen ? (
                        <ImageModal onClose={this.closeLightbox}>
                            <Carousel
                                currentIndex={currentImage}
                                views={photos.map(x => ({
                                    ...x
                                }))}
                            />
                        </ImageModal>
                    ) : null}
                </ModalGateway>
            </Modal>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        downloadFromUrl: (data) => dispatch(downloadFromUrl(data)),
        getAll: (filter) => dispatch(getAll(filter)),
    }
}

export default connect(null, mapDispatchToProps)(InstantSearchModal);