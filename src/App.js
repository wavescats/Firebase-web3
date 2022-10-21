import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./routes/Home";
import Auth from "./routes/Auth";
import Profile from "./routes/Profile";
import { authService } from "./firebase";
import Nav from "./components/Nav";

function App() {
  const [init, setInit] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
        setUserObj(user);
      } else {
        setIsLogin(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      <Router>
        {isLogin && <Nav />}
        {init ? (
          <Routes>
            {isLogin ? (
              <>
                <Route path="/" element={<Home userObj={userObj} />} />
                <Route path="/profile" element={<Profile />} />
              </>
            ) : (
              <Route path="/" element={<Auth />} />
            )}
          </Routes>
        ) : (
          "asddd"
        )}
      </Router>
    </>
  );
}

export default App;
