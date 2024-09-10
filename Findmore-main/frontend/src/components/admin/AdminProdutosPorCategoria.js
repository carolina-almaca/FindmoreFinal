import axios from 'axios';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

export default function AdminProdutosPorCategoria() {
	const COLORS = ['#F38CDB', '#C3CEFF', '#41B3FB'];

	const [data, setData] = useState(null);
	const [dataUnidades, setDataUnidades] = useState(null);

	useEffect(() => {
		const fetchEstatisticas = async () => {
			try {
				const { data } = await axios.get(
					`http://localhost:3001/dashboard/graficoCategorias`
				);

				setData(fromApiToChartData(data.percentagens));
				setDataUnidades(fromApiToChartData(data.unidades));
			} catch (error) {
				return null;
			}
		};

		fetchEstatisticas();
	}, []);

	const fromApiToChartData = (input) => {
		const chartData = Object.keys(input).map((key) => ({
			name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter of the key
			value: parseFloat(input[key]), // Convert the string value to a float
		}));

		return chartData;
	};

    const getDataPercentage = (category) => {
        return data.filter((d) => d.name === category)[0].value;
    }

    const getDataUnidades = (category) => {
        return dataUnidades.filter((d) => d.name === category)[0].value;
    }

	return (
		<div className='admin-produtos-por-categoria'>
			<h1>Produtos por categoria</h1>
			{data && data.length > 0 && (
				<div className='admin-produtos-por-categoria-chart-wrapper'>
					<ResponsiveContainer width='100%' height='100%'>
						<PieChart width={300} height={100}>
							<Pie
								data={data}
								cx='50%'
								cy='50%'
								outerRadius={80}
								dataKey='value'
								stroke='none'
							>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<div className='admin-produtos-por-categoria-list-wrapper'>
						<div className='admin-produtos-por-categoria-list-item'>
							<span className='admin-produtos-por-categoria-list-item-dot-performance' />
							<span className='admin-produtos-por-categoria-list-item-text'>
								Performance
							</span>
							<span className='admin-produtos-por-categoria-list-item-text'>
								{`${getDataPercentage('Performance')}% (${getDataUnidades('Performance')} ${getDataUnidades('Performance') > 1 ? 'unidades' : 'unidade'})`}
							</span>
						</div>
						<div className='admin-produtos-por-categoria-list-item'>
							<span className='admin-produtos-por-categoria-list-item-dot-fotografia' />
							<span className='admin-produtos-por-categoria-list-item-text'>
								Fotografia
							</span>
							<span className='admin-produtos-por-categoria-list-item-text'>
                            {`${getDataPercentage('Fotografia')}% (${getDataUnidades('Fotografia')} ${getDataUnidades('Fotografia') > 1 ? 'unidades' : 'unidade'})`}
							</span>
						</div>
						<div className='admin-produtos-por-categoria-list-item'>
							<span className='admin-produtos-por-categoria-list-item-dot-ferramentas' />
							<span className='admin-produtos-por-categoria-list-item-text'>
								Ferramentas
							</span>
							<span className='admin-produtos-por-categoria-list-item-text'>
                            {`${getDataPercentage('Ferramenta')}% (${getDataUnidades('Ferramenta')} ${getDataUnidades('Ferramenta') > 1 ? 'unidades' : 'unidade'})`}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
