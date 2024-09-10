import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]


export default function AdminDashboardComprasRecentes() {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchTopVendas = async () => {
			try {
				const { data } = await axios.get(
					`http://localhost:3001/dashboard/ultimasCompras`
				);

				setData(data);
			} catch (error) {
				return null;
			}
		};

		fetchTopVendas();
	}, []);

	const renderAvalicao = (avaliacao) => {
		return (
			<div className='star-rating'>
				{[1, 2, 3, 4, 5].map((value) => (
					<FaStar
						key={value}
						size={30}
						color={value <= avaliacao ? '#ffc107' : '#e4e5e9'}
					/>
				))}
			</div>
		);
	};

	const renderRow = (d, idx) => {
        const data = new Date(d.dataCompra);
		return (
			<tr key={`row-compras-${idx}`}>
				<td>{d.nome}</td>
				<td>{`${meses[data.getUTCMonth()]} ${data.getDate()}, ${data.getFullYear()}`}</td>
				<td>{d.nomeComprador}</td>
				<td>{d.nomeVendedor}</td>
				<td>{`${d.valorCompra}€`}</td>
				<td>{d.avaliacao ? renderAvalicao(d.avaliacao) : 'N/A'}</td>
			</tr>
		);
	};

	return (
		<div className='admin-dashboard-compras-recentes'>
			<h1>Compras Recentes</h1>
			{data.length > 0 && (
				<table>
					<thead>
						<tr>
							<th>Produto</th>
							<th>Data</th>
							<th>Comprador</th>
							<th>Vendedor</th>
							<th>Montante</th>
							<th>Feedback</th>
						</tr>
					</thead>
					<tbody>{data.map((d, idx) => renderRow(d, idx))}</tbody>
				</table>
			)}
		</div>
	);
}
