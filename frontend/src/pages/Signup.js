import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css'; // Assuming you are using a CSS module

const Signup = () => {
    const navigate = useNavigate();
    const [isEmailValid, setIsEmailValid] = useState(true);

    const validateEmail = async (email) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/validateEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            return data.isAvailable; // Expecting the backend to return `{ isAvailable: true/false }`
        } catch (err) {
            console.error('Error validating email:', err);
            return false; // Assume the email is invalid in case of an error
        }
    };

    const signup = async () => {
        const inputs = document.querySelectorAll('input');
        const username = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;
        const contactNo = inputs[3].value;
        const TC = inputs[4]; // Terms and conditions checkbox

        if (!email) {
            alert('Please enter a valid email address.');
            return;
        }

        // Validate the email
        const isAvailable = await validateEmail(email);
        setIsEmailValid(isAvailable);

        if (!isAvailable) {
            alert('This email is already registered. Please use another email.');
            return;
        }

        if (TC.checked) {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password, contactNo }),
                    credentials: 'include',
                });

                const data = await response.json();
                alert(Object.values(data));

                if (response.ok) {
                    navigate('/login'); // Redirect to login page after successful signup
                }
            } catch (err) {
                alert('Error during signup:', err);
            }
        } else {
            alert('Please accept our T&C to proceed.');
        }
    };

    return (
        <div className={styles.signupmain}>
            <div className={styles.box}>
                <h1>Sign-up</h1>

                <div className={styles.bb}>
                    <input type="text" required placeholder="Name" />
                </div>

                <div className={styles.bb}>
                    <input
                        type="email"
                        required
                        placeholder="Email"
                        className={!isEmailValid ? styles.invalid : ''}
                        onBlur={async (e) => {
                            const email = e.target.value;
                            const isAvailable = await validateEmail(email);
                            setIsEmailValid(isAvailable);
                        }}
                    />
                    
                </div>

                <div className={styles.bb}>
                    <input type="password" required placeholder="Password" />
                </div>

                <div className={styles.bb}>
                    <input type="tel" required placeholder="Contact Number" />
                </div>

                <div className={styles.checkbox}>
                    <label>
                        <input type="checkbox" required /> Terms and conditions agreement
                    </label>
                </div>

                <div>
                    <button className={styles.btnn} onClick={signup}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
