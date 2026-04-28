import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderPage from '../components/HeaderPage.jsx'
import FooterPage from '../components/FooterPage.jsx'
import { getAllUsers, deleteUser } from '../services/userService.js'
import { accessPages } from '../services/accessPages';

export default function Admin() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [query, setQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [error, setError] = useState('')


    const [sessionUser, setSessionUser] = useState(null)
        
    useEffect(() => {
        async function checkPage(){
            const { user, canAccessToPage } = await accessPages("device")

            if (!canAccessToPage) {
                navigate("/home")
            }

            setSessionUser(user)
        }

        checkPage()
        
    }, [navigate])

    useEffect(() => {
        async function getAllUsersHandler() {
            const allUsers = await getAllUsers()
            setUsers(allUsers ?? [])
        }
        getAllUsersHandler()
    }, [])

    async function deleteHandler(e, id) {
        e.preventDefault()
        setError('')
        const { message, success } = await deleteUser(id)
        if (!success) {
            setError(message)
        } else {
            setUsers(prev => prev.filter(u => u.id !== id))
        }
    }

    const filteredUsers = users.filter((user) => {
        const matchesQuery = user.nickName?.toLowerCase().includes(query.toLowerCase())
        const matchesRole =
            roleFilter === 'all' ||
            user.role === roleFilter
        return matchesQuery && matchesRole
    })

    const highlight = (text) => {
        if (!query.trim() || !text) return text
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
        return text.split(regex).map((part, i) =>
            regex.test(part) ? <mark key={i} className="highlight">{part}</mark> : part
        )
    }

    const listUsers = filteredUsers.map((user) => (
        <div className="admin-user-card" key={user.id}>
            <article className="user-info" onClick={() => navigate(`/profile/${user.id}`)}>
                <span>{highlight(user.nickName)}</span>
                <span>[{user.role}]</span>
            </article>
            { sessionUser && sessionUser.id != user.id && <button className="kick-btn" type="button" onClick={(e) => deleteHandler(e, user.id)}>Delete</button> }
        </div>
    ))

    return (
        <>
        <HeaderPage page={"admin"} />
        <main>
            <section className="center">
                <h1 className="title">Admin</h1>

                <input
                    className="input"
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <div className="buttons">
                    <button className={roleFilter === 'all'   ? 'submit-button' : 'link'} onClick={() => setRoleFilter('all')}>All</button>
                    <button className={roleFilter === 'user'  ? 'submit-button' : 'link'} onClick={() => setRoleFilter('user')}>User</button>
                    <button className={roleFilter === 'admin' ? 'submit-button' : 'link'} onClick={() => setRoleFilter('admin')}>Admin</button>
                </div>

                <div className="admin-container">
                    {filteredUsers.length > 0 ? (
                        listUsers
                    ) : (
                        <p className="no-result">No results found.</p>
                    )}
                </div>

                {error && <p className="register-error">{error}</p>}
            </section>
        </main>
        <FooterPage />
        </>
    )
}
