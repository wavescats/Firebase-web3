import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./routes/Home";
import Auth from "./routes/Auth";
import Profile from "./routes/Profile";
import { authService } from "./firebase";
import Nav from "./components/Nav";
import { updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: updateProfile(user, { displayName: user.displayName }),
        });
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: updateProfile(user, { displayName: user.displayName }),
    });
  };

  return (
    <>
      <Router>
        {isLogin && <Nav userObj={userObj} />}
        {init ? (
          <Routes>
            {isLogin ? (
              <>
                <Route path="/" element={<Home userObj={userObj} />} />
                <Route
                  path="/profile"
                  element={
                    <Profile userObj={userObj} refreshUser={refreshUser} />
                  }
                />
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
