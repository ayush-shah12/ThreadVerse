import axios from "axios";
import React, { useContext, useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext";
import { ViewContext } from "../context/ViewContext";
import "../stylesheets/CreateCommunity.css";
import "../stylesheets/index.css";

const CreateCommunity = () => {
    const { setView, setCommunityID } = useContext(ViewContext);
    const { authUser } = useContext(UserContext);

    //state for form inputs
    const [communityName, setCommunityName] = useState('');
    const [communityDescription, setCommunityDescription] = useState('');

    //error state
    const [errors, setErrors] = useState({
        communityName: '',
        communityDescription: '',
    });

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
                const newCommunityData = {
                    name: communityName.trim(),
                    description: communityDescription.trim()
                };
                //send post request to server
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/communities/create`, newCommunityData, 
                    {withCredentials: true, validateStatus: (status) => status >= 200 && status < 500});

                if(response.status === 400) {
                    alert(response.data.error);
                    return;
                }

                const savedCommunity = response.data;

                setCommunityID(savedCommunity.id);
                setView('CommunityPage');


                //reset fields
                setCommunityName('');
                setCommunityDescription('');

                setErrors({
                    communityName: '',
                    communityDescription: '',
                });

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

    return (
        <div>
            <Header />
            <div className="containerSideMain">
                <Navbar />
                <div id="main" className="main">
                    <div className="create-community-container">
                        <h2>Create a New Community</h2>
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
                            {/*Creator Username */}
                            {/* <div className = "form-group">
                    <label htmlFor = "creatorUsername">
                       Creator Username <span className = "required">*</span>
                    </label>
                    <input
                    type = "text"
                    id = "creatorUsername"
                    value = {creatorUsername}
                    onChange={(e) => setCreatorUsername(e.target.value)}
                    maxLength="100"
                    required />
                    {errors.creatorUsername && (
                        <span className = "error-message">{errors.creatorUsername}</span>
                    )}
                </div> */}

                            {/*Submit Btn */}
                            <button type="submit" className="engender-button">
                                Create Community
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default CreateCommunity;
