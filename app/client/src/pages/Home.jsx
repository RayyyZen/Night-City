import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderPage from '../components/HeaderPage.jsx';
import FooterPage from '../components/FooterPage.jsx';

export default function Home() {
  const navigate = useNavigate();
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
    <HeaderPage page={"home"} />
    
      <section className="center">
        <h1 className="big-title">Welcome in Night-City</h1>
        <div className="buttons">
          <button className="submit-button" onClick={() => navigate('/all-news')}>News</button>
          <button className="submit-button" onClick={() => navigate('/buildings')}>Buildings</button>
        </div>
      </section>
     
    <FooterPage/>
    </>
  );
}