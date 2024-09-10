import { Link, useLocation } from 'react-router-dom';
import LOGO from '../images/logo-horizontal.png';
import ProfileIcon from '../images/profile-icon.svg';
import '../styles/navbarAdmin.css';
import { Container, Nav, Navbar } from 'react-bootstrap';

export default function AdminNavbar({ onLogout }) {
    const { pathname } = useLocation();

	return (
		<Navbar expand='lg' className='navbar-admin'>
			<Container>
				<Link className='navbar-brand' to='/admin'>
					<img src={LOGO} width='185' height='65' alt='' />
				</Link>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='me-auto'>
						<Link className={`nav-link${pathname === '/admin' ? ' active' : ''}`} to='/admin'>
							Dashboard
						</Link>
						<Link className={`nav-link${pathname.includes('/admin/vendedores') ? ' active' : ''}`} to='/admin/vendedores'>
							Vendedores
						</Link>
						<Link className={`nav-link${pathname.includes('/admin/compradores') ? ' active' : ''}`} to='/admin/compradores'>
							Compradores
						</Link>
						<Link className={`nav-link${pathname.includes('/admin/produtos') ? ' active' : ''}`} to='/admin/produtos'>
							Produtos
						</Link>
						<Link className={`nav-link${pathname.includes('/admin/compras') ? ' active' : ''}`} to='/admin/compras'>
							Compras
						</Link>
						<Link className={`nav-link${pathname.includes('/admin/pacotes') ? ' active' : ''}`} to='/admin/pacotes'>
							Pacotes
						</Link>
						<Link className={`nav-link${pathname.includes('/admin/orcamentos') ? ' active' : ''}`} to='/admin/orcamentos'>
							Orçamentos
						</Link>
					</Nav>
				</Navbar.Collapse>
                <div className="navbar-menu-lg">
                    <Link to="/perfil" className='profile-btn'>
						<img src={ProfileIcon} alt='Logo' />
					</Link>
                    <button className="btn btn-primary" onClick={() => onLogout()}>
                        Sair
                    </button>
                </div>
			</Container>
		</Navbar>
	);
}
