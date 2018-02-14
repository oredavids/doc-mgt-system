/* eslint-disable require-jsdoc */
/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import { PageHeader, Button, FormControl, ControlLabel, Alert } from 'react-bootstrap';
import { createAssessUser } from '../../actions/assessUserActions';

class CreateAssessUserPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      name: null,
      phoneNumber: null,
      email: null,
      relationship: 'co-worker',
      showAlert: false,
      errorMessage: null,
    };

    this.onChange = this.onChange.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.displayErrorAlert = this.displayErrorAlert.bind(this);
    this.displaySuccessAlert = this.displaySuccessAlert.bind(this);
  }

  onChange(event) {
    const { name, value } = event.target;
    this.setState(() => {
      return { [name]: value };
    });
  }

  onClickSave(event) {
    event.preventDefault();
    createAssessUser(this.state)
      .then(() => {
        this.setState(() => {
          return {
            showAlert: true,
            successMessage: 'Successfully added new user.'
          };
        });
      })
      .catch((errorMessage) => {
        this.setState(() => {
          return {
            showAlert: true,
            errorMessage
          };
        });
      });
  }

  handleDismiss() {
    this.setState(() => {
      return {
        showAlert: false,
        errorMessage: false
      };
    });
  }

  displayErrorAlert() {
    return (
      <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
        <h4>Oh snap! You got an error!</h4>
        {this.state.errorMessage}
      </Alert>
    );
  }

  displaySuccessAlert() {
    return (
      <Alert bsStyle="success" onDismiss={this.handleDismiss}>
        <h4>Yay!!!</h4>
        {this.state.successMessage}
      </Alert>
    );
  }

  render() {
    const style = {
      paddingRight: 10,
      paddingLeft: 5
    };
    const { showAlert, errorMessage, successMessage } = this.state;

    return (
      <div className="Jumbotron">
        <PageHeader>Welcome To Assessment Page</PageHeader>
        <h3> Submit Info </h3>
        {showAlert && errorMessage ? this.displayErrorAlert() : null}
        {showAlert && successMessage ? this.displaySuccessAlert() : null}
        <div style={{ width: 500 }}>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            name="name"
            type="text"
            onChange={this.onChange}
          />
          <br />
          <ControlLabel>Phone Number</ControlLabel>
          <FormControl
            name="phoneNumber"
            type="text"
            onChange={this.onChange}
          />
          <br />
          <ControlLabel>Email</ControlLabel>
          <FormControl
            name="email"
            type="email"
            onChange={this.onChange}
          />
          <br />
          <ControlLabel>Relationship</ControlLabel>
          <div style={style}>
            <input
              type="radio"
              name="relationship"
              value="co-worker"
              onClick={this.onChange}
            />
            <span style={style}>Co-worker</span>
            <input
              type="radio"
              name="relationship"
              value="friend"
              onClick={this.onChange}
            />
            <span style={style}>Friend</span>
          </div>
          <br />
          <Button
            bsStyle="primary"
            onClick={this.onClickSave}
          >
            Create User
          </Button>
        </div>
      </div>
    );
  }
}

export default CreateAssessUserPage;
