import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import { UserContext } from "../context/UserContext";
import { ViewContext } from "../context/ViewContext";
import "../stylesheets/NewPost.css";
import "../stylesheets/index.css";


const NewPost = () => {
    const { setView, setPostID } = useContext(ViewContext);
    const { authUser } = useContext(UserContext);

    //state for input forms
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [linkFlair, setLinkFlair] = useState('');
    const [postContent, setPostContent] = useState('');
    const [showNewLinkFlairInput, setShowNewLinkFlairInput] = useState(false);
    const [newLinkFlair, setNewLinkFlair] = useState("");

    //error states
    const [errors, setErrors] = useState({
        selectedCommunity: '',
        postTitle: '',
        linkFlair: '',
        postContent: '',
        server: '',

    });

    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        // Fetch available communities from the server
        const fetchCommunities = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/communities`);
                let communityList = response.data;

                //sort for joined communitites:
                if (authUser) {
                    const joinedCommunities = communityList.filter(c => c.memberIds && c.memberIds.includes(authUser.id));
                    const otherCommunities = communityList.filter(c => !c.memberIds || !c.memberIds.includes(authUser.id));
                    communityList = [...joinedCommunities, ...otherCommunities];
                }
                setCommunities(communityList);
            } catch (error) {
                console.error("Error fetching communities:", error);
            }
        };
        fetchCommunities();
    }, [authUser, setView]);


    const [availableLinkFlairs, setAvailableLinkFlairs] = useState([]);

    useEffect(() => {
        const fetchLinkFlairs = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/linkflairs`);
                setAvailableLinkFlairs(response.data);
            }
            catch (error) {
                console.error("error fetching link flairs: ", error);
            }

        }; fetchLinkFlairs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let isValid = true;

        const newErrors = {
            selectedCommunity: '',
            postTitle: '',
            linkFlair: '',
            postContent: '',
            server: '',
        };

        if (selectedCommunity === "") {
            newErrors.selectedCommunity = "Community selection is required.";
            isValid = false;
        }

        if (postTitle.trim() === '') {
            newErrors.postTitle = "Post Title is required.";
            isValid = false;
        }
        else if (postTitle.length > 100) {
            newErrors.postTitle = "Post Title should not exceed 100 characters.";
            isValid = false;
        }

        if (showNewLinkFlairInput) {
            if (newLinkFlair.trim() === "") {
                newErrors.linkFlair = "New Link Flair is required.";
                isValid = false;
            }
            else if (newLinkFlair.trim().length > 30) {
                newErrors.linkFlair = "Link Flair should not exceed 30 characters.";
                isValid = false;
            }
        }
        if (postContent.trim() === "") {
            newErrors.postContent = "Post Content is required.";
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            try {
                const payload = {
                    title: postTitle.trim(),
                    content: postContent.trim(),
                    communityId: selectedCommunity,
                    linkflairId: linkFlair === "AddNewLinkFlair" ? "" : (linkFlair || ""),
                    newLinkflair: linkFlair === "AddNewLinkFlair",
                    newLinkflairName: linkFlair === "AddNewLinkFlair" ? newLinkFlair.trim() : ""
                };

                const response = await axios.post(`${process.env.REACT_APP_API_URL}/posts/create`, payload, {withCredentials: true});
                const createdPost = response.data;

                setPostID(createdPost.id);
                setView('Home');

                setSelectedCommunity('');
                setPostTitle('');
                setLinkFlair('');
                setNewLinkFlair('');
                setPostContent('');
                setErrors({
                    selectedCommunity: '',
                    postTitle: '',
                    linkFlair: '',
                    postContent: '',
                    server: '',
                });
            }
            catch (error) {
                console.error("Error creating post:", error);
                let serverError = "Failed to create post";
                if (error.response && error.response.data && error.response.data.error) {
                    serverError = error.response.data.error;
                }
                setErrors(prevErrors => ({ ...prevErrors, server: serverError }));

            }
        }
        else {
            setSelectedCommunity(selectedCommunity.trim());
            setPostTitle(postTitle.trim());
            setNewLinkFlair(newLinkFlair.trim());
            setPostContent(postContent.trim());
        }
    };

    const handleLinkFlairChange = (e) => {
        const value = e.target.value;
        setLinkFlair(value);

        if (value === "AddNewLinkFlair") {
            setShowNewLinkFlairInput(true);
            setNewLinkFlair("");
        }
        else {
            setShowNewLinkFlairInput(false);
            setNewLinkFlair("");
        }
    };

    return (

        <div>
            <Header />
            <div className="containerSideMain">
                <NavBar />
                <div id="main" className="main">
                    <div className="new-post-container">
                        <h2>Create a New Post</h2>
                        {errors.server && <div className="error-message"> {errors.server}</div>}
                        <form onSubmit={handleSubmit} className="new-post-form">
                            {/* community selection */}
                            <div className="form-group">
                                <label htmlFor="communitySelect">
                                    Select Community <span className="required">*</span>
                                </label>
                                <select
                                    id="communitySelect"
                                    value={selectedCommunity}
                                    onChange={(e) => setSelectedCommunity(e.target.value)} required>
                                    <option value="" style={{ fontStyle: 'italic' }}>Select a Community</option>
                                    {communities.map((community) => (
                                        <option key={community.id} value={community.id}>{community.name}</option>
                                    ))}
                                </select>
                                {errors.selectedCommunity && <span className="error-message">
                                    {errors.selectedCommunity}</span>}

                            </div>

                            {/* post title */}
                            <div className="form-group">
                                <label htmlFor="postTitle">Post Title <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="postTitle"
                                    value={postTitle}
                                    onChange={(e) => setPostTitle(e.target.value)}
                                    maxLength="100"
                                    required
                                />
                                {errors.postTitle && <span className="error-message"> {errors.postTitle}</span>}
                                <small>{postTitle.length}/100 chars</small>
                            </div>

                            {/* link flair */}
                            <div className="form-group">
                                <label htmlFor="linkFlairSelect"> Link Flair (Optional)</label>
                                <select
                                    id="linkFlairSelect"
                                    value={linkFlair}
                                    onChange={handleLinkFlairChange}
                                >
                                    <option value="" style={{ fontStyle: 'italic' }}>Select a Link Flair</option>
                                    {availableLinkFlairs.map((flair) => (
                                        <option key={flair.id} value={flair.id}>{flair.content}</option>
                                    ))}
                                    <option disabled>_______________</option>
                                    <option value="AddNewLinkFlair" style={{ fontWeight: "500" }}>Add New Link Flair</option>
                                </select>
                                {errors.linkFlair && <span className="error-message">{errors.linkFlair}</span>}
                            </div>
                            {showNewLinkFlairInput && (
                                <div className="form-group">
                                    <label htmlFor="newLinkFlair">New Link Flair (Optional)</label>
                                    <input
                                        type="text"
                                        id="newLinkFlair"
                                        value={newLinkFlair}
                                        onChange={(e) => setNewLinkFlair(e.target.value)}
                                        maxLength="30"
                                    />
                                    {errors.linkFlair && <span className="error-message">{errors.linkFlair}</span>}
                                    <small>{newLinkFlair.length}/30 characters</small>
                                </div>
                            )}
                            {/* post cont */}
                            <div className="form-group">
                                <label htmlFor="postContent">Post Content<span className="required">*</span></label>
                                <textarea
                                    id="postContent"
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    required
                                ></textarea>
                                {errors.postContent && <span className="error-message">{errors.postContent}</span>}
                            </div>

                            <button type="submit" className="submit-post-button">
                                Submit Post
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPost;