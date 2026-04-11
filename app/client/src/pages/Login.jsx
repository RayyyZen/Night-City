import { useState } from 'react'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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

        setError('')
    }

    return (
        <form method="post" onSubmit={submitLogin}>
            <label>
                Mail : 
                <input 
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
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value)
                        setError('')
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