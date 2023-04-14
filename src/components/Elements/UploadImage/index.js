import { Upload, Icon, Modal } from 'antd';
import React from 'react';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 0);
};

class UploadImage extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [

        ],
    };

    static defaultProps = {
        onChangeData: () => { }
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    onRemove = async file => {
        let newFile = [...this.state.fileList];
        newFile = newFile.filter(item => item.uid !== file.uid);
        this.setState({
            ...this.state,
            fileList: newFile
        });
        let data = await this.setData(newFile)
        this.props.onChangeData(data);
    }

    async setData(list) {
        let listData = [];
        if (list.length) {
            for (let i = 0; i < list.length; i++) {
                let data = await getBase64(list[i].originFileObj);
                listData.push({
                    data: data,
                    name: list[i].originFileObj.name
                })
            }
        }
        return listData;
    }

    handleChange = async ({ fileList }) => {
        this.setState({ fileList });
        let data = await this.setData(this.state.fileList);
        this.props.onChangeData(data);
    }


    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        var { multiple } = this.props;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    customRequest={dummyRequest}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    onRemove={this.onRemove}
                    onDownload={false}
                    accept="image/*, .doc, video/*"
                    multiple={multiple}
                >
                    {
                        multiple ? (
                            uploadButton
                        ) : (
                            fileList.length < 1 ? uploadButton : null
                        )
                    }
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default UploadImage;