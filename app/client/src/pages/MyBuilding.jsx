import { useState } from 'react'
import HeaderPage from '../components/HeaderPage.jsx';
import { useEffect } from "react";
import { getMyBuilding } from '../services/buildingService.js';
import { useNavigate } from 'react-router-dom';
import { accessPages } from '../services/accessPages';

export default function MyBuilding() {

    const navigate = useNavigate()

    useEffect(() => {
        async function checkPage(){
            const { canAccessToPage } = await accessPages("mybuilding")

            if (!canAccessToPage) {
                navigate("/home")
            }
        }

        checkPage()
        
    }, [navigate])

    const [loading, setLoading] = useState(true)

    const [building, setBuilding] = useState(null)

    useEffect(() => {
        async function getMyBuildingHandler(){
            const b = await getMyBuilding()
            setBuilding(b)
            setLoading(false)
        }

        getMyBuildingHandler()
        
    }, [])



    return (
        <>

        <HeaderPage page={"mybuilding"} />

        { building &&
            <div className="center">
                <div> {building.name} </div>
                <div> {building.address} </div>
                <div> {building.area} </div>
            </div>
        }

        { !loading && !building && <div>Building not found</div> }

        </>
    )
}