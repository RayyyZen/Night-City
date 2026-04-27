import { useState } from 'react'
import HeaderPage from '../components/HeaderPage.jsx';
import { useEffect } from "react";
import { getAllUsers, deleteUser } from '../services/userService.js';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import FooterPage from '../components/FooterPage.jsx';

export default function Admin() {

    const navigate = useNavigate()

    const [users, setUsers] = useState([])

    useEffect(() => {
        async function getAllUsersHandler(){
            const allUsers = await getAllUsers()
            setUsers(allUsers)
        }

        getAllUsersHandler()
        
    }, [])

    const [error, setError] = useState('')

    async function deleteHandler(e, id){
        e.preventDefault()
        setError('')

        const { message, success } = await deleteUser(id)

        if(!success){
            setError(message)
        }
        else{
            setUsers(prevUsers =>
                prevUsers.filter(u => u.id !== id)
            );
        }
    }



    const listUsers = users?.map(user => 
        <div key={user.id} >
            <article className="card" onClick={() => navigate(`/profile/${user.id}`)}> {user.nickName} [{user.role}] </article>
            <button type="button" onClick={(e) => { deleteHandler(e, user.id) }}>Delete</button>
        </div>
    )

    return (
        <>

        <HeaderPage page={"admin"} />

        <div className="center" >

            <div className="card-container">

            
                {listUsers}
        

            </div>

            {error && <div>{error}</div>}
    
            
        </div>


        <FooterPage/>

        </>
    )
}