import React from 'react';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { connect } from 'react-redux';
import { getAll } from '../../actions/FileManagerActions';
import IntlMessages from 'Util/IntlMessages';
import ListLargeDoc from '../../components/FileManager/ListLargeDoc';
import ListLargeFolder from '../../components/FileManager/ListLargeFolder';
import ListLargeImg from '../../components/FileManager/ListLargeImg';
import ListLargeVideo from '../../components/FileManager/ListLargeVideo';
import { Icon, Radio, Checkbox } from 'antd';
import { withRouter } from 'react-router-dom';
import LinkFolder from '../../components/FileManager/LinkFolder';


class ChosseFile extends React.Component {

    static defaultProps = {
        onChangeSelect: () => { },
    }

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
        folderbase: "/",
    }


    componentDidMount() {
        if (this.props.folderbase !== "/") {
            const folder = this.props.folderbase;
            this.setState({
                ...this.state,
                folderbase: folder
            }, () => this.props.getAllFile(folder).then(res => {
                let { folders, docs, videos, images } = res.data;
                let data = this.onCreateData(folders, docs, videos, images, this.state.filter);
                this.setState({
                    ...this.state,
                    data: data
                })
            }))

        }
        else {
            const folder = this.state.folderbase;
            this.props.getAllFile(folder).then(res => {
                let { folders, docs, videos, images } = res.data;
                let data = this.onCreateData(folders, docs, videos, images, this.state.filter);
                this.setState({
                    ...this.state,
                    data: data
                })
            });
        }
    }

    onCheckAll = (e) => {
        this.setState({
            ...this.state,
            checkAll: e.target.checked,
            indeterminate: false,
            checkedItem: e.target.checked ? this.state.data : { total: 0, docs: [], videos: [], images: [], folders: [] }
        }, () => this.props.onChangeSelect(this.state.checkedItem, this.state.folderbase))
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
                }, () => this.props.onChangeSelect(this.state.checkedItem, this.state.folderbase))
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
                        total: checkedItem.docs.length + checkedItem.videos.length + checkedItem.folders.length + data.length
                    }
                }, () => this.props.onChangeSelect(this.state.checkedItem, this.state.folderbase))
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
                }, () => this.props.onChangeSelect(this.state.checkedItem, this.state.folderbase))
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
                }, () => this.props.onChangeSelect(this.state.checkedItem, this.state.folderbase))
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
        this.setState({
            ...this.state,
            folderbase: item.path
        })
    }

    openFolder = (item) => {
        this.setState({
            ...this.state,
            folderbase: item.path_relative
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.folderbase !== this.state.folderbase) {
            var folder = this.state.folderbase;
            this.props.getAllFile(folder).then(res => {
                let { folders, docs, videos, images } = res.data;
                let data = this.onCreateData(folders, docs, videos, images, this.state.filter);
                this.setState({
                    ...this.state,
                    data: data
                })
            });
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


    render() {
        var { checkedItem } = this.state;
        const { folders, docs, videos, images } = this.state.data;
        const checkedTotal = this.state.checkedItem.total;
        var folderbase = this.state.folderbase;
        var dataLink = this.createDataLink(folderbase);

        return (
            <React.Fragment>
                <div style={{ marginTop: "10px", marginBottom: "5px" }}>
                    <span style={{ color: "#595959", fontWeight: "500" }}><i><Icon type="folder-open" theme="filled" /> <LinkFolder data={dataLink} onChangeFolderLink={this.onChangeFolderLink}></LinkFolder></i></span><br />
                </div>
                <div style={{ clear: "both", marginBottom: "30px" }}>
                    <span>Filter</span><br />
                    <Radio.Group defaultValue="all" size="small" buttonStyle="solid" onChange={this.onSetFilterView} name="filter">
                        <Radio.Button value="all">All</Radio.Button>
                        <Radio.Button value="folder">Folder</Radio.Button>
                        <Radio.Button value="doc">Doc</Radio.Button>
                        <Radio.Button value="video">Video</Radio.Button>
                        <Radio.Button value="image">Image</Radio.Button>
                    </Radio.Group>
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
                    {(this.state.filter === "all" || this.state.filter === "folder") ?
                        <React.Fragment>
                            <h2><IntlMessages id="file.folder" /> {folders.length ? <i>{folders.length + " item(s)"}</i> : <span style={{ color: "red" }}><i> No data</i></span>}</h2>
                            <ListLargeFolder
                                data={folders}
                                onChangeChecked={this.onChangeChecked}
                                checkAll={this.state.checkAll}
                                indeterminate={this.state.indeterminate}
                                openFolder={this.openFolder}
                                folderbase={folderbase}
                                checkedItem={checkedItem.folders}
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
                                checkedItem={checkedItem.docs}
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
                                checkedItem={checkedItem.videos}
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
                                checkedItem={checkedItem.images}
                            ></ListLargeImg>
                        </React.Fragment>
                        : null}
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
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChosseFile));