import { createContext, useState } from "react";
export const ViewContext = createContext({});

export function ViewContextProvider({ children }) {
    const [view, setView] = useState("WelcomePage");
    const [postID, setPostID] = useState(null);
    const [communityID, setCommunityID] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [commentID, setCommentID] = useState(null);
    const [adminSelectUser, setAdminSelectUser] = useState(null);

    return (
        <ViewContext.Provider 
        value={{ 
            view,
            setView, 
            postID, 
            setPostID, 
            communityID, 
            setCommunityID,
            searchQuery,
            setSearchQuery,
            searchResults,
            setSearchResults,
            commentID,
            setCommentID,
            adminSelectUser,
            setAdminSelectUser
            }}
        >

        {children}
        </ViewContext.Provider>
    );
}