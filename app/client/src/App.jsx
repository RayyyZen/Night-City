import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import VerifyCode from './pages/VerifyCode'
import Register from './pages/Register'

function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App

/*
import { useRef, useState } from "react";
import "./styles.css";

function App(){
  // State 
  const [count, setCount] = useState(1);

  const [users, setUsers]  = useState([
    {id: 1, nom: "Rémi"},
    {id: 2, nom: "Rayane"},
    {id: 3, nom: "Alexis"},
    {id: 4, nom: "Atahan"}
  ])

  const [newUser, setnewUser] = useState("");

  const inputRef = useRef();

  // Behaviour
  const handleClick = () => {
    setCount(count + 1);
  }
  const handleDelete = (id) => {
    console.log(id);
  
  // 1 state copy
  const usersCopy = [...users];

  // 2 manipulate state
  const usersCopyUpdated = usersCopy.filter((user => user.id !== id));

  // 3 change state with setter 
  setUsers(usersCopyUpdated);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("handleSubmit");
    const usersCopy = [...users];

    const id = new Date().getTime();
    const nom = newUser;
    usersCopy.push({id: id, nom: nom});

    setUsers(usersCopy);
    setnewUser("");
  };

  const handleChange = (event) => {
    const valueAfterChange = event.target.value;
    console.log(valueAfterChange);
    setnewUser(valueAfterChange);
  };

  // display (render)
  return( 
  <div className="App">
      <header className="app-header">
        <h1 className="app-title">Night-Tower</h1>
        <p className="app-subtitle">Welcome to Night-Tower</p>
      </header>

      <main className="main-card">
        <p className="counter">Counter : {count}</p>
        <button className="btn-primary" onClick={handleClick}>
          Add
        </button>

        <h2 className="section-title">Users list</h2>

        <ul className="users-list">
          {users.map((user) => (
            <li key={user.id}>
              <span className="user-name">{user.nom}</span>
              <button
                className="btn-special"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit}>
          <input
            value={newUser}
            onChange={handleChange}
            type="text"
            placeholder="Ajouter un utilisateur..."
          />
          <button className="btn-primary" type="submit">
            Add +
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
 */


/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
*/