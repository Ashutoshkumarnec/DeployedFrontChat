import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client/dist/socket.io.js";
var e;
var msg = [],
  msg1 = [];
var tym, sendtym, backmsg;
var key = 1,
  keys = 0;
var NewMsg = [];
var SetGroupUser = [];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const WeekNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
class Chat extends Component {
  constructor(props) {
    super(props);
    e = this;
    this.socket = io("https://limitless-coast-89306.herokuapp.com", {
      jsonp: false
    });

    this.state = {
      text: "",
      Sevtext: "",
      UserName: "",
      OnlineUser: [],
      Status: 0,
      OwnUsername: "",
      Error: 0,
      myid: "",
      AllMsg: [],
      Clicked: 0,
      DropDown: false,
      typingstatus: 0,
      typing: 0,
      MessageUser: "",
      Replied: "",
      GroupUser: [],
      AllUser: [],
      Selecteduser: "",
      Group: false,
      SelectedName: "",
      AllGroupUser: [],
      TextToShow: "",
      showNext: false,
      GroupName: "",
      GroupUser: [],
      GroupClient: false,
      Room: "",
      LastSeen: "",
      IncMsgSeen: false,
      DevliveredMsg: false
    };
    this.socket.on("Server-Send-Text", function(data) {
      e.setState({ Sevtext: data });
    });
    // io.on("connection", (socket, next) => {
    //   const ID = socket.id; // id property on the socket Object
    //   alert("Socket id" + ID);
    // });

    this.socket.on("usernames", function(data, data1, data2) {
      if (e.state.Error !== 1) {
        e.setState({ OnlineUser: data });
      }
      if (e.state.UserName === data1) {
        e.setState({ LastSeen: data2 });
      }
      console.log("All user status", e.state.AllUser);
    });
    this.socket.on("ForceLogout", async function(data) {
      alert("Message from Server : " + data);
      await localStorage.removeItem("email");
      await localStorage.removeItem("username");
      e.props.history.push("/Login");
    });
    this.socket.on("NewGroupJoined", function(data) {
      e.GroupDetails123();
    });
    this.socket.on("MessageSeen", function(data, data2) {
      if (e.state.UserName === data && data2 === "seen") {
        // e.SeenMsgUpdate();
        // alert("New Msg" + data);
        e.setState({ IncMsgSeen: true, DevliveredMsg: false });
      } else {
        e.setState({ IncMsgSeen: false, DevliveredMsg: true });
      }
    });
    this.socket.on("New-Message", function(data) {
      // e.setState({ NewMsg: data });

      msg.push(data);

      e.setState({ Status: 1 });
    });
    this.socket.on("Reloads", function(msg) {
      e.UpdateUser();
    });
    this.socket.on("typing", function(user) {
      if (e.state.UserName === user) {
        e.setState({ typingstatus: 1 });
      }
    });
    this.socket.on("Closeit", function(user) {
      e.setState({ typingstatus: 0 });
    });
    this.socket.on("GroupMessage", async function(message) {
      if (e.state.UserName !== "") {
        if (message.Messagefrom !== e.state.UserName) {
          alert(message.Messagefrom + " : " + message.Message);
          await e.AssignMsg(message);
        } else {
          await e.AssignMsg(message);

          tym = e.AssignTime();
          var allmsg = {
            Messagefrom: message.MessageBy,
            Messages: message.Message,
            Time: tym
          };
          e.state.AllMsg.push(allmsg);
          e.setState({ Status: 1, typingstatus: 0 });
          e.scrollToBottom();
          console.log("Message from :", message.Messagefrom);
        }
      } else {
        console.log("GroupName", message.Messagefrom);
        console.log("GroupRoom", message.Room);
        await e.AssignMsg(message);
        e.Select1(message.Room, message.Messagefrom);
        console.log("Username:", message.MessageBy);

        tym = e.AssignTime();

        console.log("Message from :", message.Messagefrom);
      }
    });
    this.socket.on("Message", async function(message) {
      if (e.state.UserName !== "") {
        if (message.Messagefrom !== e.state.UserName) {
          e.socket.emit(
            "MsgSeen",
            message.Messagefrom,
            e.state.OwnUsername,
            "delivered"
          );
          alert(message.Messagefrom + " : " + message.Message);

          await e.AssignMsg(message);
        } else {
          await e.AssignMsg(message);
          tym = e.AssignTime();
          var allmsg = {
            Messagefrom: message.Messagefrom,
            Messages: message.Message,
            Time: tym
          };
          e.state.AllMsg.push(allmsg);
          e.setState({ Status: 1, typingstatus: 0 });

          // e.setState({ IncMsgSeen: true });
          e.scrollToBottom();
          e.socket.emit(
            "MsgSeen",
            message.Messagefrom,
            e.state.OwnUsername,
            "seen"
          );
          await e.SeenMsgUpdate(message.Messagefrom);
          console.log("Message from :", message.Messagefrom);
        }
      } else {
        await e.AssignMsg(message);
        e.Select(message.Messagefrom);
        e.setState({ GroupClient: false });
        tym = e.AssignTime();
        console.log("Message from :", message.Messagefrom);
      }
    });
    this.socket.on("Error", function(msg) {
      alert("Message from Server : " + msg);
      e.setState({ Error: 1 });
      // e.ErrorLogout();
    });
    // this.socket.on("Error1", function(msg) {
    //   alert("Message from Server :" + msg);
    //   e.ErrorLogout();
    // });
  }
  AssignTime = () => {
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var sec = d.getSeconds();
    var dat = d.getDate();
    dat = dat < 10 ? "0" + dat : dat;
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var Seconds = sec < 10 ? "0" + sec : sec;
    var month = monthNames[d.getMonth()];
    var week = WeekNames[d.getDay()];
    var tyme =
      week +
      " " +
      month +
      " " +
      dat +
      " " +
      d.getFullYear() +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      Seconds +
      " " +
      ampm;
    return tyme;
  };
  AssignMsg = message => {
    if (NewMsg.length !== 0) {
      console.log("Inside forloop");
      for (var i = 0; i < NewMsg.length; i++) {
        if (NewMsg[i].MessageFrom === message.Messagefrom) {
          console.log("Inside forloop1", NewMsg);
          NewMsg.splice(i, 1);
          key = 0;
          console.log("Inside forloop2");
          break;
        } else {
          key = 0;
        }
      }
    } else {
      NewMsg.push({
        MessageFrom: message.Messagefrom,
        Message: message.Message
      });
      e.setState({ Status: 1 });
      key = 1;
      console.log("NewMsg", NewMsg);
    }
    if (key !== 1) {
      NewMsg.push({
        MessageFrom: message.Messagefrom,
        Message: message.Message
      });
      key = 0;
      console.log("Inside if");
      e.setState({ Status: 1 });
    }
  };
  StorageChange = async event => {
    if (event.newValue === null) {
      await this.Logout();
      this.props.history.push("/Login");
    }
  };
  componentWillUnmount() {
    this.socket.emit("unmounting", localStorage.getItem("email"));
  }
  GroupDetails123 = async () => {
    this.setState({ GroupUser: [] });
    console.log("Local", localStorage.getItem("email"));
    fetch("https://limitless-coast-89306.herokuapp.com/SendGroupDetails", {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        email: await localStorage.getItem("email")
      })
    })
      .then(response => {
        return response.json();
      })
      .then(resp => {
        console.log("All user", resp.data);
        this.setState({ GroupUser: resp.data });

        // } else {
        //   alert("You are already Logged in");
        //   this.ErrorLogout();
        // }
      });
  };
  Select1 = async (data, data1) => {
    await this.setState({
      Selecteduser: data,
      GroupClient: true,
      Room: data,
      LastSeen: "",
      IncMsgSeen: false,
      DevliveredMsg: false
    });
    // if (data === this.state.MessageUser) {
    //   this.setState({ MessageUser: "", Replied: "" });
    // }
    if (data1 !== this.state.UserName) {
      await this.setState({
        UserName: data1,
        AllMsg: [],
        Selecteduser: data
      });
      fetch("https://limitless-coast-89306.herokuapp.com/FindGroupMessage", {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          Room: data
        })
      })
        .then(response => {
          return response.json();
        })
        .then(resp => {
          // this.setState({ AllMsg: resp.data });
          console.log("Record Details", resp.data);
          if (resp.data !== "No Record") {
            // msg.push(resp.data);
            // console.log("All Message", resp.data.Message[1]);
            for (var i = 0; i < resp.data[0].Message.length; i++) {
              this.state.AllMsg.push(resp.data[0].Message[i]);
              // console.log("Messages", resp.data.Message[i]);
            }
            console.log("After all message push", this.state.AllMsg);
            // resp.data.Message[0].map(data =>
            //   console.log("After all message push", data.Messages)
            // );
            // this.setState({ AllMsg: resp.data.Message });
            this.setState({ Status: 1 });
            this.scrollToBottom();
            // this.state.AllMsg.map(data =>
            //   console.log("After state set", data.Messages)
            // );
          } else {
            this.setState({ AllMsg: [] });
          }
        });
    }
  };
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "instant" });
  };
  async componentDidMount() {
    window.addEventListener("storage", this.StorageChange);
    var username = await localStorage.getItem("email");
    await this.setState({ OwnUsername: username });
    console.log("LocalStorage", username);
    if (username === null) {
      this.props.history.push("/Login");
    } else {
      fetch("https://limitless-coast-89306.herokuapp.com/CheckLogin", {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ email: username })
      })
        .then(response => {
          return response.json();
        })
        .then(resp => {
          if (resp.data === "Allowed") {
            this.setState({ OwnUsername: "" });

            fetch("https://limitless-coast-89306.herokuapp.com/SignUps", {
              headers: {
                Accept: "application/json",
                "Content-type": "application/json"
              },
              method: "POST",
              body: JSON.stringify({
                Username: username
              })
            })
              .then(response => {
                return response.json();
              })
              .then(resp => {
                console.log("All user", resp.alluser);
                this.setState({
                  myid: resp.data,
                  AllUser: resp.alluser
                });
                // console.log("All Group User", resp.AllGroupUser);
                // if (resp.data === "offline") {
                this.setState({ OwnUsername: username });
                this.Send();
                // } else {
                //   alert("You are already Logged in");
                //   this.ErrorLogout();
                // }
              });
            fetch(
              "https://limitless-coast-89306.herokuapp.com/SendGroupDetails",
              {
                headers: {
                  Accept: "application/json",
                  "Content-type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                  email: localStorage.getItem("email")
                })
              }
            )
              .then(response => {
                return response.json();
              })
              .then(resp => {
                console.log("All user", resp.alluser);
                this.setState({ GroupUser: resp.data });
                console.log("GroupUser", this.state.GroupUser);
                this.socket.emit("NewGroup", this.state.GroupUser);
                // } else {
                //   alert("You are already Logged in");
                //   this.ErrorLogout();
                // }
              });
          } else {
            localStorage.removeItem("email");
            localStorage.removeItem("username");
            this.props.history.push("/Login");
          }
        });
    }

    // var username = window.prompt("Enter username");
    if (username === null) {
      // alert("Please Enter username");
      this.props.history.push("/Login");
    } else {
      // fetch("http://192.168.100.143:3000/SignUp", {
      //   headers: {
      //     Accept: "application/json",
      //     "Content-type": "application/json"
      //   },
      //   method: "POST",
      //   body: JSON.stringify({
      //     Username: username
      //   })
      // })
      //   .then(response => {
      //     return response.json();
      //   })
      //   .then(resp => {
      //     this.setState({ myid: resp.data });
      //   });
      // this.socket.emit("new-user", this.state.UserName);
    }
  }
  UpdateUser = () => {
    fetch("https://limitless-coast-89306.herokuapp.com/UpdateAllUser", {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        email: localStorage.getItem("email")
      })
    })
      .then(response => {
        return response.json();
      })
      .then(resp => {
        console.log("All user", resp.alluser);
        this.setState({ AllUser: resp.alluser });

        // if (resp.data === "offline") {
        // this.setState({ OwnUsername: username });
        // this.Send();
        // } else {
        //   alert("You are already Logged in");
        //   this.ErrorLogout();
        // }
      });
  };
  setGroupText = e => {
    this.setState({ GroupName: e.target.value });
  };
  ShowEmoji = () => {
    this.setState({ ShowsEmoji: !this.state.ShowsEmoji });
  };
  ErrorLogout = async () => {
    var email = await localStorage.removeItem("email");
    await localStorage.removeItem("username");
    e.setState({ Status: 1 });
    this.props.history.push("/Login");
  };
  Logout = async () => {
    var email = await localStorage.getItem("email");
    fetch("https://limitless-coast-89306.herokuapp.com/ChangeStatus", {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        Status: "offline",
        email: email
      })
    })
      .then(response => {
        return response.json();
      })
      .then(resp => {
        console.log("Status changed");
      });

    await this.socket.emit("Logout", email);
    var email = await localStorage.removeItem("email");
    await localStorage.removeItem("username");
    this.props.history.push("/Login");
  };
  Send = async username => {
    await this.socket.emit("new-user", this.state.OwnUsername);
    // alert("Sending name" + this.state.UserName);
  };
  Deni = () => {
    this.socket.emit("Close-typing", this.state.UserName);
  };
  SeenMsgUpdate = data => {
    fetch("https://limitless-coast-89306.herokuapp.com/ChangeSeenStatus", {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        Username: data,
        myid: this.state.myid
      })
    })
      .then(response => {
        return response.json();
      })
      .then(resp => {
        console.log("updated");
      });
  };
  ControlScroll = () => {
    window.scrollBy(0, 1);
  };
  SendMessage = async e => {
    if (this.state.UserName === "") {
      alert("Select User");
    } else {
      if (this.state.UserName === this.state.OwnUsername) {
        alert("You cant send message to yourself, Please select another user");
      } else {
        if (this.state.text === "") {
          alert("Enter Messages");
        } else {
          // msg.push({
          //   Messagefrom: this.state.OwnUsername,
          //   Message: this.state.text
          // });
          // var d = new Date();
          // var dat = d.toDateString();
          // var tim = d.toLocaleTimeString();
          sendtym = this.AssignTime();
          // sendtym = d.toLocaleString(d);
          this.setState({ IncMsgSeen: false, DevliveredMsg: false });
          var allmsg = {
            Messagefrom: this.state.OwnUsername,
            Messages: this.state.text,
            Time: sendtym
          };
          this.state.AllMsg.push(allmsg);
          // await this.scrollToBottom();
          if (this.state.GroupClient !== true) {
            fetch(
              "http://https://limitless-coast-89306.herokuapp.com/SaveMessages",
              {
                headers: {
                  Accept: "application/json",
                  "Content-type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                  myid: this.state.myid,
                  OwnUsername: this.state.OwnUsername,
                  Username: this.state.UserName,
                  Message: this.state.text,
                  Time: sendtym
                })
              }
            )
              .then(response => {
                return response.json();
              })
              .then(resp => {
                // msg = null;
                msg.push(resp.data);
              });
            this.socket.emit(
              "newMessage",
              this.state.text,
              this.state.UserName
            );
          } else {
            fetch(
              "https://limitless-coast-89306.herokuapp.com/SaveGroupMessages",
              {
                headers: {
                  Accept: "application/json",
                  "Content-type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                  OwnUsername: this.state.OwnUsername,
                  Room: this.state.Room,
                  Message: this.state.text,
                  Time: sendtym
                })
              }
            )
              .then(response => {
                return response.json();
              })
              .then(resp => {
                // msg = null;
                msg.push(resp.data);
              });

            this.socket.emit(
              "NewGroupMessage",
              this.state.text,
              this.state.UserName,
              this.state.Room,
              this.state.OwnUsername
            );
          }
          this.setState({ Status: 1 });
          this.refs.texts.value = "";

          e.target.value = "";
          this.setState({ text: "" });
        }
      }
    }
  };
  DropDown1 = () => {
    if (this.state.DropDown !== false) {
      this.setState({ DropDown: false });
    }
  };
  AddAll = async () => {
    if (this.state.showNext !== true && SetGroupUser.length !== 0) {
      console.log("All added ", SetGroupUser);
      this.setState({ showNext: true });
    } else if (SetGroupUser.length === 0) {
      this.setState({ showNext: false, Group: false });
    } else {
      if (this.state.GroupName !== "") {
        this.setState({ showNext: false, Group: false });
        var room = Math.floor(Math.random() * 10000000000000000000);

        await SetGroupUser.push(localStorage.getItem("email"));
        this.socket.emit("CreatedGroup", SetGroupUser, room);
        console.log("Goup Details", SetGroupUser, "Text", this.state.GroupName);
        fetch("https://limitless-coast-89306.herokuapp.com/AddGroupDetails", {
          headers: {
            Accept: "application/json",
            "Content-type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({
            GoupUser: SetGroupUser,
            GroupName: this.state.GroupName,
            Admin: localStorage.getItem("email"),
            GroupRoom: room
          })
        })
          .then(response => {
            return response.json();
          })
          .then(resp => {
            console.log("data Saved", resp.data);
            SetGroupUser = [];
            this.setState({ GroupUser: resp.data });
          });
      } else {
        var confirm = window.confirm("You have not Entered GroupName");
        if (confirm === false) {
          this.setState({ showNext: false, Group: false });
        }
      }
    }
  };
  show = () => {
    this.setState({ DropDown: !this.state.DropDown });
  };
  ShowProfile = () => {
    alert("Write Down Code");
  };
  Select = async data => {
    this.setState({
      ChangeColor: "black",
      SelectedName: data,
      GroupClient: false,
      IncMsgSeen: false,
      DevliveredMsg: false
    });
    if (data === this.state.MessageUser) {
      this.setState({ MessageUser: "", Replied: "" });
    }
    if (data !== this.state.UserName) {
      await this.setState({
        UserName: data,
        AllMsg: [],
        Selecteduser: data,
        LastSeen: ""
      });

      fetch("https://limitless-coast-89306.herokuapp.com/Find", {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          Username: this.state.UserName,
          myid: this.state.myid
        })
      })
        .then(response => {
          return response.json();
        })
        .then(resp => {
          if (resp.data !== "No Record") {
            window.scrollBy(0, 1);
            // msg.push(resp.data);
            // console.log("All Message", resp.data.Message[1]);
            for (var i = 0; i < resp.data.Message.length; i++) {
              this.state.AllMsg.push(resp.data.Message[i]);
              // console.log("Messages", resp.data.Message[i]);
            }
            console.log("After all message push", this.state.AllMsg);
            // resp.data.Message[0].map(data =>
            //   console.log("After all message push", data.Messages)
            // );
            // this.setState({ AllMsg: resp.data.Message });
            console.log("Last seen", resp.data1);

            this.setState({ Status: 1, LastSeen: resp.data1 });
            this.scrollToBottom();
            this.socket.emit(
              "MsgSeen",
              this.state.UserName,
              this.state.OwnUsername,
              "seen"
            );
            // this.state.AllMsg.map(data =>
            //   console.log("After state set", data.Messages)
            // );
          } else {
            this.setState({ AllMsg: [] });
          }
        });
    }

    console.log("MyID in DataBase", this.state.myid);
  };
  SetUsers = async value => {
    if (SetGroupUser.length !== 0) {
      for (var i = 0; i < SetGroupUser.length; i++) {
        if (SetGroupUser[i] === value) {
          await SetGroupUser.splice(i, 1);
          console.log("All user inside loop", SetGroupUser.length);
          keys = 1;
          break;
        } else {
          keys = 0;
        }
      }
      if (keys === 0) {
        SetGroupUser.push(value);
        this.setState({ TextToShow: "Added" });
      } else {
        console.log("All user inside else", SetGroupUser.length);
        this.setState({ TextToShow: "Remove" });
      }
    } else {
      SetGroupUser.push(value);
      this.setState({ TextToShow: "Added" });
    }

    this.setState({ Status: 1 });
  };
  DisableGroup = () => {
    this.setState({ Group: !false });
  };
  AddGroup = async () => {
    this.setState({ Group: !this.state.Group, showNext: false, GroupName: "" });
    SetGroupUser = [];
    fetch("https://limitless-coast-89306.herokuapp.com/GroupAdd", {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        email: await localStorage.getItem("email")
      })
    })
      .then(response => {
        return response.json();
      })
      .then(resp => {
        this.setState({ AllGroupUser: resp.data });
        console.log("All user ", resp.data);
      });
  };
  settext = e => {
    this.setState({ text: e.target.value });
    if (this.state.UserName !== this.state.OwnUsername) {
      this.socket.emit("is-typing", this.state.UserName);
    }
  };
  render() {
    return (
      <div>
        {/*<link
          href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          rel="stylesheet"
          id="bootstrap-css"
        />*/}
        <link rel="stylesheet" href="style.css" />
        {/*---- Include the above in your HEAD tag --------*/}
        {/*<link
          href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css"
          rel="stylesheet"
          id="bootstrap-css"
        />*/}
        {/*---- Include the above in your HEAD tag --------*/}
        <meta charSet="UTF-8" />
        <meta name="robots" content="noindex" />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="//production-assets.codepen.io/assets/favicon/favicon-8ea04875e70c4b0bb41da869e81236e54394d63638a1ef12fa558a4a835f1164.ico"
        />
        <link
          rel="mask-icon"
          type
          href="//production-assets.codepen.io/assets/favicon/logo-pin-f2d2b6d2c61838f7e76325261b7195c27224080bc099486ddd6dccb469b8e8e6.svg"
          color="#111"
        />
        <link
          rel="canonical"
          href="https://codepen.io/emilcarlsson/pen/ZOQZaV?limit=all&page=74&q=contact+"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,300"
          rel="stylesheet"
          type="text/css"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js" />
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" />
        <link
          rel="stylesheet prefetch"
          href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css"
        />
        <link
          rel="stylesheet prefetch"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.2/css/font-awesome.min.css"
        />
        {/*<style
          className="cp-pen-styles"
          dangerouslySetInnerHTML={{
            __html:
              
          }}
        />*/}
        {/* 
      
      A concept for a chat interface. 
      
      Try writing a new message! :)
      
      
      Follow me here:
      Twitter: https://twitter.com/thatguyemil
      Codepen: https://codepen.io/emilcarlsson/
      Website: http://emilcarlsson.se/
      
      */}
        <div id="all">
          <div id="frame">
            <div id="sidepanel">
              <div id="profile">
                <div className="wrap">
                  <img
                    id="profile-img"
                    src="users.png"
                    className="online"
                    alt={this.state.OwnUsername}
                  />

                  <p style={{ width: 150, height: 100 }}>
                    {this.state.OwnUsername}
                  </p>

                  {/*{this.state.DropDown === true ? (
                    <div>
                      <i
                        className="fa fa-chevron-down expand-button"
                        aria-hidden="true"
                        style={{
                          color: "black",
                          fontSize: 20,
                          marginTop: 40
                        }}
                        onClick={this.show}
                      />
                      <div
                        style={{
                          width: 100,
                          height: 130,
                          opacity: 0.7,
                          position: "absolute",
                          zIndex: 5,
                          marginTop: 60,
                          marginRight: 40,
                          backgroundColor: "white",
                          border: "solid",
                          marginLeft: 180,
                          borderWidth: 1,
                          borderColor: "orange",
                          borderRadius: 10
                        }}
                      >
                        <a href="#">
                          <p
                            onClick={this.Logout}
                            style={{
                              marginLeft: 13,
                              color: "black",
                              fontSize: 15
                            }}
                          >
                            Logout
                          </p>
                        </a>
                        <a href="#">
                          <p
                            onClick={this.ShowProfile}
                            style={{
                              marginLeft: 13,
                              color: "black",
                              fontSize: 15
                            }}
                          >
                            ShowProfile
                          </p>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <i
                      className="fa fa-chevron-up expand-button"
                      aria-hidden="true"
                      style={{
                        color: "black",
                        fontSize: 20,
                        marginTop: 40
                      }}
                      onClick={this.show}
                    />
                  )}*/}

                  <div id="status-options">
                    <ul>
                      <li id="status-online" className="active">
                        <span className="status-circle" /> <p>Online</p>
                      </li>
                      <li id="status-away">
                        <span className="status-circle" /> <p>Away</p>
                      </li>
                      <li id="status-busy">
                        <span className="status-circle" /> <p>Busy</p>
                      </li>
                      <li id="status-offline">
                        <span className="status-circle" /> <p>Offline</p>
                      </li>
                    </ul>
                  </div>
                  <div id="expanded">
                    <label htmlFor="twitter">
                      <i className="fa fa-facebook fa-fw" aria-hidden="true" />
                    </label>
                    <input name="twitter" type="text" defaultValue="mikeross" />
                    <label htmlFor="twitter">
                      <i className="fa fa-twitter fa-fw" aria-hidden="true" />
                    </label>
                    <input name="twitter" type="text" defaultValue="ross81" />
                    <label htmlFor="twitter">
                      <i className="fa fa-instagram fa-fw" aria-hidden="true" />
                    </label>
                    <input
                      name="twitter"
                      type="text"
                      defaultValue="mike.ross"
                    />
                  </div>
                </div>
              </div>
              <div id="search" style={{ borderWidth: 4, borderColor: "gray" }}>
                {/*<label htmlFor>*/}
                {/*<i className="fa fa-search" aria-hidden="true" />*/}
                {/*</label>*/}
                {/*<input type="text" placeholder="Search contacts..." />*/}
              </div>
              <div id="contacts">
                <ul>
                  {this.state.AllUser.length !== 0 ? (
                    this.state.AllUser.map((data, key) => (
                      <li
                        className={
                          this.state.Selecteduser === data.email
                            ? "contact active"
                            : "contact"
                        }
                        onClick={() => this.Select(data.email)}
                      >
                        <div className="wrap">
                          <span className="contact-status busy" />
                          {this.state.OnlineUser.map(
                            (data1, key) =>
                              data1 === data.email ? (
                                <span className="contact-status online" />
                              ) : (
                                <p />
                              )
                          )}

                          <img src="users.png" onMouseOver={data.email} />
                          <div className="meta">
                            <p className="name">{data.email}</p>
                            {NewMsg.map(
                              (data1, key) =>
                                data1.MessageFrom === data.email ? (
                                  <p
                                    className="preview"
                                    style={{ color: "black" }}
                                  >
                                    {""}
                                    {data1.Message}
                                  </p>
                                ) : (
                                  ""
                                )
                            )}
                          </div>
                        </div>
                        <br />
                      </li>
                    ))
                  ) : (
                    <p />
                  )}
                  {this.state.GroupUser.map((data, key) => (
                    <li
                      className={
                        this.state.Selecteduser === data.GroupRoom
                          ? "contact active"
                          : "contact"
                      }
                      onClick={() =>
                        this.Select1(data.GroupRoom, data.GroupName)
                      }
                    >
                      <div className="wrap">
                        <span className="contact-status busy" />
                        <img src="groupusers.png" alt style={{ width: 30 }} />
                        <div className="meta">
                          <p className="name">{data.GroupName}</p>
                          {/*<p className="preview">
                            Wrong. You take the gun, or you pull out a bigger
                            one. Or, you call their bluff. Or, you do any one of
                            a hundred and forty six other things.
                  </p>*/}
                        </div>
                      </div>
                    </li>
                  ))}
                  {/*
                  <li className="contact active">
                    <div className="wrap">
                      <span className="contact-status busy" />
                      <img
                        src="http://emilcarlsson.se/assets/harveyspecter.png"
                        alt
                      />
                      <div className="meta">
                        <p className="name">Harvey Specter</p>
                        <p className="preview">
                          Wrong. You take the gun, or you pull out a bigger one.
                          Or, you call their bluff. Or, you do any one of a
                          hundred and forty six other things.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="contact">
                    <div className="wrap">
                      <span className="contact-status away" />
                      <img
                        src="http://emilcarlsson.se/assets/rachelzane.png"
                        alt
                      />
                      <div className="meta">
                        <p className="name">Rachel Zane</p>
                        <p className="preview">
                          I was thinking that we could have chicken tonight,
                          sounds good?
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="contact">
                    <div className="wrap">
                      <span className="contact-status online" />
                      <img
                        src="http://emilcarlsson.se/assets/donnapaulsen.png"
                        alt
                      />
                      <div className="meta">
                        <p className="name">Donna Paulsen</p>
                        <p className="preview">
                          Mike, I know everything! I'm Donna..
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="contact">
                    <div className="wrap">
                      <span className="contact-status busy" />
                      <img
                        src="http://emilcarlsson.se/assets/jessicapearson.png"
                        alt
                      />
                      <div className="meta">
                        <p className="name">Jessica Pearson</p>
                        <p className="preview">
                          Have you finished the draft on the Hinsenburg deal?
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="contact">
                    <div className="wrap">
                      <span className="contact-status" />
                      <img
                        src="http://emilcarlsson.se/assets/haroldgunderson.png"
                        alt
                      />
                      <div className="meta">
                        <p className="name">Harold Gunderson</p>
                        <p className="preview">Thanks Mike! :)</p>
                      </div>
                    </div>
                  </li>
                  <li className="contact">
                    <div className="wrap">
                      <span className="contact-status" />
                      <img
                        src="http://emilcarlsson.se/assets/danielhardman.png"
                        alt
                      />
                      <div className="meta">
                        <p className="name">Daniel Hardman</p>
                        <p className="preview">
                          We'll meet again, Mike. Tell Jessica I said 'Hi'.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="contact">
                    <div className="wrap">
                      <span className="contact-status busy" />
                      <img
                        src="http://emilcarlsson.se/assets/katrinabennett.png"
                        alt
                      />
                      <div className="meta">
                        <p className="name">Katrina Bennett</p>
                        <p className="preview">
                          I've sent you the files for the Garrett trial.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="contact">
                    <div className="wrap">
                      <span className="contact-status" />
                      <img
                        src="http://emilcarlsson.se/assets/charlesforstman.png"
                        alt
                      />
                      <div className="meta">
                        <p className="name">Charles Forstman</p>
                        <p className="preview">Mike, this isn't over.</p>
                      </div>
                    </div>
                  </li>
                  <li className="contact">
                    <div className="wrap">
                      <span className="contact-status" />
                      <img
                        src="http://emilcarlsson.se/assets/jonathansidwell.png"
                        alt
                      />
                      <div className="meta">
                        <p className="name">Jonathan Sidwell</p>
                        <p className="preview">
                          <span>You:</span> That's bullshit. This deal is solid.
                        </p>
                      </div>
                    </div>
                  </li>

    */}
                </ul>
              </div>
              <div id="bottom-bar">
                <button id="addcontact" onClick={this.Logout}>
                  <i className="fa fa-sign-out" aria-hidden="true" />{" "}
                  <span>Logout</span>
                </button>
                <button id="settings" onClick={this.AddGroup}>
                  <i
                    class="fa fa-group"
                    aria-hidden="true"
                    style={{ color: "red" }}
                  />{" "}
                  <span>Create Group</span>
                </button>
              </div>
            </div>
            <div
              className="content"
              style={{
                backgroundImage: "url(whatsapp.jpg)"
              }}
            >
              {this.state.UserName !== "" ? (
                <div className="contact-profile" style={{ height: 60 }}>
                  <div>
                    <img src="users.png" alt />
                  </div>

                  <div>
                    <p style={{ fontSize: 13 }}>
                      {this.state.UserName}
                      <br />
                      {this.state.typingstatus === 1 ? (
                        <p>typing ...</p>
                      ) : (
                        <p style={{ fontSize: 13 }}>{this.state.LastSeen}</p>
                      )}
                    </p>
                  </div>

                  <div className="social-media">
                    {/*<i className="fa fa-facebook" aria-hidden="true" />
              <i className="fa fa-twitter" aria-hidden="true" />
              <i className="fa fa-instagram" aria-hidden="true" />*/}
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.state.Group === true ? (
                <div
                  style={{
                    width: 300,
                    height: 400,
                    opacity: 0.7,
                    position: "absolute",
                    zIndex: 5,
                    marginTop: 60,
                    marginRight: 40,
                    backgroundColor: "white",
                    border: "solid",
                    overflowY: "scroll",
                    borderWidth: 1,
                    borderColor: "orange",
                    borderRadius: 10
                  }}
                >
                  {this.state.showNext !== true ? (
                    <div style={{ overflowY: "scroll", overflowX: "hidden" }}>
                      {this.state.AllGroupUser.map((data, key) => (
                        <div style={{ flexDirection: "row" }}>
                          <div
                            style={{
                              borderWidth: 1,
                              height: 20,
                              marginTop: 20,
                              marginLeft: 10,
                              display: "flex"
                            }}
                          >
                            <a
                              href="#"
                              onClick={() => this.SetUsers(data.email)}
                            >
                              {data.email}
                            </a>
                          </div>
                          <div>
                            <p
                              style={{
                                marginLeft: 10,
                                display: "flex",
                                color: "green"
                              }}
                            >
                              {SetGroupUser.map(
                                (data1, key) =>
                                  data1 === data.email
                                    ? this.state.TextToShow
                                    : ""
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        flexDirection: "row",
                        marginTop: 40,
                        marginLeft: 30
                      }}
                    >
                      <img
                        src="groupusers.png"
                        style={{ marginTop: 20, width: 30 }}
                      />
                      <input
                        type="text"
                        placeholder="Enter your Group Name"
                        style={{ marginLeft: 20 }}
                        onChange={this.setGroupText}
                      />
                    </div>
                  )}

                  <button
                    style={{ marginTop: 40, marginLeft: 50 }}
                    onClick={this.AddAll}
                  >
                    Done
                  </button>
                </div>
              ) : (
                ""
              )}

              <div className="messages">
                <ul>
                  {this.state.AllMsg.map(
                    (data, key) =>
                      data.Messagefrom !== this.state.OwnUsername ? (
                        <div>
                          <li className="sent">
                            <img src="users.png" alt />
                            <p>
                              {data.Messages}
                              {"                      "}
                              {this.state.GroupClient === true ? (
                                <p style={{ fontSize: 12, color: "black" }}>
                                  ~{data.Messagefrom}
                                </p>
                              ) : (
                                ""
                              )}

                              <br />
                              <br />
                              {data.Time}
                            </p>
                          </li>
                          {/*<li className="sent">
                            {" "}
                           
                      </li>*/}
                        </div>
                      ) : (
                        <div>
                          <li className="replies">
                            <img src="users.png" alt />
                            <p>
                              {data.Messages}
                              {data.Seen === "yes" ? (
                                <img src="seenmsg.jpg" style={{ width: 25 }} />
                              ) : this.state.IncMsgSeen === true ? (
                                <img src="seenmsg.jpg" style={{ width: 25 }} />
                              ) : this.state.DevliveredMsg === true ? (
                                <img src="deliveredimg.png" />
                              ) : (
                                <img src="tick.gif" style={{ width: 20 }} />
                              )}
                              <br />
                              <br />
                              {data.Time}
                            </p>
                          </li>
                          {/*<li className="replies">
                            <p />
                      </li>*/}
                        </div>
                      )
                  )}
                  <div
                    style={{ float: "left", clear: "both" }}
                    ref={el => {
                      this.messagesEnd = el;
                    }}
                  />
                  {/*
                  <li className="replies">
                    <img
                      src="http://emilcarlsson.se/assets/harveyspecter.png"
                      alt
                    />
                    <p>Excuses don't win championships.</p>
                  </li>
                  <li className="sent">
                    <img src="http://emilcarlsson.se/assets/mikeross.png" alt />
                    <p>Oh yeah, did Michael Jordan tell you that?</p>
                  </li>
                  <li className="replies">
                    <img
                      src="http://emilcarlsson.se/assets/harveyspecter.png"
                      alt
                    />
                    <p>No, I told him that.</p>
                  </li>
                  <li className="replies">
                    <img
                      src="http://emilcarlsson.se/assets/harveyspecter.png"
                      alt
                    />
                    <p>
                      What are your choices when someone puts a gun to your
                      head?
                    </p>
                  </li>
                  <li className="sent">
                    <img src="http://emilcarlsson.se/assets/mikeross.png" alt />
                    <p>
                      What are you talking about? You do what they say or they
                      shoot you.
                    </p>
                  </li>
                  <li className="replies">
                    <img
                      src="http://emilcarlsson.se/assets/harveyspecter.png"
                      alt
                    />
                    <p>
                      Wrong. You take the gun, or you pull out a bigger one. Or,
                      you call their bluff. Or, you do any one of a hundred and
                      forty six other things.
                    </p>
                  </li>
*/}
                </ul>
              </div>
              {this.state.UserName !== "" ? (
                <div className="message-input">
                  <div className="wrap">
                    <input
                      type="text"
                      placeholder="Write your message..."
                      onChange={this.settext}
                      onBlur={this.Deni}
                      name="text"
                      ref="texts"
                    />
                    <i
                      className="fa fa-paperclip attachment"
                      aria-hidden="true"
                    />
                    <button className="submit" onClick={this.SendMessage}>
                      <i className="fa fa-paper-plane" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Chat;
