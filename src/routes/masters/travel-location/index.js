import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Button, Row, Table} from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { withRouter } from 'react-router-dom';
import IntlMessages from 'Util/IntlMessages';
import StatusButton from '../../../components/StatusButton';
import TableActionBar from '../../../components/TableActionBar';
import AddTravelLocation from "./AddTravelLocation";
import _ from 'lodash';
// actions
import {
    createTravelLocation,
    deleteTravelLocation,
    getAllTravelLocation,
    updateTravelLocation
} from '../../../actions/TravelLocationActions';
import AvatarInTable from "Components/AvatarInTable";

class ListTravelLocation extends Component {
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
            addTravelLocationState: false,
            selectedRowKeys: [],
            isSubmiting: false,
            current_travellocation: null,
            edit: false,
            re_render: false,
            activeTab: null,
            isLoadingTable: false
        }

    }
    async componentDidMount() {
        this.props.getAllTravelLocation({
            ...this.state.filter,
            type: {
                type: '='
            }
        });

        this.setState({
            filter: {
                ...this.state.filter
            }
        });
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    }

    onAddTravelLocation = (edit = false, item) => {
        this.setState({
            edit,
            addTravelLocationState: true,
            item: edit ? item : null
        })
    }

    onTravelLocationClose = () => {
        this.setState({
            addTravelLocationState: false,
            current_travellocation: null,
            isSubmiting: false,
            edit: false
        })
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
            await this.props.getAllTravelLocation(this.state.filter);
            this.setState({ isLoadingTable: false });
        });
    }

    onSaveTravelLocation = async (data, id) => {
        await this.setState({
            ...this.state,
            isSubmiting: true
        })

        if(id) {

            await this.props.updateTravelLocation(data,id).then(res => {
                if (res.data.parent_id !== 0) {
                    this.setState({
                            ...this.state,
                            isSubmiting: false,
                            addTravelLocationState: false,
                            current_travellocation: null,
                            edit: false
                        }, () => window.location.reload()
                    )
                }
                else {
                    this.setState({
                        ...this.state,
                        isSubmiting: false,
                        addTravelLocationState: false,
                        current_travellocation: null,
                        edit: false
                    });
                }

            }).catch(err => {
                this.setState({
                    ...this.state,
                    isSubmiting: false
                })
            })
        } else {
            await this.props.createTravelLocation(data).then(res => {
                if (res.data.parent_id !== 0) {
                    this.setState({
                            ...this.state,
                            isSubmiting: false,
                            addTravelLocationState: false,
                            current_travellocation: null,
                            edit: false
                        }, () => window.location.reload()
                    )
                }
                else {
                    this.setState({
                        ...this.state,
                        isSubmiting: false,
                        addTravelLocationState: false,
                        current_travellocation: null,
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

    }
    onDelete = (id) => {
        this.props._onDelete({id}) ;
        setTimeout( () => {window.location.reload();},200 )

    }
    render() {
        const { selectedRowKeys, isLoadingTable } = this.state;
        const hasSelected = selectedRowKeys.length > 0;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const { country, listTravelLocation, currency, types } = this.props;

        const columns = [
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: 'id',
                key: 'id',
                sorter: true

            },
            {
                title: <IntlMessages id='global.title' />,
                dataIndex: "title",
                key: "title",
                render: (text, record) => (
                    <p>{record.name}</p>
                )
            },
            {
                title: <IntlMessages id='global.code' />,
                dataIndex: "code",
            },
            {
                title: 'Sân bay',
                dataIndex: "airport_name",
            },
            {
                title: <IntlMessages id='global.avatar' />,
                render: (text, record, index) => {
                    return (
                        <AvatarInTable
                            src={record.avatar}
                            title={
                                record.name
                                    ? `${record.name}${record.code}`
                                    : `user`
                            }
                            alt={`${record.name} ${record.code}`}
                        ></AvatarInTable>

                    )
                }
            },

            {
                title: <IntlMessages id="global.action" />,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Row>
                                <Button type="primary" size="small" className="mt-1"
                                        onClick={() => this.onAddTravelLocation(true, record)}>
                                    Chỉnh Sửa
                                </Button>
                            </Row>
                            <Row>
                                <Button type="danger" size="small" className="mt-1"
                                        onClick={() => this.onDelete(record.id)}>
                                    Xóa
                                </Button>
                            </Row>
                        </div>

                    )
                }
            }

        ];

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.travel_point" />}
                        match={this.props.match}
                    />
                    <div className="row">
                        <RctCollapsibleCard colClasses="col-12">
                            <TableActionBar
                                onAdd={() => this.onAddTravelLocation(false,null)}
                                isShowPublishButtons={false}
                                isShowDeleteButton={false}
                                isDisabled={!hasSelected}
                                rows={this.state.selectedRowKeys}
                                isShowPublishButtons={false}
                                textSearch={false}
                                table="travellocation"
                                showFilter={false}
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
                            <Table
                                loading={isLoadingTable}
                                columns={columns}
                                dataSource={listTravelLocation}
                                rowKey="id"
                                onChange={this.onChangTable}
                                size='middle'
                                // pagination={{
                                //     defaultPageSize: 10,
                                //     showSizeChanger: true,
                                //     pageSizeOptions: ['5', '10', '20', '30'],
                                //     total: this.props.paging.count
                                // }}
                            />
                        </RctCollapsibleCard>
                    </div>
                </div>
                <AddTravelLocation
                    open={this.state.addTravelLocationState}
                    onSaveTravelLocation={this.onSaveTravelLocation}
                    loading={this.state.isSubmiting}
                    edit={this.state.edit}
                    travellocation={this.state.item}
                    onTravelLocationClose={this.onTravelLocationClose}
                />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        listTravelLocation: state.travellocation.listTravelLocation,
        paging: state.travellocation.paging,
        country: state.country.listCountry,
        currency: state.currency.listCurrency,
        types: state.travellocation.types
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllTravelLocation: (filter) => dispatch(getAllTravelLocation(filter)),
        createTravelLocation: (data) => dispatch(createTravelLocation(data)),
        updateTravelLocation: (data,id) => dispatch(updateTravelLocation(data,id)),
        _onDelete: (data) => dispatch(deleteTravelLocation(data))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListTravelLocation));
