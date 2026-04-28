import { useParams } from "react-router-dom";
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import HeaderPage from '../components/HeaderPage.jsx';
import { accessPages } from '../services/accessPages';
import { useEffect } from "react";
import FooterPage from '../components/FooterPage.jsx';
import { getPublicProfile, updateRole } from '../services/userService';


export default function Profile() {

    const navigate = useNavigate()

    const [sessionUser, setSessionUser] = useState(null)
    
    useEffect(() => {
        async function checkPage(){
            const { user, canAccessToPage } = await accessPages("profile")

            if (!canAccessToPage) {
                navigate("/home")
            }

            setSessionUser(user)
        }

        checkPage()
        
    }, [navigate])

    const { id } = useParams()

    const [user, setUser] = useState(null)

    const [buildingRole, setBuildingRole] = useState('')
    const [oldBuildingRole, setOldBuildingRole] = useState('')
    
    useEffect(() => {
        async function getMyProfileHandler(id){
            const user = await getPublicProfile(id)
            setUser(user)
            if(user && user.building_role){
                setBuildingRole(user.building_role)
                setOldBuildingRole(user.building_role)
            }
        }

        getMyProfileHandler(id)
        
    }, [id])

    const [updatingBuildingRole, setUpdatingBuildingRole] = useState(false)

    const [error, setError] = useState('')

    async function submitRoleUpdate(e){
        e.preventDefault()

        setUpdatingBuildingRole(false)

        if(buildingRole == "owner"){
            setBuildingRole(oldBuildingRole)
            setError("You can't make him an owner")
            return
        }
        
        const { message, success } = await updateRole(id, buildingRole)

        if(!success){
            setError(message)
            setBuildingRole(oldBuildingRole)
        }
        else{
            setOldBuildingRole(buildingRole)
        }
    }

    return (

    <>

    <HeaderPage page={"profile"} />

        {user && 

        <div className="center">
            
            <form className="form" onSubmit={submitRoleUpdate}>
                <h1 className='formName'>Profile</h1>
                {user.image
                    ? <img
                        src={`http://localhost:3000/${user.image}`}
                        alt="Photo de profil"
                        className="register-image"
                    />
                    : <div className="image-placeholder"></div>
                }

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

            { user.building_id && sessionUser && sessionUser.building_id && sessionUser.building_id == user.building_id && sessionUser.id != user.id && sessionUser.building_role == "owner" &&
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
            }

            { user.building_id && sessionUser && sessionUser.building_id && sessionUser.building_id == user.building_id && sessionUser.id != user.id && sessionUser.building_role == "owner" &&
                <label className="align">
                    Points
                    <input 
                        disabled
                        className="input"
                        type="Number"
                        name="points"
                        value={user.points} 
                    />
                </label>
            }

            { user.building_id && sessionUser && sessionUser.building_id && sessionUser.building_id == user.building_id && sessionUser.id != user.id && sessionUser.building_role == "owner" &&

                <label className="align">
                    Building Role
                    <input 
                        disabled={!updatingBuildingRole}
                        className="input"
                        type="text"
                        name="building_role"
                        value={buildingRole} 
                        onChange={e => {
                            setBuildingRole(e.target.value)
                            setError('')
                        }}
                    />
                
                    <div className="buttons">
                        { updatingBuildingRole && <button type="submit" className="input">Submit</button> }
                        { !updatingBuildingRole && <button type="button" className="input" onClick={() => { setUpdatingBuildingRole(true) }}>Update</button> }
                        { updatingBuildingRole && <button type="button" className="input" onClick={() => { setBuildingRole(oldBuildingRole), setUpdatingBuildingRole(false) }}>Cancel</button> }
                    </div>
                </label>

            }

            {error && <div className="error">{error}</div>}

            { user.building_id && <button type="button" className="submit-button" onClick={() => { navigate(`/building/${user.building_id}`) }}>Building</button> }

        </form>
        </div>

}

        
    
        <FooterPage/>
        </>
        
    )
}