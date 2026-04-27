import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import HeaderPage from '../components/HeaderPage.jsx';
import FooterPage from '../components/FooterPage.jsx';
import { accessPages } from '../services/accessPages';
import { useEffect } from "react";
import { createDevice } from "../services/deviceService.js";


export default function CreateDevice() {

    const navigate = useNavigate()
    
    useEffect(() => {
        async function checkPage(){
            const { canAccessToPage } = await accessPages("create-device")

            if (!canAccessToPage) {
                navigate("/home")
            }
        }

        checkPage()
        
    }, [navigate])

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [energy, setEnergy] = useState('')

    const [error, setError] = useState('')

    async function createDeviceHandler(e){
        e.preventDefault()

        const { message, success } = await createDevice(name, description, energy)

        if(success){
            navigate('/mybuilding')
        }
        else{
            setError(message)
        }
    }

    return (

    <>

    <HeaderPage page={"create-device"} />


        <div className="center">
            
            <form className="form" onSubmit={createDeviceHandler}>
                <h1 className='formName'>Create device</h1>
            <label className="align">
                Name
                <input 
                    required
                    className="input"
                    type="text"
                    name="name"
                    value={name} 
                    onChange={e => {
                        setName(e.target.value)
                        setError('')
                    }}
                />
            </label>

            <label className="align">
                Description
                <textarea
                    required
                    className="input left"
                    name="description"
                    value={description} 
                    onChange={e => {
                        setDescription(e.target.value)
                        setError('')
                        e.target.style.height = "auto"
                        e.target.style.height = e.target.scrollHeight + "px"
                    }}
                ></textarea>
            </label>

            <label className="align">
                Energy
                <input 
                    required
                    className="input"
                    type="Number"
                    name="energy"
                    value={energy}
                    onChange={e => {
                        setEnergy(e.target.value)
                        setError('')
                    }}
                />
            </label>

            <button className="submit-button" type="submit">
                Submit
            </button>

            {error && <div>{error}</div>}
        </form>
        </div>

        <FooterPage />
        </>
        
    )
}