import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import logo from '../Assets/logo.svg';
import Docicon from '../Assets/Docicon.svg';
import search from '../Assets/search.svg';
import edit from '../Assets/edit.svg';
import deletes from '../Assets/delete.svg';

import './Homepage.css';

function Homepage() {
  const [documents, setDocuments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState('');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editedDocumentName, setEditedDocumentName] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    if (!userId) {
      console.error('userId is missing.');
      return;
    }
    const backendURI = `http://localhost:5000/document/documents/${userId}`
    axios
      .get(backendURI)
      .then((response) => {
        setDocuments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching documents:', error);
      });
  }, [userId]);

  const handleNewDocument = () => {
    setShowPopup(true);
  };

  const handleCreateDocument = async () => {
    try {
      if (newDocumentName.trim() !== '') {
        const backendURI = `http://localhost:5000/document/create-document/${userId}`;
        const response = await axios.post(backendURI, { name: newDocumentName });
  
        setDocuments([...documents, response.data]);
        setNewDocumentName('');
        setShowPopup(false);
      } else {
        alert('Document name cannot be empty.');
      }
    } catch (error) {
      console.error('Error creating document:', error);
  
      if (error.response) {
        if (error.response.status === 400 && error.response.data && error.response.data.error === 'Document with the same name already exists.') {
          alert('Document name already exists. Please try a different name.');
        } else {
          alert('Error creating document. Please try again.');
        }
      } else if (error.request) {
        alert('No response from the server. Please try again.');
      } else {
        alert('Unexpected error. Please try again.');
      }
    }
  };
  
  const handleDeleteDocument = async (documentId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete the document?');

      if (confirmDelete) {
        const backendURI = `http://localhost:5000/document/delete-document/${documentId}`;
        await axios.delete(backendURI);

        setDocuments(documents.filter((doc) => doc._id !== documentId));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleEditDocument = (documentId) => {
    setSelectedDocumentId(documentId);
    setShowEditPopup(true);
  };

  const handleUpdateDocumentName = async () => {
    try {
      if (editedDocumentName.trim() !== '') {
        const backendURI = `http://localhost:5000/document/update-document/${selectedDocumentId}`;
        await axios.put(backendURI, { name: editedDocumentName });

        setDocuments((docs) =>
          docs.map((doc) =>
            doc._id === selectedDocumentId ? { ...doc, name: editedDocumentName } : doc
          )
        );

        setEditedDocumentName('');
      } else {
        alert('Document name cannot be empty.');
      }
    } catch (error) {
      console.error('Error updating document name:', error);
    }

    setShowEditPopup(false);
  };

  const logout = () => {
  };

  return (
    <div>
      {showPopup || showEditPopup ? <div className="overlay"></div> : null}
      <nav className="navbar">
        <img className="logo" src={logo} alt="Logo" />
        <div className="search-box">
          <img className="searchicon" src={search} alt="search" />
          <input style={{margin:"0", border:"none", borderTopLeftRadius:"0px", borderBottomLeftRadius:"0px"}} className="search-input" type="text" placeholder="Search" />

        </div>
        <Link to={`/`}>
          <button onClick={logout}>Logout</button>
        </Link>
      </nav>
      <div className="documentheader">
        Recent Documents
        <button className="newdocument" onClick={handleNewDocument}>
          + New Document
        </button>
      </div>
      {showPopup && (
        <div className="popup">
          <h3>Enter new Document name</h3>
          <input
            type="text"
            placeholder="Enter document name"
            value={newDocumentName}
            onChange={(e) => setNewDocumentName(e.target.value)}
          />
          <button onClick={handleCreateDocument}>Create</button>
          <button onClick={() => setShowPopup(false)}>Cancel</button>
        </div>
      )}

      {showEditPopup && (
        <div className="popup">
          <h3>Edit Document name</h3>
          <input
            type="text"
            placeholder="Enter new document name"
            value={editedDocumentName}
            onChange={(e) => setEditedDocumentName(e.target.value)}
          />
          <button onClick={handleUpdateDocumentName}>Update</button>
          <button onClick={() => setShowEditPopup(false)}>Cancel</button>
        </div>
      )}
      <br />
      <div className="documents">
        {documents.map((document) => (
          <div className="documentElement" key={document._id}>
            <div className="TopPart">
              <Link to={`/${userId}/document-editor/${document._id}`}>
                <img className="Docicon" src={Docicon} alt="Doc icon" />
              </Link>
            </div>
            <div className="BottomPart">
              <div className="leftpart">
                <div className="filename">{document.name}</div>
                <div className="date">{document.date_of_creation}</div>
              </div>
              <div className="rightpart">
                <button className="button" onClick={() => handleEditDocument(document._id)}>
                  <img src={edit} alt="edit" />
                </button>
                <button className="button" onClick={() => handleDeleteDocument(document._id)}>
                  <img src={deletes} alt="delete" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Homepage;
