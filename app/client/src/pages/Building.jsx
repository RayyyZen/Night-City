import { useState } from 'react'
import HeaderPage from '../components/HeaderPage.jsx';
import { useEffect } from "react";
import { getBuilding } from '../services/buildingService.js';
import { joinBuilding } from '../services/userService.js';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Building() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    const { id } = useParams()

    const [error, setError] = useState('')
    const [building, setBuilding] = useState(null)

    useEffect(() => {
        async function getBuildingHandler(id){
            const b = await getBuilding(id)
            setBuilding(b)
            setLoading(false)
        }

        getBuildingHandler(id)
        
    }, [id])

    async function joinBuildingHandler(e){
        e.preventDefault()

        const { success, message } = await joinBuilding(id)

        if(success){
            navigate('/profile')
        }
        else{
            setError(message)
        }
    }

    return (
        <>

        <HeaderPage page={"building"} />

        { id && building &&
            <div className="center">
                <h1 className="title"> {building.name} </h1>
                <div> {building.address} </div>
                <div> {building.area} </div>

                <button className="submit-button" onClick={joinBuildingHandler}>Join</button>
                { error && <div>{error}</div> }
            </div>
        }

        { !loading && (!id || !building) && <div>Building not found</div> }

        </>
    )
}