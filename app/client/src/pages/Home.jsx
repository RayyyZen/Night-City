import { Link } from 'react-router-dom';

export default function Home() {
  const news = [
    {
      id: 1,
      title: "Sensor maintenance",
      date: "April 11, 2026",
      content:
      "A maintenance operation is scheduled for several of the building's connected sensors."
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

  return (
    <div className="home-page">
      <header className="header">
        <div className="logo">Night-Tower</div>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/login">Sign-in</Link>
          <Link to="/register">Sign-up</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

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

          <div className="news-container">
            {news.map((item) => (
              <article className="news-card" key={item.id}>
                <h3>{item.title}</h3>
                <p className="date">{item.date}</p>
                <p>{item.content}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}