import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import IntlMessages from 'Util/IntlMessages';
import { changeStatus, publish, unpublish } from '../../actions/CommonActions';
import StatusButton from '../../components/StatusButton';
import TableActionBar from '../../components/TableActionBar';
import config from '../../../config';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { Table, Tag, Button } from 'antd';
import AddWidget from './AddWidget';
// actions
import { getAllWidgets, getAllTradeMark,getWidgetDetail, addWidget, deleteWidget, updateWidget, getAllCombo, getAllHotel, getAllVoucher, getAllTour, getAllBlog } from '../../actions/WidgetActions';

class Widgets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                sort: {
                    type: "desc",
                    attr: ""
                },
                // search: "",
                paging: {
                    perpage: 10,
                    page: 1
                }
            },
            selectedRowKeys: [],
            addWidget: false,
            isLoadingSubmit: false,
            currentWidget: null,
            edit: false
        }
    }

    componentDidMount() {
        this.props.getAllWidgets(this.state.filter);
        this.props.getAllCombo();
        this.props.getAllTour();
        this.props.getAllHotel();
        this.props.getAllVoucher();
        this.props.getAllTradeMark();
        this.props.getAllBlog();
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };

    onRefresh() {
        this.props.getAllWidgets(this.state.filter);
        this.setState({
            selectedRowKeys: []
        })
    }

    onDelete() {
        this.props.deleteWidget({ id: this.state.selectedRowKeys }).then(() => {
            this.setState({
                selectedRowKeys: []
            })
        })
    }

    onChangPage(page, pageSize) {
        this.setState({
            ...this.state,
            filter: {
                ...this.state.filter,
                paging: {
                    perpage: pageSize,
                    page: page
                }
            }
        }, () => {
            this.props.getAllWidgets(this.state.filter);
        });
    }

    onChangePerpage(current, size) {
        this.setState({
            ...this.state,
            filter: {
                ...this.state.filter,
                paging: {
                    perpage: size,
                    page: current
                }
            }
        }, () => {
            this.props.getAllWidgets(this.state.filter);
        });
    }

    filter = (value, name, type) => {
        if (type === "search") {
            this.setState({
                ...this.state,
                filter: {
                    ...this.state.filter,
                    search: value
                }
            }, () => this.props.getAllWidgets(this.state.filter))

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
            }, () => this.props.getAllWidgets(this.state.filter))
        }
    }

    onAddWidget = (item = null) => {
        if (item) {
            this.setState({
                currentWidget: item,
                addWidget: true
            })
        } else {
            this.setState({
                addWidget: true
            })
        }

    }

    onClose = () => {
        this.setState({
            addWidget: false,
            currentWidget: null
        })
    }

    onSubmit(data) {
        this.setState({ isLoadingSubmit: true });
        if (this.state.currentWidget) {
            this.props.updateWidget({
                ...data,
                id: this.state.currentWidget.id
            }).then(() => {
                setTimeout(() => {
                    this.setState({ isLoadingSubmit: false, addWidget: false, currentWidget: null });
                }, 500);
            })
        } else {
            this.props.addWidget(data).then(() => {
                setTimeout(() => {
                    this.setState({ isLoadingSubmit: false, addWidget: false, currentWidget: null });
                }, 500);
            })
        }
    }

    render() {
        var { widgets, paging } = this.props;
        const { selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

        const columns = [
            {
                title: <IntlMessages id='global.title' />,
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => (
                    <Button type="link" className="p-0" onClick={() => this.onAddWidget(record)}>{record.title}</Button>
                )
            },
            {
                title: <IntlMessages id='global.status' />,
                dataIndex: 'status',
                render: (text, record) => (
                    <StatusButton data_id={record.id} status={record.status} table='widgets' />
                )
            },
            {
                title: <IntlMessages id='global.code' />,
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: <IntlMessages id='global.type' />,
                dataIndex: 'type',
                key: 'type',
                render: type => {
                    if (type == 'STAY') return <Tag color='magenta'><IntlMessages id='global.stay' /></Tag>
                    if (type == 'DESTINATION') return <Tag color='green'><IntlMessages id='global.destination' /></Tag>
                    if (type == 'CAR') return <Tag color='#2db7f5'><IntlMessages id='global.car' /></Tag>
                    return <Tag color='blue'><IntlMessages id='global.custom' /></Tag>
                }
            },
        ];

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.widgets" />}
                        match={this.props.match}
                    />
                    <div className="row">
                        <RctCollapsibleCard colClasses='col-12'>
                            <TableActionBar
                                onAdd={() => this.onAddWidget()}
                                onDelete={() => this.onDelete()}
                                onRefresh={() => this.onRefresh()}
                                isDisabled={!hasSelected}
                                rows={this.state.selectedRowKeys}
                                isShowPublishButtons={true}
                                table='widgets'
                                showFilter={false}
                                onFilter={this.filter}
                            >
                                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                            </TableActionBar>
                            <Table
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={widgets}
                                tableLayout="auto"
                                rowKey="id"
                                pagination={{
                                    pageSizeOptions: ['10', '15', '20', '50'],
                                    total: paging.count,
                                    onChange: (page, pageSize) => this.onChangPage(page, pageSize),
                                    showSizeChanger: true,
                                    onShowSizeChange: (current, size) => this.onChangePerpage(current, size)

                                }}
                            // onChange={this.onChangeTable}
                            />

                        </RctCollapsibleCard>
                    </div>
                </div>
                <AddWidget
                    open={this.state.addWidget}
                    onSave={(data) => this.onSubmit(data)}
                    loading={this.state.isLoadingSubmit}
                    widget={this.state.currentWidget}
                    onClose={this.onClose}
                // destinations={destinations}
                // tours={tours}
                />
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        widgets: state.widget.widgets,
        paging: state.widget.paging,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllWidgets: (query) => dispatch(getAllWidgets(query)),
        getWidgetDetail: (id) => dispatch(getWidgetDetail(id)),
        addWidget: (data) => dispatch(addWidget(data)),
        updateWidget: (data) => dispatch(updateWidget(data)),
        deleteWidget: (data) => dispatch(deleteWidget(data)),
        getAllCombo:() => dispatch(getAllCombo()),
        getAllTour:() => dispatch(getAllTour()),
        getAllHotel:() => dispatch(getAllHotel()),
        getAllVoucher:() => dispatch(getAllVoucher()),
        getAllTradeMark:() => dispatch(getAllTradeMark()),
        getAllBlog:() => dispatch(getAllBlog())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Widgets));
