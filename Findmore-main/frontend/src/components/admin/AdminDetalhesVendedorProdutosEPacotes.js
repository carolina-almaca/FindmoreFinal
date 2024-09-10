import { FaSearch } from 'react-icons/fa';
import PaginatedTable from '../PaginatedTable';
import React, { useEffect, useState } from 'react';
import authService from '../../view/auth.service';
import axios from 'axios';
import DetalhesCompletosProdutoModal from '../DetalhesCompletosProdutoModal';
import DetalhesCompletosPacoteModal from '../DetalhesCompletosPacoteModal';

const AdminDetalhesVendedorProdutosEPacotes = ({ userId }) => {
	const [produtos, setProdutos] = useState([]);
	const [produtosTableData, setProdutosTableData] = useState([]);
	const [filteredProdutosTableData, setFilteredProdutosTableData] = useState([]);
	const [pacotes, setPacotes] = useState([]);
	const [pacotesTableData, setPacotesTableData] = useState([]);
	const [filteredPacotesTableData, setFilteredPacotesTableData] = useState([]);
	const [produtoDetalhes, setProdutoDetalhes] = useState(undefined);
	const [pacoteDetalhes, setPacoteDetalhes] = useState(undefined);


	useEffect(() => {
		if (userId) {
			fetchProdutos();
			fetchPacotes();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId]);

	const fetchProdutos = async () => {
		const user = authService.getCurrentUser();
		if (user) {
			try {
				if (!authService.getCurrentUser()) authService.logout();
				const { data } = await axios.get(
					'http://localhost:3001/produto/lista',
					{
						headers: {
							Authorization: `Bearer ${
								authService.getCurrentUser().token
							}`,
						},
					}
				);

				if (data && data.message === 'O token não é válido.') {
					authService.logout();
				}

				const pVendedor = data.filter(
					(p) => Number(p.idUtilizador) === Number(userId)
				);

				setProdutos(pVendedor);
				setProdutosTableData(parseTableData(pVendedor));
				setFilteredProdutosTableData(parseTableData(pVendedor));
			} catch (error) {}
		}
	};

	const fetchPacotes = async () => {
		const user = authService.getCurrentUser();
		if (user) {
			try {
				if (!authService.getCurrentUser()) authService.logout();
				const { data } = await axios.get(
					`http://localhost:3001/pacote/${userId}/pacotes`,
					{
						headers: {
							Authorization: `Bearer ${
								authService.getCurrentUser().token
							}`,
						},
					}
				);

				if (data && data.message === 'O token não é válido.') {
					authService.logout();
				}

				// Fetch produtos for each pacote
				const pacotesWithProdutos = await Promise.all(
					data.map(async (pacote) => {
						const produtosResponse = await axios.get(
							`http://localhost:3001/pacote/${pacote.idPacote}/produtos`
						);
						return { ...pacote, produtos: produtosResponse.data };
					})
				);

				setPacotes(pacotesWithProdutos);
				setPacotesTableData(parseTableDataPacotes(pacotesWithProdutos));
				setFilteredPacotesTableData(parseTableDataPacotes(pacotesWithProdutos));
			} catch (error) {}
		}
	};

	const onSearchProdutos = (e) => {
		const searchValue = String(e.target.value);

		if (searchValue !== '') {
			const filteredData = produtosTableData.filter(
				(data) =>
					data.nome.toLowerCase().includes(searchValue) ||
					data.minidesc.toLowerCase().includes(searchValue) ||
					data.categoria.toLowerCase().includes(searchValue) ||
					String(data.stock).includes(searchValue) ||
					String(data.montante).includes(searchValue)
			);

			setFilteredProdutosTableData(filteredData);
		} else {
			setFilteredProdutosTableData(parseTableData(produtos));
		}
	};

	const onSearchPacotes = (e) => {
		const searchValue = String(e.target.value);

		if (searchValue !== '') {
			const filteredData = pacotesTableData.filter(
				(data) =>
					data.nome.toLowerCase().includes(searchValue) ||
					String(data.quantidade).includes(searchValue) ||
					String(data.valor).includes(searchValue)
			);

			setFilteredPacotesTableData(filteredData);
		} else {
			setFilteredPacotesTableData(parseTableDataPacotes(pacotes));
		}
	};

	const handleProdutoClicked = (produto) => {
		setProdutoDetalhes(produto);
	}

	const handlePacoteClicked = (pacote) => {
		setPacoteDetalhes(pacote);
	}

	const parseTableData = (data) => {
		if (!data) return [];
		const parsedData = data.map((d) => {
			return {
				nome: d.nomeP,
				minidesc: d.miniDescricao,
				categoria: d.categoria,
				stock: d.stock,
				montante: `${d.preco.toFixed(2)}€`,
				itemClickCallback: {
					itemKey: 'nome',
					fn: () =>
						handleProdutoClicked({...d, nomeVersaoP: d.versaoPs[0].nomeVersaoP}),
				},
			};
		});
		return parsedData;
	};

	const parseTableDataPacotes = (data) => {
		if (!data) return [];
		const parsedData = data.map((d) => {
			return {
				nome: d.nomePacote,
				quantidade: d.quantidadePacote,
				valor: `${d.valor.toFixed(2)}€`,
				itemClickCallback: {
					itemKey: 'nome',
					fn: () =>
						handlePacoteClicked(d),
				},
			};
		});
		return parsedData;
	};

	return (
		<React.Fragment>
			<div className='admin-compradores-table-wrapper'>
			{
				produtoDetalhes && <DetalhesCompletosProdutoModal produto={produtoDetalhes}  handleCloseModal={() => setProdutoDetalhes(undefined)}/>
			}
			{
				pacoteDetalhes && <DetalhesCompletosPacoteModal pacote={pacoteDetalhes}  handleCloseModal={() => setPacoteDetalhes(undefined)}/>
			}
				<div className='admin-compradores-table-wrapper-header'>
					<h1>Produtos</h1>
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
						'Nome',
						'Mini Descrição',
						'Categoria',
						'Stock',
						'Montante',
					]}
					tableHeadersKeys={[
						{
							key: 'nome',
							label: 'Nome',
						},
						{
							key: 'minidesc',
							label: 'Mini Descrição',
						},
						{
							key: 'categoria',
							label: 'Categoria',
						},
						{
							key: 'stock',
							label: 'Stock',
						},
						{
							key: 'montante',
							label: 'Montante',
						},
					]}
					tableData={filteredProdutosTableData}
					rowsPerPage={5}
					customTableClassName='admin-compradores-table'
				/>
			</div>

			<div className='admin-compradores-table-wrapper'>
				<div className='admin-compradores-table-wrapper-header'>
					<h1>Pacotes</h1>
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
					tableHeaders={['Nome', 'Quantidade', 'Valor']}
					tableHeadersKeys={[
						{
							key: 'nome',
							label: 'Nome',
						},
						{
							key: 'quantidade',
							label: 'Quantidade',
						},
						{
							key: 'valor',
							label: 'Valor',
						},
					]}
					tableData={filteredPacotesTableData}
					rowsPerPage={5}
					customTableClassName='admin-compradores-table'
				/>
			</div>
		</React.Fragment>
	);
};

export default AdminDetalhesVendedorProdutosEPacotes;
