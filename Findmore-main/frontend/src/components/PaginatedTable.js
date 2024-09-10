import React, { useState } from 'react';
import '../styles/paginatedTable.css';
import { FaChevronRight, FaStar } from 'react-icons/fa';
import { FaChevronLeft } from 'react-icons/fa';

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const PaginatedTable = ({
	tableHeaders,
	tableData,
	rowsPerPage,
	customTableClassName,
    customTdClassName,
	tableHeadersKeys,
}) => {
	const [currentPage, setCurrentPage] = useState(1);

	const pageCount = Math.ceil(tableData.length / rowsPerPage);

	const getPaginatedData = () => {
		const start = (currentPage - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		return tableData.slice(start, end);
	};

	const handlePrevClick = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNextClick = () => {
		if (currentPage < pageCount) {
			setCurrentPage(currentPage + 1);
		}
	};

	const paginatedData = getPaginatedData();

    const renderEstadoCol = (value) => {
        return <span className={value === 'Ativo' ? 'table-col-estado table-col-estado-ativo' : 'table-col-estado table-col-estado-desativado'}>{value}</span>
    }

	const renderItem = (item, header) => {
		const headerKey = tableHeadersKeys.find((t) => t.label === header).key;

		if (item.itemClickCallback && item.itemClickCallback.itemKey === headerKey) {
			return (
				<button style={{ border: 'none', backgroundColor: 'transparent', textDecoration: 'underline' }} onClick={() => item.itemClickCallback.fn()}>
					{item[headerKey]}
				</button>
			)
		}

		return item[headerKey];
	}

	const renderDataCol = (value) => {
		const date = new Date(value);
        return (
			`${meses[date.getUTCMonth()]} ${date.getDate()}, ${date.getFullYear()}`
		)
    }

	const renderAvalicaoCol = (avaliacao) => {
		if (!avaliacao) return 'N/A';
		return (
			<div className='star-rating'>
				{[1, 2, 3, 4, 5].map((value) => (
					<FaStar
						key={value}
						size={30}
						color={value <= avaliacao ? '#ffc107' : '#e4e5e9'}
					/>
				))}
			</div>
		);
	};

	return (
		<div className='paginated-table-wrapper'>
			<table className={customTableClassName}>
				<thead>
					<tr>
						{tableHeaders.map((header, index) => (
							<th key={index}>{header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{paginatedData.map((item, index) => (
						<tr key={index}>
							{tableHeaders.map((header, subIndex) => (
								<td key={subIndex} className={`${customTableClassName ? `${customTableClassName}-${header.toLowerCase().trim()}`: header.toLowerCase().trim()}`}>
									{
										header.toLowerCase().trim() === 'estado' && renderEstadoCol(item[header.toLowerCase().trim()])
									}
									{
										header.toLowerCase().trim() === 'data' && (renderDataCol(item[header.toLowerCase().trim()]))
									}
																		{
										header.toLowerCase().trim() === 'feedback' && (renderAvalicaoCol(item[header.toLowerCase().trim()]))
									}
									{
									   header.toLowerCase().trim() !== 'estado' &&
									   header.toLowerCase().trim() !== 'data' &&
									   header.toLowerCase().trim() !== 'feedback' &&
									   renderItem(item, header)
                                    }
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<div className='pagination'>
				<button
					onClick={handlePrevClick}
					disabled={currentPage === 1}
					className={`${
						currentPage === 1 ? 'pagination-btn-disabled' : ''
					}`}
				>
					<FaChevronLeft />
				</button>
				<span>
					<span className='bold'>{currentPage}</span> / {pageCount}
				</span>
				<button
					onClick={handleNextClick}
					disabled={currentPage === pageCount}
					className={`${
						currentPage === pageCount
							? 'pagination-btn-disabled'
							: ''
					}`}
				>
					<FaChevronRight />
				</button>
			</div>
		</div>
	);
};

export default PaginatedTable;
