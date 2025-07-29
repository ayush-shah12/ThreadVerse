import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ViewContext } from "../context/ViewContext";
import image from "../images/thinking-snoo.png";
import "../stylesheets/Comments.css";
import { generateTimeStamp } from "./utils";

import activeDownIcon from '../images/downvote_color.png';
import neutralDownIcon from '../images/downvote_neutral.png';
import activeUpIcon from '../images/upvote_color.png';
import neutralUpIcon from '../images/upvote_neutral.png';

const Comments = () => {

    const { postID, setView, setCommentID } = useContext(ViewContext);
    const { authUser } = useContext(UserContext); 

    const [post, setPost] = useState(null);
    const [renderedComments, setRenderedComments] = useState([]);

    const loggedIn = !!authUser;
    const canVote = loggedIn && authUser.reputation >= 50;

    // Fetch the post object
    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postID}`);
                setPost(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        getPost();
    }, [postID]);


    // same as original, just axios
    const getAllComments = async (dict, commentIds, postID, initialComment = null) => {
        if (!dict[postID]) {
            dict[postID] = [];
        }

        for (const commentID of commentIds) {

            try {
                let comment = await axios.get(`${process.env.REACT_APP_API_URL}/comments/${commentID}`);
                comment = comment.data;

                dict[postID].push({
                    "commentID": commentID,
                    "commentDate": comment.date,
                    "initialComment": initialComment
                });

                            if (comment.replyIds && comment.replyIds.length > 0) {
                await getAllComments(dict, comment.replyIds, postID, commentID);
                }
            } catch (error) {
                console.error(`Error fetching comment ${commentID}:`, error);
            }
        }

        return dict;
    };

    // run once post is fetched, sets the rendered comments state to display later
    useEffect(() => {
        const fetchComments = async () => {
            if (post && post.commentIds) {
                let dict = {};
                try {
                    await getAllComments(dict, post.commentIds, postID);

                    let commentsNested = transformData(dict[postID]);
                    sortTopLevelComments(commentsNested);
                    sortReplies(commentsNested);
                    if (commentsNested.length > 0) {
                        const renderedComments = await renderComments(commentsNested);
                        setRenderedComments(renderedComments);
                    }
                } catch (error) {
                    console.error("Error fetching comments:", error);
                }
            }
        };

        fetchComments();;
    }, [post]); 



    function transformData(comments) {
        const commentMap = {};

        comments.forEach(comment => {
            commentMap[comment.commentID] = { ...comment, replies: [] };
        });

        const nestedComments = [];

        comments.forEach(comment => {
            if (comment.initialComment === null) {
                nestedComments.push(commentMap[comment.commentID]);
            } else {
                const parent = commentMap[comment.initialComment];
                if (parent) {
                    parent.replies.push(commentMap[comment.commentID]);
                }
            }
        });
        return (nestedComments);
    }

    function sortTopLevelComments(comments) {
        comments.sort((a, b) => new Date(b.commentDate) - new Date(a.commentDate));
    }

    function sortReplies(comments) {
        for (const commentObject of comments) {
            if (commentObject.replies.length > 0) {
                commentObject.replies.sort((a, b) => new Date(b.commentDate) - new Date(a.commentDate));
                sortReplies(commentObject.replies);
            }
        }
    }

    // changed to return the rendered comments instead of displaying them here, bc it is async and map doesn't work with async
    const renderComments = async (comments) => {
        const renderedComments = await Promise.all(
            comments.map(async (comment) => {
                const commentDataRes = await axios.get(`${process.env.REACT_APP_API_URL}/comments/${comment.commentID}`);
                const commentData = commentDataRes.data;
                let currentVote = 'none';
                if (loggedIn) {
                    const voteRes = await axios.get(`${process.env.REACT_APP_API_URL}/vote/comment/myVote/${comment.commentID}`, { withCredentials: true });
                    currentVote = voteRes.data.vote || 'none';
                    // Treat NOVOTE same as none for UI purposes
                    if (currentVote === 'NOVOTE') {
                        currentVote = 'none';
                    }
                }

                let upIcon = neutralUpIcon;
                let downIcon = neutralDownIcon;

                        if (currentVote === 'UPVOTE') {
            upIcon = activeUpIcon;
        }
        if (currentVote === 'DOWNVOTE') {
            downIcon = activeDownIcon;
        }
        // NOVOTE or 'none' both mean no active vote

                const handleCommentUpvote = async () => {
                    if (!canVote || commentData.user.id === authUser.id) return;
                    try {
                        const response = await axios.post(`${process.env.REACT_APP_API_URL}/vote/comment/${comment.commentID}`, {voteType:'UPVOTE'}, {withCredentials:true});
                        if(response.data.success) {
                            commentData.votes = response.data.newVoteCount;
                            currentVote = response.data.newVoteState;
                            // Treat NOVOTE same as none for UI purposes
                            if (currentVote === 'NOVOTE') {
                                currentVote = 'none';
                            }
                            await fetchAll();                        }
                    } catch(e) {
                        console.error("Upvote failed", e);
                    }
                };

                const handleCommentDownvote = async () => {
                    if (!canVote || commentData.user.id === authUser.id) return;
                    try {
                        const response = await axios.post(`${process.env.REACT_APP_API_URL}/vote/comment/${comment.commentID}`, {voteType:'DOWNVOTE'}, {withCredentials:true});
                        if(response.data.success) {
                            commentData.votes = response.data.newVoteCount;
                            currentVote = response.data.newVoteState;
                            // Treat NOVOTE same as none for UI purposes
                            if (currentVote === 'NOVOTE') {
                                currentVote = 'none';
                            }
                            //re-render
                           await fetchAll();
                        }
                    } catch(e) {
                        console.error("Downvote failed", e);
                    }
                };

                const fetchAll = async () => {
                    if (post && post.commentIds) {
                        let dict = {};
                        try {
                            await getAllComments(dict, post.commentIds, postID);
                            let commentsNested = transformData(dict[postID]);
                            sortTopLevelComments(commentsNested);
                            sortReplies(commentsNested);
                            if (commentsNested.length > 0) {
                                const newlyRendered = await renderComments(commentsNested);
                                setRenderedComments(newlyRendered);
                            } else {
                                setRenderedComments([]);
                            }
                        } catch (error) {
                            console.error("Error fetching comments:", error);
                        }
                    }
                };
                const showVoting = () => loggedIn;
                const votingAllowed = canVote;

                return (
                                          <div key={comment.commentID} className="comment">
                        <div className="commentHeader">
                            <p>u/{commentData.user.displayName} • {generateTimeStamp(commentData.date)}</p>
                        </div>
    
                        <div className="commentContent">
                            <p>{commentData.content}</p>
                        </div>
                       
                        {loggedIn && showVoting() ? (
                            <div className="votingSection">
                                                            <img 
                                src={currentVote === 'UPVOTE' ? activeUpIcon : neutralUpIcon} 
                                    alt="upvote" 
                                    onClick={votingAllowed ? handleCommentUpvote : undefined}
                                    style={{ cursor:  (votingAllowed && commentData.user.id !== authUser.id) ? 'pointer' : 'default', opacity: votingAllowed ? 1 : 0.5 }}
                                />
                                                            <img 
                                src={currentVote === 'DOWNVOTE' ? activeDownIcon : neutralDownIcon} 
                                    alt="downvote"
                                    onClick={votingAllowed ? handleCommentDownvote : undefined}
                                    style={{ cursor:  (votingAllowed && commentData.user.id !== authUser.id) ? 'pointer' : 'default', opacity: votingAllowed ? 1 : 0.5 }}
                                />
                                 <p className = "voteCount" >{commentData.votes} votes </p>
                            </div>
                        ) : null}
    
                      
                        {loggedIn ? (
                          <div className="commentFooter">
                            <button onClick={() => {
                                setCommentID(comment.commentID);
                                setView("NewComment");
                            }}>Reply</button>
                          </div>
                        ) : null}
    
                        {comment.replies.length > 0 && (
                            <div className="replies">
                                {await renderComments(comment.replies)}
                            </div>
                        )}
                    </div>
                );
            })
        );
    
        return renderedComments;
    };

    return (
        <div>
            {renderedComments.length > 0 ? (
                <div>{renderedComments}</div>
            ) : (
                <div>
                    <p>No Comments yet. Be the first to comment!</p>
                    <br />
                    <img className="noCommentsImage" src={image} alt="No Comments" />
                    <br />
                    <p>Nobody's responded to this post yet. Add your thoughts and get the conversation going.</p>
                </div>
            )}
        </div>
    );
}

export default Comments;
