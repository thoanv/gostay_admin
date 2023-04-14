import React from 'react';
import './style.css';
import { Icon } from 'antd';

class LinkFolder extends React.Component {

    static defaultProps = {
        data: [],
        onChangeFolderLink: () => { }
    }


    showListLink(data) {
        if (data.length) {
            return data.map((item, index) => {
                if (index) return (
                    <React.Fragment key={item.name}>
                        <Icon type="right" /><span className="link-item" onClick={() => this.props.onChangeFolderLink(item)}>{item.name}</span>
                    </React.Fragment>
                )
                else return null;
            })
        }
    }


    render() {
        const data = this.props.data;
        return (
            <React.Fragment>
                <span className="link-item" onClick={() => this.props.onChangeFolderLink({name: "root", path: "/"})}>root</span>
                {this.showListLink(data)}
            </React.Fragment>
        )
    }
}

export default LinkFolder;