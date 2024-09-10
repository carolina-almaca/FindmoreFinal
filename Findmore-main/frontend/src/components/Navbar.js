
import LOGO from '../images/logo-horizontal.png';
import '../styles/navbar.css';

export default function Navbar(props) {
    const { onLoginClick, onRegistarClick } = props;

    return (
        <div className="navbar">
            <img className="navbar-logo" src={LOGO} alt="Logo" />
            <div className="navbar-menu">
                <button className="btn btn-secondary" onClick={onRegistarClick}>
                    Registar
                </button>
                <button className="btn btn-primary" onClick={onLoginClick}>
                    Entrar
                </button>
            </div>
        </div>
    )
}