import { useState } from 'react'
import { useNavigate } from "react-router-dom";

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
        <form onSubmit={submitCode}>
            <label>
                Code : 
                <input 
                    name="verifyCode"
                    type="text"
                    value={code}
                    onChange = {e => {
                        setCode(e.target.value)
                    }}
                />
            </label>

            <button type="submit">
                Submit
            </button>

            {error && <div>{error}</div>}
        </form>
    )
}