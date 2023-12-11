import './App.css';
import { LoginSignup } from './Components/LoginSignup/LoginSignup';
import Homepage from './Components/Homepage/Homepage';
import DocumentEditor from './Components/DocumentEditor/DocumentEditor';
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Createaccount } from './Components/CreateAccount/CreateAccount';
export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/home/:userId" element={<Homepage />} />
          <Route path="/:userId/document-editor/:documentId" element={<DocumentEditor/>} />
          <Route path="/createAccount" element={<Createaccount />} />
          <Route index element={<LoginSignup/>} />
        </Routes>
      </Router>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);