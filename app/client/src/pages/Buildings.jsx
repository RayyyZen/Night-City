import { useState } from 'react'
import HeaderPage from '../components/HeaderPage.jsx';
import { useEffect } from "react";
import { getAllBuildings } from '../services/buildingService.js';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function Buildings() {

    const navigate = useNavigate()

    const [buildings, setBuildings] = useState([])

    useEffect(() => {
        async function getAllBuildingsHandler(){
            const allBuildings = await getAllBuildings()
            setBuildings(allBuildings)
        }

        getAllBuildingsHandler()
        
    }, [])

    const listBuildings = buildings?.map(building => 
        <li key={building.id} onClick={() => navigate(`/building/${building.id}`)}>
            <div> {building.name} </div>
        </li>
    )

    return (
        <>

        <HeaderPage page={"buildings"} />

        <div className="center">
            <ul>
                {listBuildings}
            </ul>
        </div>

        </>
    )
}