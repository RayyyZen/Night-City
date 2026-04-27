import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import HeaderPage from '../components/HeaderPage.jsx';
import FooterPage from '../components/FooterPage.jsx';
import { accessPages } from '../services/accessPages';
import { useEffect } from "react";
import { getDevice, updateDevice } from "../services/deviceService.js";
import { useParams } from "react-router-dom";
import { useRef } from "react"



export default function Device() {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    
    useEffect(() => {
        async function checkPage(){
            const { user, canAccessToPage } = await accessPages("device")

            if (!canAccessToPage) {
                navigate("/home")
            }

            setUser(user)
        }

        checkPage()
        
    }, [navigate])

    const { id } = useParams()

    const [device, setDevice] = useState(null)
    const [loading, setLoading] = useState(true)

    const [updatingName, setUpdatingName] = useState(false)
    const [updatingDescription, setUpdatingDescription] = useState(false)
    const [updatingEnergy, setUpdatingEnergy] = useState(false)

    const [oldName, setOldName] = useState('')
    const [oldDescription, setOldDescription] = useState('')
    const [oldEnergy, setOldEnergy] = useState('')

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [energy, setEnergy] = useState('')

    const [error, setError] = useState('')

    const textareaRef = useRef(null)

    useEffect(() => {
        async function getDeviceHandler(id){
            const { device } = await getDevice(id)
            setDevice(device)

            if(device){
                setName(device.name)
                setDescription(device.description)
                setEnergy(device.energy)

                setOldName(device.name)
                setOldDescription(device.description)
                setOldEnergy(device.energy)
            }

            setLoading(false)
        }

        getDeviceHandler(id)
        
    }, [id])

    useEffect(() => {
        const el = textareaRef.current
        if (el) {
            el.style.height = "auto"
            el.style.height = el.scrollHeight + "px"
        }
    }, [device])

    async function submitUpdate(e){
        e.preventDefault()

        setUpdatingName(false)
        setUpdatingDescription(false)
        setUpdatingEnergy(false)

        const data = {
            name: name,
            description: description,
            energy: energy
        }

        const { message, success } = await updateDevice(id, data)

        if(!success){
            setError(message)

            setName(oldName)
            setDescription(oldDescription)
            setEnergy(oldEnergy)
        }
        else{
            setOldName(name)
            setOldDescription(description)
            setOldEnergy(energy)
        }
    }

    return (

    <>

    <HeaderPage page={"device"} />

        {device && 

        <div className="center">
            
            <form className="form" onSubmit={submitUpdate}>
                <h1 className='formName'>Device</h1>

            <label className="align">
                Name
                <input 
                    disabled={!updatingName}
                    required
                    className="input"
                    type="text"
                    name="name"
                    value={name} 
                    onChange={ e => {
                        setName(e.target.value)
                    }}
                />

                {user && user.building_role && user.building_role == "owner" &&
                <div className="buttons">
                    { updatingName && <button type="submit" className="input">Submit</button> }
                    { !updatingName && <button type="button" className="input" onClick={() => { if(!updatingDescription && !updatingEnergy) setUpdatingName(true) }}>Update</button> }
                    { updatingName && <button type="button" className="input" onClick={() => { setName(oldName), setUpdatingName(false) }}>Cancel</button> }
                </div>
                }
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
                    { !updatingDescription && <button type="button" className="input" onClick={() => { if(!updatingName && !updatingEnergy) setUpdatingDescription(true) }}>Update</button> }
                    { updatingDescription && <button type="button" className="input" onClick={() => { setDescription(oldDescription), setUpdatingDescription(false) }}>Cancel</button> }
                </div>
                }
            </label>

            <label className="align">
                Energy
                <input 
                    disabled
                    required
                    className="input"
                    type="Number"
                    name="energy"
                    value={energy}
                    onChange={ e => {
                        setEnergy(e.target.value)
                    }}
                />

                {user && user.building_role && user.building_role == "owner" &&
                <div className="buttons">
                    { updatingEnergy && <button type="submit" className="input">Submit</button> }
                    { !updatingEnergy && <button type="button" className="input" onClick={() => { if(!updatingDescription && !updatingName) setUpdatingEnergy(true) }}>Update</button> }
                    { updatingEnergy && <button type="button" className="input" onClick={() => { setEnergy(oldEnergy), setUpdatingEnergy(false) }}>Cancel</button> }
                </div>
                }
            </label>

            <label className="align">
                Status
                <input 
                    disabled
                    required
                    className="input"
                    type="text"
                    name="status"
                    value={device.status} 
                />
            </label>

            <label className="align">
                Installation Date
                <input
                    disabled
                    required
                    className="input"
                    name="date"
                    type="date"
                    value={device.installationDate.split('T')[0]} 
                />
            </label>

            { device.status == "in_use" && <button onClick={() => navigate(`/profile/${device.user_id}`)}>User</button> }
            <button className="submit-button" type="button" onClick={() => navigate(`/building/${device.building_id}`)}>Building</button>

            {error && <div>{error}</div>}
        </form>
        </div>
        }

        { !loading && !device && <div>Device not found</div> }

        <FooterPage />
        </>
        
    )
}