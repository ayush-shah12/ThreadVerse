import axios from "axios"
import { useContext, useEffect, useState } from "react"
import Header from "../components/Header"
import NavBar from "../components/Navbar"
import Post from "../components/Post"
import { sortPosts } from "../components/utils.js"
import { UserContext } from "../context/UserContext.jsx"
import { ViewContext } from "../context/ViewContext"
import "../stylesheets/HomePage.css"
import "../stylesheets/index.css"


const HomePage = () => {

    const [posts, setPosts] = useState([]);
    const [numPosts, setNumPosts] = useState(0);
    const [sort, setSort] = useState("Newest"); // active sort not working for now
    const {authUser} = useContext(UserContext);
    const { setView } = useContext(ViewContext);




    useEffect(() => {
        const fetchPosts = async () => {
            try {
                //fetch all posts
                const postResp = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
                let allPosts = postResp.data;

                //fetch all communities
                const communitiesResp = await axios.get(`${process.env.REACT_APP_API_URL}/communities`);
                const allComm = communitiesResp.data;

                //mappings from postID to community:
                const postToComm = {};
                allComm.forEach(community => {community.postIds.forEach(postID => {
                    postToComm[postID] = {
                        communityID: community.id,
                        communityName: community.name
                    };
                });});

                //assigning community info to each post:
                const infoPosts = allPosts.map(post => ({
                    ...post,
                    communityID: postToComm[post.id]?.communityID || null,
                    communityName: postToComm[post.id]?.communityName || "N/A"
                }));

                //if user is not logged in, just display all the posts:

                if(!authUser) {
                    const s = await sortPosts(sort, infoPosts);
                    setPosts(s);
                    setNumPosts(infoPosts.length);
                    return;
                }
                //if logged in:
                //first we get the posts that the user joined.
                //fetch them by filtering communities where user is a member
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

                setPosts(combined);
                setNumPosts(infoPosts.length);
                
            } catch (error) {
                console.error(error);
                setView("WelcomePage");
            }
        }
        fetchPosts();
    }, [sort, authUser, setView]);

    return (
        <div>
            <Header />
            <div className="containerSideMain">
                <NavBar />
                <div id="main" className="main">
                    <header>
                        <h2 id="allposts">All Posts</h2>
               
                        <div className="buttonContainer">
                            <button 
                                className={sort === "Newest" ? "selected" : ""} 
                                onClick={() => { setSort("Newest") }}
                            >
                                Newest
                            </button>
                            <button 
                                className={sort === "Oldest" ? "selected" : ""} 
                                onClick={() => { setSort("Oldest") }}
                            >
                                Oldest
                            </button>
                            <button 
                                className={sort === "Active" ? "selected" : ""} 
                                onClick={() => { setSort("Active") }}
                            >
                                Active
                            </button>
                        </div>
                    </header>
                    <div className="postCountDiv">
                        <h3 id="numPosts">Number of Posts: {numPosts} </h3>
                    </div>
                    <div id="postContainer" className="postContainer">
                        {posts && posts.map((post, index) => {
                            if(post.__type === "label") {
                                {
                 
                                    return (
                                        // key warning with react without key:
                                        <div key={`label-${index}`} className="post-divider"> 
                                            <h3>{post.label}</h3>
                                            <hr />
                                        </div>
                                    );
                                }
                            }
                            return (
                                <Post key={post.id} post={post}></Post>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;