import { useRef, useState } from "react";

function App(){
  // State 
  const [count, setCount] = useState(1);

  const [users, setUsers]  = useState([
    {id: 1, nom: "Rémi"},
    {id: 2, nom: "Rayane"}
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
  return( <div>
    <h1>Night-Tour {count} </h1>
    <button onClick={handleClick}>Add</button>
    <h1>Users list</h1>
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.nom} <button onClick={() => handleDelete(user.id)} >Stock</button>
          </li>
      ))}
    </ul>
    <form action="submit" onSubmit={handleSubmit}>
      <input value={newUser} ref={inputRef} type="text" placeholder="Ajouter un utilisateur..." 
      onChange = {handleChange}
      />
      <button >Ajouter +</button>
    </form>
  </div>
  );
}

export default App;
