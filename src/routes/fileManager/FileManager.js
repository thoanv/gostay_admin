import React, { forwardRef } from 'react';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { connect } from 'react-redux';
import IntlMessages from 'Util/IntlMessages';
import ListLargeDoc from '../../components/FileManager/ListLargeDoc';
import ListLargeFolder from '../../components/FileManager/ListLargeFolder';
import ListLargeImg from '../../components/FileManager/ListLargeImg';
import ListLargeVideo from '../../components/FileManager/ListLargeVideo';
import { Icon, Radio, Checkbox, Button, Divider, Modal, Input } from 'antd';
import { withRouter } from 'react-router-dom';
import qs from 'qs';
import LinkFolder from '../../components/FileManager/LinkFolder';
import AddFolder from './AddFolder';
import UploadFile from './UploadFille';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import InstantSearchModal from './InstantSearchModal';
// actions
import { getAll, add, del, upload, uploadMultiple } from '../../actions/FileManagerActions';

const confirm = Modal.confirm;

class FileManager extends React.Component {

    state = {
        checkAll: false,
        indeterminate: false,
        view: "thumbnail",
        filter: "all",
        data: {
            total: 0,
            docs: [],
            videos: [],
            images: [],
            folders: []
        },
        checkedItem: {
            total: 0,
            docs: [],
            videos: [],
            images: [],
            folders: []
        },
        folder: "",
        openAddFolder: false,
        loadingAdd: false,
        openUploadFile: false,
        loadingUpFile: false,
        isOpenInstantSearchModal: false,
        lastModifiedTimestamp: null // variable show that image just downloaded instantly and need to refresh current folder
    }


