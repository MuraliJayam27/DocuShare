const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentcontroller');

router.get('/documents/:userId', documentController.getDocuments);
router.post('/create-document/:userId', documentController.createDocument);
router.delete('/delete-document/:documentId', documentController.deleteDocument);
router.put('/update-document/:documentId', documentController.updateDocumentName);

module.exports = router;
