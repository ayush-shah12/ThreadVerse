import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import { UserContext } from "../context/UserContext.jsx";
import { ViewContext } from "../context/ViewContext.jsx";
import "../stylesheets/NewComment.css";

const EditComment = () => {
    const { setView, commentID } = useContext(ViewContext);
    const { authUser } = useContext(UserContext);


    //state forms
    const [commentContent, setCommentContent] = useState("");

    //error states
    const [errors, setErrors] = useState({
        commentContent: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/comments/${commentID}`);
                setCommentContent(response.data.content);
            } catch (error) {
                console.error("Failed to fetch comment data", error);
                setErrors({
                    commentContent: "Failed to fetch original comment data",
                });
            }
        };

        fetchData();
    }, [commentID]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let isValid = true;
        const validationErrors = {
            commentContent: "",
        };

        if (commentContent.trim() === "") {
            validationErrors.commentContent = "Comment content is required.";
            isValid = false;
        }
        else if (commentContent.length > 500) {
            validationErrors.commentContent = "Comment should not exceed 500 characters.";
            isValid = false;
        }

        setErrors(validationErrors);

        if (isValid) {
            try {
                const newCommentData = {
                    updatedContentOrDescription: commentContent.trim(),
                };
                await axios.put(`${process.env.REACT_APP_API_URL}/comments/update/${commentID}`, newCommentData, {withCredentials: true});

                //reset
                setCommentContent("");
                setErrors({
                    commentContent: "",
                });
                if(authUser.role === "admin"){
                    setView("AdminPage");
                }
                else{
                    setView("ProfilePage");
                }
            }
            catch (error) {
                setErrors({
                    commentContent: "Failed to submit comment",
                });
                console.error("Failed to submit comment", error);
            }
        }
        else {
            setCommentContent(commentContent.trim());
        }
    };

    const handleDelete = async () => {
        // alert("In Progress");
    //     try {
    //         await deleteCommentAndReplies(commentID);
    //         console.log("Comment and replies deleted successfully");
    //         setView("ProfilePage");
    //     } catch (error) {
    //         setErrors({
    //             server: "Failed to delete comment",
    //         });
    //         console.error("Failed to delete comment", error);
    //     }
    };

    // const deleteCommentAndReplies = async (commentID) => {
    //     try {
    //         const response = await axios.get(`${process.env.REACT_APP_API_URL}/comments/${commentID}/replies`);
    //         const replies = response.data;

    //         console.log("replies", replies);
    //         for (const reply of replies) {
    //             await deleteCommentAndReplies(reply);
    //         }

    //         await axios.delete(`${process.env.REACT_APP_API_URL}/comments/delete/${commentID}`);
    //         return;
    //     } catch (error) {
    //         console.error("Error deleting comment or its replies:", error);
    //         throw error;
    //     }
    // };

    return (
        <div>
            <Header />
            <div className="containerSideMain">
                <NavBar />
                <div id="main" className="main">
                    <div className="new-comment-container">
                        <h2>Add a Comment </h2>
                        <form onSubmit={handleSubmit} className="new-comment-form">
                            {/* comment content */}
                            <div className="form-group">
                                <label htmlFor="commentContent">
                                    Comment Content <span className="required">*</span>
                                </label>
                                <textarea
                                    id="commentContent"
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    maxLength="500"
                                    required></textarea>
                                {errors.commentContent && (
                                    <span className="error-message">{errors.commentContent}</span>

                                )}
                                <small>{commentContent.length}/500 chars</small>
                            </div>

                            <button type="submit" className="submit-comment-button">
                                Submit Comment
                            </button>
                        </form>
                        <button onClick={handleDelete} className="delete-comment-button">Delete Comment</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditComment;

