const Document = require('../models/document');
const pdf = require('html-pdf');
const htmlToDocx = require('html-to-docx');

const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      userId: req.params.userId,
      _id: req.params.documentId,
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ content: document.content });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndUpdate(
      {
        userId: req.params.userId,
        _id: req.params.documentId,
      },
      { $set: { 'content.text': req.body.content.text } },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ message: 'Document updated successfully' });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      userId: req.params.userId,
      _id: req.params.documentId,
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const documentText = document.content.text;

    if (req.params.format === 'pdf') {
      const pdfOptions = { format: 'Letter' };
      pdf.create(documentText, pdfOptions).toBuffer((err, buffer) => {
        if (err) {
          console.error('Error generating PDF:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=document.${req.params.format}`);
        res.send(buffer);
      });
    } else if (req.params.format === 'doc') {
      const docxBuffer = await htmlToDocx(documentText);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename=document.${req.params.format}`);
      res.send(docxBuffer);
    } else {
      return res.status(400).json({ error: 'Invalid format specified' });
    }
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getDocument,
  updateDocument,
  downloadDocument,
};
