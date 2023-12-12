const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../your-express-app'); // Replace with the path to your Express app file
const expect = chai.expect;

chai.use(chaiHttp);

describe('Document Routes', () => {
  let createdDocumentId;

  // Assuming you have a user with ID 'testUserId' for testing purposes
  const testUserId = 'testUserId';

  it('should create a new document, update its name, and delete it', (done) => {
    // Create a new document
    const documentData = {
      name: 'Test Document',
      date_of_creation: new Date(),
    };

    chai.request(app)
      .post(`/api/create-document/${testUserId}`)
      .send(documentData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name').equal(documentData.name);
        createdDocumentId = res.body._id;

        // Update the name of the document
        const updatedName = 'Updated Document';

        chai.request(app)
          .put(`/api/update-document/${createdDocumentId}`)
          .send({ name: updatedName })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name').equal(updatedName);

            // Delete the document
            chai.request(app)
              .delete(`/api/delete-document/${createdDocumentId}`)
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').to.equal('Document deleted successfully');
                done();
              });
          });
      });
  });

  it('should not create a document with the same name', (done) => {
    const documentData = {
      name: 'Test Document',
      date_of_creation: new Date(),
    };

    chai.request(app)
      .post(`/api/create-document/${testUserId}`)
      .send(documentData)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.equal('Document with the same name already exists.');
        done();
      });
  });

  it('should get documents based on user id', (done) => {
    chai.request(app)
      .get(`/api/documents/${testUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should not find a deleted document', (done) => {
    chai.request(app)
      .get(`/api/documents/${testUserId}`)
      .end((err, res) => {
        const deletedDocument = res.body.find(doc => doc._id === createdDocumentId);
        expect(deletedDocument).to.be.undefined;
        done();
      });
  });
});
