import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import FormInput from './InputText';
import Logo2 from '../images/logo-2.png';
import { useState } from 'react';
import axios from 'axios';
import authService from '../view/auth.service';

export default function ProdutoModal({
	handleCloseModal,
	onProdutoCriado,
	editarProduto,
}) {
	const [message, setMessage] = useState('');
	const [nomeP, setNomeP] = useState(editarProduto?.nomeP || '');
	const [miniDescricao, setMiniDescricao] = useState(
		editarProduto?.miniDescricao || ''
	);
	const [descricao, setDescricao] = useState(editarProduto?.descricao || '');
	const [categoria, setCategoria] = useState(
		editarProduto?.categoria || 'performance'
	);
	const [licenca, setLicenca] = useState(editarProduto?.licenca || '');
	const [stock, setStock] = useState(editarProduto?.stock || 1);
	const [preco, setPreco] = useState(editarProduto?.preco || '');
	const [versao, setVersao] = useState(editarProduto?.versaoP || '');
	// const [imagem, setImage] = useState(null);

	const onCriarProduto = async (e) => {
		e.preventDefault();

		const user = authService.getCurrentUser();

		if (user) {
			try {
				const res = await axios.post(
					'http://localhost:3001/produto/criar',
					{
						nomeP,
						miniDescricao,
						descricao,
						categoria,
						preco,
						stock,
						licenca,
						versaoP: versao,
						idUtilizador: user.idUtilizador,
						dataVersao: new Date().toISOString(),
						// imagem,
					}
				);

				if (res === '' || res === false) return;

				handleCloseModal();
				onProdutoCriado();
			} catch (e) {
				setMessage(e.message);
			}
		}
	};

	const onEditarProduto = async (e) => {
		e.preventDefault();

		const user = authService.getCurrentUser();

		if (user) {
			try {
				const res = await axios.put(
					`http://localhost:3001/produto/${editarProduto.idProduto}`,
					{
						nomeP,
						miniDescricao,
						descricao,
						categoria,
						preco,
						stock,
						licenca,
						idUtilizador: user.idUtilizador,
						// imagem,
					}
				);

				if (res === '' || res === false) return;

				handleCloseModal();
				onProdutoCriado();
			} catch (e) {
				setMessage(e.message);
			}
		}
	};

	const handlePreco = (preco) => {
		// Replace comma with dot
		const standardizedPrice = preco.replace(',', '.');

		// Convert to number
		const priceNumber = parseFloat(standardizedPrice);

		// Check if the conversion was successful
		if (isNaN(priceNumber)) {
			setMessage('Preço inválido');
			return;
		}

		setMessage('');
		setPreco(priceNumber);
	};

	const handleStock = (stockValue) => {
		if (stockValue <= 1) {
			setStock(1);
		} else {
			setStock(stockValue);
		}
	};

	// const handleImageChange = (e) => {
	//     const file = e.target.files[0];
	//     if (file) {
	//       const reader = new FileReader();
	//       reader.onloadend = () => {
	//         setImage(reader.result.split(',')[1]); // Apenas a parte base64 da string
	//       };
	//       reader.readAsDataURL(file);
	//     } else {
	//       setImage(null);
	//     }
	//   };

	return (
		<Modal show={true} onHide={handleCloseModal} className='login-modal'>
			<Modal.Header closeButton>
				<Modal.Title>
					{editarProduto ? 'Editar Produto' : 'Novo Produto'}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<img src={Logo2} alt='' />
				</Container>
				<Form>
					<Form.Group>
						<FormInput
							label='Nome Produto'
							type='text'
							id='nomeP'
							helpBlockTxt=''
							onChange={(e) => setNomeP(e.currentTarget.value)}
							defaultValue={editarProduto?.nomeP}
						/>
						<FormInput
							label='Mini Descrição'
							type='text'
							id='miniDescricao'
							helpBlockTxt=''
							onChange={(e) =>
								setMiniDescricao(e.currentTarget.value)
							}
							defaultValue={editarProduto?.miniDescricao}
						/>
						<FormInput
							label='Descrição'
							type='text'
							id='descricao'
							helpBlockTxt=''
							onChange={(e) =>
								setDescricao(e.currentTarget.value)
							}
							defaultValue={editarProduto?.descricao}
						/>
						{!editarProduto && (
							<FormInput
								label='Versão'
								type='text'
								id='versaoP'
								helpBlockTxt=''
								onChange={(e) =>
									setVersao(e.currentTarget.value)
								}
							/>
						)}
						<Form.Group
							className='mb-3'
							controlId='exampleForm.ControlInput1'
						>
							<Form.Label>Categoria</Form.Label>
							<Form.Select
								aria-label='Categoria'
								onChange={(e) =>
									setCategoria(e.currentTarget.value)
								}
								defaultValue={editarProduto?.categoria}
							>
								<option value='performance'>Performance</option>
								<option value='fotografia'>Fotografia</option>
								<option value='ferramenta'>Ferramenta</option>
							</Form.Select>
						</Form.Group>
						<FormInput
							label='Licença'
							type='text'
							id='licenca'
							helpBlockTxt=''
							onChange={(e) => setLicenca(e.currentTarget.value)}
							defaultValue={editarProduto?.licenca}
						/>
						<FormInput
							label='Stock'
							type='number'
							id='stock'
							helpBlockTxt=''
							onChange={(e) => handleStock(e.currentTarget.value)}
							defaultValue={editarProduto?.stock}
						/>
						<FormInput
							label='Preço'
							type='string'
							id='preco'
							helpBlockTxt=''
							onChange={(e) => handlePreco(e.currentTarget.value)}
							defaultValue={editarProduto?.preco}
						/>
						{/* <FormInput
							label='Imagem'
							id='imagem'
							type='file'
							onChange={(e) => handleImageChange(e)}
							accept='image/*'
						/> */}
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
									editarProduto
										? (e) => onEditarProduto(e)
										: (e) => onCriarProduto(e)
								}
							>
								{editarProduto ? 'Editar' : 'Criar'}
							</Button>
						</Col>
					</Row>
				</Container>
			</Modal.Body>
		</Modal>
	);
}
