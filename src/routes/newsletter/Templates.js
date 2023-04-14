import React from 'react';
import { connect } from 'react-redux';
import { Card, Checkbox } from 'antd';
import { getListTemplates } from '../../actions/NewsletterAction';

const { Meta } = Card;



class Templates extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            template: null
        }
    }
    componentDidMount() {
        this.props.getListTemplates();
    }

    render() {
        let { templates } = this.props.newsletter
        return (
            <React.Fragment>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                    {
                       templates && templates.length ? templates.map(_ => (
                            <div style={{ display: "flex", flexDirection: "row", flexWrap: 'wrap' }} className='mr-4 mb-4' key={_.id}>
                                <span style={{ display: "flex", flexDirection: "column", alignItems: 'center', position: "relative" }} className='mr-4'>
                                    <Checkbox onChange={() => {
                                        this.setState({
                                            template: _.id
                                        })
                                        this.props.onChange(_.id)
                                    }}
                                        style={{ position: "absolute", top: "20px", right: "10px", zIndex: 1000 }}
                                        checked={_.id === this.state.template}

                                    ></Checkbox>
                                    <Card
                                        onClick={() => window.open(_.thumbnail, "_blank")}
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt={_.name} src={_.thumbnail} />}
                                    >
                                        <Meta title={_.name} description="" />
                                    </Card>

                                </span>
                            </div>
                        ))
                        : null
                    }
                </div>
            </React.Fragment >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        newsletter: state.newsletter
    }
}
export default connect(mapStateToProps, { getListTemplates })(Templates)