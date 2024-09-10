import axios from 'axios';
import { useEffect, useState } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

const monthNames = [
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

export default function AdminGraficoTotalVendas() {
	const [data, setData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.get(
					'http://localhost:3001/dashboard/total-vendas-por-mes'
				);

				setData(fromApiDataToChartsData(data));
			} catch (error) {}
		};

		fetchData();
	}, []);

	const fromApiDataToChartsData = (apiData) => {
		// Convert API data to an array of [key, value] pairs and sort it by year and month
		const sortedData = Object.entries(apiData).sort(([a], [b]) => {
			const [yearA, monthA] = a.split('-').map(Number);
			const [yearB, monthB] = b.split('-').map(Number);
	
			if (yearA === yearB) {
				return monthA - monthB; // Compare by month if years are the same
			}
			return yearA - yearB; // Otherwise compare by year
		});
	
		// Map sorted data to the chart format
		const chartsData = sortedData.map(([key, value]) => {
			const [, month] = key.split('-');
			return {
				mes: monthNames[parseInt(month, 10) - 1], // Convert month to month name
				Produtos: value.produtos.toFixed(2),
				Pacotes: value.pacotes.toFixed(2),
				amt: `${(value.produtos + value.pacotes).toFixed(2)}€`, // Assuming amt is the sum of Produtos and Pacotes
			};
		});
	
		return chartsData;
	};
	

	return (
		<div className='admin-grafico-vendas-wrapper'>
			<h1>Total de Compras</h1>
			<ResponsiveContainer width='100%' height='100%'>
				<BarChart
					width={500}
					height={300}
					data={data}
					margin={{
						top: 20,
						right: 0,
						left: 0,
						bottom: 20,
					}}
					barSize={20}
				>
					<CartesianGrid vertical={false} stroke='#CEE5F7' />
					<XAxis
						dataKey='mes'
						tick={{ fill: '#366E92' }}
						strokeWidth={0}
					/>
					<YAxis
						dataKey=''
						tick={{ fill: '#366E92' }}
						tickCount={10}
						strokeWidth={0}
						tickFormatter={(tick) => {
							return `${tick.toFixed(0)}€`;
						}}
					/>
					<Tooltip formatter={(value) => `${value}€`} />
					<Legend />
					<Bar dataKey='Pacotes' fill='#A82489' label='Pacotes' />
					<Bar dataKey='Produtos' fill='#1CA0DA' label='Produtos' />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
