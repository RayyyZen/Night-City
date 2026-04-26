import { useState } from 'react'
import HeaderPage from '../components/HeaderPage.jsx';
import { useEffect } from "react";
import { getBuilding } from '../services/buildingService.js';
import { session } from '../services/userService.js';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import FooterPage from '../components/FooterPage.jsx';

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

    return (
        <>

        <HeaderPage page={"building"} />

        { id && building &&
            <div className="center">
                <h1 className="title"> {building.name} </h1>
                <div> {building.description} </div>
                <div> {building.address} </div>
                <div> {building.area} </div>

                <button className="submit-button" onClick={joinHandler}>Join</button>
                {error && <div>{error}</div>}
            </div>
        }

        { !loading && (!id || !building) && <div>Building not found</div> }


        <FooterPage/>

        </>
    )
}