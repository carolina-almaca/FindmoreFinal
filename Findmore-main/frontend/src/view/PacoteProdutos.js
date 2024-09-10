import React from 'react';
import '../styles/navbar.css';
import '../styles/pacoteProdutos.css';
import ProductPerformanceImage from '../images/product-1.png';
import ProductFotografiaImage from '../images/product-2.png';
import ProductFerramentaImage from '../images/product-3.png';

export default function PacoteProdutos({ pacote, onPacoteClick }) {
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

	const { produtos } = pacote;

	return (
		<div className='comprador-pacote-wrapper'>
			<div className='comprador-pacote-header'>
				<h1>{`${pacote.nomePacote} - ${pacote.valor.toFixed(2)}€`}</h1>
				<button
					className='btn btn-secondary'
					onClick={() => onPacoteClick(pacote)}
				>
					Comprar
				</button>
			</div>
			<div className='comprador-pacotes-produtos'>
				{produtos.map((p, idx) => {
					return (
						<React.Fragment>
							<div
								className='comprador-pacotes-produtos-produto'
								key={`produto-${p.idProduto}`}
								style={{
									backgroundColor: getProdutoBgColor(p),
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
								<h2>{`Versão: ${p.versaoPs?.nomeVersaoP}`}</h2>
							</div>
							{idx < produtos.length - 1 && <hr />}
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
}
