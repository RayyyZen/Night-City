import { useState } from 'react'
import HeaderPage from '../components/HeaderPage.jsx';
import { useEffect } from "react";
import { getAllNews } from '../services/newsService.js';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import FooterPage from '../components/FooterPage.jsx';

export default function AllNews() {

    const navigate = useNavigate()

    const [allNews, setAllNews] = useState([])

    useEffect(() => {
        async function getAllNewsHandler(){
            const allNews = await getAllNews()
            setAllNews(allNews)
        }

        getAllNewsHandler()
        
    }, [])

    const listAllNews = allNews?.map(news => 
        <div key={news.id} onClick={() => navigate(`/news/${news.id}`)} >
            <article className="card"> {news.title} </article>
        </div>
    )

    return (
        <>

        <HeaderPage page={"buildings"} />

        <div className="center" >

            <div className="card-container">

            
                {listAllNews}
        

            </div>
    
            
        </div>


        <FooterPage/>

        </>
    )
}