    componentDidMount() {
        var folder = qs.parse(this.props.location.search).folder;
        if (folder === undefined || folder === "" || folder === "/") folder = '/';

        this.props.getAllFile(folder).then(res => {
            let { folders, docs, videos, images } = res.data;
            let data = this.onCreateData(folders, docs, videos, images, this.state.filter);
            this.setState({
                ...this.state,
                data: data
            })
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.search !== this.props.location.search || prevState.lastModifiedTimestamp !== this.state.lastModifiedTimestamp) {
            setTimeout(() => {
                var folder = qs.parse(this.props.location.search).folder;
                if (folder === undefined || folder === "" || folder === "/") folder = '/';

                this.props.getAllFile(folder).then(res => {
                    let { folders, docs, videos, images } = res.data;
                    let data = this.onCreateData(folders, docs, videos, images, this.state.filter);
                    this.setState({
                        ...this.state,
                        data: data
                    })
                });
            }, 500);
        }
    }

    onSetFilterView = (e) => {
        const { folders, docs, videos, images } = this.props.fileManager;
        var filterType = e.target.value;
        console.log(filterType)

        this.setState({
            data: this.onCreateData(folders, docs, videos, images, filterType),
            [e.target.name]: e.target.value
        })
    }

    onCreateData(folders = [], docs = [], videos = [], images = [], type = "all") {
        console.log(type);
        switch (type) {
            case "all": {
                return {
                    total: folders.length + docs.length + videos.length + images.length,
                    docs: docs,
                    folders: folders,
                    videos: videos,
                    images: images
                };
            }
            case "doc": {
                return {
                    total: docs.length,
                    docs: docs,
                    folders: [],
                    videos: [],
                    images: []
                };
            }
            case "video": {
                return {
                    total: videos.length,
                    docs: [],
                    folders: [],
                    videos: videos,
                    images: []
                };
            }
            case "image": {
                return {
                    total: images.length,
                    docs: [],
                    folders: [],
                    videos: [],
                    images: images
                };
            }
            case "folder": {
                return {
                    total: folders.length,
                    docs: [],
                    folders: folders,
                    videos: [],
                    images: []
                }
            }
            default: return [];
        }
    }

    onCheckAll = (e) => {
        this.setState({
            ...this.state,
            checkAll: e.target.checked,
            indeterminate: false,
            checkedItem: e.target.checked ? this.state.data : { total: 0, docs: [], videos: [], images: [], folders: [] }
        })
    }

    onChangeChecked = (type, data) => {
        let checkedItem = this.state.checkedItem;
        switch (type) {
            case "doc": {
                let total = data.length + checkedItem.videos.length + checkedItem.folders.length + checkedItem.images.length
                return this.setState({
                    ...this.state,
                    checkAll: (total > 0) && (total === this.state.data.total),
                    indeterminate: (total > 0) && (total < this.state.data.total),
                    checkedItem: {
                        ...this.state.checkedItem,
                        docs: data,
                        total: total
                    }
                })
            }
            case "image": {
                let total = checkedItem.docs.length + checkedItem.videos.length + checkedItem.folders.length + data.length
                return this.setState({
                    ...this.state,
                    checkAll: (total > 0) && (total === this.state.data.total),
                    indeterminate: (total > 0) && (total < this.state.data.total),
                    checkedItem: {
                        ...this.state.checkedItem,
                        images: data,
                        total: total
                    }
                })
            }
            case "folder": {
                let total = checkedItem.docs.length + checkedItem.videos.length + data.length + checkedItem.images.length;
                return this.setState({
                    ...this.state,
                    checkAll: (total > 0) && (total === this.state.data.total),
                    indeterminate: (total > 0) && (total < this.state.data.total),
                    checkedItem: {
                        ...this.state.checkedItem,
                        folders: data,
                        total: checkedItem.docs.length + checkedItem.videos.length + data.length + checkedItem.images.length
                    }
                })
            }
            case "video": {
                let total = checkedItem.docs.length + data.length + checkedItem.folders.length + checkedItem.images.length
                return this.setState({
                    ...this.state,
                    checkAll: (total > 0) && (total === this.state.data.total),
                    indeterminate: (total > 0) && (total < this.state.data.total),
                    checkedItem: {
                        ...this.state.checkedItem,
                        videos: data,
                        total: checkedItem.docs.length + data.length + checkedItem.folders.length + checkedItem.images.length
                    }
                })
            }
            default: return 0;
        }
    }

    createDataLink(queryString) {
        var data = [{ name: "root", path: "/" }];;
        if (queryString === undefined || queryString === "" || queryString === "/") return data;
        var arrQ = queryString.split("/");

        arrQ = arrQ.filter(item => item);
        console.log(arrQ);

        let items = arrQ.map((item, index) => {
            let path = arrQ.slice(0, index + 1).join('/');

            return { name: item, path: path + '/' };
        });

        return [...data, ...items];
    }

    onChangeFolderLink = (item) => {
        this.props.history.push({
            pathname: '/app/file-manager',
            search: `?&folder=${item.path}`
        });
    }

    openFolder = (item) => {
        console.log("item", item)
        this.props.history.push({
            pathname: '/app/file-manager',
            search: `?&folder=${item.path_relative}`
        });
    }

    onCloseAdd = () => {
        this.setState({
            ...this.state,
            openAddFolder: false
        })
    }

    onOpenAdd = () => {
        this.setState({
            ...this.state,
            openAddFolder: true
        })
    }

    submitAddFolder = async (folder) => {
        this.setState({ loadingAdd: true });
        await this.props.add(folder.foldername, folder.folderbase);
        this.setState({ loadingAdd: false, lastModifiedTimestamp: Date.now() });
    }

    onDelete() {
        let queryString = qs.parse(this.props.location.search).folder;
        let folderbase = "/";
        if (queryString !== undefined || queryString !== "" || queryString !== "/") folderbase = queryString;
        let checkedItem = this.state.checkedItem;
        if (this.props.config.fileSystem == 's3') {
            checkedItem.folders = checkedItem.folders.map(folder => {
                return {
                    ...folder,
                    name: `${folder.name}/`
                }
            })
        }
        let arr = checkedItem.folders.concat(checkedItem.images).concat(checkedItem.docs).concat(checkedItem.videos);
        let arrName = arr.map(item => item.name);
        let data = {
            rm: arrName,
            folder: folderbase
        }
        this.props.del(data);
        this.setState({
            lastModifiedTimestamp: Date.now(),
            indeterminate: false,
            checkedItem: {
                total: 0,
                docs: [],
                videos: [],
                images: [],
                folders: []
            },
        });
    }

    openAlert() {
        confirm({
            title: "Bạn có muốn xóa tệp / thư mục này không?",
            cancelText: "Huỷ",
            okText: "OK",
            okType: 'danger',
            onOk: () => this.onDelete(),
            onCancel() { },
        })
    }


    onCloseUpload = () => {
        this.setState({
            ...this.state,
            openUploadFile: false
        })
    }

    onOpenUpload = () => {
        this.setState({
            ...this.state,
            openUploadFile: true
        })
    }

    submitFile = (files) => {
        this.setState({ loadingUpFile: true })
        this.props.uploadMultiple(files).then(res => {
            this.setState({
                lastModifiedTimestamp: Date.now(),
                loadingUpFile: false,
                openUploadFile: false
            })
        }).catch(err => {
            this.setState({ loadingUpFile: false })
        })
    }

    toggleInstanceSearch(visible) {
        let folder = null;
        if (visible) folder = qs.parse(this.props.location.search).folder;

        this.setState({ isOpenInstantSearchModal: visible, folder: folder });
    }

    render() {
        var { isOpenInstantSearchModal, folder, checkedItem } = this.state;
        const { folders, docs, videos, images } = this.state.data;
        const checkedTotal = this.state.checkedItem.total;
        var queryString = qs.parse(this.props.location.search).folder;
        var dataLink = this.createDataLink(queryString);
        var folderbase = "/";
        if (queryString !== undefined || queryString !== "" || queryString !== "/") folderbase = queryString;

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.file-manager" />}
                        match={this.props.match}
                    />
                    <RctCollapsibleCard colClasses="col-12">
                        <div>
                            <React.Fragment>
                                <Button type="primary" onClick={() => this.onOpenUpload()} className="mr-2" >
                                    <Icon type="upload" /> <IntlMessages id="global.upload" />
                                </Button>
                                <Button type="primary" onClick={() => this.onOpenAdd()} className="mr-2" >
                                    <Icon type="folder-add" /> <IntlMessages id="global.create-new-folder" />
                                </Button>
                                <Button type="default" onClick={() => this.toggleInstanceSearch(true)} className="mr-2">
                                    <Icon type="search" /> <IntlMessages id="file.instant_search" />
                                </Button>
                                {/* <Button type="primary" onClick={() => { }} disabled={this.state.checkedItem.total === 0} className="mr-2">
                                    <Icon type="download" /> <IntlMessages id="global.download" />
                                </Button> */}
                                <Button type="danger" onClick={() => this.openAlert()} disabled={this.state.checkedItem.total === 0} className="mr-2">
                                    <Icon type="close" /> <IntlMessages id="global.delete" />
                                </Button>
                            </React.Fragment>
                            {/* <div style={{ float: "right" }}>
                                <Radio.Group defaultValue="thumbnail" buttonStyle="solid" name="view" onChange={this.onSetFilterView}>
                                    <Radio.Button value="thumbnail"><b><Icon type="appstore" /> Thumbnail View</b></Radio.Button>
                                    <Radio.Button value="detail"><b><Icon type="unordered-list" /> Detail View</b></Radio.Button>
                                </Radio.Group>
                            </div> */}
                        </div>
                        <div style={{ marginTop: "10px", marginBottom: "5px" }}>
                            <span style={{ color: "#595959", fontWeight: "500" }}><i><Icon type="folder-open" theme="filled" /> <LinkFolder data={dataLink} onChangeFolderLink={this.onChangeFolderLink}></LinkFolder></i></span><br />
                        </div>
                        <div className="d-flex justify-content-between" style={{ clear: "both", marginBottom: "30px" }}>
                            <div>
                                <span><IntlMessages id="file.filter" /> </span><br />
                                <Radio.Group defaultValue="all" size="small" buttonStyle="solid" onChange={this.onSetFilterView} name="filter">
                                    <Radio.Button value="all"><IntlMessages id="file.all" /></Radio.Button>
                                    <Radio.Button value="folder"><IntlMessages id="file.folder" /></Radio.Button>
                                    <Radio.Button value="doc"><IntlMessages id="file.document" /></Radio.Button>
                                    <Radio.Button value="video"><IntlMessages id="file.video" /></Radio.Button>
                                    <Radio.Button value="image"><IntlMessages id="file.image" /></Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                checked={this.state.checkAll}
                                onChange={this.onCheckAll}
                                style={{ backgroundColor: (this.state.checkAll || this.state.indeterminate) ? "#F4F4F4" : "#ffff", padding: "5px", borderRadius: "3px", border: "1px solid #F5F3" }}
                            >
                                <b><IntlMessages id="file.check_all" /></b>
                            </Checkbox> <span>{checkedTotal ? checkedTotal + " item(s) checked" : null} </span>
                        </div>
                        <div>
                            {
                                folders.length ? (
                                    <div>
                                        <h2><IntlMessages id="file.folder" /> <small><i>{folders.length + " "} <IntlMessages id="file.item" /></i></small></h2>
                                        <ListLargeFolder
                                            data={folders}
                                            onChangeChecked={this.onChangeChecked}
                                            checkAll={this.state.checkAll}
                                            indeterminate={this.state.indeterminate}
                                            openFolder={this.openFolder}
                                            checkedItem={checkedItem.folders}
                                            folderbase={folderbase}
                                        />
                                    </div>
                                ) : null
                            }
                            {
                                docs.length ? (
                                    <div>
                                        <h2><IntlMessages id="file.document" /> <small><i>{docs.length + " "} <IntlMessages id="file.item" /></i></small></h2>
                                        <ListLargeDoc
                                            data={docs}
                                            onChangeChecked={this.onChangeChecked}
                                            checkAll={this.state.checkAll}
                                            indeterminate={this.state.indeterminate}
                                            openFolder={this.openFolder}
                                            checkedItem={checkedItem.docs}
                                            folderbase={folderbase}
                                        />
                                    </div>
                                ) : null
                            }
                            {
                                videos.length ? (
                                    <div>
                                        <h2><IntlMessages id="file.video" /> <small><i>{videos.length + " "} <IntlMessages id="file.item" /></i></small></h2>
                                        <ListLargeVideo
                                            data={videos}
                                            onChangeChecked={this.onChangeChecked}
                                            checkAll={this.state.checkAll}
                                            indeterminate={this.state.indeterminate}
                                            checkedItem={checkedItem.videos}
                                            folderbase={folderbase}
                                        />
                                    </div>
                                ) : null
                            }
                            {
                                images.length ? (
                                    <div>
                                        <h2><IntlMessages id="file.image" />  <small><i>{images.length + " "}<IntlMessages id="file.item" /></i></small></h2>
                                        <ListLargeImg
                                            data={images}
                                            onChangeChecked={this.onChangeChecked}
                                            checkAll={this.state.checkAll}
                                            indeterminate={this.state.indeterminate}
                                            checkedItem={checkedItem.images}
                                            folderbase={folderbase}
                                        />
                                    </div>
                                ) : null
                            }
                        </div>
                    </RctCollapsibleCard>

                    <AddFolder
                        folderbase={folderbase}
                        open={this.state.openAddFolder}
                        onClose={this.onCloseAdd}
                        loading={this.state.loadingAdd}
                        onSave={this.submitAddFolder}
                    />
                    <UploadFile
                        folderbase={folderbase}
                        open={this.state.openUploadFile}
                        onClose={this.onCloseUpload}
                        loading={this.state.loadingUpFile}
                        onSave={this.submitFile}
                        multiple={true}
                    />
                    <InstantSearchModal
                        visible={isOpenInstantSearchModal}
                        onCancel={() => this.toggleInstanceSearch(false)}
                        onDownload={() => this.setState({ lastModifiedTimestamp: Date.now() })}
                        path={folder}
                    />
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        fileManager: state.fileManager,
        config: state.config
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getAllFile: (filter) => dispatch(getAll(filter)),
        add: (foldername, folderbase) => dispatch(add(foldername, folderbase)),
        del: (data) => dispatch(del(data)),
        upload: (file) => dispatch(upload(file)),
        uploadMultiple: (file) => dispatch(uploadMultiple(file)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FileManager));