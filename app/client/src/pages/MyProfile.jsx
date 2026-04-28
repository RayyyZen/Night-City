import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import HeaderPage from '../components/HeaderPage.jsx';
import { accessPages } from '../services/accessPages';
import { useEffect } from "react";
import FooterPage from '../components/FooterPage.jsx';
import { getMyProfile } from '../services/userService';
import { updateProfile } from '../services/userService';


export default function MyProfile() {

    const navigate = useNavigate()
    
    useEffect(() => {
        async function checkPage(){
            const { canAccessToPage } = await accessPages("myprofile")

            if (!canAccessToPage) {
                navigate("/home")
            }
        }

        checkPage()
        
    }, [navigate])

    const [user, setUser] = useState(null)
    const [password, setPassword] = useState('123456789')

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const [oldFirstName, setOldFirstName] = useState('')
    const [oldLastName, setOldLastName] = useState('')

    const [fieldType, setFieldType] = useState('password')

    const [updatingPassword, setUpdatingPassword] = useState(false)
    const [updatingFirstName, setUpdatingFirstName] = useState(false)
    const [updatingLastName, setUpdatingLastName] = useState(false)







    const [updatingImage, setUpdatingImage] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [imageError, setImageError] = useState('')




    
    useEffect(() => {
        async function getMyProfileHandler(){
            const { user } = await getMyProfile()

            setUser(user)

            if(user){
                setFirstName(user.firstName)
                setLastName(user.lastName)

                setOldFirstName(user.firstName)
                setOldLastName(user.lastName)
            }
            
        }

        getMyProfileHandler()
        
    }, [])

    const [error, setError] = useState('')

    async function submitUpdate(e){
        e.preventDefault()

        setUpdatingFirstName(false)
        setUpdatingLastName(false)
        setUpdatingPassword(false)

        const data = {
            firstName: firstName,
            lastName: lastName
        }
        if(updatingPassword){
            data.password = password
        }
        
        const { message, success } = await updateProfile(data)

        if(!success){
            setError(message)

            setFirstName(oldFirstName)
            setLastName(oldLastName)
        }
        else{
            setOldFirstName(firstName)
            setOldLastName(lastName)
        }
        setPassword("123456789")
    }







    async function submitImageUpdate() {
        if (!imageFile) return
 
        const formData = new FormData()
        formData.append('image', imageFile)
 
        const uploadRes = await fetch('http://localhost:3000/users/upload-image', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        const uploadData = await uploadRes.json()
 
        if (!uploadRes.ok) {
            setImageError(uploadData.message || 'Upload failed')
            return
        }
 
        const { success, message } = await updateProfile({ image: uploadData.path })
 
        if (!success) {
            setImageError(message)
            return
        }
 
        setUser(prev => ({ ...prev, image: uploadData.path }))
        setUpdatingImage(false)
        setImageFile(null)
        setImagePreview(null)
        setImageError('')
    }







    return (

    <>

    <HeaderPage page={"myprofile"} />

        {user && 

        <div className="center">
            
            <form className="form" onSubmit={submitUpdate}>
                <h1 className='formName'>My Profile</h1>
                {imagePreview
                    ? <img src={imagePreview} alt="Photo de profil" className="register-image" />
                    : user.image
                        ? <img src={`http://localhost:3000/${user.image}`} alt="Photo de profil" className="register-image" />
                        : <div className="image-placeholder"></div>
                }
 
                { updatingImage && <label className="custom-file-button">Choose file<input type="file" accept="image/*" className="hidden-input" onChange={e => { const f = e.target.files[0]; if(!f) return; setImageFile(f); setImagePreview(URL.createObjectURL(f)); setImageError('') }} /></label> }
                <div className="buttons">
                    { !updatingImage && <button type="button" className="input" onClick={() => { if(!updatingFirstName && !updatingLastName && !updatingPassword) setUpdatingImage(true) }}>Update</button> }
                    { updatingImage && imageFile && <button type="button" className="input" onClick={submitImageUpdate}>Submit</button> }
                    { updatingImage && <button type="button" className="input" onClick={() => { setUpdatingImage(false); setImageFile(null); setImagePreview(null); setImageError('') }}>Cancel</button> }
                </div>
                { imageError && <div>{imageError}</div> }


            <label className="align">
                First Name
                <input 
                    disabled={!updatingFirstName}
                    className="input"
                    type="text"
                    name="firstName"
                    value={firstName} 
                    onChange={e => {
                        setFirstName(e.target.value)
                        setError('')
                    }}
                />
                
                <div className="buttons">
                    { updatingFirstName && <button type="submit" className="input">Submit</button> }
                    { !updatingFirstName && <button type="button" className="input" onClick={() => { if(!updatingImage && !updatingLastName && !updatingPassword) setUpdatingFirstName(true) }}>Update</button> }
                    { updatingFirstName && <button type="button" className="input" onClick={() => { setFirstName(oldFirstName), setUpdatingFirstName(false) }}>Cancel</button> }
                </div>
            </label>

            <label className="align">
                Last Name
                <input 
                    disabled={!updatingLastName}
                    className="input"
                    type="text"
                    name="lastName"
                    value={lastName} 
                    onChange={e => {
                        setLastName(e.target.value)
                        setError('')
                    }}
                />

                <div className="buttons">
                    { updatingLastName && <button type="submit" className="input">Submit</button> }
                    { !updatingLastName && <button type="button" className="input" onClick={() => { if(!updatingImage && !updatingFirstName && !updatingPassword) setUpdatingLastName(true) }}>Update</button> }
                    { updatingLastName && <button type="button" className="input" onClick={() => { setLastName(oldLastName), setUpdatingLastName(false) }}>Cancel</button> }
                </div>
            </label>

            <label className="align">
                Nick Name
                <input 
                    disabled
                    className="input"
                    type="text"
                    name="nickName"
                    value={user.nickName} 
                />
            </label>

            <label className="align">
                Email
                <input 
                    disabled
                    className="input"
                    type="email"
                    name="email"
                    value={user.email} 
                />
            </label>

            <label className="align">
                Password
                <input 
                    disabled={!updatingPassword}
                    className="input"
                    type={fieldType}
                    name="password"
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value)
                        setError('')
                    }}
                />

                <div className="buttons">
                    { updatingPassword && <button type="submit" className="input">Submit</button> }
                    { !updatingPassword && <button type="button" className="input" onClick={() => { if(!updatingImage && !updatingFirstName && !updatingLastName) setUpdatingPassword(true) }}>Update</button> }
                    { updatingPassword && <button type="button" className="input" onClick={() => { setPassword("123456789"), setUpdatingPassword(false) }}>Cancel</button> }
                </div>


                { updatingPassword && fieldType == "password" && <button type="button" className="input" onClick={() => { setFieldType("text") }}>Show</button> }

                { updatingPassword && fieldType == "text" && <button type="button" className="input" onClick={() => { setFieldType("password") }}>Hide</button> }

            </label>

            <label className="align">
                Role
                <input 
                    disabled
                    className="input"
                    type="text"
                    name="role"
                    value={user.role} 
                />
            </label>

            <label className="align">
                Level
                <input 
                    disabled
                    className="input"
                    type="text"
                    name="level"
                    value={user.level} 
                />
            </label>

            <label className="align">
                Points
                <input 
                    disabled
                    className="input"
                    type="Number"
                    name="points"
                    value={user.points} 
                />
            </label>

            { user.building_role &&
                <label className="align">
                    Building role
                    <input 
                        disabled
                        className="input"
                        type="text"
                        name="building_role"
                        value={user.building_role} 
                    />
                </label>
            }

            { user.building_id && <button type="button" className="submit-button" onClick={() => { navigate('/mybuilding') }}>My Building</button> }

            {error && <div className="error">{error}</div>}
        </form>
        </div>

}

        
    
        <FooterPage/>
        </>
        
    )
}