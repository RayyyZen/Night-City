import { useState } from 'react'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function submitLogin(e){
        e.preventDefault()

        const form = e.target
        const formData = new FormData(form)

        fetch('http://localhost:3000/login', {
            method: form.method,
            body: formData
        })

        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })

        const data = await res.json()

        if (!res.ok) {
        setError(data.message)
        return
        }

        setError('') // reset erreur si succès
        console.log("Login OK")
    }

    return (
        <form method="post" onSubmit={submitLogin}>
            <label>
                Mail : 
                <input type="email" name="email" />
            </label>

            <label>
                Password : 
                <input type="password" name="password" />
            </label>

            <button type="submit">
                Submit
            </button>
        </form>
    )
}