import React, { useEffect, useState , useCallback } from 'react';
import Navbar from '../navbar/Navbar';
import Products from '../products/Products';
import AddProduct from '../forms/AddProduct';
import SignUp from '../forms/SignUp';
import SignIn from '../forms/SignIn';
import { AuthContext } from '../../context/context';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

let logoutTimer;
const Container = () => {
    let routes;
    const [token, setToken] = useState(null);
    const [tokenExpiration, setTokenExpiration] = useState();
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState("");
    const [searchQ, setSearchQ] = useState({
      type: "",
      searchKeyWord: ""
    });
    // on logout
    const logout = useCallback(()=>{
      setToken(null);
      setUserId(null);
      setTokenExpiration(null)
      localStorage.removeItem("user");
    }, []);
    // on login
  const login = useCallback((uid, jwtToken, expirationDate)=>{
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpiration(tokenExpirationDate);
    setToken(jwtToken);
    setUserId(uid);
    setName(name)
    localStorage.setItem("user", JSON.stringify({
      userId:uid,
      token:jwtToken,
      expiration: tokenExpirationDate.toISOString()
    }))
  }, []);
  // handling logout timer
  useEffect(()=> {
    if(token && tokenExpiration){
      let remainingTime = tokenExpiration.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime)
    }else{
      clearTimeout(logoutTimer);
    }
  },[token, logout, tokenExpiration])
  // setting data on loggin user in
  useEffect(()=> {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if(userDetails && userDetails.token && new Date(userDetails.expiration) > new Date()){
      login(userDetails.userId, userDetails.token, new Date(userDetails.expiration));
    }
  },[login]);
  const search = (query) => {
    console.log(query)
    setSearchQ(query);
  };
  
  if(token){
    routes = (
      <React.Fragment>
      <Route path="/" element={<Products query={searchQ} />} />
      <Route path="/add" element={<AddProduct />} />
      <Route path="/edit" element={<AddProduct />} />
      <Route
        path="*"
        element={<Navigate to="/" replace />}
    />
      </React.Fragment>)
  }else{
    routes = (
      <React.Fragment>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route
        path="*"
        element={<Navigate to="/signup" replace />}
    />
        </React.Fragment>
    );
  }
    return (
      <AuthContext.Provider  value={{isLoggedIn:!!token,name:name, token:token,userId: userId ,login:login, logout:logout}}>
        <Router>
          <div className='container mx-auto px-2  min-h-screen'>
            <Navbar onSearch={search}/>
            <Routes>
              {routes}
            </Routes>
          </div>
        </Router>
      </AuthContext.Provider>
    );
}

export default Container;
