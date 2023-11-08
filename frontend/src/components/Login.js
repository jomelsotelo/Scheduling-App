import React from "react";

function LoginForm() {
  return (
    <form className="login-form">
      <input type="text" placeholder="username" id="username" />
      <input type="password" placeholder="password" id="password" />
      <button type="button" id="loginButton" onClick={() => window.location.href = 'index.html'}>
        login
      </button>
    </form>
  );
}

export default LoginForm;
