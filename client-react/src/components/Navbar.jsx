import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ViewContext } from "../context/ViewContext";
import "../stylesheets/Navbar.css";

const NavBar = () => {

  const [communities, setCommunities] = useState([]);
  const { view, setView, communityID, setCommunityID } = useContext(ViewContext);
  const { authUser } = useContext(UserContext); 

  
  const handleNavigation = (targetView, params = {}) => {
    setView(targetView);
    if(params.communityID) {
      setCommunityID(params.communityID);
    }
    else{
      setCommunityID(null);
    }
  };

  useEffect(() => {
    const fetchCommunities = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/communities`);
           let allCommunities = response.data;
           if(authUser){
            //sort comms so that the ones joined by the user appear first
                       const joinedCommunities = allCommunities.filter(c => c.memberIds && c.memberIds.includes(authUser.id));
           const otherCommunities = allCommunities.filter(c=>!c.memberIds || !c.memberIds.includes(authUser.id));
            allCommunities = [...joinedCommunities, ...otherCommunities];
           }
           setCommunities(allCommunities);
            
        } catch (error) {
            console.error(error);
        }
    }
    fetchCommunities();
}, [authUser]);

  const handleCreateCommunity = () => {
    if (authUser) {
      handleNavigation("CreateCommunity");
   } else {
      // guest user scenario
      alert("Please log in to create a community.");
   }
  };
  return (
    <div className="sidebar">
      <ul>
        <div style={{ cursor: "pointer" }} 
        onClick={() => { setView("Home"); setCommunityID(null); }} className="nav-link active">
          <li style={{backgroundColor: (view === "Home") ? "#6366F1" : ""}}
          className="home-link">
            Home
          </li>
        </div>
        <hr className="nav-divider" />
        <h3 className="communities-header" style={{ marginLeft: "5px", marginBottom: "5px" }}>
          Communities
        </h3>
        <div className="create-community-link">
          <li className={`createCommunity${view ==="CreateCommunity" ? "active" : ""}
          ${!authUser? "disabled-community" : ""}`}
           style={{ cursor: authUser? "pointer" : "not-allowed", paddingLeft: "40px", backgroundColor: (view === "CreateCommunity") ? "#6366F1" : "", opacity: !authUser ? 0.5 : 1 }}
           onClick= {handleCreateCommunity}>
            Create Community
          </li>
        </div>
        <li className="list-communities-li">
          <ol id="list-communities-ol" className="list-communities-ol">
            {communities.map((community) => (
              <li key={community.id}>
                <div 
                  className="nav-link"
                  style={{cursor: "pointer"}}
                  onClick = {() => {
                    setView("CommunityPage"); 
                    setCommunityID(community.id);
                  }}
                >
                  <p style={{color: (view === "CommunityPage" && community.id === communityID) ? "#6366F1" : "", fontWeight: (view === "CommunityPage" && community.id === communityID) ? "bold" : ""}}>c/{community.name}</p>
                </div>
              </li>
            ))}
          </ol>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;