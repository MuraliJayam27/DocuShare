const Document = require('../models/document');

const getDocuments = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching documents for userId:', userId);
    const documents = await Document.find({ userId });
    console.log('Fetched documents:', documents);
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createDocument = async (req, res) => {
  try {
    const { name, date_of_creation } = req.body;
    const userId = req.params.userId;

    const existingDocument = await Document.findOne({ name, userId });
    if (existingDocument) {
      return res.status(400).json({ error: 'Document with the same name already exists.' });
    }

    const newDocument = await Document.create({ name, userId, date_of_creation });
    res.json(newDocument);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    await Document.findByIdAndDelete(documentId);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateDocumentName = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { name } = req.body;
    const updatedDocument = await Document.findByIdAndUpdate(documentId, { name }, { new: true });
    res.json(updatedDocument);
  } catch (error) {
    console.error('Error updating document name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getDocuments,
  createDocument,
  deleteDocument,
  updateDocumentName,
};
