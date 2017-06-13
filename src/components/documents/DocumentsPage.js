/* eslint-disable require-jsdoc */
/* eslint-disable class-methods-use-this */

import React from 'react';
import { connect } from 'react-redux';
import * as documentActions from '../../actions/documentsActions';

class DocumentsPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      document: {
        title: '',
        content: '',
      },
      user: {
        name: ''
      }
    };

    this.onTitleChange = this.onTitleChange.bind(this);
    this.onContentChange = this.onContentChange.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
  }

  onTitleChange(event) {
    const document = Object.assign({}, this.state.document);
    document.title = event.target.value;
    this.setState({
      document
    });
  }

  onContentChange(event) {
    const document = Object.assign({}, this.state.document);
    document.content = event.target.value;
    this.setState({
      document
    });
  }

  onClickSave(event) {
    this.props.dispatch(documentActions.createDocument(this.state.document));
  }

  documentRow(document, index) {
    return (
      <div>
        <div key={index}>
          <p>Title: {document.title}</p>
          <p>Content: {document.content}</p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="Jumbotron">
        <h1>Documents Page</h1>
        {this.props.documents.map(this.documentRow)}
        <h2> Add Document </h2>
        <input
          type="text"
          onChange={this.onTitleChange}
          value={this.state.document.title}
        />
        <input
          type="text"
          onChange={this.onContentChange}
          value={this.state.document.content}
        />
        <input
          type="submit"
          value="Save"
          onClick={this.onClickSave}
        />
      </div>
    );
  }
}

const { PropTypes } = React;

DocumentsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  documents: PropTypes.array.isRequired
};

function mapStateToProps(state, ownprops) {
  return {
    documents: state.documents
  };
}

export default connect(mapStateToProps)(DocumentsPage);
