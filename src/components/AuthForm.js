import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { authService } from "../firebase";

function AuthForm() {
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

  return (
    <div>
      <form className="container" onSubmit={onSubmitBtn}>
        <input
          className="authInput"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={onChangeInput}
          required
        />
        <input
          className="authInput"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChangeInput}
          required
        />
        <input
          className="authInput authSubmit"
          type="submit"
          value={newAccount ? "Create Account" : "SignIn"}
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span className="authSwitch" onClick={toggleAccount}>
        {newAccount ? "SignIn" : "Create Account"}
      </span>
    </div>
  );
}

export default AuthForm;
