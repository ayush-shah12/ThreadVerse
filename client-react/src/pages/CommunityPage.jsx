import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { generateTimeStamp } from "../components/utils";
import { sortPosts } from "../components/utils.js";
import { UserContext } from "../context/UserContext.jsx";
import { ViewContext } from "../context/ViewContext";
import "../stylesheets/CommunityPage.css";
import "../stylesheets/index.css";


const CommunityPage = () => {
    const { communityID, setView } = useContext(ViewContext);
    const { authUser } = useContext(UserContext);
    const [sortOption, setSortOption] = useState("Newest");
    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);

 
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/communities/` + communityID);
                setCommunity(response.data);
                const response2 = await axios.get(`${process.env.REACT_APP_API_URL}/posts/getByCommunity/` + communityID);
                const s = await sortPosts(sortOption, response2.data); // Need to AWAIT or it will cause errors
                setPosts(s);
                
            } catch (error) {
                console.error(error);
                alert("System Error: Returning to welcome page");
                setView("WelcomePage");
            }
        };
        useEffect(() => {
        fetchPosts();

    }, [communityID, sortOption, setView]);

    let isMember = false;
    if(authUser && community && community.memberIds) {
        isMember = community.memberIds.includes(authUser.id);
    }

    const handleJoin = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/communities/join/${communityID}`,{}, {withCredentials:true});
            if(response.data.success) {
                fetchPosts();
            }
        } catch(err) {
            console.error(err);
        }
    };
    
    const handleLeave = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/communities/leave/${communityID}`,{}, {withCredentials:true});
            if(response.data.success) {
                fetchPosts();
            }
        } catch(err) {
            
            console.error(err);
        }
    };
    

    return (
        <div>
            <Header />
            <div className="containerSideMain">
                <Navbar />
                <div id="main" className="main">
                    <header className="communityHeader">
                        <div className="communityInfo">
                            <h2>c/{community && community.name}</h2>
                            <p>{community && community.description}</p>
                            {community && community.user && (
                                <p className="communityCreatedBy">
                                Created by u/{community.user.displayName} {generateTimeStamp(community && community.dateCreated)}
                            </p>)}
                            <h4>Posts: {community && community.postIds.length} | Members: {community && community.memberIds.length}
                            </h4>
                            {/* join/leave*/}
                            {authUser ? (
                                isMember ? (
                                    <button className="joinLeaveButton" onClick={handleLeave}>Leave Community</button>)
                                    : (
                                        <button className="joinLeaveButton" onClick={handleJoin}>Join Community</button>
                                    )
                                ) : null}
                           
                        </div>

                        <div className="buttonContainer">
                            <button 
                                className={sortOption === "Newest" ? "selected" : ""} 
                                onClick={() => setSortOption("Newest")}
                            >
                                Newest
                            </button>
                            <button 
                                className={sortOption === "Oldest" ? "selected" : ""} 
                                onClick={() => setSortOption("Oldest")}
                            >
                                Oldest
                            </button>
                            <button 
                                className={sortOption === "Active" ? "selected" : ""} 
                                onClick={() => setSortOption("Active")}
                            >
                                Active
                            </button>
                        </div>
                    </header>
                    <div id="postContainer" className="postContainer">
                        {posts.map((post) => (
                            <Post key={post.id} post={post} showCommunityName={false} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;