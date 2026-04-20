import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import HeaderPage from '../components/HeaderPage.jsx';
import FooterPage from '../components/FooterPage.jsx';
import { accessPages } from '../services/accessPages';
import { useEffect } from "react";
import { createBuilding } from "../services/buildingService.js";


export default function CreateBuilding() {

    const navigate = useNavigate()
    
    useEffect(() => {
        async function checkPage(){
            const { canAccessToPage } = await accessPages("create-building")

            if (!canAccessToPage) {
                navigate("/home")
            }
        }

        checkPage()
        
    }, [navigate])

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [area, setArea] = useState('')
    const [error, setError] = useState('')

    async function createBuildingHandler(e){
        e.preventDefault()
        const { message, success } = await createBuilding(name, address, area)
        if(success){
            navigate('/mybuilding')
        }
        else{
            setError(message)
        }
    }

    return (

    <>

    <HeaderPage page={"create-page"} />


        <div className="center">
            
            <form className="form" onSubmit={createBuildingHandler}>
                <h1 className='formName'>Create building</h1>
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
                Address
                <input 
                    required
                    className="input"
                    type="text"
                    name="address"
                    value={address}
                    onChange={e => {
                        setAddress(e.target.value)
                        setError('')
                    }}
                />
            </label>

            <label className="align">
                Area
                <input 
                    required
                    className="input"
                    type="Number"
                    name="area"
                    value={area}
                    onChange={e => {
                        setArea(e.target.value)
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