import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import FormInput from "./InputText";
import Logo2 from "../images/logo-2.png";
import { useEffect, useState } from "react";
import axios from "axios";
import authService from "../view/auth.service";

export default function PacoteModal({
	handleCloseModal,
	onPacoteCriado,
	editarPacote,
	produtosDisponiveis,
}) {
	const [message, setMessage] = useState("");
	const [nomePacote, setNomePacote] = useState(editarPacote?.nomePacote || "");
	const [valor, setValor] = useState(editarPacote?.valor || "");
	const [quantidadePacote, setQuantidate] = useState(editarPacote?.quantidadePacote || "");
	const [produtosPacote, setProdutosPacote] = useState([]);

	useEffect(() => {
		if (editarPacote) {
			const { produtos } = editarPacote;

			const versoes = produtos.map((p) => p.versaoPs);

			const produtosExistentes = versoes.map((v) => {
				return {
					idProduto: v.idProduto,
					idVersaoP: v.idVersaoP,
				}
			});

			setProdutosPacote(produtosExistentes);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onCriarPacote = async (e) => {
		e.preventDefault();

		const user = authService.getCurrentUser();

		if (user) {
			try {
				const res = await axios.post("http://localhost:3001/pacote", {
					nomePacote,
					valor,
					quantidadePacote,
					produtos: produtosPacote,
				});

				if (res === "" || res === false) return;

				handleCloseModal();
				onPacoteCriado();
			} catch (e) {
				if (e.response && e.response.data && e.response.data.error) {
					setMessage(e.response.data.error); 
				  } else {
					setMessage("Erro ao criar o pacote.");
				  }
			}
		}
	};

	const onEditarPacote = async (e) => {
		e.preventDefault();

		const user = authService.getCurrentUser();

		if (user) {
			try {
				const res = await axios.put(
					`http://localhost:3001/pacote/${editarPacote.idPacote}`,
					{
						nomePacote,
						valor,
						quantidadePacote,
						produtos: produtosPacote,
					}
				);

				if (res === "" || res === false) return;

				handleCloseModal();
				onPacoteCriado();
			} catch (e) {
				setMessage(e.message);
			}
		}
	};

	const handlePreco = (preco) => {
		// Replace comma with dot
		const standardizedPrice = preco.replace(",", ".");

		// Convert to number
		const priceNumber = parseFloat(standardizedPrice);

		// Check if the conversion was successful
		if (isNaN(priceNumber)) {
			setMessage("Preço inválido");
			return;
		}

		setMessage("");
		setValor(priceNumber);
	};

	const handleSelectionChange = (idProduto, idVersaoP) => {
		const produtoIdx = produtosPacote.findIndex((p) => p.idProduto === idProduto);
	
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
			<div>
			{`${produto.nomeP} - ${produto.miniDescricao} - ${produto.preco}€ - stock: ${produto.stock}`}
			{
				versoes.map((versao) => {
					return (
						<Form.Check
							type="checkbox"
							label={`Versão: ${versao.nomeVersaoP}`}
							checked={produtosPacote.some(
								(p) => p.idProduto === produto.idProduto && p.idVersaoP === versao.idVersaoP
							)}
							onChange={() => handleSelectionChange(produto.idProduto, versao.idVersaoP)}
							value={produto.idProduto}
							key={`option-${produto.idProduto}-versao-${versao.idVersaoP}`}
						/>
					)
				})
			}
		</div>
		)
	}

	return (
		<Modal show={true} onHide={handleCloseModal} className='login-modal'>
			<Modal.Header closeButton>
				<Modal.Title>
					{editarPacote ? "Editar Pacote" : "Novo Pacote"}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<img src={Logo2} alt='' />
				</Container>
				<Form>
					<Form.Group>
						<FormInput
							label='Nome Pacote'
							type='text'
							id='nomePacote'
							helpBlockTxt=''
							onChange={(e) =>
								setNomePacote(e.currentTarget.value)
							}
							defaultValue={editarPacote?.nomePacote}
						/>

						<FormInput
							label='Quantidade'
							type='number'
							id='quantidadePacote'
							helpBlockTxt=''
							onChange={(e) =>
								setQuantidate(e.currentTarget.value)
							}
							defaultValue={editarPacote?.quantidadePacote}
						/>
						<FormInput
							label='Valor'
							type='string'
							id='valor'
							helpBlockTxt=''
							onChange={(e) => handlePreco(e.currentTarget.value)}
							defaultValue={editarPacote?.valor}
						/>
                        <Form.Group>
                            <Form.Label>Produtos</Form.Label>
                            {
                                produtosDisponiveis.map((p) => {
									return renderVersoesProduto(p);
								})
                            }
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
								onClick={
									editarPacote
										? (e) => onEditarPacote(e)
										: (e) => onCriarPacote(e)
								}
                                disabled={!nomePacote || !valor || !quantidadePacote || produtosPacote.length === 0}
							>
								{editarPacote ? "Editar" : "Criar"}
							</Button>
						</Col>
					</Row>
				</Container>
			</Modal.Body>
		</Modal>
	);
}
