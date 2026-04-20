import { useState } from 'react'
import HeaderPage from '../components/HeaderPage.jsx';
import { useEffect } from "react";
import { getAllBuildings } from '../services/buildingService.js';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import FooterPage from '../components/FooterPage.jsx';

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
        <div key={building.id} onClick={() => navigate(`/building/${building.id}`)} >
            <article className="card"> {building.name} </article>
        </div>
    )

    return (
        <>

        <HeaderPage page={"buildings"} />

        <div className="center" >

            <div className="card-container">

            
                {listBuildings}
        

            </div>
    
            
        </div>


        <FooterPage/>

        </>
    )
}