import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import PaginatedTable from '../PaginatedTable';
import DetalhesCompraProdutoModal from '../DetalhesCompraProdutoModal';

const AdminDetalhesVendedorVendaProdutos = ({ userId, vendedor }) => {
	const [produtos, setProdutos] = useState([]);
	const [produtosTableData, setProdutosTableData] = useState([]);
	const [filteredProdutosTableData, setFilteredProdutosTableData] = useState([]);
	const [produtoCompraDetalhes, setProdutoCompraDetalhes] = useState(undefined);

	useEffect(() => {
		if (userId) {
			fetchProdutos();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId]);

	const fetchProdutos = async () => {
		try {
			const { data: produtosComprados } = await axios.get(
				`http://localhost:3001/compra/produtosVendidos/${userId}`
			);
			setProdutos(produtosComprados);
			setProdutosTableData(parseTableData(produtosComprados));
			setFilteredProdutosTableData(parseTableData(produtosComprados));
		} catch (error) {}
	};

	const onSearchProdutos = (e) => {
		const searchValue = String(e.target.value);

		if (searchValue !== '') {
			const filteredData = produtosTableData.filter(
				(data) =>
					String(data.id).includes(searchValue.toLowerCase()) ||
					data.produto.toLowerCase().includes(searchValue) ||
					data.data.toLowerCase().includes(searchValue) ||
					data.comprador.toLowerCase().includes(searchValue) ||
					data.versao.toLowerCase().includes(searchValue) ||
					data.comentario.toLowerCase().includes(searchValue)
			);

			setFilteredProdutosTableData(filteredData);
		} else {
			setFilteredProdutosTableData(parseTableData(produtos));
		}
	};

	const handleProdutoClicked = (produto) => {
		setProdutoCompraDetalhes({ ...produto, Vendedor: vendedor, comprador: produto.Comprador });
	}

	const parseTableData = (data) => {
		if (!data) return [];
		const parsedData = data.map((d) => {
			return {
				id: d.Compra.idCompra,
				produto: d.Produto.nomeP,
				data: d.Compra.dataCompra,
				comprador: d.Comprador.nomeU,
				versao: d.VersaoP.nomeVersaoP,
				feedback: d.Feedback.avaliacao,
				comentario: d.Feedback.comentario || 'N/A',
				itemClickCallback: {
					itemKey: 'id',
					fn: () =>
						handleProdutoClicked(d),
				},
			};
		});

		return parsedData;
	};

	return (
		<div className='admin-compradores-table-wrapper'>
			{
				produtoCompraDetalhes && <DetalhesCompraProdutoModal produtoCompra={produtoCompraDetalhes}  handleCloseModal={() => setProdutoCompraDetalhes(undefined)}/>
			}
			<div className='admin-compradores-table-wrapper-header'>
				<h1>Venda de Produtos</h1>
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
					'Produto',
					'Data',
					'Comprador',
					'Versão',
					'Feedback',
					'Comentários',
				]}
				tableHeadersKeys={[
					{
						key: 'id',
						label: 'Id Compra',
					},
					{
						key: 'produto',
						label: 'Produto',
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
						key: 'versao',
						label: 'Versão',
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
				tableData={filteredProdutosTableData}
				rowsPerPage={5}
				customTableClassName='admin-compradores-table'
			/>
		</div>
	);
};

export default AdminDetalhesVendedorVendaProdutos;
