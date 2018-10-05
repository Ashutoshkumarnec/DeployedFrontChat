import React, { Component } from "react";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      mobileno: "",
      password: "",
      usernamemsg: "",
      emailmsg: "",
      mobilemsg: "",
      passwordmsg: "",
      Confirmmsg: ""
    };
  }
  Login = () => {
    this.props.history.push("/Login");
  };
  componentDidMount() {
    var email = localStorage.getItem("email");
    if (email !== null) {
      this.props.history.push("/App");
    }
  }
  Forget = () => {
    this.props.history.push("/Forget");
  };
  setText = e => {
    if (e.target.name === "username") {
      if (e.target.value.length !== 0) {
        this.setState({ [e.target.name]: e.target.value, usernamemsg: "" });
      } else {
        this.setState({ usernamemsg: "Enter Username", username: "" });
      }
    } else if (e.target.name === "email") {
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
    } else if (e.target.name === "mobileno") {
      if (e.target.value.length !== 10) {
        this.setState({ mobilemsg: "Invalid Mobileno. Entered", mobileno: "" });
      } else {
        this.setState({ [e.target.name]: e.target.value, mobilemsg: "" });
      }
    } else if (e.target.name === "password") {
      if (e.target.value.length !== 0) {
        this.setState({ [e.target.name]: e.target.value, passwordmsg: "" });
      } else {
        this.setState({ passwordmsg: "Enter Password", password: "" });
      }
    }
  };
  Registration = e => {
    e.preventDefault();
    if (this.state.username === "") {
      this.setState({ usernamemsg: "Enter , Uername" });
    } else if (this.state.email === "") {
      this.setState({ emailmsg: "Enter Email", usernamemsg: "" });
    } else if (this.state.mobileno === "") {
      this.setState({
        mobilemsg: "Enter mobile no.",
        emailmsg: "",
        usernamemsg: ""
      });
    } else if (this.state.password === "") {
      this.setState({
        passwordmsg: "Enter Password",
        mobilemsg: "",
        emailmsg: "",
        usernamemsg: ""
      });
    } else {
      this.setState({
        passwordmsg: "",
        mobilemsg: "",
        emailmsg: "",
        usernamemsg: "",
        Confirmmsg: ""
      });
      fetch("https://limitless-coast-89306.herokuapp.com/Registration", {
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
          // console.log(resp.data);
          this.setState({ Confirmmsg: resp.data });
        });
    }
  };
  render() {
    return (
      <div>
        <title>Register</title>
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
                <span className="login100-form-title">Register</span>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Valid email is required: ex@abc.xyz"
                >
                  <input
                    className="input100"
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    onChange={this.setText}
                  />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-file-text" aria-hidden="true" />
                  </span>
                </div>
                <p style={{ color: "red", marginLeft: 20 }}>
                  {this.state.usernamemsg}
                </p>
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
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
                  />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-envelope" aria-hidden="true" />
                  </span>
                </div>
                <p style={{ color: "red", marginLeft: 20 }}>
                  {this.state.emailmsg}
                </p>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Valid email is required: ex@abc.xyz"
                >
                  <input
                    className="input100"
                    type="number"
                    name="mobileno"
                    placeholder="Enter Mobile No."
                    onChange={this.setText}
                  />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-file-text" aria-hidden="true" />
                  </span>
                </div>
                <p style={{ color: "red", marginLeft: 20 }}>
                  {this.state.mobilemsg}
                </p>
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
                <p style={{ color: "red", marginLeft: 20 }}>
                  {this.state.passwordmsg}
                </p>
                <div className="container-login100-form-btn">
                  <button
                    className="login100-form-btn"
                    onClick={this.Registration}
                  >
                    Register
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
export default Register;
