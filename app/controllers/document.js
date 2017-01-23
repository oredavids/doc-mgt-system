const model = require('../models');

const accessCategories = {
  public: 'public',
  private: 'private',
  role: 'role'
};

/**
 * Class DocumentsController
 * To handle routing logic for documents route
 */
class DocumentsController {

  /**
   * Method createDocument
   * @param {Object} request - request Object
   * @param {Object} response - request Object
   * @return {Object} response Object
   */
  static createDocument(request, response) {
    model.Document.create(request.body)
      .then((newDocument) => {
        return response.status(201)
          .send(newDocument);
      })
      .catch((error) => {
        return response.status(500)
          .send(error.errors);
      });
  }

  /**
   * Method getDocuments to obtain all documents
   * @param {Object} request - request Object
   * @param {Object} response - request Object
   * @return {Object} response Object
   */
  static getDocuments(request, response) {
    const query = {
      limit: request.query.limit || null,
      offset: request.query.offset || null
    };

    model.Document.findAll(query)
      .then((documents) => {
        return response.status(200)
          .send(documents);
      });
  }

  /**
   * Method getDocument to obtain a document
   * @param {Object} request - request Object
   * @param {Object} response - request Object
   * @return {Object} response Object
   */
  static getDocument(request, response) {
    model.Document.findById(request.params.id)
      .then((foundDocument) => {
        if (!foundDocument)
          return response.status(404)
          .send({
            message: `No document found with id: ${request.params.id}`
          });
        // eslint-disable-next-line curly
        if (foundDocument.access === accessCategories.public)
          return response.status(200)
            .send(foundDocument);
        if ((foundDocument.access === accessCategories.private) &&
          (foundDocument.OwnerId === request.decoded.UserId))
          return response.status(200)
            .send(foundDocument);
        if (foundDocument.access === accessCategories.role)
          return model.User.findById(foundDocument.OwnerId)
            .then((documentOwner) => {
              if (documentOwner.RoleId === request.decoded.RoleId)
                return response.status(200)
                  .send(foundDocument);
            });
        return response.status(403)
          .send({
            message: 'You are not permitted to access this document'
          });
      });
  }

  /**
   * Method getUserDocuments to obtain all documents for a specific user
   * @param {Object} request - request Object
   * @param {Object} response - request Object
   * @return {Object} response Object
   */
  static getUserDocuments(request, response) {
    model.Document.findAll({ where: { OwnerId: request.params.id } })
      .then((foundDocuments) => {
        if (!foundDocuments) return response.status(404)
          .send({ message: `No document found for user with id:\
            ${request.params.id}` });
        return response.status(200)
          .send(foundDocuments);
      });
  }

  /**
   * Method updateDocument
   * @param {Object} request - request Object
   * @param {Object} response - request Object
   * @return {Object} response Object
   */
  static updateDocument(request, response) {
    model.Document.findById(request.params.id)
      .then((foundDocument) => {
        if (!foundDocument) return response.status(404)
          .send({ message: `No document found with id: ${request.params.id}` });
        if (foundDocument.OwnerId === request.decoded.UserId)
          foundDocument.update(request.body)
            .then((updatedDocument) => {
              return response.status(202)
                .send(updatedDocument);
            });
        else
          return response.status(403)
            .send({ message: 'You are not the Owner of this document.' });
      });
  }

  /**
   * Method deleteDocument
   * @param {Object} request - request Object
   * @param {Object} response - request Object
   * @return {Object} response Object
   */
  static deleteDocument(request, response) {
    model.Document.findById(request.params.id)
      .then((foundDocument) => {
        if (!foundDocument) return response.status(404)
          .send({ message: `No document found with id: ${request.params.id}` });
        if (foundDocument.OwnerId === request.decoded.UserId)
          foundDocument.destroy()
            .then(() => {
              return response.status(202)
                .send({ message: 'Document succesfully deleted' });
            });
        else
          return response.status(403)
            .send({ message: 'You are not the Owner of this document.' });
      });
  }
}

module.exports = DocumentsController;
