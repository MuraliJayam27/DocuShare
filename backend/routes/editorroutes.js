const express = require('express');
const router = express.Router();
const documentController = require('../controllers/editorcontroller');

router.get('/get/:userId/:documentId', documentController.getDocument);
router.put('/update/:userId/:documentId', documentController.updateDocument);
router.get('/download/:userId/:documentId/:format', documentController.downloadDocument);

module.exports = router;
