import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import PaginatedTable from '../PaginatedTable';
import DetalhesCompraPacoteModal from '../DetalhesCompraPacoteModal';

const AdminDetalhesVendedorVendaPacotes = ({ userId, vendedor }) => {
	const [pacotes, setPacotes] = useState([]);
	const [pacotesTableData, setPacotesTableData] = useState([]);
	const [filteredPacotesTableData, setFilteredPacotesTableData] = useState([]);
	const [compraPacoteDetalhes, setCompraPacoteDetalhes] = useState(undefined);

	useEffect(() => {
		if (userId) {
			fetchPacotes();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId]);

	const fetchPacotes = async () => {
		try {
			const { data: pacotesVendidos } = await axios.get(
				`http://localhost:3001/compra/pacotesVendidos/${userId}`
			);
			setPacotes(pacotesVendidos);
			setPacotesTableData(parseTableData(pacotesVendidos));
			setFilteredPacotesTableData(parseTableData(pacotesVendidos));
		} catch (error) {}
	};

	const onSearchPacotes = (e) => {
		const searchValue = String(e.target.value);

		if (searchValue !== '') {
			const filteredData = pacotesTableData.filter(
				(data) =>
					String(data.id).includes(searchValue.toLowerCase()) ||
					data.pacote.toLowerCase().includes(searchValue) ||
					data.data.toLowerCase().includes(searchValue) ||
					data.comprador.toLowerCase().includes(searchValue) ||
					data.comentario.toLowerCase().includes(searchValue)
			);

			setFilteredPacotesTableData(filteredData);
		} else {
			setFilteredPacotesTableData(parseTableData(pacotes));
		}
	};

	const handlePacoteClicked = (pacote) => {
		setCompraPacoteDetalhes(
			{ ...pacote, vendedor, pacotes: pacote.pacote }
		);
	}

	const parseTableData = (data) => {
		if (!data) return [];
		const parsedData = data.map((d) => {
			return {
				id: d.idCompra,
				pacote: d.pacote[0].nomePacote,
				data: d.dataCompra,
				comprador: d.comprador.nomeU,
				feedback: d.feedback.avaliacao,
				comentario: d.feedback.comentario || 'N/A',
				itemClickCallback: {
					itemKey: 'id',
					fn: () =>
						handlePacoteClicked(d),
				},
			};
		});

		return parsedData;
	};

	return (
		<div className='admin-compradores-table-wrapper'>
			{
				compraPacoteDetalhes && <DetalhesCompraPacoteModal compraPacoteDetalhes={compraPacoteDetalhes}  handleCloseModal={() => setCompraPacoteDetalhes(undefined)}/>
			}
			<div className='admin-compradores-table-wrapper-header'>
				<h1>Venda de Pacotes</h1>
				<div className='search-container'>
					<input
						className='form-control rounded-pill'
						type='search'
						id='search-input'
						placeholder='Pesquisar'
						onChange={(e) => onSearchPacotes(e)}
					/>
					<FaSearch className='search-icon' />
				</div>
			</div>
			<PaginatedTable
				tableHeaders={[
					'Id Compra',
					'Pacote',
					'Data',
					'Comprador',
					'Feedback',
					'Comentários',
				]}
				tableHeadersKeys={[
					{
						key: 'id',
						label: 'Id Compra',
					},
					{
						key: 'pacote',
						label: 'Pacote',
					},
					{
						key: 'data',
						label: 'Data',
					},
					{
						key: 'comprador',
						label: 'Comprador',
					},
					{
						key: 'feedback',
						label: 'Feedback',
					},
					{
						key: 'comentario',
						label: 'Comentários',
					},
				]}
				tableData={filteredPacotesTableData}
				rowsPerPage={5}
				customTableClassName='admin-compradores-table'
			/>
		</div>
	);
};

export default AdminDetalhesVendedorVendaPacotes;
