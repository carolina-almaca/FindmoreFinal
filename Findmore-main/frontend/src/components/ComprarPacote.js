import { Button } from 'react-bootstrap';
import LOGO from '../images/logo-horizontal.png';
import ProfileIcon from '../images/profile-icon.svg';
import Footer from './Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import '../styles/comprarProduto.css';
import axios from 'axios';
import PagamentoPacote from './PagamentoPacote';
import ToastNotification from './ToastNotification';

export default function ComprarPacote({ onLogout }) {
	const { pacoteId } = useParams();

	const [pacote, setPacote] = useState(undefined);
	const [quantity, setQuantity] = useState(1);
	const [showPagamento, setShowPagamento] = useState(false);
	const [observacao, setObservacao] = useState('');
	const [toast, setToast] = useState({
		show: false,
		message: '',
		variant: 'success',
	});

	const navigate = useNavigate();

	useEffect(() => {
		if (pacoteId) {
			const fetchPacote = async () => {
				try {
					const { data } = await axios.get(
						`http://localhost:3001/pacote/${pacoteId}`
					);
					setPacote(data);
				} catch (error) {
					const errorMessage =
						error.response?.data?.error ||
						'Ocorreu um erro ao efetuar o pagamento';
					handleShowToast(errorMessage, 'danger');
				}
			};

			fetchPacote();
		}
	}, [pacoteId]);

	const removeQuantity = () => {
		if (quantity === 1) return;
		setQuantity((prev) => prev - 1);
	};

	const addQuantity = () => {
		if (quantity >= pacote?.quantidatePacote) return;
		setQuantity((prev) => prev + 1);
	};

	const handleShowToast = (message, variant) => {
		setToast({ show: true, message, variant });
	};

	const handleCloseToast = () => setToast({ ...toast, show: false });

	const handleGoBack = async () => {
		if (pacote.orcamento) {
			try {
				await axios.delete(
					`http://localhost:3001/pacote/${pacote.idPacote}`
				);
				
				navigate(-1);
			} catch (error) {
				navigate(-1);
			}
		} else {
			navigate('/comprador');
		}
	}

	return (
		<React.Fragment>
			{showPagamento && (
				<PagamentoPacote
					onLogout={onLogout}
					pacote={pacote}
					quantity={quantity}
					onCancelar={() => setShowPagamento(false)}
					observacao={observacao}
				/>
			)}
			<ToastNotification
				show={toast.show}
				handleClose={handleCloseToast}
				toast={toast}
			/>
			{!showPagamento && (
				<main>
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
						<h1 className='category-title-1'>Comprar</h1>

						<div className='buy-wrapper'>
							<div className='buy-wrapper-resume'>
								<div className='resume-container'>
									<div className='resume-container-header'>
										<h1>{pacote?.nomePacote}</h1>
										<h1>{`${pacote?.valor.toFixed(
											2
										)}€`}</h1>
									</div>
									<div className='resume-container-content'>
										<h2>{pacote?.miniDescricao}</h2>
										<p>{pacote?.descricao}</p>
									</div>
								</div>
								<div className='resume-container-selection'>
									<div className='resume-container-selection-quantity'>
										<span className='resume-container-selection-title'>
											Preço: {pacote?.valor.toFixed(2)}€
										</span>
										<div className='quantity-wrapper'>
											<button
												className='btn-quantity'
												onClick={pacote?.orcamento ? () => {} : () => removeQuantity()}
												disabled={pacote?.orcamento}
											>
												-
											</button>
											<span className='quantity-value'>
												{quantity || 1}
											</span>
											<button
												className='btn-quantity'
												onClick={pacote?.orcamento ? () => {} : () => addQuantity()}
												disabled={pacote?.orcamento}
											>
												+
											</button>
										</div>
									</div>
								</div>
							</div>
							<div className='buy-wrapper-footer'>
								<div className='buy-wrapper-footer-obs'>
									<h1>Observação</h1>
									<textarea
										rows={6}
										cols={60}
										onChange={(e) =>
											setObservacao(e.currentTarget.value)
										}
									/>
								</div>
								<div className='buy-wrapper-footer-resumo'>
									<h1>Resumo do pedido</h1>
									<div>
										<span>Total: </span>
										<span>{`${(
											pacote?.valor * quantity
										).toFixed(2)}€`}</span>
									</div>
								</div>
								<div className='buy-wrapper-footer-actions'>
									
										<Button className='btn-primary' onClick={handleGoBack}>
											Continuar a comprar
										</Button>
									<Button
										className='btn-secondary'
										onClick={() => setShowPagamento(true)}
									>
										Pagamento
									</Button>
								</div>
							</div>
						</div>
					</div>

					<Footer />
				</main>
			)}
		</React.Fragment>
	);
}
