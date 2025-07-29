import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { sortPosts } from "../components/utils.js";
import { UserContext } from "../context/UserContext.jsx";
import { ViewContext } from "../context/ViewContext";
import "../stylesheets/HomePage.css";
import "../stylesheets/SearchPage.css";



import NoResultsImage from "../images/NoResults.svg";
const SearchPage = () => {
    const { searchQuery, searchResults } = useContext(ViewContext);
    const [sortedResults, setSortedResults] = useState([]);
    const [sort,setSort] = useState("Newest");
    const {authUser} = useContext(UserContext);


    useEffect(() => {
        const sortAndSetResults = async () => {
            if(!searchResults || searchResults.length === 0) {
                setSortedResults([]);
                return;
            }
            try {
               
                    //fetch all communities to map posts to communities
                    const communitiesResp = await axios.get(`${process.env.REACT_APP_API_URL}/communities`);
                    const allComm = communitiesResp.data;

                    //mappings from postID to community:
                    const postToComm = {};
                    allComm.forEach(community => {community.postIds.forEach(postID => {
                    postToComm[postID] = {
                        communityID: community.id,
                        communityName: community.name,
                    }; });});
                
                    //put community info in search results
                    const infoPosts = searchResults.map(post => ({
                        ...post,
                        communityID: postToComm[post.id]?.communityID || null,
                        communityName: postToComm[post.id]?.communityName || "N/A"
                    }));

                    //if user is not logged in, just display all the posts:

                if(!authUser) {
                    const sorted = await sortPosts(sort, infoPosts);
                    setSortedResults(sorted);
                }
                else {
                    //registered user
                    const userJoinedCommunities = allComm.filter(community => community.memberIds && community.memberIds.includes(authUser.id));
                    const userJoinedCommIDs = userJoinedCommunities.map(c=> c.id.toString());
                    const userCommPosts = infoPosts.filter(post => post.communityID && userJoinedCommIDs.includes(post.communityID.toString()));
                    const otherPosts = infoPosts.filter(post => !post.communityID || !userJoinedCommIDs.includes(post.communityID.toString()));
                    //sort both of them
                    const sortedUserCommPosts = await sortPosts(sort, userCommPosts);
                    const sortedOtherPosts = await sortPosts(sort, otherPosts);

                    //combine and mark separation:

                    let combined = [];
                    if (sortedUserCommPosts.length > 0) {
                        combined.push({ __type: "label", label: "Posts from Your Communities" });
                        combined = combined.concat(sortedUserCommPosts);
                    }
                    if (sortedOtherPosts.length > 0) {
                        combined.push({ __type: "label", label: "Posts from Other Communities" });
                        combined = combined.concat(sortedOtherPosts);
                    }
                setSortedResults(combined);

                }
                
                
            }catch(err) {
                console.error(err);
            }
            };

       

        
        sortAndSetResults();
    }, [sort, searchResults, authUser]);
    return (
        <div>
            <Header />
            <div className = "containerSideMain">
            <Navbar />
            <div id = "main" className = "main">
                {sortedResults.length > 0 ? (
                    <>
                    <header>
                        <h2>Results for: {searchQuery}</h2>
                        <div className="buttonContainer">
                            <button 
                                className={sort === "Newest" ? "selected" : ""} 
                                onClick={() => setSort("Newest")}
                            >
                                Newest
                            </button>
                            <button 
                                className={sort === "Oldest" ? "selected" : ""} 
                                onClick={() => setSort("Oldest")}
                            >
                                Oldest
                            </button>
                            <button 
                                className={sort === "Active" ? "selected" : ""} 
                                onClick={() => setSort("Active")}
                            >
                                Active
                            </button>
                        </div>
                    </header>
                    <div className="postCountDiv1">
                        <h3>Number of Posts: {sortedResults.filter(post => post.__type !== "label").length}</h3>
                    </div>
                    <div id="postContainer" className="postContainer">
                        {sortedResults.map((post, index) => {
                            if (post.__type === "label") {
                                return (
                                    <div key = {`label-${index}`} className = "post-divider">
                                        <h3>{post.label}</h3>
                                        <hr/>
                                        </div> 
                                );
                            }
                        return (
                            <Post key={post.id} post={post} />
                        );
                        })}
                    </div>
                </>
                ): (
                    <>
                    <header>
                        <h2>No results found for: {searchQuery}</h2>
                    </header>
                    <div className="postCountDiv1">
                        <h3>Number of Posts: {sortedResults.length}</h3>
                    </div>
                    <div id = "postContainer" className ="postContainer no-results-container">
                        <img src = {NoResultsImage} alt = "No results found" className = "no-results-image"></img>
                        <p>Hm... we couldn’t find any results</p>
                    </div>
                    </>
                )}
                </div>
            </div>
            </div>

                );
            };


export default SearchPage;