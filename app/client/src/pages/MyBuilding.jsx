import { useState } from 'react'
import HeaderPage from '../components/HeaderPage.jsx';
import { useEffect } from "react";
import { getMyBuilding } from '../services/buildingService.js';
import { useNavigate } from 'react-router-dom';
import { accessPages } from '../services/accessPages';
import FooterPage from '../components/FooterPage.jsx';

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
    const [users, setUsers] = useState([])
    const [devices, setDevices] = useState([])

    useEffect(() => {
        async function getMyBuildingHandler(){
            const { building, users, devices } = await getMyBuilding()
            setBuilding(building)
            setUsers(users)
            setDevices(devices)

            setLoading(false)
        }

        getMyBuildingHandler()
        
    }, [])

    const listUsers = users?.map(user => 
        <div key={user.id} onClick={() => navigate(`/profile/${user.id}`)} >
            <article className="card"> {user.nickName} </article>
        </div>
    )

    const listDevices = devices?.map(device => 
        <div key={device.id} onClick={() => navigate(`/device/${device.id}`)} >
            <article className="card"> {device.name} [{device.status}] </article>
        </div>
    )


    return (
        <>

        <HeaderPage page={"mybuilding"} />

        { building &&
            <div className="center">
                <h1 className="title"> {building.name} </h1>
                <div> {building.description} </div>
                <div> {building.address} </div>
                <div> {building.area} </div>
            </div>
        }

        <div className="card-container">
            <div className="center title">Users</div>
            {listUsers}
        </div>

        <div className="card-container">
            <div className="center title">Devices</div>
            {listDevices}
            <button onClick={() => navigate('/create-device')}>Create new device</button>
        </div>

        <button onClick={() => navigate('/publish-news')}>Publish news</button>

        { !loading && !building && <div>Building not found</div> }

        <FooterPage/>

        </>
    )
}