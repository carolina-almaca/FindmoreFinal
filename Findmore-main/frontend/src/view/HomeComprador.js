import LOGO from '../images/logo-horizontal.png';
import ProfileIcon from '../images/profile-icon.svg';
import '../styles/navbar.css';
import '../styles/homeVendedor.css';
import Footer from '../components/Footer';
import React, { useEffect, useState } from 'react';
import PacoteProdutos from './PacoteProdutos';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from './auth.service';
import ProductsCarousel from '../components/ProductsCarousel';
import OrcamentoPacotesModal from '../components/OrcamentoPacotesModal';
import ToastNotification from '../components/ToastNotification';

export default function HomeComprador({ onLogout }) {
	const [produtosPerformance, setProdutosPerformance] = useState([]);
	const [produtosFotografia, setProdutosFotografia] = useState([]);
	const [produtosFerramentas, setProdutosFerramentas] = useState([]);
	const [pacotes, setPacotes] = useState([]);
	const [tab, setTab] = useState('produtos');
	const [showNovoOrcamentoModal, setShowNovoOrcamentoModal] = useState(false);
	const [toast, setToast] = useState({
		show: false,
		message: '',
		variant: 'success',
	});

	useEffect(() => {
		const fetchProdutos = async () => {
			try {
				if (!authService.getCurrentUser()) authService.logout();
				const { data } = await axios.get(
					'http://localhost:3001/produto/listaStock',
					{
						headers: {
							Authorization: `Bearer ${
								authService.getCurrentUser().token
							}`,
						},
					}
				);
				if (data && data.message === 'O token não é válido.') {
					authService.logout();
				}

				const pPerformance = data.filter(
					(p) => String(p.categoria).toLowerCase() === 'performance'
				);
				setProdutosPerformance(pPerformance);

				const pFotografia = data.filter(
					(p) => String(p.categoria).toLowerCase() === 'fotografia'
				);
				setProdutosFotografia(pFotografia);

				const pFerramenta = data.filter(
					(p) => String(p.categoria).toLowerCase() === 'ferramenta'
				);
				setProdutosFerramentas(pFerramenta);
			} catch (error) {}
		};

		const fetchPacotes = async () => {
			try {
				const { data } = await axios.get(
					'http://localhost:3001/pacote/lista'
				);

				// Fetch produtos for each pacote
				const pacotesWithProdutos = await Promise.all(
					data.filter(p => p.idOrcamento === null).map(async (pacote) => {
						const produtosResponse = await axios.get(
							`http://localhost:3001/pacote/${pacote.idPacote}/produtos`
						);
						return { ...pacote, produtos: produtosResponse.data };
					})
				);

				// Update the state with combined data
				setPacotes(pacotesWithProdutos);
				if (data && data.message === 'O token não é válido.') {
					authService.logout();
				}
			} catch (error) {}
		};

		fetchProdutos();
		fetchPacotes();
	}, []);

	const navigate = useNavigate();

	const handleProductClick = (produto) => {
		navigate(`/comprar-produto/${produto.idProduto}`);
	};

	const handlePacoteClick = (pacote) => {
		navigate(`/comprar-pacote/${pacote.idPacote}`);
	};

	const handleOrcamentoCriado = () => {
		handleShowToast('Orçamento criado com sucesso! Verifique o estado no seu perfil.', 'success');
	}

	const handleShowToast = (message, variant) => {
		setToast({ show: true, message, variant });
	};

	const handleCloseToast = () => setToast({ ...toast, show: false });

	return (
		<main className='home-vendedor'>
			{
				showNovoOrcamentoModal && (
					<OrcamentoPacotesModal
						handleCloseModal={() => setShowNovoOrcamentoModal(false)}
						onOrcamentoCriado={handleOrcamentoCriado}
						produtosDisponiveis={[...produtosPerformance, ...produtosFerramentas, ...produtosFotografia]}
					/>
				)
			}
			<ToastNotification
				show={toast.show}
				handleClose={handleCloseToast}
				toast={toast}
			/>
			<div className='navbar'>
				<img className='navbar-logo' src={LOGO} alt='Logo' />
				<div className='navbar-menu-lg'>
					<Link to='/perfil-comprador' className='profile-btn'>
						<img src={ProfileIcon} alt='Logo' />
					</Link>
					<button
						className='btn btn-primary'
						onClick={() => onLogout()}
					>
						Sair
					</button>
				</div>
			</div>
			<div className='container-wrapper'>
				<div className='vender-artigo-title'>
					<h1>Comprar Artigo</h1>
					{tab === 'pacotes' && (
						<button
							onClick={() => setShowNovoOrcamentoModal(true)}
						>
							Novo Orçamento
						</button>
					)}
				</div>
				<div className='tab-links'>
					<h1
						className={`tab-link tab-link-ltr ${
							tab === 'produtos' ? 'tab-link-active' : ''
						}`}
						onClick={() => setTab('produtos')}
					>
						Produtos individuais
					</h1>
					<h1
						className={`tab-link tab-link-ltr ${
							tab === 'pacotes' ? 'tab-link-active' : ''
						}`}
						onClick={() => setTab('pacotes')}
					>
						Pacotes
					</h1>
				</div>
				{tab === 'produtos' && (
					<div className='carousel-produtos-wrapper'>
						{produtosPerformance.length > 0 && (
							<React.Fragment>
								<h1>Performance</h1>
								<ProductsCarousel
									produtos={produtosPerformance}
									onEditarProdutoClick={() => {}}
									onApagarProdutoClick={() => {}}
									fromComprador
									onProdutoClick={(p) =>
										handleProductClick(p)
									}
								/>
							</React.Fragment>
						)}
						{produtosFotografia.length > 0 && (
							<React.Fragment>
								<h1>Fotografia</h1>
								<ProductsCarousel
									produtos={produtosFotografia}
									onEditarProdutoClick={() => {}}
									onApagarProdutoClick={() => {}}
									fromComprador
									onProdutoClick={(p) =>
										handleProductClick(p)
									}
								/>
							</React.Fragment>
						)}
						{produtosFerramentas.length > 0 && (
							<React.Fragment>
								<h1>Ferramenta</h1>
								<ProductsCarousel
									produtos={produtosFerramentas}
									onEditarProdutoClick={() => {}}
									onApagarProdutoClick={() => {}}
									fromComprador
									onProdutoClick={(p) =>
										handleProductClick(p)
									}
								/>
							</React.Fragment>
						)}
					</div>
				)}
				{tab === 'pacotes' && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '30px',
							marginBottom: '30px',
						}}
					>
						{pacotes.map((pacote) => {
							return (
								<PacoteProdutos
									pacote={pacote}
									key={pacote.idPacote}
									onPacoteClick={(p) => handlePacoteClick(p)}
								/>
							);
						})}
					</div>
				)}
			</div>
			<Footer />
		</main>
	);
}
