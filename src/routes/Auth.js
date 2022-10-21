import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { authService } from "../firebase";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChangeInput = event => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmitBtn = async event => {
    event.preventDefault();
    try {
      if (newAccount) {
        const createData = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
        console.log(createData);
      } else {
        const signData = await signInWithEmailAndPassword(
          authService,
          email,
          password
        );
        console.log(signData);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => setNewAccount(prev => !prev);
  const onSocial = async event => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={onSubmitBtn}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={onChangeInput}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChangeInput}
          required
        />
        <input type="submit" value={newAccount ? "Create Account" : "SignIn"} />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "SignIn" : "Create Account"}
      </span>
      <div>
        <button name="google" onClick={onSocial}>
          Continue With Google
        </button>
        <button name="github" onClick={onSocial}>
          Continue With Github
        </button>
      </div>
    </div>
  );
}

export default Auth;
