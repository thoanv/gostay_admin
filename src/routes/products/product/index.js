import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { listProduct } from '../../../actions/ProductAction';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import IntlMessages from 'Util/IntlMessages';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        search: '',
        paging: {
          perpage: 10,
          page: 1
        }
      },
      isCreateProduct:false
    };
  }
  componentDidMount() {
    this.props.listProduct(this.state.filter);
  }
  handleChangePage(event, newPage) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          paging: {
            ...this.state.filter.paging,
            page: newPage + 1
          }
        }
      },
      () => {
        this.props.listProduct(this.state.filter);
      }
    );
  }
  handleChangeRowsPerPage(event) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          paging: {
            perpage: +event.target.value,
            page: 1
          }
        }
      },
      () => {
        this.props.listProduct(this.state.filter);
      }
    );
  }

  openCreateProductModal = () => {
    this.setState({
      ...this.state,
      isCreateProduct: true
    });
  };

  closeCreateProductModal = () => {
    this.setState({
      ...this.state,
      isCreateProduct: false
    });
  };

  onChangeSearch(event) {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          search: event.target.value
        }
      },
      () => this.props.getAllProducts(this.state.filter)
    );
  }

  // showProduct = listProducts => {
  //   var result = null;
  //   if (listProducts) {
  //     result = listProducts.map((item, index) => {
  //       return (
  //         // <Products
  //         //   key={item.id}
  //         //   index={
  //         //     (this.state.filter.paging.page - 1) *
  //         //       this.state.filter.paging.perpage +
  //         //     index +
  //         //     1
  //         //   }
  //         //   item={item}
  //         //   // onDeleteProduct={this.onDeleteProduct}
  //         // ></Products>
  //       );
  //     });
  //   }
  //   return result;
  // };

  render() {
    return (
      <React.Fragment>
        <div className='formelements-wrapper'>
          <PageTitleBar
            title={<IntlMessages id='sidebar.products' />}
            match={this.props.match}
          />
          <div className='row'>
            <div className='col-sm-12 col-md-12 col-xl-12'>
              <RctCollapsibleCard heading='List Products'>
                <div className='mb-20'>
                  <Button
                    className='mr-10 mb-10'
                    outline
                    color='primary'
                    onClick={() => this.openCreateProductModal()}
                  >
                    <span aria-hidden='true' className='icon-plus'></span>{' '}
                    &nbsp;Add new Product
                  </Button>
                  <br />
                  <div className='row'>
                    <div className='col-sm-6 col-md-6 col-xl-3'>
                      <div className='form-group'>
                        <TextField
                          id='search'
                          fullWidth
                          label='Search'
                          value={this.state.filter.search}
                          onChange={event => this.onChangeSearch(event)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='scroll-table'>
                    <Table stickyHeader>
                      <TableHead style={{ backgroundColor: '#5d92f4' }}>
                        <TableRow>
                          <TableCell className='background-table-header'>
                            No.
                          </TableCell>
                          <TableCell className='background-table-header'>
                            Title
                          </TableCell>
                          <TableCell className='background-table-header'>
                            Short title
                          </TableCell>
                          <TableCell className='background-table-header'>
                            Signed
                          </TableCell>
                          <TableCell className='background-table-header'>
                            Code
                          </TableCell>
                          <TableCell className='background-table-header'>
                            Logo
                          </TableCell>

                          <TableCell className='background-table-header'>
                            Status
                          </TableCell>
                          <TableCell className='background-table-header'>
                            Image
                          </TableCell>
                          <TableCell className='background-table-header'>
                            Params
                          </TableCell>
                          <TableCell
                            className='background-table-header'
                            align='center'
                          >
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.showProduct(this.props.listProducts)}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                {
                  this.props.listProductRes.isSuccess&&
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15, 20, 30]}
                  component='div'
                  count={this.props.paging.count}
                  rowsPerPage={+this.props.paging.perpage}
                  page={this.props.paging.page - 1}
                  backIconButtonProps={{
                    'aria-label': 'previous page'
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'next page'
                  }}
                  onChangePage={(event, newPage) =>
                    this.handleChangePage(event, newPage)
                  }
                  onChangeRowsPerPage={event =>
                    this.handleChangeRowsPerPage(event)
                  }
                />
              }
              </RctCollapsibleCard>
            </div>
          </div>
        </div>
        <Modal isOpen={this.state.isCreateProduct} size='lg'>
          <ModalHeader toggle={() => this.closeCreateProductModal()}>
            Products Infomation
          </ModalHeader>
          <ModalBody>
            <FormCreateProduct
              close={() => this.closeCreateProductModal()}
            ></FormCreateProduct>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  // console.log('map state: ', state);
  return {
    listProductRes: state.listProduct,
  };
}

export default connect(
  mapStateToProps,
  {listProduct}
)(index);
