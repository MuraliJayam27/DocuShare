import React, { useEffect, useState } from 'react';
import './DocumentEditor.css';
import logo from '../Assets/logo.svg';
import download from '../Assets/download.svg';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import { QuillToolbar, modules, formats } from './QuillToolbar';
import { useParams } from 'react-router-dom';


const initialState = { value: '' };

const DocumentEditor = () => {
  const { userId, documentId } = useParams();
  const [state, setState] = useState(initialState);
  const [downloadFormat, setDownloadFormat] = useState('pdf');

  useEffect(() => {
    fetchDocumentContent();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userId, documentId]);

  const fetchDocumentContent = async () => {
    
    try {
      console.log('fetching data');
      const response = await fetch(`http://localhost:5000/editor/get/${userId}/${documentId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch document content: ${response.status} - ${response.statusText}`);
      }
  
      const documentData = await response.json();
      const contentText = documentData.content ? documentData.content.text : '';
      setState({ value: contentText });
    } catch (error) {
      console.error('Error loading document content:', error);
    }
  };
  

  const saveDocument = async () => {
    const updatedDocument = {
      content: {
        text: state.value,
      },
    };

    try {
      const response = await fetch(`http://localhost:5000/editor/update/${userId}/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDocument),
      });
      // console.log('Response from server:', response);
      // console.log('Updated document:', updatedDocument);
      if (response.ok) {
        console.log('Document saved successfully!');
      } else {
        console.error('Error saving document:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const handleDownloadClick = async () => {
    try {
      const response = await fetch(`http://localhost:5000/editor/download/${userId}/${documentId}/${downloadFormat}`);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `document.${downloadFormat}`;
      link.click();
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };


  const handleBeforeUnload = () => {
    saveDocument();
    return null;
  };

  const handleUnload = () => {
    saveDocument();
  };


  return (
    <div>
      <nav className="navbar">
        <img className="logo" src={logo} alt="Logo" />
        <div className="button-section">
          <button className='download' onClick={saveDocument}>Save</button>
          <button className="download" onClick={handleDownloadClick}>
            <img className="download-icon" src={download} alt="Download" />
            Download
          </button>
          <select value={downloadFormat} onChange={(e) => setDownloadFormat(e.target.value)}>
            <option value="pdf">PDF</option>
            <option value="doc">DOC</option>
          </select>
        </div>
      </nav>
  
      <div className="text-editor">
        <div className="Toolbar">
          <QuillToolbar />
        </div>
        <div className="editor">
          {/* Conditionally render ReactQuill only if data has been fetched */}
          {state.value !== undefined && (
            <ReactQuill
              theme="snow"
              value={state.value}
              onChange={(value) => setState({ value })}
              placeholder={state.value ? undefined : 'Write something awesome...'}
              modules={modules}
              formats={formats}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
