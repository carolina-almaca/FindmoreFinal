import axios from 'axios';
import { useEffect, useState } from 'react';

export default function AdminTopDeVendas() {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchTopVendas = async () => {
			try {
				const { data } = await axios.get(
					`http://localhost:3001/dashboard/topVendas`
				);

				setData(data.sort((a, b) => a.quandidade - b.quantidade));
			} catch (error) {
				return null;
			}
		};

		fetchTopVendas();
	}, []);

	const renderRow = (idx) => {
		return (
			<tr key={`row-top-vendas-${idx}`}>
				<td>{`0${idx + 1}`}</td>
				<td>{data[idx].nome}</td>
				<td style={{ textTransform: 'capitalize' }} >{data[idx].tipo}</td>
				<td>{data[idx].quantidade}</td>
				<td>
					<span className={`admin-top-vendas-preco-${idx + 1}`}>
						{`${data[idx].valorTotal.toFixed(2)}€`}
					</span>
				</td>
			</tr>
		);
	};

	return (
		<div className='admin-top-vendas'>
			<h1>Top de vendas</h1>
			{data.length > 0 && (
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Nome</th>
							<th>Tipo</th>
							<th>Quantidade</th>
							<th>Preço</th>
						</tr>
					</thead>
					<tbody>
						{
                            data.map((d, idx) => renderRow(idx))
                        }
					</tbody>
				</table>
			)}
		</div>
	);
}
