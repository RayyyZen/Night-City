import { useState, useEffect } from "react"
import { useNavigate, Link } from 'react-router-dom'
import '../styles.css'
import { accessPages } from '../services/accessPages';

const API = 'http://localhost:3000'

function Register({ onSuccess}) {

    const navigate = useNavigate()
        
    useEffect(() => {
        async function checkPage(){
            const { canAccessToPage } = await accessPages("register")

            if (!canAccessToPage) {
                navigate("/home")
            }
        }

        checkPage()
        
    }, [navigate])

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
    const [imagePreview, setImagePreview] = useState(null)

    // copie tout l'objet form et écrase seulement les champ qui a changé
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name] : value }))
        setErrors(prev => ({ ...prev, [name] : '' }))       // effacer erreur quand user retape
        setServerError('')
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }
        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, image : 'Le fichier doit être une image'}))
            return
        }
        try {
            const compressed = await compressImage(file)
            setForm(prev => ({ ...prev, image: compressed}))
            setImagePreview(compressed)
            setErrors(prev => ({ ...prev, image: ''}))
        } catch {
            setErrors(prev => ({ ...prev, image: "Erreur lors du traitement de l'image." }))
        }
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
        } else {
            const date = new Date(form.birthdate)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDay()
            const currentYear = new Date().getFullYear()
            if (year.toString().length > 4) {
                newErrors.birthdate = 'Année invalide (max. 4 chiffres)'
            } else if (year < 1900) {
                newErrors.birthdate = 'Année invalide (min. 1900)'
            } else if (year > currentYear) {
                newErrors.birthdate = `L'année de ne peut pas dépasser ${currentYear}`
            } else if (month < 1 || month > 12) {
                newErrors.birthdate = 'Le mois doit être compris entre 1 et 12'
            } else if (day < 1) {
                e.birthdate = 'Le jour est invalide'
            } else {
                const daysInMonth = {
                    1: 31, 2: null, 3: 31, 4: 30,       // null pour février
                    5: 31, 6: 30,  7: 31, 8: 31,
                    9: 30, 10: 31, 11: 30, 12: 31
                }
                // vérification année bissextile
                const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
                daysInMonth[2] = isLeapYear ? 29 : 28
                const maxDay = daysInMonth[month]
                if (day > maxDay) {
                    if (month === 2) {
                        newErrors.birthdate = isLeapYear
                            ? 'Février a au maximum 29 jours (année bissextile)'
                            : 'Février a au maximum 28 jours'
                    } else {
                        newErrors.birthdate = 'Ce mois a au maximum ${maxDay} jours'
                    }
                }
            }
        }
        return newErrors
    }

    // Image user
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const img = new Image()
                img.src = e.target.result
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    canvas.width = 100
                    canvas.height = 100
                    const a = canvas.getContext('2d')
                    a.drawImage(img, 0, 0, 100, 100)
                    const compressed = canvas.toDataURL('image/jpeg', 0.7)
                    resolve(compressed)
                }
            img.onerror = () => reject(new Error('Erreur de chargement image'))
            }
            reader.onerror = () => reject(new Error('Erreur de lecture fichier'))
            reader.readAsDataURL(file)
        })
    }

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
                    image: form.image || `https://api.dicebear.com/7.x/thumbs/svg?seed=${form.nickName}`
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

            <header className="header">
                <Link to="/home" class="logo">Night-Tower</Link>

                <nav className="nav">
                    <Link to="/home">Home</Link>
                    <Link to="/login">Sign-in</Link>
                    <Link to="/register">Sign-up</Link>
                    <Link to="/profile">Profile</Link>
            </nav>
            </header>

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
                            min="1900-01-01"
                            max={`${new Date().getFullYear()}-12-31`}
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

                    {/* Photo de profil */}
                    <div className="register-field">
                        <label className="register-label" htmlFor="image">
                            Photo de profil
                        </label>
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Aperçu"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginBottom: '8px',
                                    border: '2px solid var(--yellow)'
                                }}
                            />
                        ) : (
                            // Placeholder si pas encore d'image
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'var(--bg-header)',
                                border: '2px dashed rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-soft)',
                                fontSize: '24px',
                                marginBottom: '8px'
                            }}>
                            </div>
                        )}
                        <input 
                            id="image"
                            type="file"
                            accept="image/"
                            onChange={handleImageChange}
                            className="register-input"
                            style={{ padding: '8px' }}
                        />
                        <span style={{ color: 'var(--text-soft)', fontSize: '0.75rem' }}>
                            ✓
                        </span>
                        {errors.image && <span className="register-error">{errors.image}</span>}
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