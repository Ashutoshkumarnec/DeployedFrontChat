import React, { Component } from "react";
class Forget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailmsg: "",
      ForgetConfirm: ""
    };
  }
  Create = () => {
    this.props.history.push("/");
  };
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
    }
  };
  Forget = e => {
    e.preventDefault();
    if (this.state.email === "") {
      this.setState({ emailmsg: "Enter Emailid" });
    } else {
      this.setState({ emailmsg: "", ForgetConfirm: "" });
      fetch("https://limitless-coast-89306.herokuapp.com/Forget", {
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
          this.setState({ ForgetConfirm: resp.data });
        });
    }
  };
  render() {
    return (
      <div>
        <title>Forget</title>
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
                <span className="login100-form-title">Forget</span>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Valid email is required: ex@abc.xyz"
                >
                  <input
                    className="input100"
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={this.setText}
                  />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-envelope" aria-hidden="true" />
                  </span>
                </div>
                <p style={{ color: "red" }}>{this.state.emailmsg}</p>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" onClick={this.Forget}>
                    Submit
                  </button>
                </div>
                <p
                  style={{
                    color: "red",
                    marginLeft: 20,
                    fontSize: 15,
                    marginTop: 20
                  }}
                >
                  {this.state.ForgetConfirm}
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
export default Forget;
