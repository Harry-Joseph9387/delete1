import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';  // Assuming you want to use your friend's styling
import { Link } from 'react-router-dom';

const Login = ({ setLoggedIn,fetchUsr }) => {
    const navigate = useNavigate();

    const loginFunct = async () => {
        const inputs = document.querySelectorAll('input');
        const username = inputs[0].value;
        const password = inputs[1].value;

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                alert('Logged in');
                localStorage.setItem('loggedIn', true);
                localStorage.setItem('username', username);
                localStorage.setItem('admin', data.admin);
                setLoggedIn(true)
                navigate('/');
            } else {
                alert(Object.values(data));
            }
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div className={styles.loginmain}>
            <div className={styles.box}>
                <h1>Login</h1>

                <div className={styles.inputbox}>
                    <input  type="text" placeholder="Username" />
                    <i className="bx bxs-user"></i>
                </div>

                <div className={styles.inputbox}>
                    <input  type="password" placeholder="Password" />
                    <i className="bx bxs-lock-alt"></i>
                </div>

                <div className={styles.checkforgot}>
                    <label>
                        <input type="checkbox" /> Remember me
                    </label>
                    <Link to="/forgot">Forgot password?</Link>
                </div>

                <div>
                    <button className={styles.btnn} onClick={loginFunct}>
                        Login
                    </button>
                </div>

                <div className={styles.reg}>
                    <p>Don't have an account?<Link to="/signup"> Register</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
