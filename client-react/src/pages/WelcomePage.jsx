import React, { useContext, useEffect } from 'react';
import { ViewContext } from "../context/ViewContext"; 
import { UserContext } from "../context/UserContext"; 
import "../stylesheets/WelcomePage.css";
import axios from 'axios';

const WelcomePage = () => {
    const { setView } = useContext(ViewContext);
    const { authUser, setAuthUser } = useContext(UserContext);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
                    withCredentials: true,
                    validateStatus: () => true
                });

                if (response.status === 200) {
                    setAuthUser(response.data);
                } else {
                    console.log("No valid token found");
                }
            } catch (error) {
                console.error("Error checking user:", error);
            }
        };

        checkUser();
    }, [setAuthUser]);

    useEffect(() => {
        if (authUser) {
            setView('Home');
        }
    }, [authUser, setView]);

    const handleLoginClick = () => {
        setView('Login');
    };

    const handleRegisterClick = () => {
        setView('Register');
    };

    const handleGuestClick = () => {
        setView('Home');
    };

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Welcome!</h1>
                <button onClick={handleLoginClick}>Login</button>
                <button onClick={handleRegisterClick}>Register</button>
                <button onClick={handleGuestClick}>Continue as Guest</button>
            </div>
        </div>
    );
};

export default WelcomePage;