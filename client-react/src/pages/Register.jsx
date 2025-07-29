import "../stylesheets/LoginPage.css";
import { useContext, useState } from "react";
import { ViewContext } from "../context/ViewContext";
import axios from "axios";

const Register = () => {
    const { setView } = useContext(ViewContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
                email: email.trim(),
                password: password,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                displayName: displayName.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                validateStatus: () => true
            });

            if (response.status === 200) {
                console.log("User registered successfully");
                alert("User registered successfully!");
                setView("WelcomePage");
            }
            else {
                //use actual response message
                console.log("response status:", response.status, "response data:", response.data);
                const errorMessage = response.data || "A server error occured. Please try again.";
                alert(errorMessage);
                //alert("A server error occurred. Please try again.");
                console.error("An error occurred:", errorMessage);
            }
        } catch (error) {
            alert("A server error occurred. Please try again.");
            console.error("There was an error registering!", error);
        }
    };

    const handleLogin = () => {
        setView("Login");
    };

    const handleGuest = () => {
        setView("Home");
    };

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Register!</h1>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="given-name"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name"
                    />
                    <input
                        type="text"
                        placeholder="Display Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        autoComplete="nickname"
                    />
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
                        autoComplete="new-password"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <button type="submit">Register</button>
                </form>
                <button onClick={handleLogin}>To Login Page</button>
                <button onClick={handleGuest}>Continue as Guest</button>
            </div>
        </div>
    );
};

export default Register;