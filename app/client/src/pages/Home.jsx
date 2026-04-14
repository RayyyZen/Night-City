import { useState } from 'react';
import HeaderPage from '../components/HeaderPage.jsx';

export default function Home() {
  const news = [
    {
      id: 1,
      title: "Sensor maintenance",
      date: "April 11, 2026",
      content:
        "A maintenance operation is scheduled for several of the building's connected sensors (jfjfjf)."
    },
    {
      id: 2,
      title: "New service available",
      date: "April 10, 2026",
      content:
        "Energy consumption tracking is now accessible from your dashboard."
    },
    {
      id: 3,
      title: "Platform update",
      date: "April 08, 2026",
      content:
        "The interface has been improved to provide a better experience on mobile and tablet."
    }
  ];

  const [query, setQuery] = useState('');

  const filteredNews = news.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q)
    );
  });

  const highlight = (text) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="highlight">{part}</mark> : part
    );
  };

  return (
    <>
    <HeaderPage />
    <div className="home-page">

      <main>
        <section className="hero">
          <h1>Welcome on Night-Tower</h1>
          <p>
            An intelligent platform to centralize information,
            services, and connected objects.
          </p>
          <button>Discover</button>
        </section>

        <section className="news-section">
          <h2>Latest news</h2>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search news..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="news-container">
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <article className="news-card" key={item.id}>
                  <h3>{highlight(item.title)}</h3>
                  <p className="date">{item.date}</p>
                  <p>{highlight(item.content)}</p>
                </article>
              ))
            ) : (
              <p className="no-result">No results found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
    </>
  );
}