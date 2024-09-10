import AdminNavbar from '../AdminNavbar';
import Footer from '../Footer';
import ResumeCard from '../ResumeCard';
import CompradoresIcon from '../../images/compradores-icon.svg';
import CartIcon from '../../images/shopping-cart-icon.svg';
import { useEffect, useState } from 'react';
import authService from '../../view/auth.service';
import axios from 'axios';
import PaginatedTable from '../PaginatedTable';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AdminCompradores({ onLogout }) {
	const [compradoresData, setCompradoresData] = useState(null);
	const [compradoresDataTable, setCompradoresDataTable] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		fetchCompradoresCount();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchCompradoresCount = async () => {
		const user = authService.getCurrentUser();
		if (user) {
			try {
				if (!authService.getCurrentUser()) authService.logout();
				const { data } = await axios.get(
					`http://localhost:3001/utilizador/compradores/count`,
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

				setCompradoresData(data);
				setCompradoresDataTable(
					parseCompradoresTableData(data.compradores)
				);
			} catch (error) {}
		}
	};

	const getTotalCompradoresAtivos = () => {
		return compradoresData?.compradores.filter((c) => c.ativo === true)
			.length;
	};

	const handleItemClicked = (item) => {
		navigate(`/admin/compradores/${item.idUtilizador}`);
	}

	const parseCompradoresTableData = (data) => {
		if (!data) return [];
		return data.map((d) => {
			return {
				nome: d.nomeU,
				email: d.email,
				estado: d.ativo ? 'Ativo' : 'Desativado',
				itemClickCallback: {
					itemKey: 'nome',
					fn: () =>
						handleItemClicked(d),
				},
			};
		});
	};

	const onSearch = (e) => {
		const searchValue = e.target.value;

		if (searchValue !== '') {
			const filteredData = compradoresDataTable.filter(
				(data) =>
					data.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
					data.email.toLowerCase().includes(searchValue) ||
					data.estado.toLowerCase().includes(searchValue)
			);

			setCompradoresDataTable(filteredData);
		} else {
			setCompradoresDataTable(
				parseCompradoresTableData(compradoresData.compradores)
			);
		}
	};

	return (
		<main>
			<AdminNavbar onLogout={onLogout} />
			<div className='container-wrapper'>
				<div className='admin-pages-container'>
					<div className='admin-vendedores-resume-cards'>
						<ResumeCard
							icon={CompradoresIcon}
							title={getTotalCompradoresAtivos()}
							subtitle='Compradores ativos'
						/>
						<ResumeCard
							icon={CartIcon}
							title={compradoresData?.totalCompradores}
							subtitle='Total Compradores'
						/>
					</div>
				</div>
				<div className='admin-compradores-table-wrapper'>
					<div className='admin-compradores-table-wrapper-header'>
						<h1>Compradores</h1>
						<div className='search-container'>
							<input
								className='form-control rounded-pill'
								type='search'
								id='search-input'
								placeholder='Pesquisar'
								onChange={(e) => onSearch(e)}
							/>
							<FaSearch className='search-icon' />
						</div>
					</div>
					<PaginatedTable
						tableHeaders={['Nome', 'Email', 'Estado']}
						tableData={compradoresDataTable}
						rowsPerPage={5}
						customTableClassName='admin-compradores-table'
						tableHeadersKeys={[
							{
								key: 'nome',
								label: "Nome"
							},
							{
								key: 'email',
								label: "Email"
							},
							{
								key: 'estado',
								label: "Estado"
							},
						]}
					/>
				</div>
			</div>
			<Footer />
		</main>
	);
}
