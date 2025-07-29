import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { ViewContext } from "../context/ViewContext";
import logo from "../images/logo.svg";
import "../stylesheets/Header.css";
import "../stylesheets/index.css";

const Header = () => {
    const {view, setView, setSearchQuery, setSearchResults } = useContext(ViewContext);
    const [searchInput, setSearchInput] = useState("");
    const [placeholder, setPlaceholder] = useState("");
    const { authUser, setAuthUser } = useContext(UserContext);

    // if the user is logged in, clicking the logo should take them to the home page
    // if the user is not logged in, clicking the logo should take them to the welcome page
    const logoClick = () =>{
        if(authUser){
            setSearchInput("")
            setView("Home");
        }
        else{
            setSearchInput("")
            setView("WelcomePage");
        }
    }

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
      };
    
      const handleSearchKeyPress = async (e) => {
        if (e.key === "Enter") {
          //trigger the search
          try {
            //send search query to the server:
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/search`, {
              params: { query: searchInput }
            });
            setSearchResults(response.data);
            setSearchQuery(searchInput);

            setView("SearchPage");
            setSearchInput(""); //clear the search input
          }
          catch(error) {
            console.error ("Search Failed: ", error);
          }
          
        }
      };

      const handleLogout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/users/logout`, {}, { withCredentials: true });
            setAuthUser(null);
            setView("WelcomePage");
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Logout failed. Please try again");
        }
    };

    const handleProfileClick = () => {
      if(authUser) {
        if(authUser.role === "ADMIN"){
          setView("AdminPage");
        }
        else{
          setView("ProfilePage");
        }
      }
      else {
        alert("Please log in to view profile.");
      }
    };

    const handleCreatePost = () => {
      if(authUser) {
        setView("NewPost");
      } else {
        alert("Please log in to create a post");
      }
    };

    // Dynamic typing effect for search placeholder
    useEffect(() => {
        const searchSuggestions = [
            "Search communities...",
            "Search posts...", 
            "Search users...",
            "Search for news...",
            "Search for memes...",
            "Search programming...",
            "Search technology..."
        ];
        
        let currentIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        
        const typeEffect = () => {
            if (isPaused) return;
            
            const currentSuggestion = searchSuggestions[currentIndex];
            
            if (!isDeleting && charIndex <= currentSuggestion.length) {
                setPlaceholder(currentSuggestion.substring(0, charIndex));
                charIndex++;
                
                if (charIndex > currentSuggestion.length) {
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                        isDeleting = true;
                    }, 2000);
                }
            } else if (isDeleting && charIndex >= 0) {
                setPlaceholder(currentSuggestion.substring(0, charIndex));
                charIndex--;
                
                if (charIndex < 0) {
                    isDeleting = false;
                    currentIndex = (currentIndex + 1) % searchSuggestions.length;
                    charIndex = 0;
                }
            }
        };
        
        const timer = setInterval(typeEffect, isDeleting ? 50 : 150);
        
        return () => clearInterval(timer);
    }, []);
    
    return (
        <nav>
            <div style={{cursor: "pointer"}}
            onClick={logoClick}
              className="nav-link logo-name">
                <img src={logo} alt="logo" className="logo"/>
                    {/* <p style={{paddingLeft: "5%"}}>phreddit</p> */}
            </div>

            <input 
            type="text" 
            id="searchBox" 
            placeholder={placeholder || "Search Threadverse..."} 
            className="search"
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyDown={handleSearchKeyPress}/>

        <div className="button-container">
                <button style={{backgroundColor: (view === "NewPost") ? "#6366F1" : ""}} 
                className={`create nav-link ${!authUser ? 'disabled-button' : ''}`}
                onClick={handleCreatePost}
                disabled = {!authUser}>
                    Create Post 
                </button>
                {/* profile button */}
                <button 
                    style={{backgroundColor: (view === "ProfilePage" || view === "AdminPage") ? "#6366F1" : ""}} 
                    className="user nav-link" 
                    onClick={handleProfileClick}
                >
                  {authUser ? authUser.displayName : "Guest"}
                </button>

                {authUser && (
                <button className="logout nav-link" onClick={handleLogout}>
                    Logout
                </button>
            )}

            </div>
        </nav>
    );
}

export default Header;

