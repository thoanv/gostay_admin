import React, { Component } from 'react'
// import TextTruncate from 'react-text-truncate';
import Truncate from 'react-truncate';
import IntlMessages from "Util/IntlMessages";

export default class ReadMoreText extends Component {
    state = {
        isShowFull: false
    }

    render() {
        var { text } = this.props;
        var { isShowFull } = this.state;

        return (
            <div>
                {
                    isShowFull ? (
                        <span>{text}</span>
                    ) : (
                            // <TextTruncate
                            //     line={2}
                            //     text={text}
                            //     element="span"
                            //     truncateText="..."
                            //     textTruncateChild={
                            //         <a href="#" onClick={() => this.setState({isShowFull: true})}>
                            //             <IntlMessages id="global.read_more" />
                            //         </a>
                            //     }
                            // />
                            <Truncate 
                            lines={3} 
                            ellipsis={<span>... <a className="readmore_btn" onClick={() => this.setState({isShowFull: true})}><IntlMessages id="global.read_more" /></a></span>}>
                                {text}
                            </Truncate>
                        )
                }
            </div>
        )
    }
}
