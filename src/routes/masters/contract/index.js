// import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
// import IntlMessages from 'Util/IntlMessages';
// import { Table, Modal, message, Button, Avatar, Rate, Tag } from 'antd';
// import TableActionBar from '../../../components/TableActionBar';
// import StatusButton from '../../../components/StatusButton';
// import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
// import { getAllContract, addContract, updateContract, deleteContract } from '../../../actions/ContractActions';
// import AddContract from './AddContract';

// class ListContract extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             filter: {
//                 sort: {
//                     type: "desc",
//                     attr: ""
//                 },
//                 created_at: {
//                     type: "compare",
//                     value: {
//                         from: "",
//                         to: ""
//                     }
//                 },
//                 title: {
//                     type: "like",
//                     value: ""
//                 },
//                 alias: {
//                     type: "=",
//                     value: []
//                 },
//                 search: "",
//                 paging: {
//                     perpage: 10,
//                     page: 1
//                 }
//             },
//             addContractState: false,
//             current_contract: null,
//             selectedRowKeys: [],
//             isSubmiting: false,
//             edit: false,
//         }
//     }

//     componentDidMount() {
//         this.props.getAllContract(this.state.filter)

//     }


//     filter = (value, name, type) => {
//         console.log(value)
//         if (type === "search") {
//             this.setState({
//                 ...this.state,
//                 filter: {
//                     ...this.state.filter,
//                     search: value
//                 }
//             }, () => this.props.getAllContract(this.state.filter))
//         }
//         else
//             this.setState({
//                 ...this.state,
//                 filter: {
//                     ...this.state.filter,
//                     [name]: {
//                         type: "=",
//                         value: value
//                     }
//                 }
//             }, () => this.props.getAllContract(this.state.filter))
//     }

//     onSelectChange = selectedRowKeys => {
//         this.setState({ selectedRowKeys });
//     };


//     onAddContract = () => {
//         this.setState({ addContractState: true });
//     };
//     onEditContract(contract) {
//         this.setState({ addContractState: true, current_contract: contract, edit: true });
//     };
//     onContractClose = () => {
//         this.setState({ addContractState: false, current_contract: null, isSubmiting: false, edit: false });
//     };

//     onSaveContract = async (data, id) => {
//         await this.setState({
//             ...this.state,
//             isSubmiting: true
//         })
//         if (this.state.edit) {
//             var dataSubmit = { ...data, id: id }
//             await this.props.updateContract(dataSubmit).then(res => {
//                 this.setState({
//                     ...this.state,
//                     isSubmiting: false,
//                     addContractState: false,
//                     current_contract: null,
//                     edit: false
//                 })
//             }).catch(err => {
//                 this.setState({
//                     ...this.state,
//                     isSubmiting: false,

//                 })
//             });
//         }
//         else await this.props.createContract(data).then(res => {
//             this.setState({
//                 ...this.state,
//                 isSubmiting: false,
//                 addContractState: false,
//                 current_contract: null,
//                 edit: false
//             })
//         }).catch(err => {
//             this.setState({
//                 ...this.state,
//                 isSubmiting: false,

//             })
//         });
//     };

//     onDelete() {
//         this.props.deleteContract({ id: this.state.selectedRowKeys }).then(res => {
//             this.setState({
//                 ...this.state,
//                 selectedRowKeys: []
//             })
//         })
//     }

//     getOrder(order) {
//         if (order === "ascend") return "asc";
//         if (order === "descend") return "desc";
//         return "";
//     }

//     onChangTable = (pagination, filters, sorter, extra = { currentDataSource: [] }) => {
//         this.setState({
//             ...this.state,
//             filter: {
//                 ...this.state.filter,
//                 sort: {
//                     type: this.getOrder(sorter.order),
//                     attr: sorter.columnKey
//                 },
//                 paging: {
//                     perpage: pagination.pageSize,
//                     page: pagination.current
//                 }
//             }
//         }, () => this.props.getAllContract(this.state.filter))

//     }


