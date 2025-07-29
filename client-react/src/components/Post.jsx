import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { ViewContext } from '../context/ViewContext';
import activeDownIcon from '../images/downvote_color.png';
import neutralDownIcon from '../images/downvote_neutral.png';
import activeUpIcon from '../images/upvote_color.png';
import neutralUpIcon from '../images/upvote_neutral.png';
import '../stylesheets/Post.css';
import { generateTimeStamp } from './utils';


function Post({ post, fullPost = false, showCommunityName = true, profilePost = false }) {
    const { setView, setPostID, setCommentID } = useContext(ViewContext);
    const { authUser } = useContext(UserContext); 

    const [communityName, setCommunityName] = useState('');
    const [linkFlair, setLinkFlair] = useState(null);
    const [numComments, setNumComments] = useState(0);

    const [votes, setVotes] = useState(post.votes);
    const [currentVote, setCurrentVote] = useState('none'); 

    const loggedIn = !!authUser;
    const canVote = loggedIn && authUser.reputation >= 50;

    // fetches ALL data for a post
    useEffect(() => {
        const fetchCommunityName = async () => {
            try {
                const name = await axios.get(`${process.env.REACT_APP_API_URL}/posts/getCommunityName/${post.id}`);
                setCommunityName(`c/${name.data.communityName}`);
            }
            catch (error) {
                console.error("Error fetching community name:", error);
            }
        }

        const fetchLinkFlair = async () => {
            try {
                if (!post.linkflairId) {
                    return;
                }
                const linkflair = await axios.get(`${process.env.REACT_APP_API_URL}/linkflairs/${post.linkflairId}`);
                setLinkFlair(linkflair.data.content);
            }
            catch (error) {
                if (error.response) {
                    if (error.response.status === 404) {
                        console.log('Post has no linkflair');
                    } else {
                        console.error('Error fetching link flair:', error.response.data.error);
                    }
                    console.error("Error fetching link flair:", error);
                }
            }
        }
        const fetchCommentsCount = async (commentIds) => {
            let count = 0;
            for (const commentID of commentIds) {
                count++;                
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/comments/${commentID}`);
                const nestedCommentIDs = response.data.replyIds;

                if (nestedCommentIDs.length > 0) {
                    for (const nestedCommentID of nestedCommentIDs) {
                        count += await fetchCommentsCount([nestedCommentID]);
                    }
                }
            }
            return count;
        };

        const getCommentsCount = async (commentIds) => {
            const count = await fetchCommentsCount(commentIds);
            setNumComments(count);
        };

        fetchCommunityName();
        fetchLinkFlair();
        getCommentsCount(post.commentIds);

    },[post]);

    useEffect(() => {
        const fetchUserVote = async () => {
            if (!authUser || !post || !post.id) return;
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/vote/post/myVote/${post.id}`, { withCredentials: true});
                if (response.data && response.data.vote) {
                    let vote = response.data.vote;
                    // Treat NOVOTE same as none for UI purposes
                    if (vote === 'NOVOTE') {
                        vote = 'none';
                    }
                    setCurrentVote(vote);
                }
            } catch (error) {
                console.error("Failed to fetch user vote state:", error);
            }
        };
        fetchUserVote();
    }, [authUser, post]);
    

    function onClickPost(postID) {
        setView("PostPage");
        setPostID(postID);
        if(authUser) {
            axios.put(`${process.env.REACT_APP_API_URL}/posts/updateViews/${postID}`, {}, {withCredentials: true})
                .catch(error => console.error("Error updating views :", error));
        }
    }

    const handleUpvote = async () => {
        if (!canVote || post.user.id === authUser.id) return; //if can't vote, do nothing
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/vote/post/${post.id}`, {voteType:'UPVOTE'}, {withCredentials:true});
            if(response.data.success) {
                setVotes(response.data.newVoteCount);
                let newVoteState = response.data.newVoteState;
                // Treat NOVOTE same as none for UI purposes
                if (newVoteState === 'NOVOTE') {
                    newVoteState = 'none';
                }
                setCurrentVote(newVoteState);
            }

        } catch(e) {
            console.error("Upvote failed", e);
        }
    };

    const handleDownvote = async () => {
        if (!canVote || post.user.id === authUser.id) return; //if can't vote, do nothing
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/vote/post/${post.id}`, 
                {voteType: 'DOWNVOTE'}, 
                {withCredentials:true}
            );
            if(response.data.success){
                setVotes(response.data.newVoteCount);
                let newVoteState = response.data.newVoteState;
                // Treat NOVOTE same as none for UI purposes
                if (newVoteState === 'NOVOTE') {
                    newVoteState = 'none';
                }
                setCurrentVote(newVoteState);
            }
        } catch(error) {
            console.error("Downvote failed:", error);
        }
    };

    //icon to show:
    let upIcon = neutralUpIcon;
    let downIcon = neutralDownIcon;

    if (currentVote === 'UPVOTE') {
        upIcon = activeUpIcon;
    } 
    if (currentVote === 'DOWNVOTE') {
        downIcon = activeDownIcon;
    }
    // NOVOTE or 'none' both mean no active vote


    // only for rendering posts on ****Profile Page****, will allow user to edit post
    function onClickPostTitle(postID){
        setPostID(postID);
        setView("EditPost");
        return;
    }


    // specifically for rendering posts on ****Profile Page****
    if (profilePost) {
        return (
                            <div className="admin-profilePostContainer" onClick={() => onClickPostTitle(post.id)}>
                <div className="admin-postTitle">
                    <h3>{post.title}</h3>
                </div>
            </div>
        );
    }

    //if user not logged in or rep < 50, we display icons but they're disabled.
    //if guest is viewing post page do not display at all.
    let votingSection = null;
    if (fullPost) {
        if (loggedIn) {
            votingSection = (
                <div className="votingSection">
                    <img 
                        src={upIcon} 
                        alt="upvote" 
                        onClick={canVote ? handleUpvote : undefined}
                        style={{ cursor: (canVote && post.user.id !== authUser.id) ? 'pointer' : 'default', opacity: canVote ? 1 : 0.5 }}
                    />
                    <img 
                        src={downIcon} 
                        alt="downvote"
                        onClick={canVote ? handleDownvote : undefined}
                        style={{ cursor: (canVote && post.user.id !== authUser.id)? 'pointer' : 'default', opacity: canVote ? 1 : 0.5 }}
                    />
                </div>
            );
        } 
        //if guest  don't show any voting icons
    }
    let commentButton = null;
    if (fullPost && loggedIn) {
        commentButton = (
            <div className="addCommentButtonContainer">
                <button onClick={() => {
                    setCommentID(null);
                    setView("NewComment");
                }}>Comment</button>
            </div>
        );
    }


    if (!fullPost) {
        return (
                                <div className="linkToPost nav-link" onClick={() => onClickPost(post.id)} style={{ cursor: "pointer" }}>
                <div className="post">
                    <div className="postHeader">
                        <p> u/{post.user.displayName}
                            {showCommunityName ? ` • ${communityName} ` : " "}
                                                         • {generateTimeStamp(post.datePosted)}</p>
                    </div>
                    <div className="postTitle">
                        <h3>{post.title}</h3>
                    </div>
                    {linkFlair && <div className="linkFlair"><p>{linkFlair}</p></div>}
                    <div className="postTextPreview">
                        <p>{post.content.trim().substring(0, 80)}</p>
                    </div>
                    <div className="postFooter">
                        <p>{post.views} views • {numComments} comments • {votes} votes</p>
                    </div>
                    {votingSection}
                </div>
            </div>
        );
    } else {
        return (
            <div className="postPage">
                <div className="topHeader">
                                          <p>{communityName} • {generateTimeStamp(post.datePosted)}</p>
                </div>
                <div className="postAuthor">
                                          <p>u/{post.user.displayName}</p>
                </div>
                <div className="postTitle">
                    <h3>{post.title}</h3>
                </div>
                {linkFlair && <div className="linkFlair"><p>{linkFlair}</p></div>}
                <div className="postContent">
                    <p>{post.content}</p>
                </div>
                <div className="postFooter">
                    <p>{post.views} views • {numComments} comments • {votes} votes</p>
                </div>
                {votingSection}
                {commentButton}
            </div>
        );
    }
}

export default Post;
