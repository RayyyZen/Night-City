import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import HeaderPage from '../components/HeaderPage.jsx';
import FooterPage from '../components/FooterPage.jsx';
import { accessPages } from '../services/accessPages';
import { useEffect } from "react";
import { getNews } from "../services/newsService.js";
import { useParams } from "react-router-dom";
import { useRef } from "react"



export default function News() {

    const navigate = useNavigate()
    
    useEffect(() => {
        async function checkPage(){
            const { canAccessToPage } = await accessPages("news")

            if (!canAccessToPage) {
                navigate("/home")
            }
        }

        checkPage()
        
    }, [navigate])

    const { id } = useParams()

    const [news, setNews] = useState(null)
    const [loading, setLoading] = useState(true)

    const textareaRef = useRef(null)

    useEffect(() => {
        async function getNewsHandler(id){
            const { news } = await getNews(id)
            setNews(news)
            setLoading(false)
        }

        getNewsHandler(id)
        
    }, [id])

    useEffect(() => {
        const el = textareaRef.current
        if (el) {
            el.style.height = "auto"
            el.style.height = el.scrollHeight + "px"
        }
    }, [news])

    return (

    <>

    <HeaderPage page={"news"} />

        {news && 

        <div className="center">
            
            <form className="form">
                <h1 className='formName'>News</h1>

            <label className="align">
                Title
                <input 
                    disabled
                    required
                    className="input"
                    type="text"
                    name="title"
                    value={news.title} 
                />
            </label>

            <label className="align">
                Content
                <textarea
                ref={textareaRef}
                    disabled
                    required
                    className="input left"
                    name="content"
                    value={news.content} 
                    onChange={e => {
                        e.target.style.height = "auto"
                        e.target.style.height = e.target.scrollHeight + "px"
                    }}
                ></textarea>
            </label>

            <label className="align">
                Publish Date
                <input
                    disabled
                    required
                    className="input"
                    name="date"
                    type="date"
                    value={news.publishDate.split('T')[0]} 
                />
            </label>

            <button type="button" className="submit-button" onClick={() => navigate(`/profile/${news.author_id}`)}>Author</button>
            <button type="button" className="submit-button" onClick={() => navigate(`/building/${news.building_id}`)}>Building</button>
        </form>
        </div>
        }

        { !loading && !news && <div>News not found</div> }

        <FooterPage />
        </>
        
    )
}