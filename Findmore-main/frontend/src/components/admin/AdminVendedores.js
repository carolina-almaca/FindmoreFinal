import React, { useEffect, useState } from 'react';
import AdminNavbar from '../AdminNavbar';
import Footer from '../Footer';
import ResumeCard from '../ResumeCard';
import CompradoresIcon from '../../images/compradores-icon.svg';
import VendedoresIcon from '../../images/vendedores-icon.svg';
import authService from '../../view/auth.service';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import PaginatedTable from '../PaginatedTable';
import { useNavigate } from 'react-router-dom';

export default function AdminVendedores({ onLogout }) {
	const [vendedoresData, setVendedoresData] = useState(null);
	const [vendedoresDataTable, setVendedoresDataTable] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		fetchVendedoresCount();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchVendedoresCount = async () => {
		const user = authService.getCurrentUser();
		if (user) {
			try {
				if (!authService.getCurrentUser()) authService.logout();
				const { data } = await axios.get(
					`http://localhost:3001/utilizador/vendedores/count`,
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

				setVendedoresData(data);
				setVendedoresDataTable(parseVendedoresTableData(data.vendedores));
			} catch (error) {}
		}
	};

	const getTotalVendedoresAtivos = () => {
		return vendedoresData?.vendedores.filter((c) => c.ativo === true).length;
	};

	const handleItemClicked = (item) => {
		navigate(`/admin/vendedores/${item.idUtilizador}`);
	}

	const parseVendedoresTableData = (data) => {
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
			const filteredData = vendedoresDataTable.filter(
				(data) =>
					data.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
					data.email.toLowerCase().includes(searchValue) ||
					data.estado.toLowerCase().includes(searchValue)
			);

			setVendedoresDataTable(filteredData);
		} else {
			setVendedoresDataTable(
				parseVendedoresTableData(vendedoresData.compradores)
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
							title={getTotalVendedoresAtivos()}
							subtitle='Vendedores ativos'
						/>
						<ResumeCard
							icon={VendedoresIcon}
							title={vendedoresData?.totalVendedores}
							subtitle='Total Vendedores'
						/>
					</div>
				</div>
				<div className='admin-compradores-table-wrapper'>
					<div className='admin-compradores-table-wrapper-header'>
						<h1>Vendedores</h1>
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
						tableData={vendedoresDataTable}
						rowsPerPage={5}
						customTableClassName='admin-compradores-table'
						tableHeadersKeys={[
							{
								key: 'nome',
								label: 'Nome',
							},
							{
								key: 'email',
								label: 'Email',
							},
							{
								key: 'estado',
								label: 'Estado',
							},
						]}
					/>
				</div>
			</div>
			<Footer />
		</main>
	);
}
