import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import './App.css';
import Navbar from './components/nav/nav';
import Signup from './components/signup/signup';
import Login from './components/login/login';
import Profile from './components/profile/Profile';
import Landing from './components/landing/landing';
import CreateCampaign from './components/create_campaign/Create_Campaign';
import IndividualCampaign from './components/individual_campaign/Individual_Campaign';
import Donate from './components/donate/Donate';
import Browser from './components/browser/Browser';
import UpdateCampaign from './components/update/Update';



function App() {
  // const [token, setToken] = useState("");
	// const [userID, setUserID] = useState("");

  // Initialize the isLoggedIn state as false (user is not logged in)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.token || "");
  const [userID, setUserID] = useState(localStorage.userID || "");
  const [isAdmin, setIsAdmin] = useState(localStorage.isAdmin || "");
  
  useEffect(() => {
    console.log("TOKEN:", token);
    console.log("UserId:", userID);
    console.log("isAdmin:", isAdmin);
  }, [token, userID, isAdmin]);
  // useEffect(() => {
	// 	setToken(localStorage.token);
	// 	setUserID(localStorage.userID);
	// console.log("TOKEN:", token);
    
  //   console.log("UserId:", userID)}, 
	//  []);

  function initializeToken() {
    const storedToken = localStorage.token;
    console.log("TOKEN:", storedToken);

    if (storedToken) {
      setToken(storedToken);
      // Set the isLoggedIn state to true when a token is loaded from local storage
      setIsLoggedIn(true);
    }
  }

  function updateToken(newToken, newUserID, newIsAdmin) {
    setToken(newToken);
    localStorage.token = newToken;
		setUserID(newUserID);
		localStorage.userID = newUserID;
    setIsAdmin(newIsAdmin);
		localStorage.isAdmin = newIsAdmin;

    // Set the isLoggedIn state to true when a token is updated (user is logged in)
    setIsLoggedIn(true);
  }

  function clearToken() {
    setToken(""); // Clear the token when logging out
    localStorage.removeItem("token"); // Remove the token from local storage

    // Set the isLoggedIn state to false when the user logs out
    setIsLoggedIn(false);
  }
  return (
		<>
    <BrowserRouter>
      <Navbar token={token} clearToken={clearToken} />
      <Routes>
      <Route path="/" element={<Landing token={token} clearToken={clearToken} />} />
      <Route path="/signup" element={<Signup setToken={updateToken} />} />
      <Route path="/login" element={<Login setToken={updateToken} />} />
      <Route path="/profile" element={<Profile setToken={updateToken} token={token} userID={userID} isAdmin={isAdmin}/>} />
      <Route path="/create" element={<CreateCampaign setToken={updateToken} token={token} />} />
      <Route path="/campaign" element={<IndividualCampaign token={token} userID={userID}/>} />
      <Route path="/browser" element={<Browser />} />
      <Route path="/update/:campaignId" element={<UpdateCampaign token={token} />} />
      <Route path="/donate" element={<Donate userID={userID} />} />
      </Routes>
    </BrowserRouter>
		</>
  );
}

export default App;
