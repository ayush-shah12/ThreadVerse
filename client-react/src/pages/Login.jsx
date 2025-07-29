import axios from "axios";
import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ViewContext } from "../context/ViewContext";
import "../stylesheets/LoginPage.css";

const Login = () => {
    const { setView } = useContext(ViewContext);
    const { setAuthUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                validateStatus: () => true
            });

            if (response.status === 200) {
                setAuthUser(response.data);
                setView("Home");
            } else if (response.status === 401) {
                alert("Email and/or password is incorrect");
                console.error("Invalid credentials");
            } else {
                alert("A server error occurred. Please try again.");
                console.error("An error occurred");
            }

        } catch (error) {
            alert("A server error occurred. Please try again.");
            console.error("There was an error logging in!", error);
        }
    };

    const handleRegister = () => {
        setView("Register");
    };

    const handleGuest = () => {
        setView("Home");
    };

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Login!</h1>
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        autoComplete="email"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        autoComplete="current-password"
                    />
                    <button type="submit">Login</button>
                </form>
                <button onClick={handleRegister}>Register</button>
                <button onClick={handleGuest}>Continue as Guest</button>
            </div>
        </div>
    );
};

export default Login;