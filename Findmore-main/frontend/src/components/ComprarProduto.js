import { Button } from 'react-bootstrap';
import LOGO from '../images/logo-horizontal.png';
import ProfileIcon from '../images/profile-icon.svg';
import Footer from './Footer';
import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import '../styles/comprarProduto.css';
import axios from 'axios';
import PagamentoProduto from './Pagamento';
import ProductPerformanceImage from '../images/product-1.png';
import ProductFotografiaImage from '../images/product-2.png';
import ProductFerramentaImage from '../images/product-3.png';

export default function ComprarProduto({ onLogout }) {
	const { productId } = useParams();

	const [product, setProduct] = useState(undefined);
	const [quantity, setQuantity] = useState(1);
	const [versaoSelecionada, setVersaoSelecionada] = useState('');
	const [showPagamento, setShowPagamento] = useState(false);
	const [descricao, setDescricao] = useState('');
	const [versoes, setVersoes] = useState([]);

	useEffect(() => {
		if (productId) {
			const fetchProduct = async () => {
				try {
					const { data } = await axios.get(
						`http://localhost:3001/produto/${productId}`
					);

					let productWithImage = { ...data };

					if (data && data.categoria === 'performance') {
						productWithImage.imagem = ProductPerformanceImage;
					}

					if (data && data.categoria === 'fotografia') {
						productWithImage.imagem = ProductFotografiaImage;
					}

					if (data && data.categoria === 'ferramenta') {
						productWithImage.imagem = ProductFerramentaImage;
					}

					setProduct(productWithImage);

					setVersoes(productWithImage.versaoPs);

					const versaoMaisRecente = productWithImage.versaoPs.sort((a, b) => new Date(b.data) - new Date(a.data))[0];

					setVersaoSelecionada(versaoMaisRecente);
				} catch (error) {}
			};

			fetchProduct();
		}
	}, [productId]);

	const removeQuantity = () => {
		if (quantity === 1) return;
		setQuantity((prev) => prev - 1);
	};

	const addQuantity = () => {
		if (quantity >= product?.stock) return;
		setQuantity((prev) => prev + 1);
	};

	const handleSelectVersaoChange = (e) => {
		const versao = versoes.find((v) => Number(v.idVersaoP) === Number(e.target.value));
		setVersaoSelecionada(versao);
	}

	return (
		<React.Fragment>
			{showPagamento && (
				<PagamentoProduto
					onLogout={onLogout}
					product={product}
					quantity={quantity}
					descricao={descricao}
					onCancelar={() => setShowPagamento(false)}
					versaoSelecionada={versaoSelecionada}
				/>
			)}
			{!showPagamento && (
				<main>
					<div className='navbar'>
						<img className='navbar-logo' src={LOGO} alt='Logo' />
						<div className='navbar-menu-lg'>
							<Link to='/perfil-comprador' className='profile-btn'>
								<img src={ProfileIcon} alt='Logo' />
							</Link>
							<button
								className='btn btn-primary'
								onClick={() => onLogout()}
							>
								Sair
							</button>
						</div>
					</div>
					<div className='container-wrapper'>
						<h1 className='category-title-1'>Comprar</h1>

						<div className='buy-wrapper'>
							<div className='buy-wrapper-resume'>
								<div className='resume-container'>
									<div className='resume-container-header'>
										<h1>{product?.nomeP}</h1>
										<h1>{`${product?.preco.toFixed(
											2
										)}€`}</h1>
									</div>
									<div className='resume-container-content'>
										<h2>{product?.miniDescricao}</h2>
										<p>{product?.descricao}</p>
									</div>
								</div>
								<div className='resume-container-selection'>
									<div className='resume-container-selection-quantity'>
										<span className='resume-container-selection-title'>Preço: {product?.preco.toFixed(2)}€</span>
										<div className='quantity-wrapper'>
											<button className='btn-quantity' onClick={() => removeQuantity()}>
												-
											</button>
											<span className='quantity-value'>
												{quantity || 1}
											</span>
											<button className='btn-quantity' onClick={() => addQuantity()}>	
												+
											</button>
										</div>
									</div>
									<div className='resume-container-selection-versao'>
										<span className='resume-container-selection-title'>Versão:</span>
										<select defaultValue={versaoSelecionada.idVersaoP} onChange={handleSelectVersaoChange}>
											{
												versoes.map((versao) => {
													return <option value={versao.idVersaoP} key={`option-${versao.nomeVersaoP}-${versao.idProduto}`}>{versao.nomeVersaoP}</option>
												})
											}
										</select>
									</div>
								</div>
							</div>
							<div className='buy-wrapper-footer'>
								<div className='buy-wrapper-footer-obs'>
									<h1>Observação</h1>
									<textarea rows={6} cols={60} onChange={(e) => setDescricao(e.currentTarget.value)} />
								</div>
								<div className='buy-wrapper-footer-resumo'>
									<h1>Resumo do pedido</h1>
									<div>
										<span>Total: </span>
										<span>{`${(product?.preco * quantity).toFixed(2)}€`}</span>
									</div>
								</div>
								<div className='buy-wrapper-footer-actions'>
									<Link to='/comprador'>
										<Button className='btn-primary'>
											Continuar a comprar
										</Button>
									</Link>
									<Button className='btn-secondary' onClick={() => setShowPagamento(true)}>
                                    	Pagamento
                                	</Button>
								</div>
							</div>
						</div>
					</div>

					<Footer />
				</main>
			)}
		</React.Fragment>
	);
}
