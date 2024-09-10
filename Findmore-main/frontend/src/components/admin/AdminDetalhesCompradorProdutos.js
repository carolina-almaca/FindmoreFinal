import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import PaginatedTable from '../PaginatedTable';
import axios from 'axios';
import DetalhesCompraProdutoModal from '../DetalhesCompraProdutoModal';

const AdminDetalhesCompradorProdutos = ({ userId, comprador }) => {
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
				`http://localhost:3001/compra/produtos/${userId}`
			);

            const produtosFiltrados = produtosComprados.filter((p) => p.Produto !== null);

            setProdutos(produtosFiltrados);
			setProdutosTableData(parseTableData(produtosFiltrados));
			setFilteredProdutosTableData(parseTableData(produtosFiltrados));
		} catch (error) {}
	};

	const handleProdutoClicked = (produto) => {
		setProdutoCompraDetalhes({ ...produto, comprador });
	}

	const parseTableData = (data) => {
		if (!data) return [];
		const parsedData = data.map((d) => {
			return {
                id: d.Compra.idCompra,
				produto: d.Produto ? d.Produto.nomeP : 'N/A',
				data: d.Compra.dataCompra,
				vendedor: d.Vendedor? d.Vendedor.nomeU : 'N/A',
				versao: d.VersaoP ? d.VersaoP.nomeVersaoP : 'N/A',
				feedback: d.Feedback.avaliacao,
                comentario: d.Feedback.comentario || 'N/A',
                valor: `${d.Compra.valorTotal.toFixed(2)}€`,
                quantidade: d.Compra.quantidade,
				itemClickCallback: {
					itemKey: 'id',
					fn: () =>
						handleProdutoClicked(d),
				},
			};
		});

		return parsedData;
	};

	const onSearchProdutos = (e) => {
		const searchValue = String(e.target.value);

		if (searchValue !== '') {
			const filteredData = produtosTableData.filter(
				(data) =>
					String(data.id).includes(searchValue.toLowerCase()) ||
					data.produto.toLowerCase().includes(searchValue) ||
					data.data.toLowerCase().includes(searchValue) ||
					data.vendedor.toLowerCase().includes(searchValue) ||
					data.versao.toLowerCase().includes(searchValue) ||
					data.valor.toLowerCase().includes(searchValue) ||
					String(data.quantidade).toLowerCase().includes(searchValue) ||
					data.comentario.toLowerCase().includes(searchValue)
			);

			setFilteredProdutosTableData(filteredData);
		} else {
			setFilteredProdutosTableData(parseTableData(produtos));
		}
	};

	return (
		<div className='admin-compradores-table-wrapper' style={{ marginTop: '40px' }}>
			{
				produtoCompraDetalhes && <DetalhesCompraProdutoModal produtoCompra={produtoCompraDetalhes}  handleCloseModal={() => setProdutoCompraDetalhes(undefined)}/>
			}
			<div className='admin-compradores-table-wrapper-header'>
				<h1>Produtos Comprados</h1>
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
					'Vendedor',
					'Versão',
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
						key: 'produto',
						label: 'Produto',
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
						key: 'versao',
						label: 'Versão',
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
				tableData={filteredProdutosTableData}
				rowsPerPage={5}
				customTableClassName='admin-compradores-table'
			/>
		</div>
	);
};

export default AdminDetalhesCompradorProdutos;
