import { Link, useParams } from 'react-router-dom';
import AdminNavbar from '../AdminNavbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ToastNotification from '../ToastNotification';
import { Button, Form, Modal } from 'react-bootstrap';
import FormInput from '../InputText';
import EditarIcon from '../../images/pencil-white.svg';
import ConfirmationDialog from '../ConfirmationDialog';
import AdminDetalhesVendedorProdutosEPacotes from './AdminDetalhesVendedorProdutosEPacotes';
import AdminDetalhesVendedorVendaProdutos from './AdminDetalhesVendedorVendaProdutos';
import AdminDetalhesVendedorVendaPacotes from './AdminDetalhesVendedorVendaPacotes';

const AdminDetalhesVendedor = ({ onLogout }) => {
	const { id } = useParams();
	const [detalhesVendedor, setDetalhesVendedor] = useState(null);
	const [showEditar, setShowEditar] = useState(false);
	const [newNome, setNewNome] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [toast, setToast] = useState({
		show: false,
		message: '',
		variant: 'success',
	});
	const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
	const [tab, setTab] = useState('produtos_pacotes');

	useEffect(() => {
		if (id) {
			const fetchPacote = async () => {
				try {
					const { data } = await axios.get(
						`http://localhost:3001/utilizador/${id}`
					);
					setDetalhesVendedor(data);
				} catch (error) {}
			};

			fetchPacote();
		}
	}, [id]);

	const handleSaveEditar = async () => {
		try {
			await axios.put(`http://localhost:3001/utilizador/${id}`, {
				...detalhesVendedor,
				nomeU: newNome || detalhesVendedor.nomeU,
				email: newEmail || detalhesVendedor.email,
			});

			handleShowToast('Utilizador editado com sucesso!', 'success');
			setShowEditar(false);
			setNewEmail('');
			setNewNome('');

			setDetalhesVendedor({
				...detalhesVendedor,
				nomeU: newNome || detalhesVendedor.nomeU,
				email: newEmail || detalhesVendedor.email,
			});
		} catch (error) {
			handleShowToast(
				'Ocorreu um erro ao editar o utilizador!',
				'danger'
			);
			setShowEditar();
			setNewEmail('');
			setNewNome('');
		}
	};

	const handleShowToast = (message, variant) => {
		setToast({ show: true, message, variant });
	};

	const handleCloseToast = () => setToast({ ...toast, show: false });

	const onAtivarDesativarClick = () => {
		setShowConfirmationDialog(true);
	};

	const onAtivarDesativar = async () => {
		try {
			await axios.put(`http://localhost:3001/utilizador/${id}`, {
				...detalhesVendedor,
				ativo: !detalhesVendedor.ativo,
			});

			handleShowToast(
				detalhesVendedor?.ativo
					? 'Utilizador desativado com sucesso'
					: 'Utilizador ativado com sucesso',
				'success'
			);

			setDetalhesVendedor({
				...detalhesVendedor,
				ativo: !detalhesVendedor.ativo,
			});
			setShowConfirmationDialog(false);
		} catch (error) {
			handleShowToast(
				'Ocorreu um erro ao atualizar o utilizador!',
				'danger'
			);
			setShowConfirmationDialog(false);
		}
	};

	return (
		<main>
			<ToastNotification
				show={toast.show}
				handleClose={handleCloseToast}
				toast={toast}
			/>
			<ConfirmationDialog
				show={showConfirmationDialog}
				handleClose={() => setShowConfirmationDialog(false)}
				handleConfirm={() => onAtivarDesativar()}
				message={`${
					detalhesVendedor?.ativo
						? 'Desativar Utlizador?'
						: 'Ativar Utilizador'
				}`}
			/>
			{showEditar && (
				<Modal
					show={true}
					onHide={() => setShowEditar(false)}
					className='login-modal'
				>
					<Modal.Header closeButton>
						<Modal.Title>Editar Perfil</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group style={{ display: 'grid' }}>
								<FormInput
									label='Nome'
									type='text'
									id='nomeU'
									helpBlockTxt=''
									onChange={(e) =>
										setNewNome(e.currentTarget.value)
									}
									defaultValue={detalhesVendedor?.nomeU}
								/>
								<FormInput
									label='Email'
									type='text'
									id='email'
									helpBlockTxt=''
									onChange={(e) =>
										setNewEmail(e.currentTarget.value)
									}
									defaultValue={detalhesVendedor?.email}
								/>
								<Button
									className='btn btn-secondary'
									onClick={() => handleSaveEditar()}
									style={{ justifySelf: 'flex-end' }}
								>
									Guardar
								</Button>
							</Form.Group>
						</Form>
					</Modal.Body>
				</Modal>
			)}
			<AdminNavbar onLogout={onLogout} />
			<div className='container-wrapper'>
				<div className='admin-pages-container'>
					<div className='perfil-vendedor-header'>
						<div>
							<span>{detalhesVendedor?.nomeU}</span>
							<span>{detalhesVendedor?.email}</span>
						</div>
						<div className='perfil-vendedor-header-actions'>
							<button
								className='perfil-vendedor-header-ativar-btn'
								onClick={onAtivarDesativarClick}
							>
								{detalhesVendedor?.ativo
									? 'Desativar'
									: 'Ativar'}
							</button>
							<button
								className='perfil-vendedor-header-editar'
								onClick={() => setShowEditar(true)}
							>
								<img src={EditarIcon} alt='' />
							</button>
						</div>
					</div>
					<div className='tab-links'>
						<h1
							className={`tab-link tab-link-ltr ${
								tab === 'produtos_pacotes'
									? 'tab-link-active'
									: ''
							}`}
							onClick={() => setTab('produtos_pacotes')}
						>
							Produtos e Pacotes
						</h1>
						<h1
							className={`tab-link tab-link-ltr ${
								tab === 'historico_vendas_produtos'
									? 'tab-link-active'
									: ''
							}`}
							onClick={() => setTab('historico_vendas_produtos')}
						>
							Histórico de vendas de produtos
						</h1>
						<h1
							className={`tab-link tab-link-ltr ${
								tab === 'historico_vendas_pacotes'
									? 'tab-link-active'
									: ''
							}`}
							onClick={() => setTab('historico_vendas_pacotes')}
						>
							Histórico de vendas de pacotes
						</h1>
					</div>
                    {
                        tab === 'produtos_pacotes' && id && (
                            <AdminDetalhesVendedorProdutosEPacotes userId={id} />
                        )
                    }
                    {
                        tab === 'historico_vendas_produtos' && detalhesVendedor && (
                            <AdminDetalhesVendedorVendaProdutos userId={id} vendedor={detalhesVendedor} />
                        )
                    }
                    {
                        tab === 'historico_vendas_pacotes' && detalhesVendedor && (
                            <AdminDetalhesVendedorVendaPacotes userId={id} vendedor={detalhesVendedor} />
                        )
                    }
				</div>
				<Link
					className='btn btn-secondary'
					style={{
						fontWeight: 'bold',
						height: 'fit-content',
						margin: '30px 0',
					}}
					to={'/admin/vendedores'}
				>
					Voltar
				</Link>
			</div>
		</main>
	);
};

export default AdminDetalhesVendedor;
