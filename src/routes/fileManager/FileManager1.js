import React from 'react';
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
import { getAll, add, del, upload } from '../../actions/FileManagerActions';

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
        downloadInstantTimestamp: null // variable show that image just downloaded instantly and need to refresh current folder
    }


    componentDidMount() {
        const folder = qs.parse(this.props.location.search).folder;
        if (folder === undefined || folder === "" || folder === "/") this.props.getAllFile("/").then(res => {
            let { folders, docs, videos, images } = res.data;
            let data = this.onCreateData(folders, docs, videos, images, this.state.filter);
            this.setState({
                ...this.state,
                data: data
            })
        });
        else this.props.getAllFile(folder).then(res => {
            let { folders, docs, videos, images } = res.data;
            let data = this.onCreateData(folders, docs, videos, images, this.state.filter);
            this.setState({
                ...this.state,
                data: data
            })
        });
    }

    onCheckAll = (e) => {
        this.setState({
            ...this.state,
            checkAll: e.target.checked,
            indeterminate: false,
            checkedItem: e.target.checked ? this.state.data : { total: 0, docs: [], videos: [], images: [], folders: [] }
        })
    }

    onSetFilterView = (e) => {
        const { folders, docs, videos, images } = this.props.fileManager;
        if (e.target.name === "filter") {
            let data = this.onCreateData(folders, docs, videos, images, e.target.value);
            this.setState({
                ...this.state,
                data: data,
                [e.target.name]: e.target.value
            })
        }
        else this.setState({
            ...this.state,
            data: this.onCreateData(folders, docs, videos, images, "all"),
            [e.target.name]: e.target.value
        })
    }

    onCreateData(folders = [], docs = [], videos = [], images = [], type = "all") {
        var data = [];
        switch (type) {
            case "all": {
                data = {
                    total: folders.length + docs.length + videos.length + images.length,
                    docs: [...docs],
                    folders: [...folders],
                    videos: [...videos],
                    images: [...images]
                };
                return data;
            }
            case "doc": {
                data = {
                    total: docs.length,
                    docs: [...docs],
                    folders: [],
                    videos: [],
                    images: []
                };
                return data;
            }
            case "video": {
                data = {
                    total: videos.length,
                    docs: [],
                    folders: [],
                    videos: [...videos],
                    images: []
                };
                return data;
            }
            case "image": {
                data = {
                    total: images.length,
                    docs: [],
                    folders: [],
                    videos: [],
                    images: [...images]
                };
                return data;
            }
            case "folder": {
                data = {
                    total: folders.length,
                    docs: [],
                    folders: [...folders],
                    videos: [],
                    images: []
                };
                return data;
            }
            default: return data;
        }
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
        for (let i = 1; i < arrQ.length; i++) {
            let str = "";
            if (i === 1) str = "/" + arrQ[1];
            else str = data[i - 1].path + "/" + arrQ[i];
            data.push({ name: arrQ[i], path: str });
        }
        return data;
    }

    onChangeFolderLink = (item) => {
        this.props.history.push({
            pathname: '/app/file-manager',
            search: `?&folder=${item.path}`
        });
    }

    openFolder = (item) => {
        this.props.history.push({
            pathname: '/app/file-manager',
            search: `?&folder=${item.path_relative}`
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.search !== this.props.location.search || prevState.downloadInstantTimestamp !== this.state.downloadInstantTimestamp) {
            setTimeout(() => {
                var folder = qs.parse(this.props.location.search).folder;
                if (folder === undefined || folder === "" || folder === "/") this.props.getAllFile("/").then(res => {
                    let { folders, docs, videos, images } = res.data;
                    let data = this.onCreateData(folders, docs, videos, images, this.state.filter);
                    this.setState({
                        ...this.state,
                        data: data
                    })
                });
                else this.props.getAllFile(folder).then(res => {
                    let { folders, docs, videos, images } = res.data;
                    let data = this.onCreateData(folders, docs, videos, images, this.state.filter);
                    this.setState({
                        ...this.state,
                        data: data
                    })
                });
            }, 1000);
        }
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
        this.setState({
            ...this.state,
            loadingAdd: true
        })
        this.props.add(folder.foldername, folder.folderbase).then(res => {
            this.setState({
                ...this.state,
                loadingAdd: false
            }, () => window.location.reload())
        })
            .catch(err => {
                this.setState({
                    ...this.state,
                    loadingAdd: false
                })
            })
    }

    onDelete() {
        let queryString = qs.parse(this.props.location.search).folder;
        let folderbase = "/";
        if (queryString !== undefined || queryString !== "" || queryString !== "/") folderbase = queryString;
        let checkedItem = this.state.checkedItem;
        let arr = checkedItem.folders.concat(checkedItem.images).concat(checkedItem.docs).concat(checkedItem.videos);
        let arrName = arr.map(item => item.name);
        let data = {
            rm: arrName,
            folder: folderbase
        }
        this.props.del(data);
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

    submitFile = (file) => {
        this.setState({
            ...this.state,
            loadingUpFile: true
        })
        this.props.upload(file).then(res => {
            this.setState({
                ...this.setState,
                loadingUpFile: false,
                openUploadFile: false
            }, () => window.location.reload())
        })
            .catch(err => {
                this.setState({
                    ...this.state,
                    loadingUpFile: false
                })
            })
    }

    toggleInstanceSearch(visible) {
        let folder = null;
        if (visible) folder = qs.parse(this.props.location.search).folder;

        this.setState({ isOpenInstantSearchModal: visible, folder: folder });
    }

    render() {
        var { isOpenInstantSearchModal, folder, downloadInstantTimestamp } = this.state;
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
                                <Button type="primary" onClick={() => this.onOpenUpload()}  >
                                    <Icon type="upload" /> <IntlMessages id="global.upload" />
                                </Button>
                                <Button type="primary" onClick={() => this.onOpenAdd()}  >
                                    <Icon type="folder-add" /> <IntlMessages id="global.create-new-folder" />
                                </Button>
                                <Button type="primary" onClick={() => { }} disabled={this.state.checkedItem.total === 0} >
                                    <Icon type="download" /> <IntlMessages id="global.download" />
                                </Button>
                                <Button type="default" onClick={() => this.toggleInstanceSearch(true)} >
                                    <Icon type="search" /> <IntlMessages id="file.instant_search" />
                                </Button>
                                <Button type="danger" onClick={() => this.openAlert()} disabled={this.state.checkedItem.total === 0} >
                                    <Icon type="close" /> <IntlMessages id="global.delete" />
                                </Button>
                            </React.Fragment>
                            <div style={{ float: "right" }}>
                                <Radio.Group defaultValue="thumbnail" buttonStyle="solid" name="view" onChange={this.onSetFilterView}>
                                    <Radio.Button value="thumbnail"><b><Icon type="appstore" /> Thumbnail View</b></Radio.Button>
                                    <Radio.Button value="detail"><b><Icon type="unordered-list" /> Detail View</b></Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        <div style={{ marginTop: "10px", marginBottom: "5px" }}>
                            <span style={{ color: "#595959", fontWeight: "500" }}><i><Icon type="folder-open" theme="filled" /> <LinkFolder data={dataLink} onChangeFolderLink={this.onChangeFolderLink}></LinkFolder></i></span><br />
                        </div>
                        <div className="d-flex justify-content-between" style={{ clear: "both", marginBottom: "30px" }}>
                            <div>
                                <span>Filter</span><br />
                                <Radio.Group defaultValue="all" size="small" buttonStyle="solid" onChange={this.onSetFilterView} name="filter">
                                    <Radio.Button value="all">All</Radio.Button>
                                    <Radio.Button value="folder">Folder</Radio.Button>
                                    <Radio.Button value="doc">Doc</Radio.Button>
                                    <Radio.Button value="video">Video</Radio.Button>
                                    <Radio.Button value="image">Image</Radio.Button>
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
                                <b>Check All Items</b>
                            </Checkbox> <span>{checkedTotal ? checkedTotal + " item(s) checked" : null} </span>
                        </div>
                        <div>
                            {(this.state.filter === "all" || this.state.filter === "folder") ?
                                <React.Fragment>
                                    <h2>Folder {folders.length ? <i>{folders.length + " item(s)"}</i> : <span style={{ color: "red" }}><i> No data</i></span>}</h2>
                                    <ListLargeFolder
                                        data={folders}
                                        onChangeChecked={this.onChangeChecked}
                                        checkAll={this.state.checkAll}
                                        indeterminate={this.state.indeterminate}
                                        openFolder={this.openFolder}
                                        folderbase={folderbase}
                                    ></ListLargeFolder><br />
                                </React.Fragment>
                                : null}

                            {(this.state.filter === "all" || this.state.filter === "doc") ?
                                <React.Fragment>
                                    <h2>Doc  {docs.length ? <i>{docs.length + " item(s)"}</i> : <span style={{ color: "red" }}><i> No data</i></span>}</h2>
                                    <ListLargeDoc
                                        data={docs}
                                        onChangeChecked={this.onChangeChecked}
                                        checkAll={this.state.checkAll}
                                        indeterminate={this.state.indeterminate}
                                        folderbase={folderbase}
                                    ></ListLargeDoc><br />
                                </React.Fragment>
                                : null}


                            {(this.state.filter === "all" || this.state.filter === "video") ?
                                <React.Fragment>
                                    <h2>Video  {videos.length ? <i>{videos.length + " item(s)"}</i> : <span style={{ color: "red" }}><i> No data</i></span>}</h2>
                                    <ListLargeVideo
                                        data={videos}
                                        onChangeChecked={this.onChangeChecked}
                                        checkAll={this.state.checkAll}
                                        indeterminate={this.state.indeterminate}
                                        folderbase={folderbase}
                                    ></ListLargeVideo><br />
                                </React.Fragment>
                                : null}


                            {(this.state.filter === "all" || this.state.filter === "image") ?
                                <React.Fragment>
                                    <h2>Image  {images.length ? <i>{images.length + " item(s)"}</i> : <span style={{ color: "red" }}><i> No data</i></span>}</h2>
                                    <ListLargeImg
                                        data={images}
                                        onChangeChecked={this.onChangeChecked}
                                        checkAll={this.state.checkAll}
                                        indeterminate={this.state.indeterminate}
                                        folderbase={folderbase}
                                    ></ListLargeImg>
                                </React.Fragment>
                                : null}
                        </div>
                    </RctCollapsibleCard>

                    <AddFolder
                        folderbase={folderbase}
                        open={this.state.openAddFolder}
                        onClose={this.onCloseAdd}
                        loading={this.state.loadingAdd}
                        onSave={this.submitAddFolder}
                    ></AddFolder>

                    <UploadFile
                        folderbase={folderbase}
                        open={this.state.openUploadFile}
                        onClose={this.onCloseUpload}
                        loading={this.state.loadingUpFile}
                        onSave={this.submitFile}
                    ></UploadFile>

                    <InstantSearchModal
                        visible={isOpenInstantSearchModal}
                        onCancel={() => this.toggleInstanceSearch(false)}
                        onDownload={() => this.setState({ downloadInstantTimestamp: Date.now() })}
                        path={folder}
                    />
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        fileManager: state.fileManager
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getAllFile: (filter) => dispatch(getAll(filter)),
        add: (foldername, folderbase) => dispatch(add(foldername, folderbase)),
        del: (data) => dispatch(del(data)),
        upload: (file) => dispatch(upload(file))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FileManager));