import axios from "axios";
import React, { useContext, useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import { UserContext } from "../context/UserContext.jsx";
import { ViewContext } from "../context/ViewContext.jsx";
import "../stylesheets/NewComment.css";

const NewComment = () => {
    const { setView, postID, commentID} = useContext(ViewContext);
    const { authUser } = useContext(UserContext);

    //state forms
    const [commentContent, setCommentContent] = useState("");

    //error states
    const [errors, setErrors] = useState({
        commentContent: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        let isValid = true;
        const validationErrors = {
            commentContent: "",
        };

        if(commentContent.trim() === "") {
            validationErrors.commentContent = "Comment content is required.";
            isValid = false;
        }
        else if(commentContent.length > 500) {
            validationErrors.commentContent = "Comment should not exceed 500 characters.";
            isValid = false;
        }

        setErrors(validationErrors);

        if(isValid) {
            try {
            const newCommentData = {
                content: commentContent.trim()
            };
            if(commentID) {
                //reply to another comment
                await axios.post(`${process.env.REACT_APP_API_URL}/comments/reply/comment/${commentID}`, newCommentData, {withCredentials: true});
            }
            else{
                await axios.post(`${process.env.REACT_APP_API_URL}/comments/reply/post/${postID}`, newCommentData, {withCredentials: true});
            }
            //reset
            setCommentContent("");
            setErrors({
                commentContent: "",
            });
            setView("PostPage")
        }
         catch (error) {
            console.error("Failed to submit comment", error);
        }
    }
        else {
            setCommentContent(commentContent.trim());
        }
    };

    return (
        <div>
            <Header />
            <div className = "containerSideMain">
                <NavBar />
                <div id = "main" className = "main">
                    <div className = "new-comment-container">
                        <h2>Add a Comment </h2>
                        <form onSubmit = {handleSubmit} className = "new-comment-form">
                            {/* comment content */}
                            <div className = "form-group">
                                <label htmlFor = "commentContent">
                                    Comment Content <span className ="required">*</span>
                                </label>
                                <textarea
                                id = "commentContent"
                                value = {commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                maxLength = "500"
                                required></textarea>
                                {errors.commentContent && (
                                    <span className = "error-message">{errors.commentContent}</span>
                                
                                )}
                                <small>{commentContent.length}/500 chars</small>
                            </div>

                            {/* username */}
                            {/* <div className = "form-group">
                                <label htmlFor = "username">
                                    Username <span className ="required">*</span>
                                </label>
                                <input
                                type = "text"
                                id = "username"
                                value = {username}
                                onChange =  {(e) => setUsername(e.target.value)}
                                required
                                />
                                {errors.username && (
                                    <span className = "error-message">{errors.username}</span>
                                )}
                            </div> */}
                            <button type = "submit" className = "submit-comment-button">
                                Submit Comment
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewComment;

