import { useEffect, useState } from 'react';
import AdminNavbar from '../AdminNavbar';
import Footer from '../Footer';
import authService from '../../view/auth.service';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import PaginatedTable from '../PaginatedTable';
import DetalhesCompletosPacoteModal from '../DetalhesCompletosPacoteModal';

export default function AdminPacotes({ onLogout }) {
	const [pacotes, setPacotes] = useState([]);
	const [pacotesTableData, setPacotesTableData] = useState([]);
	const [filteredPacotesTableData, setFilteredPacotesTableData] = useState(
		[]
	);
	const [pacoteDetalhes, setPacoteDetalhes] = useState(undefined);

	useEffect(() => {
		fetchPacotes();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchPacotes = async () => {
		const user = authService.getCurrentUser();
		if (user) {
			try {
				if (!authService.getCurrentUser()) authService.logout();
				const { data } = await axios.get(
					'http://localhost:3001/pacote/lista',
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

				setPacotes(data);
				setPacotesTableData(parseTableDataPacotes(data));
				setFilteredPacotesTableData(parseTableDataPacotes(data));
			} catch (error) {}
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

    const handlePacoteClicked = (pacote) => {
		setPacoteDetalhes(pacote);
	}

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
		<main>
			<AdminNavbar onLogout={onLogout} />
			<div className='container-wrapper'>
                {
                    pacoteDetalhes && <DetalhesCompletosPacoteModal pacote={pacoteDetalhes} handleCloseModal={() => setPacoteDetalhes(undefined)} />
                }
				<div className='admin-compradores-table-wrapper' style={{ marginTop: '30px' }}>
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
			</div>
			<Footer />
		</main>
	);
}
