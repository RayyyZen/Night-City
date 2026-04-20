import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HeaderPage from '../components/HeaderPage.jsx';
import { submitCode, resendCode } from '../services/userService.js';
import { accessPages } from '../services/accessPages';
import FooterPage from '../components/FooterPage.jsx';


export default function VerifyCode() {

    const navigate = useNavigate()
    
    useEffect(() => {
        async function checkPage(){
            const { canAccessToPage } = await accessPages("code")

            if (!canAccessToPage) {
                navigate("/home")
            }
        }

        checkPage()
        
    }, [navigate])

    const [code, setCode] = useState('')
    const [error, setError] = useState('')

    async function submitCodeHandler(e){
        e.preventDefault()

        const { success, message } = await submitCode(code)

        if(success){
            navigate('/profile')
        }
        else{
            setError(message)
        }
    }

    async function resendCodeHandler(e){
        e.preventDefault()

        const { message } = await resendCode()

        setError(message)
        setCode("")
    }

    return (
        <>

        <HeaderPage page={"code"} />

        <div className="center">
        <form className="form" onSubmit={submitCodeHandler}>
            <h1 className='formName'>Code</h1>
            <label className="align">
                <input 
                    className="input"
                    name="verifyCode"
                    type="text"
                    value={code}
                    onChange = {e => {
                        setCode(e.target.value)
                    }}
                />
            </label>

            <button className="resend-button" type="button" onClick={resendCodeHandler}>
                Resend the code
            </button>

            <button className="submit-button" type="submit">
                Submit
            </button>

            {error && <div>{error}</div>}
        </form>
        </div>

        <FooterPage/>

        </>
    )
}