import { Link } from 'react-router-dom';

export default function HeaderPage(){
    return (
        <header className="header">
            <Link to="/home" className="logo">Night-Tower</Link>

            <nav className="nav">
            <Link className ="link" to="/home">Home</Link>
            <Link className ="link"to="/login">Sign-in</Link>
            <Link className ="link" to="/register">Sign-up</Link>
            <Link className ="link" to="/profile">Profile</Link>
            </nav>
        </header>
    )
}