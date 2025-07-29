import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import Post from "../components/Post";
import { generateTimeStamp } from "../components/utils";
import { UserContext } from "../context/UserContext";
import { ViewContext } from "../context/ViewContext";
import "../stylesheets/AdminPage.css";


const AdminPage = () => {
    const { authUser } = useContext(UserContext);
    const { setView, setCommunityID, setCommentID, setAdminSelectUser } = useContext(ViewContext);

    const [selection, setSelection] = useState("Users");
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [comments, setComments] = useState([]);

    function onClickCommunity(community) {
        setCommunityID(community.id);
        setView("EditCommunity");
        return;
    }


    function renderComments() {
        return comments && comments.map((comment) => (
            <div key={comment.comment._id} className="admin-linkToPost nav-link" onClick={() => { onClickCommentAdmin(comment) }} style={{ cursor: "pointer" }}>
            <div className="admin-commentContainer2">
                {/* <div key={comment.comment._id} className="admin-linkToPost nav-link" onClick={() => { onClickCommentAdmin(comment) }} style={{ cursor: "pointer" }}> */}
                    {/* <div className="admin-commentContainer2"> */}
                    <h4 className="admin-commentTitle">Post Title: {comment.postTitle}</h4>
                    <h4 className="admin-commentTitle">Comment: {comment.comment.content.trim().substring(0, 20)}</h4>
                </div>
            </div>
        ));
    }

    function onClickCommentAdmin(comment) {
                        setCommentID(comment.comment.id);
        setView("EditComment");
        return;
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selection === "Users") {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/all`, { withCredentials: true });
                    setUsers(response.data);
                } else if (selection === "Posts") {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts`, { withCredentials: true });
                    setPosts(response.data);
                } else if (selection === "Communities") {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/communities`, { withCredentials: true });
                    setCommunities(response.data);
                } else if (selection === "Comments") {
                    if (users.length === 0) {
                        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users/all`, { withCredentials: true });
                        setUsers(userResponse.data);
                        if (userResponse.data.length === 0) {
                            console.log("No users available.");
                            return;
                        }
                    }

                    const allComments = [];
                    for (const user of users) {
                        const commentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/comments/getByAuthor/${user.id}`);
                        allComments.push(...commentResponse.data);
                    }
                    setComments(allComments);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selection]);

    function onClickCommunity(community) {
        setCommunityID(community.id);
        setView("EditCommunity");
        return;
    }

    function onClickAccount(user) {
        setAdminSelectUser(user);
        setView("AdminSpecificPage");
        return;

    }

    return (
        <div>
            <Header />
            <div className="containerSideMain">
                <NavBar />
                <div id="main" className="main">
                    <header>
                        <h2 id="allposts">Admin Profile: {authUser.displayName}</h2>
                        <div className="buttonContainer">
                            <button
                                className={selection === "Users" ? "selected" : ""}
                                onClick={() => { setSelection("Users") }}
                            >
                                All Users
                            </button>
                            <button
                                className={selection === "Posts" ? "selected" : ""}
                                onClick={() => { setSelection("Posts") }}
                            >
                                All Posts
                            </button>
                            <button
                                className={selection === "Communities" ? "selected" : ""}
                                onClick={() => { setSelection("Communities") }}
                            >
                                All Communities
                            </button>
                            <button
                                className={selection === "Comments" ? "selected" : ""}
                                onClick={() => { setSelection("Comments") }}
                            >
                                All Comments
                            </button>
                        </div>
                    </header>
                    <div className="admin-postCountDiv">
                        <h4 id="admin-numPosts">Email: {authUser.email}</h4>
                        <h4 id="admin-numPosts">Member Since: {generateTimeStamp(authUser.dateJoined)}</h4>
                        <h4 id="admin-numPosts">Reputation: {authUser.reputation}</h4>
                    </div>

                    <div id="admin-postContainer" className="admin-postContainer">
                        {selection === "Users" && (
                            users.length > 0 ? (
                                users.map((user) => (
                                    
                                    <div key={user._id} className="admin-user" onClick={() => { onClickAccount(user) }} style={{ cursor: "pointer" }}>
                                        <h3>{user.displayName}</h3>
                                        <p>Email: {user.email}</p>
                                        <p>Reputation: {user.reputation}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No users available.</p>
                            )
                        )}

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
    );
};

export default AdminPage;