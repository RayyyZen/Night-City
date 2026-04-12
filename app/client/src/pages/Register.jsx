import { useState, useEffect } from "react"
import { useNavigate, Link } from 'react-router-dom'
import '../styles.css'

const API = 'http://localhost:3000'

function Register({ onSuccess}) {
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        nickName: '',
        gender: '',
        birthdate: '',
        image: ''
    })

    const [pseudoStatus, setPseudoStatus] = useState('idle') // stockes l'état de vérification du pseudo
    const [serverError, setServerError] = useState('')       // message d'erreur global (serveur)
    const [errors, setErrors] = useState({})                 // erreur par champ (locale)
    const [loading, setLoading] = useState(false)            // stockes si une requête est en cours

    // copie tout l'objet form et écrase seulement les champ qui a changé
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name] : value }))
        setErrors(prev => ({ ...prev, [name] : '' }))       // effacer erreur quand user retape
        setServerError('')
    }

    // Changement de pseudo
    // délai de 500ms pour éviter le surplus de requêtes
    useEffect(() => {
        if (form.nickName.length < 3) {
            setPseudoStatus('idle')
            return
        }
        /*                                                  Route check-nickname
        setPseudoStatus('checking')
        const timer = setTimeout(() => {
            fetch(`${API}/auth/check-pseudo?pseudo=${encodeURIComponent(form.pseudo)}`)     // vérifie si le pseudo est dispo
            .then(r => r.json())
            .then(data => setPseudoStatus(data.available ? 'available' : 'taken'))
            .catch(() => setPseudoStatus('idle'))
        }, 500)
        */
        return () => clearTimeout(timer)
    }, [form.pseudo])

    // Validation champs
    const validate = () => {
        const newErrors = {}
        if (!form.email) {
            newErrors.email = 'Email manquant'
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = 'Format invalide (ex : ray123@gmail.com)'
        }
        if (!form.nickName) {
            newErrors.nickName = 'Pseudo manquant'
        } else if (form.nickName.length < 3) {
            newErrors.nickName = 'Pseudo trop court (min. 3 caractères)'
        } else if (pseudoStatus === 'taken') {
            newErrors.nickName = 'Ce pseudo est déjà pris'
        }
        if (!form.password) {
            newErrors.password = 'Mot de passe manquant'
        } else if (form.password.length < 5) {
            newErrors.password = 'Minimum 5 caractères'
        }
        if (!form.confirmPassword) {
            newErrors.confirmPassword = 'Veuillez confirmez votre mot de passe'
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
        }
        if (!form.firstName) {
            newErrors.firstName = 'Prénom manquant'
        }
        if (!form.lastName) {
            newErrors.lastName = 'Nom manquant'
        }
        if (!form.gender) {
            newErrors.gender = 'Genre manquant'
        }
        if (!form.birthdate) {
            newErrors.birthdate = 'Date de naissance manquante'
        }
        return newErrors
    }

    const navigate = useNavigate()
    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        setLoading(true)
        setServerError('')
        // appel API inscription
        try {
            const res = await fetch(`${API}/users/register`, {
                method: 'POST',
                headers: { 
                'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    nickName: form.nickName,
                    gender: form.gender,
                    birthdate: form.birthdate,
                    image: form.image || 'https://api.dicebear.com/7.x/thumbs/svg?seed=' + form.nickName
                })
            })
            const data = await res.json()
            console.log(data)
            if (!res.ok) {
                setServerError(data.message)
                return
            }
            navigate('/verify-code')
        } catch {
            setServerError('Impossible de contacter le serveur')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-page">
            <div className="register-card">
 
                <h2 className="register-title">Créer un compte</h2>
 
                <form onSubmit={handleSubmit}>
 
                    {/* Email */}
                    <div className="register-field">
                        <label className="register-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="exemple@gmail.com"
                            className={`register-input ${errors.email ? 'register-input--error' : ''}`}
                        />
                        {errors.email && <span className="register-error">{errors.email}</span>}
                    </div>
 
                    {/* Prénom */}
                    <div className="register-field">
                        <label className="register-label" htmlFor="firstName">Prénom</label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            className={`register-input ${errors.firstName ? 'register-input--error' : ''}`}
                        />
                        {errors.firstName && <span className="register-error">{errors.firstName}</span>}
                    </div>
 
                    {/* Nom */}
                    <div className="register-field">
                        <label className="register-label" htmlFor="lastName">Nom</label>
                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            className={`register-input ${errors.lastName ? 'register-input--error' : ''}`}
                        />
                        {errors.lastName && <span className="register-error">{errors.lastName}</span>}
                    </div>
 
                    {/* Pseudo (nickName) */}
                    <div className="register-field">
                        <label className="register-label" htmlFor="nickName">
                            Pseudo
                            {pseudoStatus === 'checking'  && <span className="register-badge register-badge--checking">Vérification…</span>}
                            {pseudoStatus === 'available' && <span className="register-badge register-badge--available">✓</span>}
                            {pseudoStatus === 'taken'     && <span className="register-badge register-badge--taken">✗ Déjà pris</span>}
                        </label>
                        <input
                            id="nickName"
                            type="text"
                            name="nickName"
                            value={form.nickName}
                            onChange={handleChange}
                            className={`register-input ${
                                errors.nickName              ? 'register-input--error'  :
                                pseudoStatus === 'available' ? 'register-input--valid'  : ''
                            }`}
                        />
                        {errors.nickName && <span className="register-error">{errors.nickName}</span>}
                    </div>
 
                    {/* Genre */}
                    <div className="register-field">
                        <label className="register-label" htmlFor="gender">Genre</label>
                        <select
                            id="gender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className={`register-input ${errors.gender ? 'register-input--error' : ''}`}
                        >
                            <option value="">-- Sélectionner --</option>
                            <option value="male">Homme</option>
                            <option value="female">Femme</option>
                            <option value="other">Autre</option>
                        </select>
                        {errors.gender && <span className="register-error">{errors.gender}</span>}
                    </div>
 
                    {/* Date de naissance */}
                    <div className="register-field">
                        <label className="register-label" htmlFor="birthdate">Date de naissance</label>
                        <input
                            id="birthdate"
                            type="date"
                            name="birthdate"
                            value={form.birthdate}
                            onChange={handleChange}
                            className={`register-input ${errors.birthdate ? 'register-input--error' : ''}`}
                        />
                        {errors.birthdate && <span className="register-error">{errors.birthdate}</span>}
                    </div>
 
                    {/* Mot de passe */}
                    <div className="register-field">
                        <label className="register-label" htmlFor="password">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={`register-input ${errors.password ? 'register-input--error' : ''}`}
                        />
                        {errors.password && <span className="register-error">{errors.password}</span>}
                    </div>
 
                    {/* Confirmation mot de passe */}
                    <div className="register-field">
                        <label className="register-label" htmlFor="confirmPassword">Confirmer le mot de passe</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className={`register-input ${
                                errors.confirmPassword ? 'register-input--error' :
                                (form.confirmPassword && form.password === form.confirmPassword) ? 'register-input--valid' : ''
                            }`}
                        />
                        {(form.confirmPassword && form.password === form.confirmPassword) && (
                            <span className="register-success-msg">✓</span>
                        )}
                        {errors.confirmPassword && <span className="register-error">{errors.confirmPassword}</span>}
                    </div>
 
                    {serverError && (
                        <div className="register-server-error">{serverError}</div>
                    )}
 
                    <button
                        type="submit"
                        className="register-btn"
                        disabled={loading || pseudoStatus === 'taken'}
                    >
                        {loading ? 'Inscription en cours...' : "S'inscrire"}
                    </button>
 
                </form>
 
                <p className="register-link-row">
                    Déjà un compte ? <Link to="/login">Se connecter</Link>
                </p>
 
            </div>
        </div>
    )
}

export default Register