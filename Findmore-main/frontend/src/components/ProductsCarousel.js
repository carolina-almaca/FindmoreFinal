import React, { useState } from 'react';
import '../styles/products-carousel.css';
import ArrowRight from '../images/arrow-right.svg';
import ArrowLeft from '../images/arrow-left.svg';
import ProductPerformanceImage from '../images/product-1.png';
import ProductFotografiaImage from '../images/product-2.png';
import ProductFerramentaImage from '../images/product-3.png';
import EditarIcon from '../images/pencil.svg';
import ApagarIcon from '../images/trash.svg';
import { Modal } from 'react-bootstrap';
import FormInput from './InputText';
import axios from 'axios';

const ProductsCarousel = ({
	produtos,
	onEditarProdutoClick,
	onApagarProdutoClick,
	isPacote,
	fromComprador,
	onProdutoClick,
}) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [selectedProdutoModal, setSelectedProdutoModal] = useState(null);
	const [novaVersao, setNovaVersao] = useState('');

	const visibleCards = 3;
	const cardWidth = 320;
	const cardMargin = 10; // Total margin on both sides

	const prevSlide = () => {
		if (currentSlide > 0) {
			setCurrentSlide(currentSlide - 1);
		}
	};

	const nextSlide = () => {
		if (currentSlide < produtos.length - visibleCards) {
			setCurrentSlide(currentSlide + 1);
		}
	};

	const renderProduto = (produto) => {
		const categoriaProduto = produto.categoria;
		let cardBgColor = '';
		let cardImage = '';

		if (categoriaProduto === 'performance') {
			cardBgColor = '#FFEBF8';
			cardImage = ProductPerformanceImage;
		}

		if (categoriaProduto === 'fotografia') {
			cardBgColor = '#E7F6FB';
			cardImage = ProductFotografiaImage;
		}

		if (categoriaProduto === 'ferramenta') {
			cardBgColor = '#EDEEF6';
			cardImage = ProductFerramentaImage;
		}

		const versoes = produto.versaoPs;

		const versaoMaisRecente = isPacote
			? versoes
			: versoes.sort((a, b) => new Date(b.data) - new Date(a.data))[0] ||
			  'N/A';

		return (
			<div
				style={{ backgroundColor: cardBgColor }}
				className='carousel-card-produto'
			>
				<img src={cardImage} alt='' height={180} />
				<div className='carousel-card-produto-section'>
					<h1 title={produto.nomeP}>{produto.nomeP}</h1>
					<span
						className='carousel-card-produto-minidescricao'
						title={produto.miniDescricao}
					>
						{produto.miniDescricao}
					</span>
					{isPacote || fromComprador ? (
						<span>Versão: {versaoMaisRecente.nomeVersaoP}</span>
					) : (
						<button
							className='btn-versao'
							onClick={() => setSelectedProdutoModal(produto)}
						>
							{versaoMaisRecente.nomeVersaoP}
						</button>
					)}
					{!isPacote && <span>{`Stock: ${produto.stock}`}</span>}
					{isPacote && <span>{produto.categoria}</span>}
				</div>
				<p
					className='carousel-card-produto-descricao'
					title={produto.descricao}
				>
					{produto.descricao}
				</p>
				{!fromComprador && (
					<div className='carousel-card-produto-footer'>
						<h1>{`${produto.preco.toFixed(2)}€`}</h1>
						{!isPacote && (
							<div>
								<button
									onClick={() =>
										onEditarProdutoClick(produto)
									}
								>
									<img src={EditarIcon} alt='' height={22} />
								</button>
								<button
									onClick={() =>
										onApagarProdutoClick(produto)
									}
								>
									<img src={ApagarIcon} alt='' height={22} />
								</button>
							</div>
						)}
					</div>
				)}
				{
					fromComprador && (
						<div style={{
							width: '100%'
						}}>
							<button style={{
								width: '100%',
								border: 'none',
								backgroundColor: 'white',
								padding: '8px',
								borderRadius: '20px',
								color: '#1E2544',
								fontSize: '18px',
								fontWeight: 'bold'
							}} onClick={() => onProdutoClick(produto)}>{`${produto.preco.toFixed(2)}€`}</button>
						</div>
					)
				}
			</div>
		);
	};

	const onAddNovaVersao = async (produto, novaVersao) => {
		try {
			const res = await axios.post(
				`http://localhost:3001/produto/novaVersaoP/${produto.idProduto}`,
				{
					idProduto: produto.idProduto,
					versaoP: novaVersao,
					versaoData: new Date().toISOString(),
				}
			);

			if (res === '' || res === false) return;

			setNovaVersao('');
			const updatedSelectedProduto = { ...selectedProdutoModal };

			updatedSelectedProduto.versaoPs.push(res.data.versaoP);

			setSelectedProdutoModal(updatedSelectedProduto);
		} catch (error) {
			console.log(error);
		}
	};

	const renderModalVersoes = (produto) => {
		const versaoMaisRecente = produto.versaoPs.sort(
			(a, b) => new Date(b.data) - new Date(a.data)
		)[0].nomeVersaoP;
		const outrasVersoes = produto.versaoPs
			.filter((v) => v.nomeVersaoP !== versaoMaisRecente)
			.sort((a, b) => new Date(b.data) - new Date(a.data));

		return (
			<Modal
				show={true}
				onHide={() => setSelectedProdutoModal(null)}
				className='versao-modal'
			>
				<Modal.Header closeButton>
					<Modal.Title>{`Versão ${versaoMaisRecente}`}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						{outrasVersoes.map((versao) => {
							return (
								<span key={`versao-${versao.data}`}>
									Versão: {versao.nomeVersaoP}
								</span>
							);
						})}
					</div>
					<div className='versao-modal-body'>
						<FormInput
							type='text'
							id='novaVersão'
							helpBlockTxt=''
							placeholder='Nova versão'
							value={novaVersao}
							onChange={(e) =>
								setNovaVersao(e.currentTarget.value)
							}
						/>
						<button
							className='btn btn-secondary'
							onClick={() => onAddNovaVersao(produto, novaVersao)}
						>
							Nova versão
						</button>
					</div>
				</Modal.Body>
			</Modal>
		);
	};

	return (
		<div className='products-carousel-wrapper'>
			{selectedProdutoModal && renderModalVersoes(selectedProdutoModal)}
			<button
				className='products-carousel-btn products-prev-btn'
				onClick={prevSlide}
			>
				<img src={ArrowLeft} alt='' />
			</button>
			<div className='products-carousel-container'>
				<div
					className='products-carousel-inner'
					style={{
						transform: `translateX(-${
							currentSlide * (cardWidth + cardMargin)
						}px)`,
					}}
				>
					{produtos.map((produto, index) => (
						<div className='products-carousel-card' key={index}>
							{renderProduto(produto)}
						</div>
					))}
				</div>
			</div>
			<button
				className='products-carousel-btn products-next-btn'
				onClick={nextSlide}
			>
				<img src={ArrowRight} alt='' />
			</button>
		</div>
	);
};

export default ProductsCarousel;
