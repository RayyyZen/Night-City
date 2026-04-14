import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import HeaderPage from '../components/HeaderPage.jsx';
import FooterPage from '../components/FooterPage.jsx';

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [fieldType, setFieldType] = useState('password')

    const navigate = useNavigate()

    async function submitLogin(e){
        e.preventDefault()

        const res = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({  
                email: email,
                password: password
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

        navigate('/verify-code')
    }

    return (

    <>

    <HeaderPage />


        <div className="center">
            
            <form className="form" onSubmit={submitLogin}>
                <h1 className='formName'>Login</h1>
            <label className="align">
                Mail
                <input 
                    className="input"
                    type="email"
                    name="email"
                    value={email} 
                    onChange={e => {
                        setEmail(e.target.value)
                        setError('')
                    }}
                />
            </label>

            <label className="align">
                Password
                <input 
                    className="input"
                    type={fieldType}
                    name="password"
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value)
                        setError('')
                    }}
                />

                { fieldType == "password" && <button className="input" onClick={e => { setFieldType("text") }}>Show</button> }

                { fieldType == "text" && <button className="input" onClick={e => { setFieldType("password") }}>Hide</button> }

            </label>

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