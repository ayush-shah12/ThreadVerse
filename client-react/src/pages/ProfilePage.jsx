import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import Post from "../components/Post";
import { generateTimeStamp } from "../components/utils";
import { UserContext } from "../context/UserContext";
import { ViewContext } from "../context/ViewContext";
import "../stylesheets/ProfilePage.css";

const ProfilePage = () => {
    const { authUser } = useContext(UserContext);
    const { setView, setCommunityID, setCommentID } = useContext(ViewContext);

    const [selection, setSelection] = useState("Posts");
    const [posts, setPosts] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selection === "Posts") {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/getByAuthor/${authUser.id}`);
                    setPosts(response.data);
                } else if (selection === "Communities") {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/communities/getByAuthor/${authUser.id}`);
                    setCommunities(response.data);
                } else if (selection === "Comments") {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/comments/getByAuthor/${authUser.id}`);
                    setComments(response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selection, authUser.id]);


    function onClickCommunity(community) {
        setCommunityID(community.id);
        setView("EditCommunity");
        return;
    }

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
                        <h2 id="allposts">u/{authUser.displayName}'s Profile</h2>
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
                        </div>
                    </header>
                    <div className="postCountDiv">
                        <h4 id="numPosts">Email: {authUser.email}  </h4>
                        <h4 id="numPosts">Member Since: {generateTimeStamp(authUser.dateJoined)}  </h4>
                        <h4 id="numPosts">Reputation: {authUser.reputation}  </h4>
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

export default ProfilePage;


