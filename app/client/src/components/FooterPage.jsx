import { Link } from 'react-router-dom';

export default function FooterPage(){
    return (
    
        <footer className="footer">
                    
                <ul className="list-inline">
                    <Link className= "link" to="/about">About</Link>
                </ul>
                <p className="copyright">Night-City © 2026</p>
        </footer>
    )
}