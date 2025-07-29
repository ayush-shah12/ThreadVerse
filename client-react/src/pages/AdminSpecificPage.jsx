// Specifcally made so Admin can view any user account
// Exact same as ProfilePage, but with one extra button to go back to AdminPage 
// this could have been done with ProfilePage, but no time to refactor (reason is that profilePage depends on the logged in user, while this page depends on the selected user)

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import Post from "../components/Post";
import { generateTimeStamp } from "../components/utils";
import { ViewContext } from "../context/ViewContext";
import "../stylesheets/ProfilePage.css";

const AdminSpecificPage = () => {

    const { adminSelectUser, setView, setCommunityID, setCommentID } = useContext(ViewContext);

    const [selection, setSelection] = useState("Posts");
    const [posts, setPosts] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selection === "Posts") {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/getByAuthor/${adminSelectUser.id}`, { withCredentials: true });
                    setPosts(response.data);
                } else if (selection === "Communities") {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/communities/getByAuthor/${adminSelectUser.id}`, { withCredentials: true });
                    setCommunities(response.data);
                } else if (selection === "Comments") {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/comments/getByAuthor/${adminSelectUser.id}`, { withCredentials: true });
                    setComments(response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selection, adminSelectUser._id]);


    function onClickCommunity(community) {
        setCommunityID(community.id);
        setView("EditCommunity");
        return;
    }

    // function renderComments() {
    //     return comments && comments.map((comment) => (
    //         <div key={comment.comment._id} className="linkToPost nav-link" onClick={() => { onClickComment(comment) }} style={{ cursor: "pointer" }}>
    //             <div className="comment">
    //                 <h4>
    //                     Post Title: {comment.postTitle}
    //                 </h4>
    //                 <h4>
    //                     Comment: {comment.comment.content.trim().substring(0, 20)}
    //                 </h4>
    //             </div>
    //         </div>
    //     ));
    // }

    function renderComments() {
        return comments && comments.map((comment) => (
            <div key={comment.comment._id} className="admin-linkToPost nav-link" onClick={() => { onClickComment(comment) }} style={{ cursor: "pointer" }}>
                <div className="admin-commentContainer2">
                    {/* <div key={comment.comment._id} className="admin-linkToPost nav-link" onClick={() => { onClickCommentAdmin(comment) }} style={{ cursor: "pointer" }}> */}
                    {/* <div className="admin-commentContainer2"> */}
                    <h4 className="admin-commentTitle">Post Title: {comment.postTitle}</h4>
                    <h4 className="admin-commentTitle">Comment: {comment.comment.content.trim().substring(0, 20)}</h4>
                </div>
            </div>
        ));
    }

    function onClickComment(comment) {
                        setCommentID(comment.comment.id);
        setView("EditComment");
        return;
    }

    return (
        <div>
            <Header />
            <div className="containerSideMain">
                <NavBar />
                <div id="main" className="main">
                    <header>
                        <h2 id="allposts">u/{adminSelectUser.displayName}'s Profile [VIEWING AS ADMIN] </h2>
                        <div className="buttonContainer">
                            <button
                                className={selection === "Posts" ? "selected" : ""}
                                onClick={() => { setSelection("Posts") }}
                            >
                                Posts
                            </button>
                            <button
                                className={selection === "Communities" ? "selected" : ""}
                                onClick={() => { setSelection("Communities") }}
                            >
                                Communities
                            </button>
                            <button
                                className={selection === "Comments" ? "selected" : ""}
                                onClick={() => { setSelection("Comments") }}
                            >
                                Comments
                            </button>
                            <button
                                className="backButton"
                                id="backButton"
                                onClick={() => { setView("AdminPage") }}                                
                            >
                                Back to Admin Page
                            </button>
                        </div>
                    </header>
                    <div className="postCountDiv">
                        <h4 id="numPosts">Email: {adminSelectUser.email}  </h4>
                        <h4 id="numPosts">Member Since: {generateTimeStamp(adminSelectUser.dateJoined)}  </h4>
                        <h4 id="numPosts">Reputation: {adminSelectUser.reputation}  </h4>
                    </div>

                    <div id="admin-postContainer" className="admin-postContainer">
                        {selection === "Posts" && (
                            posts.length > 0 ? (
                                posts.map((post) => (
                                    <Post key={post.id} post={post} profilePost={true} />
                                ))
                            ) : (
                                <p>No posts available.</p>
                            )
                        )}

                        {selection === "Communities" && (
                            communities.length > 0 ? (
                                communities.map((community) => (
                                    <div key={community.id} className="admin-communityContainer nav-link" onClick={() => { onClickCommunity(community) }} style={{ cursor: "pointer" }}>
                                        <div className="admin-communityTitle">
                                            <h3>{community.name}</h3>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No communities available.</p>
                            )
                        )}

                        {selection === "Comments" && (
                            comments.length > 0 ? (
                                <div className="admin-commentContainer">
                                    {renderComments()}
                                </div>
                            ) : (
                                <p>No comments available.</p>
                            )
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AdminSpecificPage;


