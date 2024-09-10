import LOGO from '../images/logo-horizontal.png';
import ProfileIcon from '../images/profile-icon.svg';
import PencilIcon from '../images/pencil.svg';
import TrashIcon from '../images/trash.svg';
import '../styles/navbar.css';
import '../styles/homeVendedor.css';
import Footer from '../components/Footer';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import authService from './auth.service';
import ProdutoModal from '../components/ProdutoModal';
import { Link } from 'react-router-dom';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ToastNotification from '../components/ToastNotification';
import PacoteModal from '../components/PacoteModal';
import ProductsCarousel from '../components/ProductsCarousel';

export default function HomeVendedor({ onLogout }) {
	const [produtosVendedor, setProdutosVendedor] = useState([]);
	const [pacotesVendedor, setPacotesVendedor] = useState([]);
	const [showNovoProdutoModal, setShowNovoProdutoModal] = useState(false);
	const [editarProduto, setEditarProduto] = useState(null);
	const [editarPacote, setEditarPacote] = useState(null);
	const [showApagarDialog, setShowApagarDialog] = useState(false);
	const [produtoApagar, setProdutoApagar] = useState(null);
	const [pacoteApagar, setPacoteApagar] = useState(null);
	const [toast, setToast] = useState({
		show: false,
		message: '',
		variant: 'success',
	});
	const [showNovoPacoteModal, setShowNovoPacoteModal] = useState(false);
	const [tab, setTab] = useState('produtos');

	useEffect(() => {
		fetchProdutos();
		fetchPacotes();
	}, []);

	//TODO this needs to be changed to fetch products for a user on its own query/endpoint
	const fetchProdutos = async () => {
		const user = authService.getCurrentUser();
		if (user) {
			try {
				if (!authService.getCurrentUser()) authService.logout();
				const { data } = await axios.get(
					'http://localhost:3001/produto/lista',
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
				const pVendedor = data.filter(
					(p) => p.idUtilizador === user.idUtilizador
				);
				setProdutosVendedor(pVendedor);
			} catch (error) {}
		}
	};

	const fetchPacotes = async () => {
		const user = authService.getCurrentUser();
		if (user) {
			try {
				if (!authService.getCurrentUser()) authService.logout();
				const { data } = await axios.get(
					`http://localhost:3001/pacote/${user.idUtilizador}/pacotes`,
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

				// Fetch produtos for each pacote
				const pacotesWithProdutos = await Promise.all(
					data.map(async (pacote) => {
						const produtosResponse = await axios.get(
							`http://localhost:3001/pacote/${pacote.idPacote}/produtos`
						);
						return { ...pacote, produtos: produtosResponse.data };
					})
				);

				setPacotesVendedor(pacotesWithProdutos);
			} catch (error) {}
		}
	};

	const handleProdutoCriado = async () => {
		if (editarProduto) {
			handleShowToast('Produto editado com sucesso!', 'success');
		} else {
			handleShowToast('Produto criado com sucesso!', 'success');
		}
		setEditarProduto(null);
		setShowNovoProdutoModal(false);
		await fetchProdutos();
	};

	const handleEditarProduto = (produto) => {
		setShowNovoProdutoModal(true);
		setEditarProduto(produto);
	};

	const handleApagarProduto = (produto) => {
		setProdutoApagar(produto);
		setShowApagarDialog(true);
	};

	const handleConfirmDialog = async () => {
		if (produtoApagar) {
			try {
				await axios.delete(
					`http://localhost:3001/produto/${produtoApagar.idProduto}`
				);
				setShowApagarDialog(false);
				setProdutoApagar(null);
				fetchProdutos();
				handleShowToast('Produto apagado com sucesso!', 'success');
			} catch (error) {
				const errorMessage =
					error.response?.data?.error ||
					'Ocorreu um erro ao apagar o pacote';
				handleShowToast(errorMessage, 'danger');
				setProdutoApagar(null);
			}
		}

		if (pacoteApagar) {
			try {
				await axios.delete(
					`http://localhost:3001/pacote/${pacoteApagar.idPacote}`
				);
				setShowApagarDialog(false);
				setPacoteApagar(null);
				fetchPacotes();
				handleShowToast('Pacote apagado com sucesso!', 'success');
			} catch (error) {
				const errorMessage =
					error.response?.data?.error ||
					'Ocorreu um erro ao apagar o pacote';
				handleShowToast(errorMessage, 'danger');
				setPacoteApagar(null);
			}
		}
	};

	const handleShowToast = (message, variant) => {
		setToast({ show: true, message, variant });
	};

	const handleCloseToast = () => setToast({ ...toast, show: false });

	const handlePacoteCriado = async () => {
		if (editarPacote) {
			handleShowToast('Pacote editado com sucesso!', 'success');
		} else {
			handleShowToast('Pacote criado com sucesso!', 'success');
		}
		setEditarPacote(null);
		setShowNovoPacoteModal(false);
		await fetchPacotes();
	};

	const handleApagarPacote = (pacote) => {
		setPacoteApagar(pacote);
		setShowApagarDialog(true);
	};

	const handleEditarPacote = (pacote) => {
		setShowNovoPacoteModal(true);
		setEditarPacote(pacote);
	};

	const produtosPerformance = produtosVendedor.filter(
		(p) => p.categoria === 'performance'
	);
	const produtosFotografia = produtosVendedor.filter(
		(p) => p.categoria === 'fotografia'
	);
	const produtosFerramenta = produtosVendedor.filter(
		(p) => p.categoria === 'ferramenta'
	);

	return (
		<main className='home-vendedor'>
			<ToastNotification
				show={toast.show}
				handleClose={handleCloseToast}
				toast={toast}
			/>

			<ConfirmationDialog
				show={showApagarDialog}
				handleClose={() => {
					setShowApagarDialog(false);
					setProdutoApagar(null);
					setPacoteApagar(null);
				}}
				handleConfirm={() => handleConfirmDialog()}
				message={`${
					produtoApagar ? 'Apagar produto?' : 'Apagar pacote?'
				}`}
			/>

			{showNovoProdutoModal && (
				<ProdutoModal
					handleCloseModal={() => {
						setShowNovoProdutoModal(false);
						setEditarProduto(null);
					}}
					onProdutoCriado={handleProdutoCriado}
					editarProduto={editarProduto}
				/>
			)}

			{showNovoPacoteModal && (
				<PacoteModal
					handleCloseModal={() => {
						setShowNovoPacoteModal(false);
						setEditarPacote(null);
					}}
					onPacoteCriado={handlePacoteCriado}
					editarPacote={editarPacote}
					produtosDisponiveis={produtosVendedor}
				/>
			)}

			<div className='navbar'>
				<img className='navbar-logo' src={LOGO} alt='Logo' />
				<div className='navbar-menu-lg'>
					<Link to='/perfil-vendedor' className='profile-btn'>
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
					<h1>Vender Artigo</h1>
					<button
						onClick={
							tab === 'produtos'
								? () => setShowNovoProdutoModal(true)
								: () => setShowNovoPacoteModal(true)
						}
					>
						Novo
					</button>
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
									onEditarProdutoClick={(produto) =>
										handleEditarProduto(produto)
									}
									onApagarProdutoClick={(produto) =>
										handleApagarProduto(produto)
									}
								/>
							</React.Fragment>
						)}
						{produtosFotografia.length > 0 && (
							<React.Fragment>
								<h1>Fotografia</h1>
								<ProductsCarousel
									produtos={produtosFotografia}
									onEditarProdutoClick={(produto) =>
										handleEditarProduto(produto)
									}
									onApagarProdutoClick={(produto) =>
										handleApagarProduto(produto)
									}
								/>
							</React.Fragment>
						)}
						{produtosFerramenta.length > 0 && (
							<React.Fragment>
								<h1>Ferramenta</h1>
								<ProductsCarousel
									produtos={produtosFerramenta}
									onEditarProdutoClick={(produto) =>
										handleEditarProduto(produto)
									}
									onApagarProdutoClick={(produto) =>
										handleApagarProduto(produto)
									}
								/>
							</React.Fragment>
						)}
					</div>
				)}

				{tab === 'pacotes' && (
					<div className='carousel-produtos-wrapper'>
						{pacotesVendedor.map((pacote) => {
							return (
								<React.Fragment>
									<div style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between'
									}}>
										<h1>{`${pacote.nomePacote} (Stock: ${pacote.quantidadePacote})`}</h1>
										<div className='carousel-card-produto-footer'>
											<h1 style={{marginBottom: '-3px', marginRight: '10px'}}>{`${Number(pacote.valor).toFixed(2)}€`}</h1>
											<button
												onClick={() =>
													handleEditarPacote(pacote)
												}
											>
												<img
													src={PencilIcon}
													alt=''
													height={22}
												/>
											</button>
											<button
												onClick={() =>
													handleApagarPacote(pacote)
												}
											>
												<img
													src={TrashIcon}
													alt=''
													height={22}
												/>
											</button>
										</div>
									</div>
									<ProductsCarousel
										produtos={pacote.produtos}
										onEditarProdutoClick={(produto) =>
											handleEditarProduto(produto)
										}
										onApagarProdutoClick={(produto) =>
											handleApagarProduto(produto)
										}
										isPacote
									/>
								</React.Fragment>
							);
						})}
					</div>
				)}
			</div>
			<Footer />
		</main>
	);
}
