import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "../firebase";

function Profile({ userObj, refreshUser }) {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const getMyNweet = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorld", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const qs = await getDocs(q);
    qs.forEach(doc => console.log(doc.id, "=>", doc.data()));
  };

  useEffect(() => {
    getMyNweet();
  }, []);

  const onChanges = event => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmits = async event => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <div className="container all_container">
      <form className="profileForm" onSubmit={onSubmits}>
        <input
          className="formInput"
          onChange={onChanges}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          autoFocus
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
}

export default Profile;
