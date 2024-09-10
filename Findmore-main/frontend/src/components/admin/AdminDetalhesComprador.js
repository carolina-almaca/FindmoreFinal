import { Link, useParams } from 'react-router-dom';
import AdminNavbar from '../AdminNavbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ToastNotification from '../ToastNotification';
import { Button, Form, Modal } from 'react-bootstrap';
import FormInput from '../InputText';
import EditarIcon from '../../images/pencil-white.svg';
import ConfirmationDialog from '../ConfirmationDialog';
import AdminDetalhesCompradorProdutos from './AdminDetalhesCompradorProdutos';
import AdminDetalhesCompradorPacotes from './AdminDetalhesCompradorPacotes';

const AdminDetalhesComprador = ({ onLogout }) => {
	const { id } = useParams();
	const [detalhesComprador, setDetalhesComprador] = useState(null);
	const [showEditar, setShowEditar] = useState(false);
	const [newNome, setNewNome] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [toast, setToast] = useState({
		show: false,
		message: '',
		variant: 'success',
	});
	const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

	useEffect(() => {
		if (id) {
			const fetchPacote = async () => {
				try {
					const { data } = await axios.get(
						`http://localhost:3001/utilizador/${id}`
					);
					setDetalhesComprador(data);
				} catch (error) {}
			};

			fetchPacote();
		}
	}, [id]);

	const handleSaveEditar = async () => {
		try {
			await axios.put(`http://localhost:3001/utilizador/${id}`, {
				...detalhesComprador,
				nomeU: newNome || detalhesComprador.nomeU,
				email: newEmail || detalhesComprador.email,
			});

			handleShowToast('Utilizador editado com sucesso!', 'success');
			setShowEditar(false);
			setNewEmail('');
			setNewNome('');

			setDetalhesComprador({
				...detalhesComprador,
				nomeU: newNome || detalhesComprador.nomeU,
				email: newEmail || detalhesComprador.email,
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
				...detalhesComprador,
				ativo: !detalhesComprador.ativo,
			});

			handleShowToast(
				detalhesComprador?.ativo
					? 'Utilizador desativado com sucesso'
					: 'Utilizador ativado com sucesso',
				'success'
			);

			setDetalhesComprador({
				...detalhesComprador,
				ativo: !detalhesComprador.ativo,
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
					detalhesComprador?.ativo
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
									defaultValue={detalhesComprador?.nomeU}
								/>
								<FormInput
									label='Email'
									type='text'
									id='email'
									helpBlockTxt=''
									onChange={(e) =>
										setNewEmail(e.currentTarget.value)
									}
									defaultValue={detalhesComprador?.email}
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
							<span>{detalhesComprador?.nomeU}</span>
							<span>{detalhesComprador?.email}</span>
						</div>
						<div className='perfil-vendedor-header-actions'>
							<button
								className='perfil-vendedor-header-ativar-btn'
								onClick={onAtivarDesativarClick}
							>
								{detalhesComprador?.ativo
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
					{
						detalhesComprador && (
							<AdminDetalhesCompradorProdutos userId={id} comprador={detalhesComprador} />
						)
					}
					{
						detalhesComprador && (
							<AdminDetalhesCompradorPacotes userId={id} comprador={detalhesComprador} />
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
					to={'/admin/compradores'}
				>
					Voltar
				</Link>
			</div>
		</main>
	);
};

export default AdminDetalhesComprador;
