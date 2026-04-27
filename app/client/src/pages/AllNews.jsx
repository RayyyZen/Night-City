import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderPage from '../components/HeaderPage.jsx'
import FooterPage from '../components/FooterPage.jsx'
import { getAllNews } from '../services/newsService.js'
import { accessPages } from '../services/accessPages'

export default function AllNews() {
    const navigate = useNavigate()
    const [newsList, setNewsList] = useState([])
    const [query, setQuery] = useState('')
    const [sortOrder, setSortOrder] = useState('desc')

    useEffect(() => {
        async function checkPage() {
            const { canAccessToPage } = await accessPages("news")
            if (!canAccessToPage) navigate("/home")
        }
        checkPage()
    }, [navigate])

    useEffect(() => {
        async function fetchNews() {
            const { news } = await getAllNews()
            setNewsList(news)
        }
        fetchNews()
    }, [])

    const filteredNews = newsList.filter((item) => {
        const q = query.toLowerCase()
        return (
            item.title.toLowerCase().includes(q) ||
            item.content.toLowerCase().includes(q)
        )
    })

    const highlight = (text) => {
        if (!query.trim()) return text
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
        return text.split(regex).map((part, i) =>
            regex.test(part) ? <mark key={i} className="highlight">{part}</mark> : part
        )
    }

    const sortedNews = [...filteredNews].sort((a, b) =>
        sortOrder === 'desc'
            ? new Date(b.publishDate) - new Date(a.publishDate)
            : new Date(a.publishDate) - new Date(b.publishDate)
    )

    const listAllNews = sortedNews.length > 0 ? (
        sortedNews.map((item) => (
            <article className="card" key={item.id} onClick={() => navigate(`/news/${item.id}`)} style={{ cursor: 'pointer' }}>
                <h3>{highlight(item.title)}</h3>
                <p className="date">{item.publishDate?.split('T')[0]}</p>
            </article>
        ))
    ) : (
        <p className="no-result">No results found.</p>
    )


    return (
        <>
        <HeaderPage page={"news"} />
        <main>
            <section className="center">
                <h1>Latest News</h1>

                <div className="search-bar">
                    <input
                        className="input"
                        type="text"
                        placeholder="Search news..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="buttons">
                    <button className={sortOrder === 'desc' ? 'submit-button' : 'link'} onClick={() => setSortOrder('desc')}>Newest first</button>
                    <button className={sortOrder === 'asc'  ? 'submit-button' : 'link'} onClick={() => setSortOrder('asc')}>Oldest first</button>
                </div>

                <div className="card-container">
                    {listAllNews}
                </div>
            </section>
        </main>
        <FooterPage />
        </>
    )
}
