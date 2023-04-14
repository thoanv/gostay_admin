import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { createAirline } from '../../../actions/AirlineActions';

class FormCreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      short_title: '',
      signed: '',
      code: '',
      logo: '',
      status: '',
      image: '',
      params: ''
    };
  }

  onClearForm = () => {
    this.setState({
      title: '',
      short_title: '',
      signed: '',
      code: '',
      logo: '',
      status: '',
      image: '',
      params: ''
    });
  };

  onElementChange = event => {
    var target = event.target;
    var name = target.name;
    var value = target.value;
    this.setState({
      [name]: value
    });
  };

  checkValidate = () => {
    var { title, short_title, signed, code, status } = this.state;
    if (title === '') {
      alert('Title is in valid!');
      return false;
    } else if (short_title === '') {
      alert('Short title is in valid!');
      return false;
    } else if (code === '') {
      alert('Code is in valid!');
      return false;
    } else if (status === '') {
      alert('Status is in valid!');
      return false;
    }else if(isNaN(status)  || status === '0') {
      alert('Status must be a number other than 0 !');
      return false;
    } else if (isNaN(signed)) {
      alert('Signed must be a number');
      return false;
    }
    return true;
  };

  onSubmit = async event => {
    event.preventDefault();
    var {
      title,
      short_title,
      signed,
      code,
      logo,
      status,
      image,
      params
    } = this.state;
    var airline = {
      title: title,
      short_title: short_title,
      signed: signed,
      code: code,
      logo: logo,
      status: status,
      image: image,
      params: params
    };
    let valid = await this.checkValidate();
    if (valid) {
      this.props.createAirline(airline);
      this.onClearForm();
    }
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} className='form-horizontal'>
        <div className='form-airline row'>
          <div className='form-group col-md-6'>
            <label>Title</label>
            <input
              type='text'
              className='form-control'
              name='title'
              value={this.state.title}
              onChange={this.onElementChange}
            />
          </div>
          <div className='form-group col-md-6'>
            <label>Short_title</label>
            <input
              type='text'
              className='form-control'
              name='short_title'
              value={this.state.short_title}
              onChange={this.onElementChange}
            />
          </div>
          <div className='form-group col-md-6'>
            <label>Signed</label>
            <input
              type='text'
              className='form-control'
              name='signed'
              value={this.state.signed}
              onChange={this.onElementChange}
            />
          </div>
          <div className='form-group col-md-6'>
            <label>Code</label>
            <input
              type='text'
              className='form-control'
              name='code'
              value={this.state.code}
              onChange={this.onElementChange}
            />
          </div>
          <div className='form-group col-md-6'>
            <label>Logo</label>
            <input
              type='text'
              className='form-control'
              name='logo'
              value={this.state.logo}
              onChange={this.onElementChange}
            />
          </div>
          <div className='form-group col-md-6'>
            <label>Status</label>
            <input
              type='text'
              className='form-control'
              name='status'
              value={this.state.status}
              onChange={this.onElementChange}
            />
          </div>
          <div className='form-group col-md-6'>
            <label>Image</label>
            <input
              type='text'
              className='form-control'
              name='image'
              value={this.state.image}
              onChange={this.onElementChange}
            />
          </div>
          <div className='form-group col-md-6'>
            <label>Params</label>
            <input
              type='text'
              className='form-control'
              name='params'
              value={this.state.params}
              onChange={this.onElementChange}
            />
          </div>
        </div>
        <div className='row'>
          <div className='form-group ml-auto mr-3 mt-20'>
            <Button color='primary' type='type' className='mr-3'>
              Add
            </Button>
            <Button color='danger' type='reset'>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    listAirlines: state.airline.listAirlines
  };
}

const mapDispatchToProps = dispatch => {
  console.log(dispatch);

  return {
    createAirline: destination => dispatch(createAirline(destination))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreateProduct);
