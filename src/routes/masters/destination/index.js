import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Table, Tabs } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { withRouter } from 'react-router-dom';
import IntlMessages from 'Util/IntlMessages';
import StatusButton from '../../../components/StatusButton';
import TableActionBar from '../../../components/TableActionBar';
import AddDestination from "./AddDestination";
import _ from 'lodash';
// actions
import { getAllCountry } from '../../../actions/CountryActions';
import { batchDelete, createDestination, getAllDestination, updateDestination, getDestinationTypes } from '../../../actions/DestinationActions';
import { getAllCurrency } from "../../../actions/CurrencyAction";

class ListDestination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                sort: {
                    type: "desc",
                    attr: ""
                },
                country_id: {
                    type: "=",
                    value: ""
                },
                search: "",
                paging: {
                    perpage: 10,
                    page: 1
                }
            },
            addDestinationState: false,
            selectedRowKeys: [],
            isSubmiting: false,
            current_destination: null,
            edit: false,
            re_render: false,
            activeTab: null,
            isLoadingTable: false
        }

    }
    async componentDidMount() {
        var types = await this.props.getDestinationTypes();
        this.props.getAllDestination({
            ...this.state.filter,
            type: {
                type: '=',
                value: types[0]
            }
        });
        this.props.getAllConuntry();

        this.setState({
            activeTab: types[0],
            filter: {
                ...this.state.filter,
                type: {
                    type: '=',
                    value: types[0]
                }
            }
        });
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    }

    onAddDestination = () => {
        this.setState({
            addDestinationState: true
        })
    }

    onEditDestination(destination) {
        this.setState({
            addDestinationState: true,
            current_destination: destination,
            edit: true
        })
    }

    onDestinationClose = () => {
        this.setState({
            addDestinationState: false,
            current_destination: null,
            isSubmiting: false,
            edit: false
        })
    }

    onRefresh() {
        this.props.getAllDestination(this.state.filter);
        this.setState({
            selectedRowKeys: []
        });
    }

    onDelete() {
        this.props.delete({ id: this.state.selectedRowKeys }).then(() => {
            this.setState({
                selectedRowKeys: []
            });
        });
    }

    getOrder(order) {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "desc";
    }

    onChangTable = (pagination, filters, sorter, extra = { currentDataSource: [] }) => {
        this.setState({
            isLoadingTable: true,
            filter: {
                ...this.state.filter,
                type: {
                    type: '=',
                    value: this.state.activeTab
                },
                sort: {
                    type: this.getOrder(sorter.order),
                    attr: sorter.columnKey
                },
                paging: {
                    perpage: pagination.pageSize,
                    page: pagination.current
                }
            }
        }, async () => {
            await this.props.getAllDestination(this.state.filter);
            this.setState({ isLoadingTable: false });
        });
    }

    onChangeTab(key) {
        this.setState({
            isLoadingTable: true,
            activeTab: key,
            filter: {
                ...this.state.filter,
                type: {
                    type: '=',
                    value: key
                },
                sort: {
                    type: "desc",
                    attr: ""
                },
            }
        }, async () => {
            await this.props.getAllDestination(this.state.filter);
            this.setState({ isLoadingTable: false });
        });
    }

    onSaveDestination = async (data, id) => {
        await this.setState({
            ...this.state,
            isSubmiting: true
        })
        if (this.state.edit) {
            var dataSubmit = { ...data, id: id }
            await this.props.updateDestination(dataSubmit).then(res => {
                if (res.data.parent_id !== 0) {
                    this.setState({
                        ...this.state,
                        isSubmiting: false,
                        addDestinationState: false,
                        current_destination: null,
                        edit: false
                    }, () => window.location.reload());
                }
                else {
                    this.setState({
                        ...this.state,
                        isSubmiting: false,
                        addDestinationState: false,
                        current_destination: null,
                        edit: false
                    });
                }
            }).catch(err => {
                this.setState({
                    ...this.state,
                    isSubmiting: false
                })
            })
        }
        else await this.props.createDestination(data).then(res => {
            if (res.data.parent_id !== 0) {
                this.setState({
                    ...this.state,
                    isSubmiting: false,
                    addDestinationState: false,
                    current_destination: null,
                    edit: false
                }, () => window.location.reload()
                )
            }
            else {
                this.setState({
                    ...this.state,
                    isSubmiting: false,
                    addDestinationState: false,
                    current_destination: null,
                    edit: false
                });
            }

        }).catch(err => {
            this.setState({
                ...this.state,
                isSubmiting: false
            })
        })
    }
    
    filter = (value, name, type) => {
        if (type === "search") {
            this.setState({
                ...this.state,
                filter: {
                    ...this.state.filter,
                    search: value
                }
            }, () => {
                this.props.getAllDestination(this.state.filter)
            })
        } else {
            this.setState({
                ...this.state,
                filter: {
                    ...this.state.filter,
                    [name]: {
                        type: "=",
                        value: value
                    }
                }
            }, () => {
                this.props.getAllDestination(this.state.filter)
            })
        }
    }


    render() {
        const { selectedRowKeys, isLoadingTable } = this.state;
        const hasSelected = selectedRowKeys.length > 0;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const { country, listDestination, types } = this.props;

        const columns = [
            {
                title: <IntlMessages id='global.status' />,
                dataIndex: "status",
                render: (text, record) => (
                    <StatusButton data_id={record.id} status={record.status} table='destination' />
                )
            },
            {
                title: <IntlMessages id='global.title' />,
                dataIndex: "title",
                key: "title",
                render: (text, record) => (
                    <Button className="p-0" type="link" onClick={() => this.onEditDestination(record)}>{record.title}</Button>
                )

            },
            {
                title: <IntlMessages id='global.country' />,
                dataIndex: "country_title",
                key: "country_title",

            },
            // {
            //     title: <IntlMessages id='global.timezone' />,
            //     dataIndex: "timezone",
            //     key: "timezone",
            // },
            // {
            //     title: <IntlMessages id='sidebar.currency' />,
            //     dataIndex: "currency_name",
            //     key: "currency_name",
            // },
            {
                title: <IntlMessages id='global.code' />,
                dataIndex: "code",
            },
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: 'id',
                key: 'id',
                sorter: true

            },

        ];
        var listDestinationParent = []
        if(this.props.listDestination && this.props.listDestination.list) {
            listDestinationParent = this.props.listDestination.list.filter(item => {
                return (
                    item.parent_id === 0
                )
            })
        }


        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.destination" />}
                        match={this.props.match}
                    />
                    <div className="row">
                        <RctCollapsibleCard colClasses="col-12">
                            <TableActionBar
                                onAdd={() => this.onAddDestination()}
                                onDelete={() => this.onDelete()}
                                onRefresh={() => this.onRefresh()}
                                isDisabled={!hasSelected}
                                rows={this.state.selectedRowKeys}
                                isShowPublishButtons={true}
                                table="destination"
                                onFilter={this.filter}
                                data={[
                                    {
                                        name: "country_id",
                                        data: country,
                                        placeholder: "Select country..."
                                    },
                                ]}
                                justify="end"
                            >
                                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                            </TableActionBar>
                            <Tabs onChange={(activeKey) => this.onChangeTab(activeKey)}>
                                {
                                    types.map(type => (
                                        <Tabs.TabPane tab={<IntlMessages id={type} />} key={type}></Tabs.TabPane>
                                    ))
                                }
                            </Tabs>
                            <Table
                                loading={isLoadingTable}
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={listDestination}
                                rowKey="id"
                                onChange={this.onChangTable}
                                size='middle'
                                pagination={{
                                    defaultPageSize: 10,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['5', '10', '20', '30'],
                                    total: this.props.paging.count
                                }}
                            />
                        </RctCollapsibleCard>
                    </div>
                </div>
                <AddDestination
                    open={this.state.addDestinationState}
                    onSaveDestination={this.onSaveDestination}
                    loading={this.state.isSubmiting}
                    edit={this.state.edit}
                    destination={this.state.current_destination}
                    onDestinationClose={this.onDestinationClose}
                    DestinationParent={listDestinationParent}
                    country={country}
                />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    console.log(state.destination.listDestination,444)
    return {
        listDestination: state.destination.listDestination.list,
        paging: state.destination.paging,
        country: state.country.listCountry,
        types: state.destination.types
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllDestination: (filter) => dispatch(getAllDestination(filter)),
        updateDestination: (data) => dispatch(updateDestination(data)),
        createDestination: (data) => dispatch(createDestination(data)),
        delete: (data) => dispatch(batchDelete(data)),
        getAllConuntry: () => dispatch(getAllCountry({ paging: 0 })),
        getDestinationTypes: () => dispatch(getDestinationTypes())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListDestination));
