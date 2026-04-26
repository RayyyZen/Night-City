import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import HeaderPage from '../components/HeaderPage.jsx';
import FooterPage from '../components/FooterPage.jsx';
import { accessPages } from '../services/accessPages';
import { useEffect } from "react";
import { createNews } from "../services/newsService.js";

export default function PublishNews() {

    const navigate = useNavigate()
    
    useEffect(() => {
        async function checkPage(){
            const { canAccessToPage } = await accessPages("publish-news")

            if (!canAccessToPage) {
                navigate("/home")
            }
        }

        checkPage()
        
    }, [navigate])

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [error, setError] = useState('')

    async function publishNewsHandler(e){
        e.preventDefault()

        const { message, success } = await createNews(title, content)

        if(success){
            navigate('/home')
        }
        else{
            setError(message)
        }
    }

    return (

    <>

    <HeaderPage page={"publish-news"} />


        <div className="center">
            
            <form className="form" onSubmit={publishNewsHandler}>
                <h1 className='formName'>Publish news</h1>
            <label className="align">
                Title
                <input 
                    required
                    className="input"
                    type="text"
                    name="title"
                    value={title} 
                    onChange={e => {
                        setTitle(e.target.value)
                        setError('')
                    }}
                />
            </label>

            <label className="align">
                Content
                <textarea
                    required
                    className="input left"
                    name="content"
                    value={content} 
                    onChange={e => {
                        setContent(e.target.value)
                        setError('')
                        e.target.style.height = "auto"
                        e.target.style.height = e.target.scrollHeight + "px"
                    }}
                ></textarea>
            </label>

            <button className="submit-button" type="submit">
                Submit
            </button>

            {error && <div>{error}</div>}
        </form>
        </div>

        <FooterPage />
        </>
        
    )
}