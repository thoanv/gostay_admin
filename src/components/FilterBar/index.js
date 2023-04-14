import React, { Component } from "react";
import { Input, Col, Row, Select } from "antd";
import PropTypes from "prop-types";

const { Search } = Input;
const { Option } = Select;

class FilterBar extends Component {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object),
        textSearch: PropTypes.bool,
        onFilter: PropTypes.func,
        searchOpition: PropTypes.object,
        justify: PropTypes.oneOf(["start", "end", "center", "space-between"]),
        showActionBar: PropTypes.bool,
        colTextSearch: PropTypes.number,
        textSearchPlaceholder: PropTypes.string
    };

    static defaultProps = {
        data: [],
        onFilter: () => { },
        textSearch: true,
        searchOpition: {},
        justify: "start",
        showActionBar: true,
        colTextSearch: 6,
        textSearchPlaceholder: "Tìm kiếm..."
    };


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
                return { ...defaultOpiton, ...item, onChange: (value) => this.props.onFilter(value, item.name, "") };
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
                            showSearch
                            placeholder={item.placeholder}
                            onChange={item.onChange}
                            style={{ width: '100%' }}
                            allowClear={true}
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
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

        const {
            onFilter,
            searchOpition,
            textSearch,
            data,
            colTextSearch,
            children,
            justify,
            textSearchPlaceholder
        } = this.props;

        return (
            <Row type="flex" gutter={[16, 24]} justify={justify}>

                <Col sm={{ span: colTextSearch }} xs={{ span: 24 }}>
                    {textSearch ? (
                        <Search
                            name="search"
                            className="txtSearch"
                            placeholder={textSearchPlaceholder}
                            allowClear
                            onChange={e =>
                                this.props.onFilter(e.target.value, e.target.name, "search")
                            }
                            style={{ width: "100%" }}
                            {...searchOpition}
                        />
                    ) : null}
                </Col>
                {this.createElement(data)}
                {children}
            </Row>

        );
    }
}

export default FilterBar;
