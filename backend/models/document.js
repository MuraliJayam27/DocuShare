const mongoose = require('mongoose');

const formatDate = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
  
    return `${day}/${month}/${year}`;
  };

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  date_of_creation: { type: String, default: formatDate },
  content: {
    text: { type: String, default: '' },
    images: [{ type: String, validate: /^https?:\/\//i }],
    links: [{ type: String, validate: /^https?:\/\//i }],
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
