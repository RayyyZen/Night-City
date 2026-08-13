import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderPage from '../components/HeaderPage.jsx'
import FooterPage from '../components/FooterPage.jsx'
import { getAllBuildings } from '../services/buildingService.js'

export default function Buildings() {
    const navigate = useNavigate()
    const [buildings, setBuildings] = useState([])
    const [query, setQuery] = useState('')
    const [areaFilter, setAreaFilter] = useState('all')
    const [areaSize, setAreaSize] = useState('')

    useEffect(() => {
        async function getAllBuildingsHandler() {
            const allBuildings = await getAllBuildings()
            setBuildings(allBuildings ?? [])
        }
        getAllBuildingsHandler()
    }, [])

    const filteredBuildings = buildings.filter((building) => {
        const q = query.toLowerCase()
        const matchesQuery = (
            building.name?.toLowerCase().includes(q) ||
            building.description?.toLowerCase().includes(q) ||
            building.address?.toLowerCase().includes(q)
        )
        const Size = parseFloat(areaSize)
        const matchesArea =
            areaFilter === 'all' ||
            (areaFilter === 'under' && !isNaN(Size) && building.area < Size) ||
            (areaFilter === 'over'  && !isNaN(Size) && building.area >= Size)
        return matchesQuery && matchesArea
    })

    const highlight = (text) => {
        if (!query.trim() || !text) return text
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
        return text.split(regex).map((part, i) =>
            regex.test(part) ? <mark key={i} className="highlight">{part}</mark> : part
        )
    }

    const listBuildings = filteredBuildings.map((building) => (
        <article className="card" key={building.id} onClick={() => navigate(`/building/${building.id}`)} style={{ cursor: 'pointer' }}>
            <h3>{highlight(building.name)}</h3>
        </article>
    ))

    return (
        <>
        <HeaderPage page={"buildings"} />
        <main>
            <section className="center">
                <h1 className="title">All Buildings</h1>

                <div className="search-bar">
                    <input
                        className="input"
                        type="text"
                        placeholder="Search buildings..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="buttons">
                    <button className={areaFilter === 'all'   ? 'submit-button' : 'link'} onClick={() => setAreaFilter('all')}>All</button>
                    <button className={areaFilter === 'under' ? 'submit-button' : 'link'} onClick={() => setAreaFilter('under')}>{'< Size'}</button>
                    <button className={areaFilter === 'over'  ? 'submit-button' : 'link'} onClick={() => setAreaFilter('over')}>{'>= Size'}</button>
                </div>

                <input
                    className="input"
                    type="number"
                    placeholder="Area Size..."
                    value={areaSize}
                    onChange={(e) => setAreaSize(e.target.value)}
                />

                <div className="card-container">
                    {filteredBuildings.length > 0 ? (
                        listBuildings
                    ) : (
                        <p className="no-result">No results found.</p>
                    )}
                </div>
            </section>
        </main>
        <FooterPage />
        </>
    )
}
