import { Link } from 'react-router-dom';
import { session } from '../services/userService.js';
import { useEffect } from 'react';
import { useState } from 'react';
import { logOut } from '../services/userService.js';
import { useNavigate } from 'react-router-dom';

export default function HeaderPage({ page }){

    const navigate = useNavigate()

    const [user, setUser] = useState(null)

    useEffect(() => {
        async function getSessionUser(){
            const { user } = await session()
            setUser(user)
        }

        getSessionUser()        
    }, [])

    async function logOutHandler(){
        const { success } = await logOut()
        if(success){
            setUser(null)
            navigate('/home')
        }
    }

    return (
        <header className="header">
            <Link to="/home" className="logo">Night-Tower</Link>

            <nav className="nav">
                { page != "home" && <Link className ="link" to="/home">Home</Link> }
                <Link className ="link" to="/buildings">Buildings</Link>
                { page != "login" && page != "register" && page != "code" && !user && <Link className ="link" to="/login">Sign-in</Link> }
                { page != "login" && page != "register" && page != "code" && !user && <Link className ="link" to="/register">Sign-up</Link> }
                { page != "profile" && page != "login" && page != "register" && page != "code" && user && <Link className ="link" to="/profile">Profile</Link> }
                { page != "mybuilding" && page != "login" && page != "register" && page != "code" && user && user.building_id && <Link className ="link" to="/mybuilding">My building</Link> }
                { page != "create-building" && user && !user.building_id && <Link className ="link" to="/create-building">Create building</Link> }
                { user && <button className ="link" onClick={logOutHandler}>Log-out</button> }
            </nav>
        </header>
    )
}