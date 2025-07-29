import NavBar from "../components/Navbar";
import Header from "../components/Header";
import Post from "../components/Post";
import "../stylesheets/PostPage.css";
import "../stylesheets/index.css";
import { useContext, useEffect, useState } from "react";
import { ViewContext } from "../context/ViewContext";
import Comments from "../components/Comments";
import axios from "axios";

const PostPage = () => {

    const { postID } = useContext(ViewContext);
    const [post, setPost] = useState(null);

    // get post given postID, easier to do this way so it can easily be passed to the Post component
    // only have to do this because the Post component needs the full post object and we only have the postID in the ViewContext
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

    return (
        <div>
            <Header />
            <div className="containerSideMain">
                <NavBar />
                <div className="individualContainer" id="individualContainer">
                    {post && <Post post={post} fullPost={true} />}
                    <div className="commentSectionDiv">
                        <Comments/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostPage;