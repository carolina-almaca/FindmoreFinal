import "../styles/navbar.css";
import "../styles/homeVendedor.css";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";
import authService from "./auth.service";
import ProductPerformanceImage from '../images/product-1.png';
import ProductFotografiaImage from '../images/product-2.png';
import ProductFerramentaImage from '../images/product-3.png';

export default function Produtos({ onProductClick }) {
	const [produtosPerformance, setProdutosPerformance] = useState([]);
	const [produtosFotografia, setProdutosFotografia] = useState([]);
	const [produtosFerramentas, setProdutosFerramentas] = useState([]);

	useEffect(() => {
		const fetchProdutos = async () => {
			try {
				if (!authService.getCurrentUser()) authService.logout();
				const { data } = await axios.get(
					"http://localhost:3001/produto/listaStock",
					{
						headers: {
							Authorization: `Bearer ${
								authService.getCurrentUser().token
							}`,
						},
					}
				);
				if (data && data.message === "O token não é válido.") {
					authService.logout();
				}

				const pPerformance = data.filter(
					(p) => String(p.categoria).toLowerCase() === "performance"
				);
				setProdutosPerformance(pPerformance);

				const pFotografia = data.filter(
					(p) => String(p.categoria).toLowerCase() === "fotografia"
				);
				setProdutosFotografia(pFotografia);

				const pFerramenta = data.filter(
					(p) => String(p.categoria).toLowerCase() === "ferramenta"
				);
				setProdutosFerramentas(pFerramenta);
			} catch (error) {}
		};

		fetchProdutos();
	}, []);

	return (
		<div className='container-wrapper'>
			{produtosPerformance.length > 0 && (
				<div>
					<span className='category-title-1'>Performance</span>
					<div className='products'>
						{produtosPerformance.map((product) => {
							return (
								<ProductCard
									product={{...product, imagem: ProductPerformanceImage}}
									key={`product-${product.idProduto}`}
									onBtnClick={() => onProductClick(product)}
									productType='performance'
									showPrice
								/>
							);
						})}
					</div>
				</div>
			)}

			{produtosFotografia.length > 0 && (
				<>
					<hr />
					<div>
						<span className='category-title-2'>Fotografia</span>
						<div className='products'>
							{produtosFotografia.map((product) => {
								return (
									<ProductCard
									product={{...product, imagem: ProductFotografiaImage}}
										key={`product-photo-${product.idProduto}`}
										onBtnClick={() =>
											onProductClick(product)
										}
										productType='fotografia'
										showPrice
									/>
								);
							})}
						</div>
					</div>
				</>
			)}

			{produtosFerramentas.length > 0 && (
				<>
					<hr />
					<div>
						<span className='category-title-3'>Ferramentas</span>
						<div className='products'>
							{produtosFerramentas.map((product) => {
								return (
									<ProductCard
										product={{...product, imagem: ProductFerramentaImage}}
										key={`product-ferramenta-${product.idProduto}`}
										onBtnClick={() =>
											onProductClick(product)
										}
										productType='ferramenta'
										showPrice
									/>
								);
							})}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
