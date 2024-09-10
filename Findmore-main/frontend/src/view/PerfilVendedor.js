import Footer from '../components/Footer';
import LOGO from '../images/logo-horizontal.png';
import EditarIcon from '../images/pencil-white.svg';
import authService from './auth.service';
import '../styles/perfilVendedor.css';
import { useEffect, useState } from 'react';
import PaginatedTable from '../components/PaginatedTable';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';
import FormInput from '../components/InputText';
import ToastNotification from '../components/ToastNotification';
import { Link } from 'react-router-dom';
import OrcamentosVendedor from '../components/OrcamentosVendedor';

const PerfilVendedor = ({ onLogout }) => {
	const [tab, setTab] = useState('historico_vendas_produtos');
	const [produtos, setProdutos] = useState([]);
	const [produtosTableData, setProdutosTableData] = useState([]);
	const [pacotes, setPacotes] = useState([]);
	const [pacotesTableData, setPacotesTableData] = useState([]);
    const [showEditar, setShowEditar] = useState(false);
    const [newNome, setNewNome] = useState("");
	const [newEmail, setNewEmail] = useState("");
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

	const user = authService.getCurrentUser();

	useEffect(() => {
		if (user) {
			getProdutos();
			getPacotes();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getProdutos = async () => {
		try {
			const { data: produtosComprados } = await axios.get(
				`http://localhost:3001/compra/produtosVendidos/${user.idUtilizador}`
			);
			setProdutos(produtosComprados);
			setProdutosTableData(parseTableData(produtosComprados));
		} catch (error) {}
	};

	const getPacotes = async () => {
		try {
			const { data: pacotesComprados } = await axios.get(
				`http://localhost:3001/compra/pacotesVendidos/${user.idUtilizador}`
			);
			setPacotes(pacotesComprados);
			setPacotesTableData(parseTableDataPacotes(pacotesComprados));
		} catch (error) {}
	};

	const onSearchProdutos = (e) => {
		const searchValue = String(e.target.value);

        if (searchValue !== '') {
			const filteredData = produtosTableData.filter(
				(data) =>
					String(data.id).includes(searchValue.toLowerCase()) ||
					data.produto.toLowerCase().includes(searchValue) ||
					data.data.toLowerCase().includes(searchValue) ||
					data.comprador.toLowerCase().includes(searchValue) ||
					data.versao.toLowerCase().includes(searchValue) ||
					data.comentario.toLowerCase().includes(searchValue)
			);

			setProdutosTableData(filteredData);
		} else {
			setProdutosTableData(
				parseTableData(produtos)
			);
		}
	};

    const onSearchPacotes = (e) => {
		const searchValue = String(e.target.value);

        if (searchValue !== '') {
			const filteredData = pacotesTableData.filter(
				(data) =>
					String(data.id).includes(searchValue.toLowerCase()) ||
					data.pacote.toLowerCase().includes(searchValue) ||
					data.data.toLowerCase().includes(searchValue) ||
					data.comprador.toLowerCase().includes(searchValue) ||
					data.comentario.toLowerCase().includes(searchValue)
			);

			setPacotesTableData(filteredData);
		} else {
			setPacotesTableData(
				parseTableDataPacotes(pacotes)
			);
		}
	};

	const parseTableData = (data) => {
		if (!data) return [];
		const parsedData = data.map((d) => {
			return {
				id: d.Compra.idCompra,
				produto: d.Produto.nomeP,
				data: d.Compra.dataCompra,
				comprador: d.Comprador.nomeU,
				versao: d.VersaoP.nomeVersaoP,
				feedback: d.Feedback.avaliacao,
                comentario: d.Feedback.comentario || 'N/A'
			};
		});

        return parsedData;
	};

    const parseTableDataPacotes = (data) => {
		if (!data) return [];
		const parsedData = data.map((d) => {
			return {
				id: d.idCompra,
				pacote: d.pacote[0].nomePacote,
				data: d.dataCompra,
				comprador: d.comprador,
				feedback: d.feedback.avaliacao,
                comentario: d.feedback.comentario || 'N/A'
			};
		});

        return parsedData;
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

    const handleShowToast = (message, variant) => {
		setToast({ show: true, message, variant });
	};

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
				<div className='tab-links'>
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
					<h1
						className={`tab-link tab-link-ltr ${
							tab === 'orcamentos'
								? 'tab-link-active'
								: ''
						}`}
						onClick={() => setTab('orcamentos')}
					>
						Orçamentos
					</h1>
				</div>
				{tab === 'historico_vendas_produtos' && produtos && (
					<div className='admin-compradores-table-wrapper'>
						<div className='admin-compradores-table-wrapper-header'>
							<h1>Histórico de vendas de produtos</h1>
							<div className='search-container'>
								<input
									className='form-control rounded-pill'
									type='search'
									id='search-input'
									placeholder='Pesquisar'
									onChange={(e) => onSearchProdutos(e)}
								/>
								<FaSearch className='search-icon' />
							</div>
						</div>
						<PaginatedTable
							tableHeaders={[
								'Id Compra',
								'Produto',
								'Data',
								'Comprador',
								'Versão',
								'Feedback',
								'Comentários',
							]}
                            tableHeadersKeys={[
                                {
                                    key: 'id',
                                    label: "Id Compra"
                                },
                                {
                                    key: 'produto',
                                    label: "Produto"
                                },
                                {
                                    key: 'data',
                                    label: "Data"
                                },
                                {
                                    key: 'comprador',
                                    label: "Comprador"
                                },
                                {
                                    key: 'versao',
                                    label: "Versão"
                                },
                                {
                                    key: 'feedback',
                                    label: "Feedback"
                                },
                                {
                                    key: 'comentario',
                                    label: "Comentários"
                                }
                            ]}
							tableData={produtosTableData}
							rowsPerPage={5}
							customTableClassName='admin-compradores-table'
						/>
					</div>
				)}

                {tab === 'historico_vendas_pacotes' && pacotesTableData && (
					<div className='admin-compradores-table-wrapper'>
						<div className='admin-compradores-table-wrapper-header'>
							<h1>Histórico de vendas de pacotes</h1>
							<div className='search-container'>
								<input
									className='form-control rounded-pill'
									type='search'
									id='search-input'
									placeholder='Pesquisar'
									onChange={(e) => onSearchPacotes(e)}
								/>
								<FaSearch className='search-icon' />
							</div>
						</div>
						<PaginatedTable
							tableHeaders={[
								'Id Compra',
								'Pacote',
								'Data',
								'Comprador',
								'Feedback',
								'Comentários',
							]}
                            tableHeadersKeys={[
                                {
                                    key: 'id',
                                    label: "Id Compra"
                                },
                                {
                                    key: 'pacote',
                                    label: "Pacote"
                                },
                                {
                                    key: 'data',
                                    label: "Data"
                                },
                                {
                                    key: 'comprador',
                                    label: "Comprador"
                                },
                                {
                                    key: 'feedback',
                                    label: "Feedback"
                                },
                                {
                                    key: 'comentario',
                                    label: "Comentários"
                                }
                            ]}
							tableData={pacotesTableData}
							rowsPerPage={5}
							customTableClassName='admin-compradores-table'
						/>
					</div>
				)}
				{tab === 'orcamentos' && (
					<OrcamentosVendedor idVendedor={user.idUtilizador} />
				)}
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
};

export default PerfilVendedor;
