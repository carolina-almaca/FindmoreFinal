import './App.css';
import {
	Route,
	Routes,
	Navigate,
	BrowserRouter as Router,
} from 'react-router-dom';
import Home from './view/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import HomeComprador from './view/HomeComprador';
import HomeAdmin from './view/HomeAdmin';
import HomeVendedor from './view/HomeVendedor';
import authService from './view/auth.service';
import ComprarProduto from './components/ComprarProduto';
import Perfil from './view/Perfil';
import ConfirmationDialog from './components/ConfirmationDialog';
import ComprarPacote from './components/ComprarPacote';
import AdminVendedores from './components/admin/AdminVendedores';
import AdminPacotes from './components/admin/AdminPacotes';
import AdminCompras from './components/admin/AdminCompras';
import AdminProdutos from './components/admin/AdminProdutos';
import AdminCompradores from './components/admin/AdminCompradores';
import PerfilVendedor from './view/PerfilVendedor';
import PerfilComprador from './view/PerfilComprador';
import AdminDetalhesVendedor from './components/admin/AdminDetalhesVendedor';
import AdminDetalhesComprador from './components/admin/AdminDetalhesComprador';
import AdminOrcamentos from './components/admin/AdminOrcamentos';

function App() {
	const [currentUser, setCurrentUser] = useState(
		authService.getCurrentUser()
	);
	const [showDialog, setShowDialog] = useState(false);

	const checkAuth = (role) => {
		const user = authService.getCurrentUser();
		if (!user) {
			return false;
		}
		if (role && user.role !== role) {
			return false;
		}
		return true;
	};

	const getHomePageByRole = (role) => {
		switch (role) {
			case 'comprador':
				return '/comprador';
			case 'vendedor':
				return '/vendedor';
			case 'admin':
				return '/admin';
			default:
				return '/';
		}
	};

	const handleLoginSuccess = () => {
		const user = authService.getCurrentUser();
		setCurrentUser(user);
	};

	const onLogout = () => {
		authService.logout();
		setCurrentUser(null);
		setShowDialog(false);
	};

	const handleLogout = () => {
		setShowDialog(true);
	};

	const initialPage = currentUser ? getHomePageByRole(currentUser.role) : '/';

	return (
		<>
			<ConfirmationDialog
				show={showDialog}
				handleClose={() => setShowDialog(false)}
				handleConfirm={() => onLogout()}
				message='Terminar sessão?'
			/>
			<Router>
				<Routes>
					<Route
						path='/'
						element={
							currentUser ? (
								<Navigate to={initialPage} replace />
							) : (
								<Home onLoginSuccess={handleLoginSuccess} />
							)
						}
					/>
					<Route
						path='/comprador'
						element={
							checkAuth('comprador') ? (
								<HomeComprador onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>
					<Route
						path='/vendedor'
						element={
							checkAuth('vendedor') ? (
								<HomeVendedor onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>
					<Route
						path='/admin'
						element={
							checkAuth('admin') ? (
								<HomeAdmin onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>
					<Route
						path='/admin/vendedores'
						element={
							checkAuth('admin') ? (
								<AdminVendedores onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>
					<Route
						path='/admin/compradores'
						element={
							checkAuth('admin') ? (
								<AdminCompradores onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>
					<Route
						path='/admin/produtos'
						element={
							checkAuth('admin') ? (
								<AdminProdutos onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>
					<Route
						path='/admin/compras'
						element={
							checkAuth('admin') ? (
								<AdminCompras onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>
					<Route
						path='/admin/pacotes'
						element={
							checkAuth('admin') ? (
								<AdminPacotes onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>
					<Route
						path='/admin/orcamentos'
						element={
							checkAuth('admin') ? (
								<AdminOrcamentos onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>
					<Route
						path='/comprar-produto/:productId'
						element={
							checkAuth('comprador') ? (
								<ComprarProduto onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>

					<Route
						path='/comprar-pacote/:pacoteId'
						element={
							checkAuth('comprador') ? (
								<ComprarPacote onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>

					<Route
						path='/perfil'
						element={
							currentUser && currentUser.token ? (
								<Perfil onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>

					<Route
						path='/perfil-vendedor'
						element={
							checkAuth('vendedor') ? (
								<PerfilVendedor onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>

					<Route
						path='/perfil-comprador'
						element={
							checkAuth('comprador') ? (
								<PerfilComprador onLogout={handleLogout} />
							) : (
								<Navigate to='/' replace />
							)
						}
					/>

					<Route
						path='/admin/vendedores/:id'
						element={
							checkAuth('admin') ? (
								<AdminDetalhesVendedor
									onLogout={handleLogout}
								/>
							) : (
								<Navigate to='/' replace />
							)
						}
					/>

					<Route
						path='/admin/compradores/:id'
						element={
							checkAuth('admin') ? (
								<AdminDetalhesComprador
									onLogout={handleLogout}
								/>
							) : (
								<Navigate to='/' replace />
							)
						}
					/>

					<Route path='*' element={<Navigate to='/' />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
