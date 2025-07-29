import { useContext } from "react";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import PostPage from "./pages/PostPage";
import { ViewContext } from "./context/ViewContext";
import CreateCommunity from "./pages/CreateCommunityPage";
import CommunityPage from "./pages/CommunityPage";
import NewPost from "./pages/NewPost";
import NewComment from "./pages/NewCommentPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WelcomePage from "./pages/WelcomePage";
import ProfilePage from "./pages/ProfilePage";
import EditPost from "./pages/EditPost";
import EditCommunity from "./pages/EditCommunity";
import EditComment from "./pages/EditComment";
import AdminPage from "./pages/AdminPage";
import AdminSpecificPage from "./pages/AdminSpecificPage";

const Wrapper = () => {
    const { view} = useContext(ViewContext);
  
    let content;
    switch (view) {
      case "Home":
        content = <HomePage />;
        break;
      case "WelcomePage":
        content = <WelcomePage />;
        break;
      case "Login":
        content = <Login />;
        break;
      case "Register":
        content = <Register />;
        break;
      case "ProfilePage":
        content = <ProfilePage />;
        break;
      case "PostPage":
        content = <PostPage />;
        break;
      case "CommunityPage":
        content = <CommunityPage />;
        break;
      case "SearchPage":
        content = <SearchPage />;
        break;
      case "CreateCommunity":
        content = <CreateCommunity />;
        break;
      case "NewPost": 
        content = <NewPost />;
        break;
      case "NewComment":
        content = <NewComment />;
        break;
      case "EditPost":
        content = <EditPost />;
        break;
      case "EditCommunity":
        content = <EditCommunity />;
        break;
      case "EditComment":
        content = <EditComment />;
        break;
      case "AdminPage":
        content = <AdminPage />;
        break;
      case "AdminSpecificPage":
        content = <AdminSpecificPage />;
        break;
      default:
        content = <HomePage />;
        break;
    }

    return(
        <div>
            {content}
        </div>
    )
};

export default Wrapper;