import React, { Component } from "react";
import io from "socket.io-client/dist/socket.io.js";
class Login extends Component {
  constructor(props) {
    super(props);
    this.socket = io("https://limitless-coast-89306.herokuapp.com", {
      jsonp: false
    });
    this.state = {
      email: "",
      password: "",
      emailmsg: "",
      passwordmsg: "",
      Confirmmsg: ""
    };
  }
  componentDidMount() {
    var email = localStorage.getItem("email");
    if (email !== null) {
      this.props.history.push("/Go-For-Chat/App");
    } else {
      let query = new URLSearchParams(window.location.search);
      let id = query.get("id");
      if (id !== null) {
        fetch("https://limitless-coast-89306.herokuapp.com/Verified", {
          headers: {
            Accept: "application/json",
            "Content-type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({ id: id })
        })
          .then(response => {
            return response.json();
          })
          .then(resp => {
            console.log(resp.data);
          });
      }
    }
  }
  setText = e => {
    if (e.target.name === "email") {
      if (e.target.value.length !== 0) {
        if (
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
            e.target.value
          ) === true
        ) {
          this.setState({ [e.target.name]: e.target.value, emailmsg: "" });
        } else {
          this.setState({ emailmsg: "Invalid Email", email: "" });
        }
      } else {
        this.setState({ emailmsg: "Enter Emailid", email: "" });
      }
    } else if (e.target.name === "password") {
      if (e.target.value.length !== 0) {
        this.setState({ [e.target.name]: e.target.value, passwordmsg: "" });
      } else {
        this.setState({ passwordmsg: "Enter Password", password: "" });
      }
    }
  };

  Login = e => {
    e.preventDefault();
    if (this.state.email === "") {
      this.setState({ emailmsg: "Enter , Email", Confirmmsg: "" });
    } else if (this.state.password === "") {
      this.setState({ passwordmsg: "Enter Password", emailmsg: "" });
    } else {
      this.setState({ email: "", passwordmsg: "" });
      fetch("https://limitless-coast-89306.herokuapp.com/Login", {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(this.state)
      })
        .then(response => {
          return response.json();
        })
        .then(resp => {
          console.log(resp.data);
          // this.setState({ Confirmmsg: resp.data });
          if (
            resp.data !==
            "User Not Registered or not Verified or Wrong Password or Already LoggedIn"
          ) {
            localStorage.setItem("email", resp.data[0].email);
            localStorage.setItem("username", resp.data[0].username);
            console.log(
              "Login Data",
              resp.data[0].email,
              "Username",
              resp.data[0].username
            );
            this.socket.emit("Reload", "Now");
            this.props.history.push("/App");
          } else {
            this.setState({ Confirmmsg: resp.data });
          }
        });
    }
  };
  Create = () => {
    this.props.history.push("/");
  };
  Forget = () => {
    this.props.history.push("/Forget");
  };
  render() {
    return (
      <div>
        <title>Login V1</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" type="image/png" href="images/icons/favicon.ico" />

        <link
          rel="stylesheet"
          type="text/css"
          href="vendor/bootstrap/css/bootstrap.min.css"
        />

        <link
          rel="stylesheet"
          type="text/css"
          href="fonts/font-awesome-4.7.0/css/font-awesome.min.css"
        />

        <link
          rel="stylesheet"
          type="text/css"
          href="vendor/animate/animate.css"
        />

        <link
          rel="stylesheet"
          type="text/css"
          href="vendor/css-hamburgers/hamburgers.min.css"
        />

        <link
          rel="stylesheet"
          type="text/css"
          href="vendor/select2/select2.min.css"
        />

        <link rel="stylesheet" type="text/css" href="css/util.css" />
        <link rel="stylesheet" type="text/css" href="css/main.css" />

        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <div className="login100-pic js-tilt" data-tilt>
                <img src="images/im.jpg" alt="IMG" />
              </div>
              <form className="login100-form validate-form">
                <span className="login100-form-title">Login</span>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Valid email is required: ex@abc.xyz"
                >
                  <input
                    className="input100"
                    type="text"
                    name="email"
                    placeholder="Enter Email"
                    onChange={this.setText}
                  />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-envelope" aria-hidden="true" />
                  </span>
                </div>
                <p style={{ color: "red" }}>{this.state.emailmsg}</p>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Password is required"
                >
                  <input
                    className="input100"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={this.setText}
                  />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <p style={{ color: "red" }}>{this.state.passwordmsg}</p>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" onClick={this.Login}>
                    Login
                  </button>
                </div>
                <div className="text-center p-t-12">
                  <span className="txt1">Forgot</span>
                  <a className="txt2" href="#" onClick={this.Forget}>
                    Username / Password?
                  </a>
                </div>
                <p style={{ color: "red", fontSize: 20, marginTop: 20 }}>
                  {this.state.Confirmmsg}
                </p>
                <div className="text-center p-t-136">
                  <a className="txt2" href="#" onClick={this.Create}>
                    Create your Account
                    <i
                      className="fa fa-long-arrow-right m-l-5"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
