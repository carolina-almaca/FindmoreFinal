import React, { useEffect, useState } from 'react';
import ProductPerformanceImage from '../../images/product-1.png';
import ProductFotografiaImage from '../../images/product-2.png';
import ProductFerramentaImage from '../../images/product-3.png';
import axios from 'axios';
import ToastNotification from '../ToastNotification';
import DetalhesOrcamentoModal from '../DetalhesOrcamentoModal';
import AdminNavbar from '../AdminNavbar';
import { Link } from 'react-router-dom';
import DetalhesCompletosProdutoModal from '../DetalhesCompletosProdutoModal';

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

const AdminOrcamentos = ({ onLogout }) => {
	const [toast, setToast] = useState({
		show: false,
		message: '',
		variant: 'success',
	});
	const [orcamentos, setOrcamentos] = useState([]);
	const [showDetalhesOrcamento, setShowDetalhesOrcamento] = useState(null);
	const [orcamentosFiltrados, setOrcamentosFiltrados] = useState([]);
	const [filtro, setFiltro] = useState('');
	const [produtoDetalhes, setProdutoDetalhes] = useState(undefined);

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
			const { data } = await axios.get(`http://localhost:3001/orcamento`);

			setOrcamentos(data);
			setOrcamentosFiltrados(data);
		} catch (error) {}
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
		if (estado === 'analise') {
			return `${nomeO} - Em análise`;
		}
		if (estado === 'aceite') {
			return `${nomeO} - Aceite - Valor: ${Number(preco).toFixed(2)}€ ${
				dataValidade
					? `- Expira em: ${renderDataCol(dataValidade)}`
					: ''
			}`;
		}
		if (estado === 'concluido') {
			return `${nomeO} - Compra Efetuada`;
		}
		if (estado === 'recusado') {
			return `${nomeO} - Recusado - Motivo: ${justificacao}`;
		}
		if (estado === 'expirado') {
			return `${nomeO} - Expirado`;
		}
	};

	const handleOrcamentoAceiteOuRejeitado = () => {
		setShowDetalhesOrcamento(null);
		getOrcamentos();
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
		<main>
			<AdminNavbar onLogout={onLogout} />
			<div className='container-wrapper'>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '30px',
						marginTop: '30px',
					}}
				>
					<ToastNotification
						show={toast.show}
						handleClose={handleCloseToast}
						toast={toast}
					/>
					{showDetalhesOrcamento && (
						<DetalhesOrcamentoModal
							handleCloseModal={() =>
								setShowDetalhesOrcamento(null)
							}
							orcamento={showDetalhesOrcamento}
							handleOrcamentoAceiteOuRejeitado={() =>
								handleOrcamentoAceiteOuRejeitado()
							}
						/>
					)}

					{produtoDetalhes && (
						<DetalhesCompletosProdutoModal
							produto={produtoDetalhes}
							handleCloseModal={() =>
								setProdutoDetalhes(undefined)
							}
						/>
					)}

					<div
						className='admin-compradores-table-wrapper-header'
						style={{ marginBottom: '0px' }}
					>
						<h1>Orçamentos</h1>
					</div>

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
						<h1 style={{ fontSize: '22px' }}>
							Não existem orçamentos.
						</h1>
					)}
					{orcamentosFiltrados.length > 0 &&
						orcamentosFiltrados.map((orcamento) => {
							const { produtos } = orcamento;
							return (
								<div
									className='comprador-pacote-wrapper'
									key={`orcament-${orcamento.nomeO}`}
								>
									<div className='comprador-pacote-header'>
										<button
											className='btn'
											onClick={() =>
												setShowDetalhesOrcamento(
													orcamento
												)
											}
										>
											<h1
												style={{
													textDecoration: 'underline',
												}}
											>
												{renderOrcamentoHeader(
													orcamento
												)}
											</h1>
										</button>
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
																getProdutoBgColor(
																	p
																),
														}}
													>
														<div className='comprador-pacotes-produtos-produto-wrapper'>
															<img
																src={getProdutoImage(
																	p
																)}
																alt=''
																width={90}
																height={80}
															/>
															<div
																style={{
																	display:
																		'flex',
																	flexDirection:
																		'column',
																	alignItems:
																		'flex-start',
                                                                    gap: '3px'
																}}
															>
															<button
                                                                className='default-btn'
                                                                onClick={() => setProdutoDetalhes(p)}
                                                                style={{ padding: 0, textDecoration: 'underline' }}
                                                            >
                                                                {p.nomeP }
                                                            </button>
																<h2>{`Vendedor: ${p.vendedor.nomeU}`}</h2>
																<h2>{`Comprador: ${orcamento.comprador.nomeU}`}</h2>
															</div>
														</div>
														<h2>{p.categoria}</h2>
														<h2>{`Versão: ${p.versaoPs[0].nomeVersaoP}`}</h2>
														<h2>{`${p.preco}€`}</h2>
													</div>
													{idx <
														produtos.length - 1 && (
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
			</div>
		</main>
	);
};

export default AdminOrcamentos;
