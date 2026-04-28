import { useState } from 'react'
import HeaderPage from '../components/HeaderPage.jsx';
import { accessPages } from '../services/accessPages';
import { useEffect } from "react";
import { joinBuilding } from '../services/userService.js';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import FooterPage from '../components/FooterPage.jsx';

export default function JoinBuilding() {

    const navigate = useNavigate()

    useEffect(() => {
        async function checkPage(){
            const { canAccessToPage } = await accessPages("join-building")

            if (!canAccessToPage) {
                navigate("/home")
            }
        }

        checkPage()
        
    }, [navigate])

    const { id } = useParams()

    const [error, setError] = useState('')
    const [password, setPassword] = useState('')

    async function joinBuildingHandler(e){
        e.preventDefault()

        const { success, message } = await joinBuilding(id, password)

        if(success){
            navigate('/mybuilding')
        }
        else{
            setError(message)
        }
    }

    return (
        <>

        <HeaderPage page={"join-building"} />

        <div className="center">
        <form className="form" onSubmit={joinBuildingHandler}>
            <h1 className='formName'>Building Password</h1>
            <label className="align">
                <input 
                    className="input"
                    name="verifyPassword"
                    type="text"
                    value={password}
                    onChange = {e => {
                        setPassword(e.target.value)
                    }}
                />
            </label>

            {error && <div className="error">{error}</div>}

            <button className="submit-button" type="submit">
                Submit
            </button>

        </form>
        </div>

        <FooterPage/>

        </>
    )
}