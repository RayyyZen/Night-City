import { Link } from 'react-router-dom';

export default function FooterPage(){
    return (
    
        <footer className="footer">
                    
                <ul class="list-inline">
                    <Link className= "link" to="/about">About</Link>
                </ul>
                <p class="copyright">Night-Tower © 2026</p>
        </footer>
    )
}