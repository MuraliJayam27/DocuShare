const Document = require('../models/document');
const logger = require('../logger/logging')
const getDocuments = async (req, res) => {
  try {
    const userId = req.params.userId;
    logger.info('Fetching documents for userId:'+userId);
    const documents = await Document.find({ userId });
    logger.info('Fetched documents:', documents);
    res.json(documents);
  } catch (error) {
    logger.error('Error fetching documents:'+ error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createDocument = async (req, res) => {
  try {
    const { name, date_of_creation } = req.body;
    const userId = req.params.userId;

    const existingDocument = await Document.findOne({ name, userId });
    if (existingDocument) {
      logger.info('Document with the same name already exists.');
      return res.status(400).json({ error: 'Document with the same name already exists.' });
    }

    const newDocument = await Document.create({ name, userId, date_of_creation });
    res.json(newDocument);
  } catch (error) {
    logger.error('Error creating document:'+ error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    await Document.findByIdAndDelete(documentId);
    logger.info('Document deleted successfully:'+ documentId);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    logger.error('Error deleting document:'+ error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateDocumentName = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { name } = req.body;
    const updatedDocument = await Document.findByIdAndUpdate(documentId, { name }, { new: true });
    logger.info('Document name updated successfully:'+ updatedDocument);
    res.json(updatedDocument);
  } catch (error) {
    logger.error('Error updating document name:'+ error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getDocuments,
  createDocument,
  deleteDocument,
  updateDocumentName,
};
