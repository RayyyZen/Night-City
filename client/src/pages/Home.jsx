import { useNavigate } from 'react-router-dom';
import HeaderPage from '../components/HeaderPage.jsx';
import FooterPage from '../components/FooterPage.jsx';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
    <HeaderPage page={"home"} />
    
      <section className="center">
        <h1 className="big-title">Welcome to Night City</h1>
        <div className="buttons homeButtons">
          <button className="submit-button homeButton" onClick={() => navigate('/all-news')}>News</button>
          <button className="submit-button homeButton" onClick={() => navigate('/buildings')}>Buildings</button>
        </div>
      </section>
     
    <FooterPage/>
    </>
  );
}