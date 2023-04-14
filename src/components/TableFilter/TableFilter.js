import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Select, Row, Col, Input } from 'antd';
const { Option } = Select;
const { Search } = Input;



class TableFilter extends Component {


    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object),
        onFilter: PropTypes.func,
        open: PropTypes.bool,
        justify: PropTypes.oneOf(['start', 'end', 'center']),
    }

    static defaultProps = {
        data: [],
        onFilter: () => { },
        open: false,
        justify: "end"
    }


    constructor(props) {
        super(props);
        this.filter = React.createRef();
        this.state = {
            open: this.props.open
        }
    }

    componentDidMount() {
        if (this.props.open) {
            let modal = this.filter.current;
            modal.style.display = "block";
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.open !== prevState.open) {
            return {
                open: nextProps.open
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.open != prevState.open) {
            var modal = this.filter.current;
            if (this.state.open) {
                modal.style.display = "block";
            }
            if (!this.state.open) {
                modal.style.display = "none";
            }
        }
    }


    handleFilter = (value, name, type) => {
        this.props.onFilter(value, name, type)
    }

    /**
     * data=[{
     *          name: 'email,
     *          col: 6,
     *          placeholder: select email,
     *          value=[''],
     *          data=[{title: "lable", id: "value"}]
     *      }]
     * searchOpition={loading: bool, placeholder: "placeholder"}
     */
    createData(data) {
        if (data.length) {
            const defaultOpiton = {
                name: "name",
                col: 6,
                placeholder: "Select",
                data: [],
                type: "multiple",
            };
            return data.map(item => {
                return { ...defaultOpiton, ...item, onChange: (value) => this.handleFilter(value, item.name, "") };
            })
        }
        return [];
    }
    createElement(data) {
        var dataElement = this.createData(data);
        if (dataElement.length) {
            return dataElement.map((item, index) => {
                return (
                    <Col sm={{ span: item.col }} xs={{ span: 24 }} key={index}>
                        <Select
                            // mode={item.type}
                            placeholder={item.placeholder}
                            onChange={item.onChange}
                            style={{ width: '100%' }}
                            allowClear={true}
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            showSearch
                        >
                            {item.data.length ?
                                item.data.map((opition, i) => {
                                    return <Option key={i} value={opition.id}>{opition.title}</Option>
                                })
                                : null
                            }
                        </Select>
                    </Col>
                )
            })
        }
        return null;
    }

    render() {
        const { data, justify } = this.props;

        const style = {
            filterBody: {
                margin: "10px 10px",
                display: "none"
            }
        }
        return (
            <div style={style.filterBody} ref={this.filter}>
                <Row type="flex" justify={justify} gutter={8}>
                    {this.createElement(data)}
                </Row>
            </div>
        )
    }
}

export default TableFilter;