import React, { useEffect, useState } from 'react';
import ProductPerformanceImage from '../images/product-1.png';
import ProductFotografiaImage from '../images/product-2.png';
import ProductFerramentaImage from '../images/product-3.png';
import axios from 'axios';
import ToastNotification from './ToastNotification';
import ConfirmationDialog from './ConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import DetalhesOrcamentoModal from './DetalhesOrcamentoModal';

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

const OrcamentosComprador = ({ idComprador, onLogout }) => {
	const [toast, setToast] = useState({
		show: false,
		message: '',
		variant: 'success',
	});
	const [orcamentos, setOrcamentos] = useState([]);
	const [orcamentosFiltrados, setOrcamentosFiltrados] = useState([]);
	const [showApagarDialog, setShowApagarDialog] = useState(null);
	const [filtro, setFiltro] = useState('');
	const [showDetalhesOrcamento, setShowDetalhesOrcamento] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		getOrcamentos();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (filtro === 'analise') {
			setOrcamentosFiltrados(
				orcamentos.filter((o) => o.estado === 'analise')
			);
		}

		if (filtro === 'aceite') {
			setOrcamentosFiltrados(
				orcamentos.filter((o) => o.estado === 'aceite')
			);
		}

		if (filtro === 'concluido') {
			setOrcamentosFiltrados(
				orcamentos.filter((o) => o.estado === 'concluido')
			);
		}

		if (filtro === 'expirado') {
			setOrcamentosFiltrados(
				orcamentos.filter((o) => o.estado === 'expirado')
			);
		}

		if (filtro === 'rejeitado') {
			setOrcamentosFiltrados(
				orcamentos.filter((o) => o.estado === 'rejeitado')
			);
		}

		if (!filtro) {
			setOrcamentosFiltrados(orcamentos);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filtro]);

	const getOrcamentos = async () => {
		try {
			const { data } = await axios.get(
				`http://localhost:3001/orcamento/utilizador/${idComprador}`
			);
			setOrcamentos(data);
			setOrcamentosFiltrados(data);
		} catch (error) {}
	};

	const onApagarOrcamento = async (idOrcamento) => {
		try {
			await axios.delete(
				`http://localhost:3001/orcamento/${idOrcamento}`
			);

			handleShowToast('Orçamento apagado com sucesso!', 'success');
			setShowApagarDialog(null);
			getOrcamentos();
		} catch (error) {
			handleShowToast('Ocorreu um erro ao apagar o orçamento!', 'danger');
			setShowApagarDialog(null);
		}
	};

	const onComprarOrcamento = async (orcamento) => {
		try {
			const { data: pacoteCriado } = await axios.post(
				'http://localhost:3001/pacote/pacoteOrcamento',
				{
					nomePacote: orcamento.nomeO,
					valor: orcamento.preco,
					quantidadePacote: orcamento.quantidade,
					produtos: orcamento.produtos,
					orcamento: true,
					idOrcamento: orcamento.idOrcamento,
				}
			);

			if (pacoteCriado) {
				navigate(`/comprar-pacote/${pacoteCriado.idPacote}`);
			}
		} catch (e) {
			if (e.response && e.response.data && e.response.data.error) {
				handleShowToast(e.response.data.error, 'danger');
			} else {
				handleShowToast(
					'Erro ao seguir com a compra do orçamento',
					'danger'
				);
			}
		}
	};

	const getProdutoImage = (produto) => {
		if (produto.categoria === 'performance') {
			return ProductPerformanceImage;
		}

		if (produto.categoria === 'fotografia') {
			return ProductFotografiaImage;
		}

		if (produto.categoria === 'ferramenta') {
			return ProductFerramentaImage;
		}

		return produto;
	};

	const getProdutoBgColor = (produto) => {
		const categoriaProduto = produto.categoria;
		let cardBgColor = '';
		if (categoriaProduto === 'performance') {
			cardBgColor = '#FFEBF8';
		}

		if (categoriaProduto === 'fotografia') {
			cardBgColor = '#E7F6FB';
		}

		if (categoriaProduto === 'ferramenta') {
			cardBgColor = '#EDEEF6';
		}

		return cardBgColor;
	};

	const renderDataCol = (value) => {
		const date = new Date(value);
		return `${date.getDate()} de ${
			meses[date.getUTCMonth()]
		}, ${date.getFullYear()}`;
	};

	const renderOrcamentoHeader = (orcamento) => {
		const { nomeO, preco, estado, dataValidade, justificacao } = orcamento;
		if (estado === 'analise') return `${nomeO} - Em análise`;
		if (estado === 'aceite')
			return `${nomeO} - Aceite - Valor: ${Number(preco).toFixed(2)}€ ${
				dataValidade
					? `- Expira em: ${renderDataCol(dataValidade)}`
					: ''
			}`;
		if (estado === 'concluido') return `${nomeO} - Compra efetuada`;
		if (estado === 'recusado')
			return `${nomeO} - Recusado - Motivo: ${justificacao}`;
		if (estado === 'expirado') return `${nomeO} - Expirado`;
	};

	const handleShowToast = (message, variant) => {
		setToast({ show: true, message, variant });
	};

	const handleCloseToast = () => setToast({ ...toast, show: false });

	const handleFiltroClick = (tipoFiltro) => {
		if (filtro === tipoFiltro) {
			setFiltro('');
			return;
		}

		setFiltro(tipoFiltro);
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
			<ToastNotification
				show={toast.show}
				handleClose={handleCloseToast}
				toast={toast}
			/>
			<ConfirmationDialog
				show={showApagarDialog}
				handleClose={() => setShowApagarDialog(false)}
				handleConfirm={() => onApagarOrcamento(showApagarDialog)}
				message='Apagar este orçamento?'
			/>

			{showDetalhesOrcamento && (
				<DetalhesOrcamentoModal
					handleCloseModal={() => setShowDetalhesOrcamento(null)}
					orcamento={showDetalhesOrcamento}
					handleOrcamentoAceiteOuRejeitado={() => {}}
					isComprador={true}
				/>
			)}

			<div className='filtros-chips'>
				<button
					onClick={() => handleFiltroClick('analise')}
					className={filtro === 'analise' ? 'selected' : ''}
				>
					Análise
				</button>
				<button
					onClick={() => handleFiltroClick('aceite')}
					className={filtro === 'aceite' ? 'selected' : ''}
				>
					Aceite
				</button>
				<button
					onClick={() => handleFiltroClick('concluido')}
					className={filtro === 'concluido' ? 'selected' : ''}
				>
					Concluído
				</button>
				<button
					onClick={() => handleFiltroClick('expirado')}
					className={filtro === 'expirado' ? 'selected' : ''}
				>
					Expirado
				</button>
				<button
					onClick={() => handleFiltroClick('rejeitado')}
					className={filtro === 'rejeitado' ? 'selected' : ''}
				>
					Rejeitado
				</button>
			</div>

			{orcamentosFiltrados.length === 0 && (
				<h1 style={{ fontSize: '22px' }}>Não existem orçamentos.</h1>
			)}
			{orcamentosFiltrados.length > 0 &&
				orcamentosFiltrados.map((orcamento) => {
					const { produtos, estado } = orcamento;
					return (
						<div
							className='comprador-pacote-wrapper'
							key={`orcament-${orcamento.nomeO}`}
						>
							<div className='comprador-pacote-header'>
								<button
									className='btn'
									onClick={() =>
										setShowDetalhesOrcamento(orcamento)
									}
								>
									<h1 style={{ textDecoration: 'underline' }}>
										{renderOrcamentoHeader(orcamento)}
									</h1>
								</button>
								<div>
									{estado === 'aceite' && (
										<button
											className='btn btn-secondary'
											onClick={() =>
												onComprarOrcamento(orcamento)
											}
											style={{ margin: '0 10px' }}
										>
											Comprar
										</button>
									)}
									{estado !== 'concluido' && (
										<button
											className='btn btn-secondary btn-secondary-danger '
											onClick={() =>
												setShowApagarDialog(
													orcamento.idOrcamento
												)
											}
										>
											Cancelar
										</button>
									)}
								</div>
							</div>
							<div className='comprador-pacotes-produtos'>
								{produtos.map((p, idx) => {
									return (
										<React.Fragment
											key={`pacote-produto-${p.id}-${idx}`}
										>
											<div
												className='comprador-pacotes-produtos-produto'
												key={`produto-${p.idProduto}`}
												style={{
													backgroundColor:
														getProdutoBgColor(p),
												}}
											>
												<div className='comprador-pacotes-produtos-produto-wrapper'>
													<img
														src={getProdutoImage(p)}
														alt=''
														width={90}
														height={80}
													/>
													<h1>{p.nomeP}</h1>
												</div>
												<h2>{p.categoria}</h2>
												<h2>{`Versão: ${p.versaoPs[0].nomeVersaoP}`}</h2>
												<h2>{`${p.preco}€`}</h2>
											</div>
											{idx < produtos.length - 1 && (
												<hr />
											)}
										</React.Fragment>
									);
								})}
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default OrcamentosComprador;