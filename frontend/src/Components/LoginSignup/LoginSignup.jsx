import React from 'react';
import './LoginSignup.css';
import logo from '../Assets/logo.svg';
import asset from '../Assets/amico.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/users/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                const { userId } = await response.json();
                console.log('Login successful');
                navigate(`/home/${userId}`);
            }
            else {
                console.log('Login failed');
                setShowErrorPopup(true);
            }
        } catch (error) {
            console.error('An error occurred during login', error);
        }
    };

    return (
        <div className='page-1'>
            <div className="left-part">
                <div className='welcome-text'>
                    Welcome back!
                </div>
                <div className='tag-line'>
                    Build your best ideas together, in DocuShare
                </div>
                <div className='asset-image'>
                    <img src={asset} alt="Welcome to DocuShare" />
                </div>
            </div>
            <div className='right-part'>
                <div className='logo-image'>
                    <img src={logo} alt="DocuShare"/>
                </div>
                <div className='email'>Email</div>
                <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}/>

                <div className='password'>Password</div> 
                <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <div className='remember-forgot-password'>
                    <div className="remember-me">
                        <input type="checkbox"/>
                        <div>Remember me</div>
                    </div>
                    <div> <span style={{color: '#0080FF'}}>Forgot Password?</span> </div>
                </div>

                <div className="signin" onClick={handleLogin}>
                    <div className='signintext'>Login</div>
                </div>
                <div className="createaccount">Don't have an account?  <a className="create-account-link" href="/createAccount" style={{marginLeft: '5px', color: '#0080FF', textDecoration: 'none'}}>Create account</a></div>
            </div>
            {showErrorPopup && (
                <div className="popup-container">
                    <div className="popup">
                        <div className="popup-content">
                            <h4>Error</h4>
                            <h3 className="popup-message">Invalid email or password. Please try again.</h3>
                            <button className="popup-button" onClick={() => {console.log("Closing pop-up"); setShowErrorPopup(false);}}>Close</button>
                        </div>
                    </div>
                    <div className="overlay"></div>
                </div>
            )}
        </div>
    )
}

