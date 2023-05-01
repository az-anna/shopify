import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import InputField from "../components/InputField";
import Button from "../components/Button";
import { BACKEND_URL } from '../utils/urls';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (email && password) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  }, [email, password, buttonEnabled]);

  const loginUser = async () => {
    const data = {"data": { id: email, pw: password}}
    try {
      const res = await fetch(`${BACKEND_URL}api/user/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (result.token) {
        localStorage.setItem("token", JSON.stringify(result))
        router.push('/')
      } else {
        setErrorMessage(true)
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-100">
      <form
        className="p-10 bg-white rounded-xl drop-shadow-xl space-y-3"
        onSubmit={submitHandler}
      >
        <h1 className="text-indigo-600 text-3xl text-center">Sign In</h1>
        <p
          className={`text-red-600 text-sm text-center ${
            errorMessage ? "opacity-100" : "opacity-0"
          }`}
        >
          emailかパスワードが間違っています
        </p>
        <InputField
          className="lg:w-96 md:w-80 w-56 bg-indigo-50"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button title="Login" disabled={!buttonEnabled} />
      </form>
    </div>
  );
}

export default LoginPage;
