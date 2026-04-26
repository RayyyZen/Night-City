import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import HeaderPage from '../components/HeaderPage.jsx';
import FooterPage from '../components/FooterPage.jsx';
import { accessPages } from '../services/accessPages';
import { useEffect } from "react";
import { getDevice } from "../services/deviceService.js";
import { useParams } from "react-router-dom";
import { useRef } from "react"



export default function Device() {

    const navigate = useNavigate()
    
    useEffect(() => {
        async function checkPage(){
            const { canAccessToPage } = await accessPages("device")

            if (!canAccessToPage) {
                navigate("/home")
            }
        }

        checkPage()
        
    }, [navigate])

    const { id } = useParams()

    const [device, setDevice] = useState(null)
    const [loading, setLoading] = useState(true)

    const textareaRef = useRef(null)

    useEffect(() => {
        async function getDeviceHandler(id){
            const { device } = await getDevice(id)
            setDevice(device)
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

    return (

    <>

    <HeaderPage page={"device"} />

        {device && 

        <div className="center">
            
            <form className="form">
                <h1 className='formName'>Device</h1>

            <label className="align">
                Name
                <input 
                    disabled
                    required
                    className="input"
                    type="text"
                    name="title"
                    value={device.name} 
                />
            </label>

            <label className="align">
                Description
                <textarea
                ref={textareaRef}
                    disabled
                    required
                    className="input left"
                    name="description"
                    value={device.description} 
                    onChange={e => {
                        e.target.style.height = "auto"
                        e.target.style.height = e.target.scrollHeight + "px"
                    }}
                ></textarea>
            </label>

            <label className="align">
                Energy
                <input 
                    disabled
                    required
                    className="input"
                    type="Number"
                    name="energy"
                    value={device.energy} 
                />
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
        </form>
        </div>
        }

        { !loading && !device && <div>Device not found</div> }

        <FooterPage />
        </>
        
    )
}