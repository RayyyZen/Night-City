import { useState, useEffect } from "react"
import { useNavigate, Link } from 'react-router-dom'
import HeaderPage from '../components/HeaderPage.jsx';
import { accessPages } from '../services/accessPages';
import FooterPage from '../components/FooterPage.jsx';

const API = 'http://localhost:3000'

export default function Register() {

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

    const pseudoStatus = useState('idle') // stockes l'état de vérification du pseudo
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


    // Validation champs
    const validate = () => {
        const newErrors = {}
        if (!form.email) {
            newErrors.email = 'Email missing'
        } else if (!/^\S+@\S+\.\S+$/.test(form.email) || !(!/[A-Z]/.test(form.email))) {
            newErrors.email = 'Invalid format (ex : ray123@gmail.com)'
        }
        if (!form.nickName) {
            newErrors.nickName = 'Nick Name missing'
        } else if (form.nickName.length < 3) {
            newErrors.nickName = 'Nick Name too short (min. 3 caracters)'
        } else if (pseudoStatus === 'taken') {
            newErrors.nickName = 'This nick name is already taken'
        }
        if (!form.password) {
            newErrors.password = 'Password missing'
        } else if (form.password.length < 5) {
            newErrors.password = 'Minimum 5 caracters'
        }
        if (!form.confirmPassword) {
            newErrors.confirmPassword = 'Confirm your password'
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'The passwords are not the same'
        }
        if (!form.firstName) {
            newErrors.firstName = 'First Name missing'
        }
        if (!form.lastName) {
            newErrors.lastName = 'Last Name missing'
        }
        if (!form.gender) {
            newErrors.gender = 'Gender missing'
        }
        if (!form.birthdate) {
            newErrors.birthdate = 'Birth date missing'
        } else {
            const date = new Date(form.birthdate)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDay()
            const currentYear = new Date().getFullYear()
            if (year.toString().length > 4) {
                newErrors.birthdate = 'Invalid year (max. 4 numbers)'
            } else if (year < 1900) {
                newErrors.birthdate = 'Invalid year (min. 1900)'
            } else if (year > currentYear) {
                newErrors.birthdate = `The year can not exceed ${currentYear}`
            } else if (month < 1 || month > 12) {
                newErrors.birthdate = 'The mouth must be between 1 and 12'
            } else if (day < 1) {
                newErrors.birthdate = 'Invalid day'
            } else {
                    const daysInMonth = {
                        1: 31, 2: null, 3: 31, 4: 30,
                        5: 31, 6: 30, 7: 31, 8: 31,
                        9: 30, 10: 31, 11: 30, 12: 31
                    }
                    const today = new Date()

                    const isLeapYear =
                        (year % 4 === 0 && year % 100 !== 0) ||
                        (year % 400 === 0)

                    daysInMonth[2] = isLeapYear ? 29 : 28
                    const maxDay = daysInMonth[month]

                    if (day > maxDay) {
                        if (month === 2) {
                            newErrors.birthdate = isLeapYear
                                ? 'February has a maximum of 29 days'
                                : 'February has a maximum of 28 days'
                        } else {
                            newErrors.birthdate = `This mouth has a maximum of ${maxDay} days`
                        }
                    } else {
                        let age = today.getFullYear() - year
                        const monthDiff = today.getMonth() + 1 - month
                        const dayDiff = today.getDate() - day

                        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                            age--
                        }

                        if (age < 12) {
                            newErrors.birthdate = 'You must have atleast 12 years old to create an account'
                        }
                    }
            }
        }
        return newErrors
    }







    /* Image user
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
    */
   const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, image: 'The file must be an image' }))
            return
        }
        const formData = new FormData()
        formData.append('image', file) 
        try {
            const res = await fetch(`${API}/users/upload-image`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })

            const data = await res.json()

            if (!res.ok) {
                setErrors(prev => ({ ...prev, image: data.message }))
                return
            }

            setForm(prev => ({ ...prev, image: data.path }))
            setImagePreview(URL.createObjectURL(file))
            setErrors(prev => ({ ...prev, image: '' }))

        } catch {
            setErrors(prev => ({ ...prev, image: "Error while uploading" }))
        }
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
            if (!res.ok) {
                setServerError(data.message)
                return
            }
            navigate('/verify-code')
        } catch {
            setServerError('Servor error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        <HeaderPage page={"register"}/>
        <div className="center">
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="formName">Register</h1>
                     {/* Photo de profil */}
                    <label className="align">Profile picture
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Aperçu"
                                className="register-image"
                            />
                        ) : (
                            // Placeholder si pas encore d'image
                            <div className="image-placeholder">
                            </div>
                        )}

                        <div className="file-upload-container">
                            <input 
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden-input"
                            />
                            
                            <label htmlFor="image" className="input custom-file-button">
                                Select
                            </label>
                        </div>
                        {errors.image && <span className="register-error">{errors.image}</span>}
                    </label>
 
                    
                    {/* Email */}
                        <label className="align">Email
                            <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="exemple@gmail.com"
                            className={`input ${errors.email ? 'input--error' : ''}`}
                        />
                        {errors.email && <span className="register-error">{errors.email}</span>}
 
                        </label>
                    {/* Prénom */}
                    <label className="align">First Name
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            className={`input ${errors.firstName ? 'input--error' : ''}`}
                        />
                        {errors.firstName && <span className="register-error">{errors.firstName}</span>}
                    </label>
 
                    {/* Nom */}
                    <label className="align">Last Name
                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            className={`input ${errors.lastName ? 'input--error' : ''}`}
                        />
                        {errors.lastName && <span className="register-error">{errors.lastName}</span>}
                    </label>
 
                    {/* Pseudo (nickName) */}
                    <label className="align">Nick Name
                            {pseudoStatus === 'checking'  && <span className="register-badge register-badge--checking">Vérification…</span>}
                            {pseudoStatus === 'available' && <span className="register-badge register-badge--available">✓</span>}
                            {pseudoStatus === 'taken'     && <span className="register-badge register-badge--taken">✗ Déjà pris</span>}
                        <input
                            id="nickName"
                            type="text"
                            name="nickName"
                            value={form.nickName}
                            onChange={handleChange}
                            className={`input ${
                                errors.nickName              ? 'input--error'  :
                                pseudoStatus === 'available' ? 'input--valid'  : ''
                            }`}
                        />
                        {errors.nickName && <span className="register-error">{errors.nickName}</span>}
                    </label>
 
                    {/* Genre */}
                    <label className="align">Gender
                        <select
                            id="gender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className={`input ${errors.gender ? 'input--error' : ''}`}
                        >
                            <option value="">-- Sélectionner --</option>
                            <option value="male">Homme</option>
                            <option value="female">Femme</option>
                        </select>
                        {errors.gender && <span className="register-error">{errors.gender}</span>}
                    </label>
 
                    {/* Date de naissance */}
                    <label className="align">Birth date
                        <input
                            id="birthdate"
                            type="date"
                            name="birthdate"
                            value={form.birthdate}
                            onChange={handleChange}
                            min="1900-01-01"
                            max={new Date(
                                new Date().getFullYear() - 12,
                                new Date().getMonth(),
                                new Date().getDate()
                            ).toISOString().split('T')[0]}
                            className={`input ${errors.birthdate ? 'input--error' : ''}`}
                        />
                        {errors.birthdate && <span className="register-error">{errors.birthdate}</span>}
                    </label>
 
                    {/* Mot de passe */}
                    <label className="align">Password
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={`input ${errors.password ? 'input--error' : ''}`}
                        />
                        {errors.password && <span className="register-error">{errors.password}</span>}
                    </label>
 
                    {/* Confirmation mot de passe */}
                    <label className="align">Confirm password
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className={`input ${
                                errors.confirmPassword ? 'input--error' :
                                (form.confirmPassword && form.password === form.confirmPassword) ? 'input--valid' : ''
                            }`}
                        />
                        {errors.confirmPassword && <span className="register-error">{errors.confirmPassword}</span>}
                    </label> 

                    {serverError && (
                        <div className="register-server-error">{serverError}</div>
                    )}

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading || pseudoStatus === 'taken'}
                    >
                        {loading ? 'Inscription en cours...' : "S'inscrire"}
                    </button>
                    <p className="linkSign">
                        You have an account ?{' '}
                        <Link to="/login" className="yellow">Sign-in</Link>
                    </p>
 
            </form>
 
        </div>
        <FooterPage />
    </>
    )
}