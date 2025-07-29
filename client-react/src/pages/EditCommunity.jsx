import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext";
import { ViewContext } from "../context/ViewContext";
import "../stylesheets/CreateCommunity.css";
import "../stylesheets/index.css";

const EditCommunity = () => {
    const { setView, communityID } = useContext(ViewContext);
    const { authUser } = useContext(UserContext);

    //state for form inputs
    const [communityName, setCommunityName] = useState('');
    const [communityDescription, setCommunityDescription] = useState('');
    const [originalCommunityName, setOriginalCommunityName] = useState('');

    //error state
    const [errors, setErrors] = useState({
        communityName: '',
        communityDescription: '',
    });

    useEffect(() => {
        const fetchCommunityData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/communities/${communityID}`, { withCredentials: true });
                const com = response.data;
                setCommunityName(com.name);
                setOriginalCommunityName(com.name);
                setCommunityDescription(com.description);
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };

        fetchCommunityData();
    }, [communityID]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        //validate inputs
        const newErrors = {
            communityName: '',
            communityDescription: '',
        };

        let isValid = true;

        if (communityName.trim() === '') {
            newErrors.communityName = 'Community name is required.';
            isValid = false;
        }
        else if (communityName.length > 100) {
            newErrors.communityName = 'Community name should not exceed 100 characters.';
            isValid = false;
        }

        if (communityDescription.trim() === '') {
            newErrors.communityDescription = 'Community description is required.';
            isValid = false;
        }
        else if (communityDescription.length > 500) {
            newErrors.communityDescription = 'Community description should not exceed 500 characters.'
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            try {
                // Check if community name was modified, and if so check if it already exists
                // don't check if the name is the same as the original name hence the check below
                if (communityName !== originalCommunityName) {
                    const checkResponse = await axios.get(`${process.env.REACT_APP_API_URL}/communities/exists/${communityName}`);
                    if (checkResponse.data.exists) {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            communityName: 'Community name already exists.'
                        }));
                        return;
                    }
                }

                const newCommunityData = {
                    updatedTitleOrName: communityName.trim(),
                    updatedContentOrDescription: communityDescription.trim(),
                };
                await axios.put(`${process.env.REACT_APP_API_URL}/communities/update/${communityID}`, newCommunityData, {withCredentials: true});

                //reset fields
                setCommunityName('');
                setCommunityDescription('');
                setOriginalCommunityName('');

                setErrors({
                    communityName: '',
                    communityDescription: '',
                });

                if(authUser.role === "admin"){
                    setView("AdminPage");
                }
                else{
                    setView("ProfilePage");
                }


            }
            catch (error) {
                alert("An error occurred. Please try again.");
                console.error("Error creating community", error);
            }
        }
        else {
            setCommunityName(communityName.trim());
            setCommunityDescription(communityDescription.trim());
        }

    };

    const handleDelete = async () => {
        // alert("In Progress");
    };

    return (
        <div>
            <Header />
            <div className="containerSideMain">
                <Navbar />
                <div id="main" className="main">
                    <div className="create-community-container">
                        <h2>Update Community</h2>
                        <form onSubmit={handleSubmit} className="create-community-form">
                            {/*Community Name*/}
                            <div className="form-group">
                                <label htmlFor="communityName">
                                    Community Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="communityName"
                                    value={communityName}
                                    onChange={(e) => setCommunityName(e.target.value)}
                                    maxLength="100"
                                    required />
                                {errors.communityName && (
                                    <span className="error-message">{errors.communityName}</span>
                                )}
                                <small>{communityName.length}/100 chars</small>
                            </div>

                            {/*Comm Descr */}
                            <div className="form-group">
                                <label htmlFor="communityDescription">
                                    Community Description <span className="required">*</span>
                                </label>
                                <textarea
                                    id="communityDescription"
                                    value={communityDescription}
                                    onChange={(e) => setCommunityDescription(e.target.value)}
                                    maxLength="500"
                                    required />
                                {errors.communityDescription && (
                                    <span className="error-message">{errors.communityDescription}</span>
                                )}
                                <small>{communityDescription.length}/500 chars</small>
                            </div>
                            {/*Submit Btn */}
                            <button type="submit" className="engender-button">
                                Update Community
                            </button>

                        </form>
                        <button onClick={handleDelete} className="delete-comment-button">Delete Community</button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default EditCommunity;
