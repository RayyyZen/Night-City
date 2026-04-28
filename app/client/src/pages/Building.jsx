import { useState } from 'react'
import HeaderPage from '../components/HeaderPage.jsx';
import { useEffect } from "react";
import { getBuilding } from '../services/buildingService.js';
import { session } from '../services/userService.js';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import FooterPage from '../components/FooterPage.jsx';
import { useRef } from "react"

export default function Building() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    const { id } = useParams()

    const [building, setBuilding] = useState(null)

    const [error, setError] = useState('')

    useEffect(() => {
        async function getBuildingHandler(id){
            const b = await getBuilding(id)
            setBuilding(b)
            setLoading(false)
        }

        getBuildingHandler(id)
        
    }, [id])

    async function joinHandler(e){
        e.preventDefault()

        const { user } = await session()

        if(user && !user.building_id){
            navigate('/join-building/' + id)
        }
        else if(!user){
            navigate('/login')
        }
        else{
            setError('You already belongs to a building')
        }
    }

    const textareaRef = useRef(null)

    useEffect(() => {
        const el = textareaRef.current
        if (el) {
            el.style.height = "auto"
            el.style.height = el.scrollHeight + "px"
        }
    }, [building])

    return (
        <>

        <HeaderPage page={"building"} />

        { id && building &&
            <div className="center">

                <form className="form">
                    <h1 className='formName'>{building.name}</h1>

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
                        Description
                        <textarea
                        ref={textareaRef}
                            disabled
                            required
                            className="input left"
                            name="description"
                            value={building.description}
                        ></textarea>
                    </label>

                    {error && <div className="error">{error}</div>}

                    <button className="submit-button" onClick={joinHandler}>Join</button>
                </form>
            </div>
        }

        { !loading && (!id || !building) && <div>Building not found</div> }

        <FooterPage/>

        </>
    )
}