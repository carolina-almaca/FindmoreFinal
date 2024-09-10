import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import FormInput from './InputText';
import Logo2 from '../images/logo-2.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import authService from '../view/auth.service';

export default function OrcamentoPacotesModal({
	handleCloseModal,
	onOrcamentoCriado,
	produtosDisponiveis,
}) {
	const [message, setMessage] = useState('');
	const [nomePacote, setNomePacote] = useState('');
	const [quantidadePacote, setQuantidate] = useState('');
	const [produtosPacote, setProdutosPacote] = useState([]);
	const [vendedores, setVendedores] = useState([]);
	const [vendedorSelecionado, setVendedorSelecionado] = useState(null);
	const [produtosVendedorSelecionado, setProdutosVendedorSelecionado] =
		useState([]);

	useEffect(() => {
		const getVendedores = async () => {
			try {
				const { data } = await axios.get(
					`http://localhost:3001/utilizador/vendedores/count`
				);

				if (data && data.message === 'O token não é válido.') {
					authService.logout();
				}

				const vendedoresAtivos = data.vendedores.filter(
					(v) => v.ativo === true
				);
				const vendedorSelecionadoInicial = vendedoresAtivos[0];

				setVendedores(vendedoresAtivos);
				setVendedorSelecionado(vendedorSelecionadoInicial);
			} catch (error) {}
		};

		getVendedores();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (vendedorSelecionado) {
			const produtosVendedorSelecionadoInicial = produtosDisponiveis.filter(
				(p) => p.idUtilizador === vendedorSelecionado.idUtilizador
			);
			setProdutosVendedorSelecionado(produtosVendedorSelecionadoInicial);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [vendedorSelecionado]);

	const onCriarOrcamento = async (e) => {
		e.preventDefault();

		const user = authService.getCurrentUser();

		if (user) {
			try {
				const res = await axios.post(
					'http://localhost:3001/orcamento',
					{
						idUtilizador: user.idUtilizador,
						nomeO: nomePacote,
						quantidade: quantidadePacote,
						estado: 'analise',
						justificacao: '',
						preco: null,
						dataValidade: null,
						produtos: produtosPacote,
					}
				);

				if (res === '' || res === false) return;

				handleCloseModal();
				onOrcamentoCriado();
			} catch (e) {
				if (e.response && e.response.data && e.response.data.error) {
					setMessage(e.response.data.error);
				} else {
					setMessage('Erro ao criar o orçamento.');
				}
			}
		}
	};

	const handleSelectionChange = (idProduto, idVersaoP) => {
		const produtoIdx = produtosPacote.findIndex(
			(p) => p.idProduto === idProduto
		);

		if (produtoIdx !== -1) {
			const produto = produtosPacote[produtoIdx];

			// Verifica se a versão desmarcada é a única e a mesma no array
			if (produto.idVersaoP === idVersaoP) {
				const newProdutosPacote = [...produtosPacote];
				newProdutosPacote.splice(produtoIdx, 1); // Remove o produto do array
				setProdutosPacote(newProdutosPacote);
			} else {
				// Se a versão é diferente ou há múltiplas versões, substitui a versão
				const newProduto = { ...produto, idVersaoP };
				const newProdutosPacote = [...produtosPacote];
				newProdutosPacote[produtoIdx] = newProduto;
				setProdutosPacote(newProdutosPacote);
			}
		} else {
			// Adiciona o produto com a nova versão se não existir
			setProdutosPacote((prev) => {
				return [...prev, { idProduto, idVersaoP }];
			});
		}
	};

	const renderVersoesProduto = (produto) => {
		const versoes = produto.versaoPs;

		return (
			<div key={`p-${produto.nomeP}-${produto.preco}`}>
				{`${produto.nomeP} - ${produto.miniDescricao} - ${produto.preco}€`}
				{versoes.map((versao) => {
					return (
						<Form.Check
							type='checkbox'
							label={`Versão: ${versao.nomeVersaoP}`}
							checked={produtosPacote.some(
								(p) =>
									p.idProduto === produto.idProduto &&
									p.idVersaoP === versao.idVersaoP
							)}
							onChange={() =>
								handleSelectionChange(
									produto.idProduto,
									versao.idVersaoP
								)
							}
							value={produto.idProduto}
							key={`option-${produto.idProduto}-versao-${versao.idVersaoP}`}
						/>
					);
				})}
			</div>
		);
	};

	const handleVendedorSelecionadoChange = (vendedorId) => {
		const vendedor = vendedores.find((v) => Number(v.idUtilizador) === Number(vendedorId));

		setVendedorSelecionado(vendedor);
	}

	return (
		<Modal show={true} onHide={handleCloseModal} className='login-modal'>
			<Modal.Header closeButton>
				<Modal.Title>
					<h1>Novo Orçamento</h1>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<img src={Logo2} alt='' />
				</Container>
				<Form>
					<Form.Group>
						<FormInput
							label='Nome Orçamento'
							type='text'
							id='nomePacote'
							helpBlockTxt=''
							onChange={(e) =>
								setNomePacote(e.currentTarget.value)
							}
						/>

						<FormInput
							label='Quantidade'
							type='number'
							id='quantidadePacote'
							helpBlockTxt=''
							onChange={(e) =>
								setQuantidate(e.currentTarget.value)
							}
						/>

						<Form.Group
							className='mb-3'
							controlId='exampleForm.ControlInput1'
						>
							<Form.Label>Vendedor</Form.Label>
							<Form.Select
								aria-label='Vendedor'
								onChange={(e) => handleVendedorSelecionadoChange(e.currentTarget.value)}
								defaultValue={vendedorSelecionado}
							>
								{vendedores.map((v) => {
									return (
										<option
											value={v.idUtilizador}
											key={`vendedor-${v.idUtilizador}-${v.nomeU}`}
										>
											{v.nomeU}
										</option>
									);
								})}
							</Form.Select>
						</Form.Group>

						<Form.Group>
							<Form.Label>Produtos</Form.Label>
							{produtosVendedorSelecionado.map((p) => {
								return renderVersoesProduto(p);
							})}
						</Form.Group>
					</Form.Group>
					{message && (
						<div className='form-group'>
							<div className='alert alert-danger' role='alert'>
								{message}
							</div>
						</div>
					)}
				</Form>
				<Container className='form-container'>
					<Row className='group-btns'>
						<Col className='d-grid'>
							<Button
								className='btn-secondary'
								size='lg'
								onClick={(e) => onCriarOrcamento(e)}
								disabled={
									!nomePacote ||
									!quantidadePacote ||
									produtosPacote.length === 0
								}
							>
								{'Criar Orçamento'}
							</Button>
						</Col>
					</Row>
				</Container>
			</Modal.Body>
		</Modal>
	);
}