//     render() {
       
        
//         const columns = [
//             {
//                 title: <IntlMessages id='global.status' />,
//                 dataIndex: 'status',
//                 render: (text, record) => (
//                     <StatusButton data_id={record.id} status={record.status} table='contract' />
//                 )
//             },
//             {
//                 title: <IntlMessages id='global.name' />,
//                 dataIndex: 'contact_name',
//                 key: 'contact_name',
//                 render:(text,record)=>(
//                     <b style={{ color: "#1890ff", cursor: "pointer" }} onClick={() => this.onEditContract(record)}>{record.contact_name}</b>
//                 ),
//                 sorter: true
//             },
//             {
//                 title: <IntlMessages id='contract.checkin' />,
//                 dataIndex: 'checkin',
//                 key: 'checkin',
//                 render:(text,record)=>(
//                     <div>
//                     {record.checkin === "TRUE" ? (
//                         <Tag color="green">
//                             <IntlMessages id="global.yes" />
//                         </Tag>
//                     ) : (
//                             <Tag color="red">
//                                 <IntlMessages id="global.no" />
//                             </Tag>
//                         )}
//                 </div>
//                 )

//             },
//             {
//                 title: <IntlMessages id='contract.checkout' />,
//                 dataIndex: 'checkout',
//                 key: 'checkout',
//                 render:(text,record)=>(
//                     <div>
//                     {record.checkout === "TRUE" ? (
//                         <Tag color="green">
//                             <IntlMessages id="global.yes" />
//                         </Tag>
//                     ) : (
//                             <Tag color="red">
//                                 <IntlMessages id="global.no" />
//                             </Tag>
//                         )}
//                 </div>
//                 )

//             },
//             {
//                 title: <IntlMessages id='global.address' />,
//                 dataIndex: 'address',
//                 key: 'address',
            
//             },
//             {
//                 title: <IntlMessages id="review.rank" />,
//                 dataIndex: "rank",
//                 key: "rank",
//                 render:(text,record)=>(
//                     <span>
//                     <Rate disabled value={record.rank} />
//                 </span>
//                 ),
//                 sorter: true
//             },
//             {
//                 title: <IntlMessages id='global.id' />,
//                 dataIndex: 'id',
//                 key: 'id',
//                 sorter:true
//             }
//         ];

//         const { selectedRowKeys } = this.state;

//         const rowSelection = {
//             selectedRowKeys,
//             onChange: this.onSelectChange,
//         };

//         const { listContract, paging } = this.props;
      
//         const hasSelected = selectedRowKeys.length > 0;

//         return (
//             <React.Fragment>
//                 <div className="formelements-wrapper">
//                     <PageTitleBar
//                         title={<IntlMessages id="sidebar.contract" />}
//                         match={this.props.match}
//                     />
//                     <div className="row">

//                         <RctCollapsibleCard colClasses='col-12'>
//                             <TableActionBar
//                                 onAdd={() => this.onAddContract()}
//                                 onDelete={() => this.onDelete()}
//                                 onRefresh={() => this.onRefresh()}
//                                 isDisabled={!hasSelected}
//                                 rows={this.state.selectedRowKeys}
//                                 table='contract'
//                                 isShowPublishButtons={true}
//                                 onFilter={this.filter}
//                             >
//                                 <span style={{ marginLeft: 8 }}>
//                                     {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
//                                 </span>
//                             </TableActionBar>

//                             <Table
//                                 rowSelection={rowSelection}
//                                 columns={columns}
//                                 dataSource={listContract}
//                                 tableLayout="auto"
//                                 rowKey="id"
//                                 pagination={{
//                                     pageSizeOptions: ['5', '10', '20', '50'],
//                                     total: paging.count,
//                                     showSizeChanger: true,
//                                 }}
                               
//                                 onChange={this.onChangTable}
//                             />
//                         </RctCollapsibleCard>
//                     </div>
//                 </div>
//                 <AddContract
//                     open={this.state.addContractState}
//                     onSaveContract={this.onSaveContract}
//                     onContractClose={this.onContractClose}
//                     loading={this.state.isSubmiting}
//                     edit={this.state.edit}
//                     contract={this.state.current_contract}
//                 />
//             </React.Fragment>
//         );
//     }
// }
// const mapStateToProps = (state) => {
//     return {
//         listContract: state.contract.listContract,
//         paging: state.contract.paging
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         getAllContract: (filter) => dispatch(getAllContract(filter)),
//         createContract: (data) => dispatch(addContract(data)),
//         updateContract: (data) => dispatch(updateContract(data)),
//         deleteContract: (data) => dispatch(deleteContract(data))
//     }
// }
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListContract));