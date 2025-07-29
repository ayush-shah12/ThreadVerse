import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import { UserContext } from "../context/UserContext";
import { ViewContext } from "../context/ViewContext";
import "../stylesheets/NewPost.css";
import "../stylesheets/index.css";


const EditPost = () => {
    const { setView, postID } = useContext(ViewContext);
    const { authUser } = useContext(UserContext);

    //state for input forms
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');

    //immutable state for post data
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [linkFlair, setLinkFlair] = useState(null);



    //error states
    const [errors, setErrors] = useState({
        postTitle: '',
        postContent: '',
        server: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        let isValid = true;

        const newErrors = {
            postTitle: '',
            postContent: '',
            server: '',
        };

        if (postTitle.trim() === '') {
            newErrors.postTitle = "Post Title is required.";
            isValid = false;
        }
        else if (postTitle.length > 100) {
            newErrors.postTitle = "Post Title should not exceed 100 characters.";
            isValid = false;
        }

        if (postContent.trim() === "") {
            newErrors.postContent = "Post Content is required.";
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            try {
                const payload = {
                    updatedTitleOrName: postTitle.trim(),
                    updatedContentOrDescription: postContent.trim(),
                };

                await axios.put(`${process.env.REACT_APP_API_URL}/posts/update/${postID}`, payload, {withCredentials: true});

                setPostTitle('');
                setPostContent('');
                setErrors({
                    postTitle: '',
                    postContent: '',
                    server: '',
                });
                
                if(authUser.role === "admin"){
                    setView("AdminPage");
                }
                else{
                    setView("ProfilePage");
                }

            }
            catch (error) {
                console.error("Error UPDATING post:", error);
                let serverError = "Failed to update post";
                if (error.response && error.response.data && error.response.data.error) {
                    serverError = error.response.data.error;
                }
                setErrors(prevErrors => ({ ...prevErrors, server: serverError }));

            }
        }
        else {
            setPostTitle(postTitle.trim());
            setPostContent(postContent.trim());
        }
    };

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postID}`);
                const post = response.data;
                setPostTitle(post.title);
                setPostContent(post.content);
                setSelectedCommunity(post.community);
                if(post.linkflairId) {
                    const linkflair = await axios.get(`${process.env.REACT_APP_API_URL}/linkflairs/${post.linkflairId}`);
                    setLinkFlair(linkflair.data.content);
                }


                // Fetch the community name based on the selected community ID
                const communityResponse = await axios.get(`${process.env.REACT_APP_API_URL}/posts/getCommunityName/${postID}`);
                setSelectedCommunity(communityResponse.data.communityName);
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };

        fetchPostData();
    }, [postID]);

    const handleDelete = async () => {
        // alert("In Progress");
    };
    return (

        <div>
            <Header />
            <div className="containerSideMain">
                <NavBar />
                <div id="main" className="main">
                    <div className="new-post-container">
                        <h2>Edit Post</h2>
                        {errors.server && <div className="error-message"> {errors.server}</div>}
                        <form onSubmit={handleSubmit} className="new-post-form">

                            {/* community selection */}
                            <div className="form-group">
                                <label htmlFor="communitySelect">
                                    Community <span className="required">*</span>
                                </label>
                                <select
                                    id="communitySelect"
                                    value={selectedCommunity || ''}
                                    disabled
                                    style={{ cursor: "not-allowed" }}
                                >
                                    <option value={selectedCommunity}>c/{selectedCommunity}</option>
                                </select>
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
                                <label htmlFor="linkFlairSelect"> Link Flair</label>
                                <select
                                    id="linkFlairSelect"
                                    value={linkFlair || ''}
                                    disabled
                                    style={{ cursor: "not-allowed" }}
                                >
                                    <option value={linkFlair} style={{ fontStyle: 'italic' }}>{linkFlair}</option>
                                </select>
                                {errors.linkFlair && <span className="error-message">{errors.linkFlair}</span>}
                            </div>

                            {/* post cont */}
                            <div className="form-group">
                                <label htmlFor="postContent">Post Content<span className="required"> *</span></label>
                                <textarea
                                    id="postContent"
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    required
                                ></textarea>
                                {errors.postContent && <span className="error-message">{errors.postContent}</span>}
                            </div>

                            <button type="submit" className="submit-post-button">
                                Update Post
                            </button>
                        </form>
                        <button onClick={handleDelete} className="delete-comment-button">Delete Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPost;