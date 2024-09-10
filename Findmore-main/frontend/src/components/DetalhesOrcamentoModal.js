import Logo2 from '../images/logo-2.png';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import FormInput from './InputText';
import { useState } from 'react';
import axios from 'axios';

const meses = [
	'Janeiro',
	'Fevereiro',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro',
];

const DetalhesOrcamentoModal = ({
	handleCloseModal,
	orcamento,
	handleOrcamentoAceiteOuRejeitado,
	isComprador,
}) => {
	const { produtos } = orcamento;
	const [message, setMessage] = useState('');
	const [precoTotal, setPrecoTotal] = useState('');
	const [observacao, setObservacao] = useState('');
	const [dataValidade, setDataValidade] = useState('');

	const handlePrecoTotal = (preco) => {
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
		setPrecoTotal(priceNumber);
	};

	const onAceitarOrcamento = async () => {
		try {
			const res = await axios.put(
				`http://localhost:3001/orcamento/${orcamento.idOrcamento}`,
				{
					estado: 'aceite',
					justificacao: observacao || null,
					preco: precoTotal || null,
					dataValidade: dataValidade || null,
				}
			);

			if (res === '' || res === false) return;

			handleCloseModal();
			handleOrcamentoAceiteOuRejeitado();
		} catch (e) {
			if (e.response && e.response.data && e.response.data.error) {
				setMessage(e.response.data.error);
			} else {
				setMessage('Erro no orçamento.');
			}
		}
	};

	const onRejeitarOrcamento = async () => {
		try {
			const res = await axios.put(
				`http://localhost:3001/orcamento/${orcamento.idOrcamento}`,
				{
					estado: 'recusado',
					justificacao: observacao || null,
					preco: precoTotal | null,
					dataValidade: dataValidade | null,
				}
			);

			if (res === '' || res === false) return;

			handleCloseModal();
			handleOrcamentoAceiteOuRejeitado();
		} catch (e) {
			if (e.response && e.response.data && e.response.data.error) {
				setMessage(e.response.data.error);
			} else {
				setMessage('Erro no orçamento.');
			}
		}
	};

	function validarData(input) {
		// Expressão regular para verificar o formato yyyy-mm-dd
		const regex = /^\d{4}-\d{2}-\d{2}$/;

		// Verifica se a data corresponde ao formato
		if (!regex.test(input)) {
			return false;
		}

		// Divide a data em partes
		const [ano, mes, dia] = input.split('-').map(Number);

		// Cria uma data a partir dos componentes para verificar se é válida
		const data = new Date(ano, mes - 1, dia);

		// Verifica se os componentes estão corretos e se a data é válida
		if (
			data &&
			data.getFullYear() === ano &&
			data.getMonth() + 1 === mes &&
			data.getDate() === dia
		) {
			return true;
		}

		return false;
	}

	const handleDataValidadeChange = (e) => {
		const data = e.currentTarget.value;

		if (data) {
			const isvalid = validarData(data);

			if (!isvalid) {
				setMessage(
					'Verifique o formato da data de validade: (YYYY-MM-DD)'
				);
				return;
			} else {
				setDataValidade(data);
				setMessage('');
				return;
			}
		}

		setMessage('');
	};

	const renderDataCol = (value) => {
		const date = new Date(value);
		return `${date.getDate()} de ${
			meses[date.getUTCMonth()]
		}, ${date.getFullYear()}`;
	};

	return (
		<Modal show={true} onHide={handleCloseModal} className='login-modal'>
			<Modal.Header closeButton>
				<Modal.Title>
					<h1>Orçamento</h1>
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
							onChange={(e) => {}}
							disabled
							placeholder={orcamento.nomeO}
						/>

						<FormInput
							label='Quantidade'
							type='number'
							id='quantidadePacote'
							helpBlockTxt=''
							onChange={(e) => {}}
							disabled
							placeholder={orcamento.quantidade}
						/>

						<FormInput
							label='Valor'
							type='string'
							id='valor'
							helpBlockTxt=''
							onChange={(e) =>
								handlePrecoTotal(e.currentTarget.value)
							}
							disabled={isComprador || orcamento.estado !== 'analise'}
							placeholder={
								orcamento.estado !== 'analise'
									? `${orcamento.preco}€`
									: ''
							}
						/>

						<FormInput
							label='Observação'
							type='string'
							id='observacao'
							helpBlockTxt=''
							onChange={(e) =>
								setObservacao(e.currentTarget.value)
							}
							placeholder={orcamento.justificacao}
							disabled={isComprador || orcamento.estado !== 'analise'}
						/>

						<FormInput
							label='Data de validade'
							type='string'
							id='dataValidade'
							helpBlockTxt=''
							onChange={(e) => handleDataValidadeChange(e)}
							placeholder={
								orcamento.dataValidade
									? renderDataCol(orcamento.dataValidade)
									: 'YYYY-MM-DD'
							}
							disabled={isComprador || orcamento.estado !== 'analise'}
						/>

						<Form.Group>
							<Form.Label>Produtos</Form.Label>
							{produtos.map((p) => {
								return (
									<h1
										key={`p-${p.nomeP}-${p.idProduto}`}
										style={{
											fontSize: '16px',
										}}
									>{`${p.nomeP} - ${p.preco}€ - Stock: ${p.stock} - Versão: ${p.versaoPs[0].nomeVersaoP}`}</h1>
								);
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
					{!isComprador && (
						<Row style={{ flexDirection: 'row', gap: 0 }}>
							<Col style={{ width: 'auto' }}>
								<Button
									className='btn-secondary'
									size='sm'
									onClick={(e) => onAceitarOrcamento(e)}
									disabled={!precoTotal}
								>
									{'Aceitar Orçamento'}
								</Button>
							</Col>
							<Col style={{ width: 'auto' }}>
								<Button
									className='btn-secondary btn-secondary-danger'
									size='sm'
									onClick={(e) => onRejeitarOrcamento(e)}
									disabled={!observacao}
								>
									{'Rejeitar Orçamento'}
								</Button>
							</Col>
						</Row>
					)}
					{isComprador && (
						<Row>
							<Col style={{ width: '100%' }}>
							<Button
								className='btn-secondary'
								size='sm'
								onClick={(e) => handleCloseModal()}
								style={{ width: '100%' }}
							>
								Ok
							</Button>
						</Col>
						</Row>
					)}
				</Container>
			</Modal.Body>
		</Modal>
	);
};

export default DetalhesOrcamentoModal;
