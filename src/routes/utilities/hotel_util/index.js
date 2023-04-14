import { Button, Row, Table, Tag } from "antd";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import { _addUtilHotel, _getAllUtilHotel, _deleteUtilHotel } from "../../../actions/UtiliesHotelAction";
import AvatarInTable from "../../../components/AvatarInTable";
import TableActionBar from "../../../components/TableActionBar";
import AddRoom_util from "./AddHotelUtilities";

const arrcolor = [
    "#00D0BD",
    "red",
    "green",
    "blue",
    "cyan",
    "#2db7f5",
    "purple",
];
class UtilitiesHotel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            filter: {
                sort: {
                    type: "desc",
                    attr: "",
                },
                paging: {
                    perpage: 10,
                    page: 1,
                },
                search: "",
            },
            edit: false,
            isSubmiting: false,
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,
            open: false,
            item: null,
        };
        this.columns = [
            {
                title: <IntlMessages id="global.id" />,
                dataIndex: "id",
                key: "id",
            },
            {
                title: <IntlMessages id="global.code" />,
                key: "code",
                render: (text, record) => {
                    return (
                        <Tag color={arrcolor[
                            record.type_id > arrcolor.length
                                ? record.type_id % arrcolor.length
                                : record.type_id
                        ]}>{record.code}</Tag>
                    );
                },

            },
            {
                title: <IntlMessages id="global.title" />,
                key: "name",
                render: (text, record) => {
                    return (
                        <b
                            style={{ color: "blue", cursor: "pointer" }}
                        >
                            {record.name}
                        </b>
                    );
                },
            },
            {
                title: <IntlMessages id="global.image" />,
                key: "icon",
                align: 'center',
                render: (text, record) => record.icon ? (
                    <AvatarInTable
                      src={record.icon}
                      defaul={1}
                      title={record.name}
                    ></AvatarInTable>
                  ) : (
                    <AvatarInTable
                      src={require('../../../assets/img/user.png')}
                      alt={`icon`}
                    ></AvatarInTable>
                  )
            },
            {
                title: <IntlMessages id="global.action" />,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Row>
                            <Button type="primary" size="small" className="mt-1" 
                            onClick={() => this.onCreate(true, record)}>
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
    }

    componentDidMount() {
        this.props._getAllUtilHotel();
    }

    onCreate = (edit = false, item) => {
        this.setState({
            edit,
            open: true,
            item: edit ? item : null
        });
    };

    onClose = () => {
        this.setState({
            open: false,
            item: null,
            edit: false,
            isSubmiting: false,
        });
    };

    onSave =  (data, id) => {
        this.onClose();
        this.props._addHotelUtilities(data);
      };

    onDelete = (id) => this.props._onDelete({id});

    render() {
        const { selectedRowKeys } = this.state;

        const { list } = this.props;

        const hasSelected = selectedRowKeys.length > 0;

        return (
            <React.Fragment>
                <div className="formelements-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.utilities_hotel" />}
                        match={this.props.match}
                    />
                    <div className="row">
                        <RctCollapsibleCard colClasses="col-12">
                            <TableActionBar
                                onAdd={() => this.onCreate()}
                                isShowPublishButtons={false}
                                isShowDeleteButton={false}
                                isDisabled={!hasSelected}
                                rows={this.state.selectedRowKeys}
                                isShowPublishButtons={false}
                                textSearch={false}
                                table="travellocation"
                                showFilter={false}
                                
                                justify="end"
                            >
                                {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                            </TableActionBar>
                            <Table
                                tableLayout="auto"
                                columns={this.columns}
                                dataSource={list}
                                rowKey="id"
                                size="small"

                            />
                        </RctCollapsibleCard>
                    </div>
                </div>
                <AddRoom_util
                    open={this.state.open}
                    edit={this.state.edit}
                    item={this.state.item}
                    onSave={this.onSave}
                    onClose={() => this.onClose()}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.utilitiesHotel.list,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        _getAllUtilHotel: () => dispatch(_getAllUtilHotel({ paging: 0 })),
        _addHotelUtilities: (data) => dispatch(_addUtilHotel(data)),
        _onDelete: (data) => dispatch(_deleteUtilHotel(data))
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(UtilitiesHotel)
);

