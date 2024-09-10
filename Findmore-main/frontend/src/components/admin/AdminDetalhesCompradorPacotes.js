import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import PaginatedTable from '../PaginatedTable';
import axios from 'axios';
import DetalhesCompraPacoteModal from '../DetalhesCompraPacoteModal';

const AdminDetalhesCompradorPacotes = ({ userId, comprador }) => {
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
			const { data: pacotesComprados } = await axios.get(
				`http://localhost:3001/compra/pacotes/${userId}`
			);

            setPacotes(pacotesComprados);
			setPacotesTableData(parseTableDataPacotes(pacotesComprados));
            setFilteredPacotesTableData(parseTableDataPacotes(pacotesComprados));
		} catch (error) {}
	};

	const handlePacoteClicked = (pacote) => {
		setCompraPacoteDetalhes(pacote);
	}

	const parseTableDataPacotes = (data) => {
		if (!data) return [];
		const parsedData = data.map((d) => {
			return {
                id: d.idCompra,
				pacote: d.pacotes[0].nomePacote,
				data: d.dataCompra,
				vendedor: d.vendedores[0].nomeU,
				feedback: d.feedback.avaliacao,
                comentario: d.feedback.comentario || 'N/A',
                valor: `${d.valorTotal.toFixed(2)}€`,
                quantidade: d.quantidade,
				itemClickCallback: {
					itemKey: 'id',
					fn: () =>
						handlePacoteClicked({ ...d, comprador, vendedor: { nomeU: d.vendedores[0].nomeU, email: d.vendedores[0].email } }),
				},
			};
		});

		return parsedData;
	};

	const onSearchProdutos = (e) => {
		const searchValue = String(e.target.value);

		if (searchValue !== '') {
			const filteredData = pacotesTableData.filter(
				(data) =>
					String(data.id).includes(searchValue.toLowerCase()) ||
					data.pacote.toLowerCase().includes(searchValue) ||
					data.data.toLowerCase().includes(searchValue) ||
					data.vendedor.toLowerCase().includes(searchValue) ||
					data.valor.toLowerCase().includes(searchValue) ||
					String(data.quantidade).toLowerCase().includes(searchValue) ||
					data.comentario.toLowerCase().includes(searchValue)
			);

			setFilteredPacotesTableData(filteredData);
		} else {
			setFilteredPacotesTableData(parseTableDataPacotes(pacotes));
		}
	};

	return (
		<div className='admin-compradores-table-wrapper' style={{ marginTop: '40px' }}>
			{
				compraPacoteDetalhes && <DetalhesCompraPacoteModal compraPacoteDetalhes={compraPacoteDetalhes}  handleCloseModal={() => setCompraPacoteDetalhes(undefined)}/>
			}
			<div className='admin-compradores-table-wrapper-header'>
				<h1>Pacotes Comprados</h1>
				<div className='search-container'>
					<input
						className='form-control rounded-pill'
						type='search'
						id='search-input'
						placeholder='Pesquisar'
						onChange={(e) => onSearchProdutos(e)}
					/>
					<FaSearch className='search-icon' />
				</div>
			</div>
			<PaginatedTable
				tableHeaders={[
					'Id Compra',
					'Pacote',
					'Data',
					'Vendedor',
                    'Valor Total',
                    'Quantidade',
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
						key: 'vendedor',
						label: 'Vendedor',
					},
                    {
                        key: 'valor',
                        label: 'Valor Total',
                    },
                    {
                        key: 'quantidade',
                        label: 'Quantidade',
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

export default AdminDetalhesCompradorPacotes;
