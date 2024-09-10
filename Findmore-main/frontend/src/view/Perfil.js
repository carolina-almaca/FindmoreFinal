import { Link } from "react-router-dom";
import LOGO from "../images/logo-horizontal.png";
import authService from "./auth.service";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import FormInput from "../components/InputText";
import Footer from "../components/Footer";
import ToastNotification from "../components/ToastNotification";
import axios from "axios";
import EditarIcon from '../images/pencil-white.svg';

export default function Perfil({ onLogout }) {
	const [showEditar, setShowEditar] = useState(false);
	const [newNome, setNewNome] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

	const user = authService.getCurrentUser();

	const handleShowToast = (message, variant) => {
		setToast({ show: true, message, variant });
	};

	const handleSaveEditar = async () => {
        try {
			await axios.put(
				`http://localhost:3001/utilizador/${user.idUtilizador}`,
				{
					...user,
					nomeU: newNome || user.nomeU,
					email: newEmail || user.email,
				}
			);

			handleShowToast('Utilizador editado com sucesso!', 'success');
			setShowEditar(false);
			setNewEmail("");
			setNewNome("");
			localStorage.setItem("user", JSON.stringify({
				idUtilizador: user.idUtilizador,
				nomeU: newNome || user.nomeU,
				email: newEmail || user.email,
				ativo: user.ativo,
				role: user.role,
				token: user.token,
			}));
		} catch (error) {
			handleShowToast('Ocorreu um erro ao editar o utilizador!', 'danger');
			setShowEditar();
			setNewEmail("");
			setNewNome("");
		}
    }

	const handleCloseToast = () => setToast({ ...toast, show: false });

	return (
		<main>
			<div className='navbar'>
				<img className='navbar-logo' src={LOGO} alt='Logo' />
				<div className='navbar-menu-lg'>
					<button
						className='btn btn-primary'
						onClick={() => onLogout()}
					>
						Sair
					</button>
				</div>
			</div>
            {
                <ToastNotification
                    show={toast.show}
                    handleClose={handleCloseToast}
                    toast={toast}
			/>
            }
            {
                showEditar && (
                    <Modal show={true} onHide={() => setShowEditar(false)} className='login-modal'>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Editar Perfil
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
								<Form.Group style={{ display: "grid" }}>
									<FormInput
										label='Nome'
										type='text'
										id='nomeU'
										helpBlockTxt=''
										onChange={(e) =>
											setNewNome(e.currentTarget.value)
										}
										defaultValue={user?.nomeU}
									/>
									<FormInput
										label='Email'
										type='text'
										id='email'
										helpBlockTxt=''
										onChange={(e) =>
											setNewEmail(e.currentTarget.value)
										}
										defaultValue={user?.email}
									/>
									<Button
										className='btn btn-secondary'
										onClick={() => handleSaveEditar()}
										style={{ justifySelf: "flex-end" }}
									>
										Guardar
									</Button>
								</Form.Group>
							</Form>
                        </Modal.Body>
                    </Modal>
                )
            }
			<div className='container-wrapper'>
				<div className='category-title-1'>
					<h1 style={{ fontWeight: 'bold' }}>PERFIL</h1>
					<hr />
				</div>
				<div className='perfil-vendedor-header'>
					<div>
						<span>{user.nomeU}</span>
						<span>{user.email}</span>
					</div>
					<button className='perfil-vendedor-header-editar' onClick={() => setShowEditar(true)}>
						<img src={EditarIcon} alt='' />
					</button>
				</div>
				<Link 
					className='btn btn-secondary'
					style={{
						fontWeight: 'bold',
						height: 'fit-content',
                        margin: '30px 0'
					}}
					to={'/'}
				>
					Voltar
				</Link>
			</div>
			<Footer />
		</main>
	);
}
