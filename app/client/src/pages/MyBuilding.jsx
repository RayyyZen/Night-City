import { useState } from 'react'
import HeaderPage from '../components/HeaderPage.jsx';
import { useEffect } from "react";
import { getMyBuilding, updateBuilding } from '../services/buildingService.js';
import { useNavigate } from 'react-router-dom';
import { accessPages } from '../services/accessPages';
import FooterPage from '../components/FooterPage.jsx';
import { useRef } from "react"

import { deviceUse, deviceIdle, deviceError } from '../services/deviceService.js';

import { kick, leave } from '../services/userService.js';


export default function MyBuilding() {

    const navigate = useNavigate()

    const [user, setUser] = useState('')

    useEffect(() => {
        async function checkPage(){
            const { user, canAccessToPage } = await accessPages("mybuilding")

            if (!canAccessToPage) {
                navigate("/home")
            }

            setUser(user)
        }

        checkPage()
        
    }, [navigate])

    const [loading, setLoading] = useState(true)

    const [building, setBuilding] = useState(null)
    const [users, setUsers] = useState([])
    const [devices, setDevices] = useState([])

    const [updatingDescription, setUpdatingDescription] = useState(false)
    const [updatingPassword, setUpdatingPassword] = useState(false)

    const [oldDescription, setOldDescription] = useState('')

    const [description, setDescription] = useState('')
    const [password, setPassword] = useState("123456789")

    const textareaRef = useRef(null)

    const [fieldType, setFieldType] = useState('password')

    const [error, setError] = useState('')

    useEffect(() => {
        async function getMyBuildingHandler(){
            const { building, users, devices } = await getMyBuilding()
            setBuilding(building)
            setUsers(users)
            setDevices(devices)

            if(building){
                setDescription(building.description)

                setOldDescription(building.description)
            }

            setLoading(false)
        }

        getMyBuildingHandler()
        
    }, [])

    async function kickHandler(e, id){
        e.preventDefault()

        const { message, success } = await kick(id)

        if(!success){
            setError(message)
        }
        else{
            setUsers(prevUsers =>
                prevUsers.filter(u => u.id !== id)
            );
        }
    }

    async function leaveHandler(e){
        e.preventDefault()

        const { message, success } = await leave()

        if(!success){
            setError(message)
        }
        else{
            navigate('/home')
        }
    }

    const listUsers = users?.map(u => 
    <div key={u.id} onClick={() => navigate(`/profile/${u.id}`)}>
        
        
        <article className="admin-user-card"> 
            
            <div className="user-info">
                <span className="name">{u.nickName}</span>
                <span className="role">{u.building_role}</span> 
            </div>

            { user.building_role == "owner" && user.id != u.id &&
            <button 
                className="kick-btn"
                onClick={(e) => {
                    e.stopPropagation(); 
                    kickHandler(e, u.id)
                    //kick user                    
                }}
            >
                KICK
            </button>
            }

            { user.id == u.id &&
            <button 
                className="kick-btn"
                onClick={(e) => {
                    e.stopPropagation(); 
                    leaveHandler(e)
                    //kick user                    
                }}
            >
                LEAVE
            </button>
            }

        </article>

    </div>
)

    async function deviceUseHandler(e, id){
        e.preventDefault()

        const { message, success } = await deviceUse(id)

        if(!success){
            setError(message)
        }
        else{
            setDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === id ? { ...device, user_id: user.id, status: "in_use" } : device
            )
            );
        }
    }

    async function deviceIdleHandler(e, id){
        e.preventDefault()

        const { message, success } = await deviceIdle(id)

        if(!success){
            setError(message)
        }
        else{
            setDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === id ? { ...device, user_id: user.id, status: "idle" } : device
            )
            );
        }
    }

    async function deviceErrorHandler(e, id){
        e.preventDefault()

        const { message, success } = await deviceError(id)

        if(!success){
            setError(message)
        }
        else{
            setDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === id ? { ...device, user_id: user.id, status: "error" } : device
            )
            );
        }
    }

    const listDevices = devices?.map(device => 
        <div className="card" key={device.id}>
            <article onClick={() => navigate(`/device/${device.id}`) }> {device.name} [{device.status}] </article>
            {device.status == "idle" && <button type="button" onClick={(e) => deviceUseHandler(e,device.id) }>Use</button> }
            {device.status == "in_use" && (device.user_id == user.id || user.building_role == "owner") && <button type="button" onClick={(e) => deviceIdleHandler(e,device.id) }>Can</button> }
            {device.status == "error" && user.building_role == "owner"  && <button type="button" onClick={(e) => deviceIdleHandler(e,device.id) }>Act</button> }
            {device.status != "error" && user.building_role == "owner" && <button type="button" onClick={(e) => deviceErrorHandler(e,device.id) }>Err</button> }
        </div>
    )

    async function submitUpdate(e){
        e.preventDefault()

        setUpdatingDescription(false)
        setUpdatingPassword(false)

        const data = {
            description: description
        }
        if(updatingPassword){
            data.password = password
        }

        const { message, success } = await updateBuilding(data)

        if(!success){
            setError(message)

            setDescription(oldDescription)
        }
        else{
            setOldDescription(description)
        }
        setPassword("123456789")
    }


    return (
        <>

        <HeaderPage page={"mybuilding"} />

        { building &&
            <div className="center">
                <form className="form" onSubmit={submitUpdate}>
                    <h1 className='formName'>My Building</h1>

                    <label className="align">
                        Name
                        <input 
                            disabled
                            required
                            className="input"
                            type="text"
                            name="name"
                            value={building.name} 
                        />
                    </label>

                    <label className="align">
                        Description
                        <textarea
                        ref={textareaRef}
                            disabled={!updatingDescription}
                            required
                            className="input left"
                            name="description"
                            value={description} 
                            onChange={e => {
                                e.target.style.height = "auto"
                                e.target.style.height = e.target.scrollHeight + "px"
                                setDescription(e.target.value)
                            }}
                        ></textarea>

                        {user && user.building_role && user.building_role == "owner" &&
                        <div className="buttons">
                            { updatingDescription && <button type="submit" className="input">Submit</button> }
                            { !updatingDescription && <button type="button" className="input" onClick={() => { if(!updatingPassword) setUpdatingDescription(true) }}>Update</button> }
                            { updatingDescription && <button type="button" className="input" onClick={() => { setDescription(oldDescription), setUpdatingDescription(false) }}>Cancel</button> }
                        </div>
                        }
                    </label>

                    <label className="align">
                        Address
                        <input 
                            disabled
                            required
                            className="input"
                            type="text"
                            name="address"
                            value={building.address} 
                        />
                    </label>

                    <label className="align">
                        Area
                        <input 
                            disabled
                            required
                            className="input"
                            type="Number"
                            name="area"
                            value={building.area} 
                        />
                    </label>

                    <label className="align">
                        Password
                        <input 
                            disabled={!updatingPassword}
                            className="input"
                            type={fieldType}
                            name="password"
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value)
                                setError('')
                            }}
                        />

                        {user && user.building_role && user.building_role == "owner" &&
                        <div className="buttons">
                            { updatingPassword && <button type="submit" className="input">Submit</button> }
                            { !updatingPassword && <button type="button" className="input" onClick={() => { if(!updatingDescription) setUpdatingPassword(true), setPassword('') }}>Update</button> }
                            { updatingPassword && <button type="button" className="input" onClick={() => { setPassword("123456789"), setUpdatingPassword(false) }}>Cancel</button> }
                        </div>
                        }
                        


                        { user && user.building_role && user.building_role == "owner" && updatingPassword && fieldType == "password" && <button type="button" className="input" onClick={() => { setFieldType("text") }}>Show</button> }

                        { user && user.building_role && user.building_role == "owner" && updatingPassword && fieldType == "text" && <button type="button" className="input" onClick={() => { setFieldType("password") }}>Hide</button> }

                        

                    </label>

                    <div className="center">
                        <div className="title">Users</div>
                        {listUsers}
                    </div>

                    <div className="center">
                        <div className="title">Devices</div>
                        {listDevices}
                        { user && user.building_role && user.building_role == "owner" && <button className="submit-button" onClick={() => navigate('/create-device')}>Create new device</button> }
                        <button className="submit-button" onClick={() => navigate('/publish-news')}>Publish news</button>
                    </div>

                    {error && <div>{error}</div>}
                </form>

            </div>
        }

        

        { !loading && !building && <div>Building not found</div> }

        <FooterPage/>

        </>
    )
}