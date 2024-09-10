import { Button, Col, Form, Row } from 'react-bootstrap';
import LOGO from '../images/logo-horizontal.png';
import ProfileIcon from '../images/profile-icon.svg';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/comprarProduto.css';
import axios from 'axios';
import CardIcon from '../images/card.svg';
import FormInput from './InputText';
import authService from '../view/auth.service';
import ToastNotification from './ToastNotification';

export default function PagamentoProduto({
	onLogout,
	product,
	quantity,
	onCancelar,
	descricao,
	versaoSelecionada,
}) {
	const [nomeCartao, setNomeCartao] = useState('');
	const [numeroCartao, setNumeroCartao] = useState('');
	const [validadeCartao, setValidadeCartao] = useState('');
	const [CVV, setCVVCartao] = useState('');
	const [erroMsgCartao, setErroMsgCartao] = useState('');
	const [erroMsgValidadeCartao, setErroMsgValidade] = useState('');
	const [erroMsgCVVCartao, setErroMsgCVV] = useState('');
	const [toast, setToast] = useState({
		show: false,
		message: '',
		variant: 'success',
	});

	const navigate = useNavigate();

	const handlePagar = async () => {
		try {
			await axios.post(`http://localhost:3001/compra/`, {
				idUtilizador: authService.getCurrentUser().idUtilizador,
				idProduto: product?.idProduto,
				valorTotal: product?.preco * quantity,
				descricao: descricao,
				quantidade: quantity,
				dataCompra: new Date().toISOString(),
				comentario: '',
				avaliacao: null,
				nomeCartao,
				numeroCartao,
				validadeCartao,
				CVV,
				idVersaoP: versaoSelecionada.idVersaoP,
			});

			handleShowToast('Compra efetuada com sucesso!', 'success');
			setTimeout(() => {
				navigate('/');
			}, 1000);
			// setShowDialog(false);
		} catch (error) {
			handleShowToast('Ocorreu um erro ao concluir a compra!', 'danger');
			// setShowDialog(false);
		}
	};

	const handleShowToast = (message, variant) => {
		setToast({ show: true, message, variant });
	};

	const handleCloseToast = () => setToast({ ...toast, show: false });

	const handleCartaoChange = (value) => {
		if (!value) {
			setErroMsgCartao('');
			return;
		}
		const isValid = validarCartaoCredito(value);

		if (!isValid) {
			setErroMsgCartao('Número de cartão inválido.');
			setNumeroCartao(value);
			return;
		} else {
			setNumeroCartao(value);
			setErroMsgCartao('');
			return;
		}
	}

	const validarCartaoCredito = (numeroCartao) => {
		// Verificar o formato de entrada (blocos de 4 dígitos separados por espaços)
		const padraoEntrada = /^(\d{4}\s){3}\d{4}$/;
    
		return padraoEntrada.test(numeroCartao);
	}

	const handleValidadeCartaoChange = (value) => {
		if (!value) {
			setErroMsgValidade('');
			return;
		}
		const isValid = validarValidadeCartao(value);

		if (!isValid) {
			setErroMsgValidade('Data de validade do cartão inválida.');
			setValidadeCartao(value);
			return;
		} else {
			setValidadeCartao(value);
			setErroMsgValidade('');
			return;
		}
	}

	const validarValidadeCartao = (validade) => {
		// Verificar o formato MM/AAAA
		const padraoValidade = /^(0[1-9]|1[0-2])\/\d{4}$/;
		if (!padraoValidade.test(validade)) {
			return false;
		}
	
		// Extrair o mês e o ano da validade
		const [mes, ano] = validade.split('/').map(Number);
	
		// Obter o mês e ano atuais
		const dataAtual = new Date();
		const mesAtual = dataAtual.getMonth() + 1; // Meses de 0 a 11
		const anoAtual = dataAtual.getFullYear();
	
		// Verificar se a validade é maior ou igual ao mês/ano atual
		if (ano > anoAtual || (ano === anoAtual && mes >= mesAtual)) {
			return true;
		}
	
		return false;
	}

	const handleCartaoCVVChange = (value) => {
		if (!value) {
			setErroMsgCVV('');
			return;
		}
		const isValid = validarCVV(value);

		if (!isValid) {
			setErroMsgCVV('CVV do cartão inválido.');
			setCVVCartao(value);
			return;
		} else {
			setCVVCartao(value);
			setErroMsgCVV('');
			return;
		}
	}

	const validarCVV = (cvv) => {
		// Verificar se o CVV tem 3 ou 4 dígitos
		const padraoCVV = /^\d{3,4}$/;
		return padraoCVV.test(cvv);
	}

	return (
		<main>
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
				<h1 className='category-title-1'>Pagamento</h1>
				<div className='buy-wrapper'>
					<div className='buy-wrapper-resume'>
						<div
							className='resume-container'
							style={{ width: '100%' }}
						>
							<div className='resume-container-header'>
								<h1>{product?.nomeP}</h1>
								<h1>{`${product?.preco.toFixed(2)}€`}</h1>
							</div>
							<div className='resume-container-content'>
								<h2>{product?.miniDescricao}</h2>
								<p>{product?.descricao}</p>
							</div>
						</div>
					</div>
					<div
						className='buy-wrapper-footer'
						style={{ justifyContent: 'normal' }}
					>
						<div className='buy-wrapper-footer-resumo'>
							<h1>Resumo do pedido</h1>
							<div>
								<span>Versão: </span>
								<span>{versaoSelecionada.nomeVersaoP}</span>
							</div>
							<div>
								<span>Quantidade: </span>
								<span>{quantity}</span>
							</div>
							<div>
								<span>Total: </span>
								<span>{`${(product?.preco * quantity).toFixed(
									2
								)}€`}</span>
							</div>
						</div>
						<div
							className='buy-wrapper-footer-obs'
							style={{ minWidth: '30%' }}
						>
							<h1>Observação</h1>
							{descricao}
						</div>
					</div>

					<div className='card-info-container'>
						<img src={CardIcon} alt='' height={60} />
						<Form>
							<Row>
								<Col md={2}>
									<Form.Group>
										<FormInput
											label='Número do Cartão'
											type='text'
											id='numberoCartao'
											helpBlockTxt=''
											onChange={(e) => handleCartaoChange(e.currentTarget.value)}
											placeholder='1234 5678 9012 3456'
											pattern='\d{4} \d{4} \d{4} \d{4}'
										/>
									</Form.Group>
								</Col>
								<Col md={2}>
									<Form.Group>
										<FormInput
											label='Nome do cartão'
											type='text'
											id='nomeCartao'
											helpBlockTxt=''
											onChange={(e) =>
												setNomeCartao(
													e.currentTarget.value
												)
											}
											placeholder="John Doe"
										/>
									</Form.Group>
								</Col>
							</Row>

							<Row>
								<Col md={2}>
									<Form.Group>
										<FormInput
											label='Validade'
											type='text'
											id='validadeCartao'
											helpBlockTxt=''
											placeholder='01/2030'
											onChange={(e) => handleValidadeCartaoChange(e.currentTarget.value) }
										/>
									</Form.Group>
								</Col>
								<Col md={2}>
									<Form.Group>
										<FormInput
											label='CVV'
											type='text'
											id='CVV'
											helpBlockTxt=''
											onChange={(e) => handleCartaoCVVChange(e.currentTarget.value)}
											placeholder="123"
										/>
									</Form.Group>
								</Col>
							</Row>
						</Form>
						<div className='buy-wrapper-footer-actions'>
							<Button
								className='btn-primary'
								onClick={() => onCancelar()}
							>
								Cancelar pagamento
							</Button>
							<Button
								className='btn-secondary'
								onClick={() => handlePagar()}
								disabled={erroMsgCartao || !numeroCartao || erroMsgValidadeCartao || !validadeCartao || erroMsgCVVCartao || !CVV || !nomeCartao}
							>
								Pagar
							</Button>
						</div>
						{
							erroMsgCartao && (
								<p style={{ margin: '10px 0', color: 'red' }}>{erroMsgCartao}</p>
							)
						}
						{
							erroMsgValidadeCartao && (
								<p style={{ margin: '10px 0', color: 'red' }}>{erroMsgValidadeCartao}</p>
							)
						}
						{
							erroMsgCVVCartao && (
								<p style={{ margin: '10px 0', color: 'red' }}>{erroMsgCVVCartao}</p>
							)
						}
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
