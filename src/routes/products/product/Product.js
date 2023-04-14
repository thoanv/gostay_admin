import React, { Component } from 'react';
import { connect } from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ViewIcon from '@material-ui/icons/Visibility';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import { getAllAirlines, deleteAirline } from '../../../actions/AirlineActions';
import FormViewAirline from './FormViewAirline';
import FormEditAirline from './FormEditAirline';

class Airlines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isViewAirline: false,
      isEditAirline: false,
      open: false
    };
  }

  showFormEditAirline = () => {
    this.setState({
      isEditAirline: true
    });
  };

  showFormViewAirline = () => {
    this.setState({
      isViewAirline: true
    });
  };

  closeViewAirlineModal = () => {
    this.setState({
      isViewAirline: false
    });
  };

  closeEditAirlineModal = () => {
    this.setState({
      isEditAirline: false
    });
  };

  deleteAirline = () => {
    this.setState({
      ...this.state,
      open: true
    });
  };

  async onConfirm() {
    await this.props.deleteAirline({ id: this.props.item.id });
    this.setState({
      ...this.state,
      open: false
    });
  }

  onCancel() {
    this.setState({
      ...this.state,
      open: false
    });
  }

  render() {
    var { item, index } = this.props;
    return (
      <React.Fragment>
        <TableRow>
          <TableCell>{index}</TableCell>
          <TableCell>{item.title}</TableCell>
          <TableCell>{item.short_title}</TableCell>
          <TableCell>{item.signed}</TableCell>
          <TableCell>{item.code}</TableCell>
          <TableCell
          // style={item.logo === '' ? { with: '100px', height: '100px' } : ''}
          >
            <img src={item.logo} alt={`${item.title}_logo`} />
          </TableCell>
          <TableCell>{item.status}</TableCell>

          <TableCell
          // style={item.image === '' ? '' : { with: '100px', height: '100px' }}
          >
            <img src={item.image} alt={`${item.title}_image`} style={{maxWidth: '100%'}} />
          </TableCell>
          <TableCell>{item.params}</TableCell>
          <TableCell>
            <p style={{ display: 'inline-flex' }}>
              <IconButton
                aria-label='View'
                onClick={() => this.showFormViewAirline()}
              >
                <ViewIcon />
              </IconButton>
              <IconButton
                aria-label='Edit'
                onClick={() => this.showFormEditAirline()}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label='Delete'
                onClick={() => this.deleteAirline()}
              >
                <DeleteIcon />
              </IconButton>
            </p>
          </TableCell>
        </TableRow>

        <SweetAlert
          btnSize='sm'
          show={this.state.open}
          showCancel
          confirmBtnText='Yes'
          confirmBtnBsStyle='success'
          cancelBtnBsStyle='danger'
          title='Are you sure?'
          onConfirm={() => this.onConfirm()}
          onCancel={() => this.onCancel()}
        >
          Do you want to delete this item?
        </SweetAlert>
        <Modal isOpen={this.state.isViewAirline} size='lg' key='modalview'>
          <ModalHeader toggle={() => this.closeViewAirlineModal()}>
            View Airline
          </ModalHeader>
          <ModalBody>
            <FormViewAirline item={item}></FormViewAirline>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' onClick={() => this.closeViewAirlineModal()}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isEditAirline} size='lg' key='modaleidt'>
          <ModalHeader toggle={() => this.closeEditAirlineModal()}>
            Edit Airline
          </ModalHeader>
          <ModalBody>
            <FormEditAirline
              item={item}
              close={() => this.closeEditAirlineModal()}
            ></FormEditAirline>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    deleteAirline: id => dispatch(deleteAirline(id))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Airlines);
