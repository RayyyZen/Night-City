import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

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

    <header className="header">
        <Link to="/" class="logo">Night-Tower</Link>

        <nav className="nav">
          <Link className ="link" to="/">Home</Link>
          <Link className ="link"to="/login">Sign-in</Link>
          <Link className ="link" to="/register">Sign-up</Link>
          <Link className ="link" to="/profile">Profile</Link>
        </nav>
      </header>


        <div className="center">
            
            <form className="form" onSubmit={submitLogin}>
                <h1 className='formName'> Login :</h1>
            <label>
                Mail :  
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

            <label>
                Password : 
                <input 
                    className="input"
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value)
                        setError('')
                    }}
                />
            </label>

            <button className="submit-button" type="submit">
                Submit
            </button>

            {error && <div>{error}</div>}
        </form>
        </div>

        <footer className="footer">
            <h1> AtaOFF</h1>
        </footer>
        </>
        
    )
}