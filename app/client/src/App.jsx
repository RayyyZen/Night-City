import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
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