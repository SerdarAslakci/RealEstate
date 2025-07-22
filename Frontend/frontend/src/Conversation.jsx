import React, { useEffect, useState,useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // <-- Buraya useLocation'ı ekleyin
import axios from "axios";
import Navbar from "./Components/Navbar.jsx";

function Conversation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [loggedInUser,setLoggedInUser] = useState();
  const [IsExists,setIsExists] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderUser,setSenderUser] = useState();
  const [receiverUser,setReceiverUser] = useState();
  const location = useLocation();
  const bottomRef = useRef(null);
  const { from, to } = location.state || {};

  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    axios
      .get(`http://localhost:5250/api/Profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data != null) {
          setIsLoggedIn(true);
          setSenderUser(res.data);
          setLoggedInUser(res.data);
        }
      })
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 404)) {
          setIsLoggedIn(false);
          localStorage.removeItem("token");
           navigate("/Login");
        } else {
            console.error("Error checking profile:", err);
        }
      });

  }, []);

  useEffect(() =>
  {
    var token = localStorage.getItem("token");
    if(token == null)
    {
        setIsLoggedIn(false);
        navigate("/Login");
    }        

    axios.get(`http://localhost:5250/api/Conversation`,
        {
            headers:
            {
                Authorization: `Bearer ${token}`
            }
        }
    )
    .then((response) => 
    {
        if(response.data)
        {
            setConversations(response.data);
        }
    })
    .catch((err) => 
    {
        if(err.response && err.response.data == 401)
            {
                setIsLoggedIn(false);
                localStorage.removeItem("token");
                navigate("/Login");
            }        
    })

    if(to != null)
    {
        axios
        .get(`http://localhost:5250/api/Profile/${to}`)
        .then((res) => {
            if (res.data != null) {
            setReceiverUser(res.data);
            }
        })
        .catch((err) => {
            if (err.response && (err.response.status === 401 || err.response.status === 404)) {
                console.log(err.response.data);
            } 
            else
            {
                console.log(err.response.data);
            }
        });
    }

  },[]);

  useEffect(() => 
    {
        conversations.forEach(element => {
            if((element.userSenderId == from && element.receiverUserId == to) || element.userSenderId == to && element.receiverUserId == from)
            {
                setSelectedConversation(element);
            }   
        });
    },[conversations])

    useEffect(() => 
    {   
        checkAndCreateConversation();
    },[to])

  useEffect(() => {
    if (selectedConversation) {
      const token = localStorage.getItem("token");

      axios
      .get(`http://localhost:5250/api/Conversation/GetMessages/${selectedConversation.id}`, 
        { headers: 
            { 
                Authorization: `Bearer ${token}` 
            } 
        })
      .then((res) =>
        {
            setMessages(res.data);
        }) 
      .catch((err) => 
        {
            if(err.response.status == 401)
            {
                setIsLoggedIn(false);
                localStorage.removeItem("token");
                navigate("/Login");
            }
        });
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (messages.length > 0) {
        bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
    }, [messages]);

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        navigate("/");
  };

  const checkAndCreateConversation = async () => {

    const token = localStorage.getItem("token");
        if (to != null) {
            try {
                const res = await axios.post(`http://localhost:5250/api/Conversation/IsExists`,
                    { receiverUserId: to },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data === false) {
                    const createRes = await axios.post(`http://localhost:5250/api/Conversation/CreateConversation`,
                        { receiverUserId: to },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (createRes.data != null) {
                        const conv = createRes.data;
                        setConversations(prev => [conv, ...prev]);
                        setSelectedConversation(conv);
                    }
                }
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setIsLoggedIn(false);
                    localStorage.removeItem("token");
                    navigate("/Login");
                }
            }
        }
    };


  const handleConversationSelect = (conversation) => {
    setMessages([]);
    setSelectedConversation(conversation); 
  };

  const handleSendMessage = (convId) => {
    if (newMessage.trim() === "" || !selectedConversation) return;

    const token = localStorage.getItem("token");
    axios
        .post(`http://localhost:5250/api/Conversation/SendMessage`,
        { 
            conversationId: convId,
            messageText: newMessage 
        },
        { 
            headers: 
            { 
                Authorization: `Bearer ${token}` 
            } 
        })
        .then(res => {

            if(res.data != null)
            {
                const msg = res.data;
                setMessages(prevMessages => [...prevMessages, msg]);
                setNewMessage("");
            }
        })
        .catch((err) => 
        {
            if(err.response && err.response.status == 401)
            {
                setIsLoggedIn(false);
                localStorage.removeItem("token");
                navigate("/Login");
            }
        });
  };

  return (
    <div className="container-fluid w-90 px-3">
      {/* Navbar - Home.jsx'teki ile aynı */}
      <nav className="navbar navbar-expand-lg navbar-light bg-dark mb-3 mt-0 shadow-sm rounded-bottom">
        <div className="container-fluid px-5">
          <Link className="navbar-brand text-white fw-bold fs-2" to="/">
            🏠︎
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/ExploreHomes">
                      Homes
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/Profile">
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link text-white btn btn-link d-flex align-items-center gap-2"
                      onClick={handleLogout}
                      style={{ textDecoration: "none" }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/ExploreHomes">
                      Homes
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/Login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/Register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Ana Konuşma Bölümü */}
      <section className="container py-5">
        <div className="row">
          {/* Sol Taraf: Sohbet Listesi */}
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark fw-bold">Conversations</div>
              <ul className="list-group list-group-flush" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <li
                      key={conv.id}
                      className={`list-group-item list-group-item-action ${selectedConversation && selectedConversation.id === conv.id ? 'active bg-dark text-white' : ''}`}
                      onClick={() => handleConversationSelect(conv)}
                      style={{ cursor: 'pointer' }}
                    >
                      {conv && conv.userSenderId != loggedInUser.id ? (`${conv.senderUserFirstName + " " + conv.senderUserLastName}`):(`${conv.receiverUserFirstName + " " + conv.receiverUserLastName}`) }
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">No conversations found.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Sağ Taraf: Mesaj Alanı */}
          <div className="col-md-8">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-dark text-white fw-bold">
                    {
                    selectedConversation
                        ? (
                            selectedConversation.userSenderId !== loggedInUser.id
                            ? `Chat with ${selectedConversation.senderUserFirstName} ${selectedConversation.senderUserLastName}`
                            : `Chat with ${selectedConversation.receiverUserFirstName} ${selectedConversation.receiverUserLastName}`
                        )
                        : 'Select a Conversation'
                    }
              </div>
              <div className="card-body d-flex flex-column" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                {selectedConversation ? (
                  messages.length > 0 ? (
                    messages.map((msg) => (
                      <div key={msg.id}>
                        <div key={msg.id} className={`d-flex mb-3 ${msg.senderUserId == senderUser.id ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`p-3 rounded ${msg.senderUserId == senderUser.id ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '75%' }}>
                                <p className="mb-0">{msg.messageText}</p>
                                <small className="text-muted d-block text-end" style={{ fontSize: '0.75em' }}>{new Date(msg.sentDate).toLocaleString()}</small>
                            </div>
                        </div> 
                        <div ref={bottomRef} />
                      </div> 
                    ))
                  ) : (
                    <div className="flex-grow-1 d-flex align-items-center justify-content-center text-muted">
                      Start a conversation!
                    </div>
                  )
                ) : (
                  <div className="flex-grow-1 d-flex align-items-center justify-content-center text-muted">
                    Please select a conversation from the left.
                  </div>
                )}
              </div>
              {selectedConversation && (
                <div className="card-footer bg-light d-flex">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                    }}
                  />
                  <button className="btn btn-warning" onClick={() => handleSendMessage(selectedConversation.id)}>
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Conversation;