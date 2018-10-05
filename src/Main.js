import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Link, Redirect } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import App from "./Chat";
import Forget from "./Forget";
import Reset from "./Reset";
// import Chat from "./Chat";
const Main = () => (
  <div>
    <Switch>
      <Route exact path="/" component={Register} />
      {console.log("After Register")}
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Forget" component={Forget} />
      <Route exact path="/App" component={App} />
      <Route exact path="/Reset" component={Reset} />
    </Switch>
  </div>
);
export default Main;
