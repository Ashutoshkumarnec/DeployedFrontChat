import React, { Component } from "react";
import io from "socket.io-client/dist/socket.io.js";
class Reset extends Component {
  constructor(props) {
    super(props);
    this.socket = io("https://limitless-coast-89306.herokuapp.com", {
      jsonp: false
    });
    this.state = {
      password: "",
      cnfpassword: "",
      passwordmsg: "",
      confirmpasswordmsg: "",
      Confirmmsg: ""
    };
  }
  componentDidMount() {
    var email = localStorage.getItem("email");
    if (email !== null) {
      this.props.history.push("/App");
    } else {
      let query = new URLSearchParams(window.location.search);
      let id = query.get("id");
      let token = query.get("token");
      console.log("id : ", id, " Token ", token);
      if (id === null && token === null) {
        this.props.history.push("/Login");
      } else {
        fetch("https://limitless-coast-89306.herokuapp.com/CheckAvailable", {
          headers: {
            Accept: "application/json",
            "Content-type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({ id: id, token: token })
        })
          .then(response => {
            return response.json();
          })
          .then(resp => {
            if (resp.data !== "Allowed") {
              this.props.history.push("/Login");
            }
          });
      }
    }
  }
  setText = e => {
    if (e.target.name === "password") {
      if (e.target.value.length !== 0) {
        this.setState({ [e.target.name]: e.target.value, passwordmsg: "" });
      } else {
        this.setState({
          passwordmsg: "Enter Password",
          password: "",
          confirmpasswordmsg: ""
        });
      }
    } else {
      if (e.target.value.length !== 0) {
        if (e.target.value === this.state.password) {
          this.setState({
            [e.target.name]: e.target.value,
            confirmpasswordmsg: "",
            passwordmsg: ""
          });
        } else {
          this.setState({
            confirmpasswordmsg: "Password and ConfirmPassword not match",
            cnfpassword: "",
            passwordmsg: ""
          });
        }
      } else {
        this.setState({
          confirmpasswordmsg: "Enter Password",
          password: "",
          passwordmsg: ""
        });
      }
    }
  };

  ChangePassword = e => {
    e.preventDefault();
    if (this.state.password === "") {
      this.setState({ passwordmsg: "Enter ,Password", Confirmmsg: "" });
    } else if (this.state.cnfpassword === "") {
      this.setState({
        confirmpasswordmsg: "Enter Confirm Password",
        passwordmsg: ""
      });
    } else {
      let query = new URLSearchParams(window.location.search);
      let id = query.get("id");
      this.setState({ passwordmsg: "", confirmpasswordmsg: "" });
      fetch("https://limitless-coast-89306.herokuapp.com/Reset1", {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ data: this.state, id: id })
      })
        .then(response => {
          return response.json();
        })
        .then(resp => {
          let e = this;
          this.setState({ Confirmmsg: resp.data });
          console.log("Details", resp);
          this.socket.emit("ForceLogout", resp.email);
          setInterval(function() {
            e.props.history.push("/Login");
          }, 2000);
        });
    }
  };
  Login = () => {
    this.props.history.push("/Login");
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
                <span className="login100-form-title">Reset</span>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Valid email is required: ex@abc.xyz"
                >
                  <input
                    className="input100"
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    onChange={this.setText}
                  />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <p style={{ color: "red" }}>{this.state.passwordmsg}</p>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Password is required"
                >
                  <input
                    className="input100"
                    type="password"
                    name="cnfpassword"
                    placeholder="Enter ConfirmPassword"
                    onChange={this.setText}
                  />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <p style={{ color: "red" }}>{this.state.confirmpasswordmsg}</p>
                <div className="container-login100-form-btn">
                  <button
                    className="login100-form-btn"
                    onClick={this.ChangePassword}
                  >
                    Change Password
                  </button>
                </div>
                <p style={{ color: "red", fontSize: 20, marginTop: 20 }}>
                  {this.state.Confirmmsg}
                </p>
                <div className="text-center p-t-136">
                  <a className="txt2" href="#" onClick={this.Login}>
                    Login
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
export default Reset;
