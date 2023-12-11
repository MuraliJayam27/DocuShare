import React from 'react';
import './CreateAccount.css';
import logo from '../Assets/logo.svg';
import { useState } from 'react';
import asset from '../Assets/pana.svg';
import { useNavigate } from 'react-router-dom';

export const Createaccount = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async () => {
        if (!name || !email || !password || !rePassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (password !== rePassword) {
            alert('Please make sure passwords match.');
            return;
        }
        const userData = {
            name,
            email,
            password,
        };

        try {
            const response = await fetch('http://localhost:3001/users/create', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                alert('User registration successful!');
                navigate('/login');
            } else {
                alert('User registration failed. Please try again.');
            }
        }catch(error){
            console.error('Error during registration:', error);
            alert('An error occurred during registration. Please try again later.');
        }
    };


    return (
        <div className='page'>

            <div className="left-part">
                <div className='welcomelogo'>
                    <img src = {logo} alt="DocuShare"/>
                </div>
                <div className='tag-line'>
                    Sign up for your DocuShare account today to experience effortless document creation and sharing!
                </div>
                <div className='asset-image'>
                    <img src={asset} alt="Welcome to DocuShare"/>
                </div>
            </div>


            <div className='right-part'>
                <div className='create-acc'>
                    Create Account
                </div>

                <div className='name'>Name</div>
                <input type="text" placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)}/>

                <div className='email'>Email</div>
                <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}/>

                <div className='password'>Password</div>
                <input type="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />

                <div className='Re-password'>Re-enter Password</div>
                <input type="password" placeholder='Re-enter your password' value={rePassword} onChange={(e) => setRePassword(e.target.value)} />
                <br/>
                <div className="signup" onClick={handleSignUp}>
                    <div className='signuptext'>
                        SignUp
                    </div>
                </div>
                <div className="have-login">Have an account?<a className="login-link" href="./" style={{marginLeft: '5px', color: "#0080FF", textDecoration: "none",display: "inline-block"}}>Login</a></div>
            </div>
            
        </div>
    )
}