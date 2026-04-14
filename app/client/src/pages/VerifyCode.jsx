import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

export default function VerifyCode() {
    const [code, setCode] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    async function submitCode(e){
        e.preventDefault()

        const res = await fetch('http://localhost:3000/users/verify-code', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                code: code
            })
        })

        let data = null

        try{
            data = await res.json()
        } catch(err) {
            data = { message: "Server error" }
        }

        if (!res.ok) {
            setError(data.message)
            return
        }

        navigate('/profile')
    }

    return (
        <>

        <header className="header">
            <Link to="/" className="logo">Night-Tower</Link>

            <nav className="nav">
            <Link className ="link" to="/">Home</Link>
            <Link className ="link"to="/login">Sign-in</Link>
            <Link className ="link" to="/register">Sign-up</Link>
            <Link className ="link" to="/profile">Profile</Link>
            </nav>
        </header>

        <div className="center">
        <form className="form" onSubmit={submitCode}>
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

            <button className="submit-button" type="submit">
                Submit
            </button>

            {error && <div>{error}</div>}
        </form>
        </div>

        </>
    )
}