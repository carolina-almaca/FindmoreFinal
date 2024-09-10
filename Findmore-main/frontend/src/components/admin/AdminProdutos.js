import { useEffect, useState } from 'react';
import AdminNavbar from '../AdminNavbar';
import Footer from '../Footer';
import authService from '../../view/auth.service';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import PaginatedTable from '../PaginatedTable';
import DetalhesCompletosProdutoModal from '../DetalhesCompletosProdutoModal';

export default function AdminProdutos({ onLogout }) {
	const [produtos, setProdutos] = useState([]);
	const [produtosTableData, setProdutosTableData] = useState([]);
	const [filteredProdutosTableData, setFilteredProdutosTableData] = useState(
		[]
	);
	const [produtoDetalhes, setProdutoDetalhes] = useState(undefined);

	useEffect(() => {
		fetchProdutos();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

				setProdutos(data);
				setProdutosTableData(parseTableData(data));
				setFilteredProdutosTableData(parseTableData(data));
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

	const handleProdutoClicked = (produto) => {
		setProdutoDetalhes(produto);
	};

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
						handleProdutoClicked({
							...d,
							nomeVersaoP: d.versaoPs[0].nomeVersaoP,
						}),
				},
			};
		});
		return parsedData;
	};

	return (
		<main>
			<AdminNavbar onLogout={onLogout} />
			<div className='container-wrapper'>
                {
                    produtoDetalhes && <DetalhesCompletosProdutoModal produto={produtoDetalhes} handleCloseModal={() => setProdutoDetalhes(undefined)} />
                }
				<div className='admin-compradores-table-wrapper' style={{ marginTop: '30px' }}>
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
			</div>
			<Footer />
		</main>
	);
}
