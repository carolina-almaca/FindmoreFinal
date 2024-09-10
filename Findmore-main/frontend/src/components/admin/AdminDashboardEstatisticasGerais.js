import ResumeCard from '../ResumeCard';
import CompradoresIcon from '../../images/compradores-icon.svg';
import VendedoresIcon from '../../images/vendedores-icon.svg';
import ProdutosIcon from '../../images/produtos-icon.svg';
import VendasIcon from '../../images/money-bag-icon.svg';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboardEstatisticasGerais() {
	const [estatisticasGerais, setEstatisticasGerais] = useState({
		totalCompradores: 0,
		totalVendedores: 0,
		totalProdutos: 0,
		totalVendas: 0,
	});

	useEffect(() => {
		const fetchEstatisticas = async () => {
			try {
				const { data } = await axios.get(
					`http://localhost:3001/dashboard/count`
				);

				setEstatisticasGerais(data);
			} catch (error) {
				return null;
			}
		};

		fetchEstatisticas();
	}, []);

	return (
		<div className='admin-dashboard-resume-cards'>
			<ResumeCard
				icon={CompradoresIcon}
				title={estatisticasGerais.totalCompradores}
				subtitle='Compradores'
			/>
			<ResumeCard
				icon={VendedoresIcon}
				title={estatisticasGerais.totalVendedores}
				subtitle='Vendedores'
			/>
			<ResumeCard
				icon={ProdutosIcon}
				title={estatisticasGerais.totalProdutos}
				subtitle='Produtos'
			/>
			<ResumeCard
				icon={VendasIcon}
				title={`${estatisticasGerais.totalVendas.toFixed(2)}€`}
				subtitle='Total Compras'
			/>
		</div>
	);
}
