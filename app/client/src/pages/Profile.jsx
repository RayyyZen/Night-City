import { useParams } from "react-router-dom";
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import HeaderPage from '../components/HeaderPage.jsx';
import { accessPages } from '../services/accessPages';
import { useEffect } from "react";
import FooterPage from '../components/FooterPage.jsx';
import { getPublicProfile } from '../services/userService';


export default function Profile() {

    const navigate = useNavigate()
    
    useEffect(() => {
        async function checkPage(){
            const { canAccessToPage } = await accessPages("profile")

            if (!canAccessToPage) {
                navigate("/home")
            }
        }

        checkPage()
        
    }, [navigate])

    const { id } = useParams()

    const [user, setUser] = useState(null)
    
    useEffect(() => {
        async function getMyProfileHandler(id){
            const user = await getPublicProfile(id)
            setUser(user)
        }

        getMyProfileHandler(id)
        
    }, [id])

    return (

    <>

    <HeaderPage page={"profile"} />

        {user && 

        <div className="center">
            
            <form className="form">
                <h1 className='formName'>Profile</h1>

            <label className="align">
                First Name
                <input 
                    disabled
                    className="input"
                    type="text"
                    name="firstName"
                    value={user.firstName} 
                />
            </label>

            <label className="align">
                Last Name
                <input 
                    disabled
                    className="input"
                    type="text"
                    name="lastName"
                    value={user.lastName} 
                />
            </label>

            <label className="align">
                Nick Name
                <input 
                    disabled
                    className="input"
                    type="text"
                    name="nickName"
                    value={user.nickName} 
                />
            </label>

            <label className="align">
                Email
                <input 
                    disabled
                    className="input"
                    type="email"
                    name="email"
                    value={user.email} 
                />
            </label>

            <label className="align">
                Level
                <input 
                    disabled
                    className="input"
                    type="text"
                    name="level"
                    value={user.level} 
                />
            </label>

            { user.building_id && <button type="button" className="submit-button" onClick={() => { navigate(`/building/${user.building_id}`) }}>Building</button> }

        </form>
        </div>

}

        
    
        <FooterPage/>
        </>
        
    )
}