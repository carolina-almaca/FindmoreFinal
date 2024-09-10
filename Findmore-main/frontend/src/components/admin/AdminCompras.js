import AdminNavbar from "../AdminNavbar";
import Footer from "../Footer";
import ResumeCard from "../ResumeCard";
import ComprasIcon from '../../images/compras-icon.svg'
import { FaSearch } from "react-icons/fa";
import PaginatedTable from "../PaginatedTable";
import { useEffect, useState } from "react";
import axios from "axios";
import DetalhesCompraPacoteModal from "../DetalhesCompraPacoteModal";
import DetalhesCompraProdutoModal from "../DetalhesCompraProdutoModal";

export default function AdminCompras({onLogout}) {
    const [compras, setCompras] = useState([]);
	const [comprasTableData, setComprasTableData] = useState([]);
	const [filteredComprasTableData, setFilteredComprasTableData] = useState([]);
    const [compraDetalhes, setCompraDetalhes] = useState(undefined);

    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:3001/compra`
                );

                // Add the isPacote flag
                data.forEach(response => {
                    response.isPacote = response.Pacotes && response.Pacotes.length > 0;
                });

                setCompras(data);
                setComprasTableData(parseTableData(compras));
                setFilteredComprasTableData(parseTableData(data));
            } catch (error) {}
        };

        fetchCompras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCompraClicked = (compra) => {
        if (!compra.isPacote) {
            const compraProduto = {
                Produto: compra.Produtos[0],
                Compra: {
                    idCompra: compra.Compra.idCompra,
                    dataCompra: compra.Compra.dataCompra,
                },
                Vendedor: {
                    nomeU: compra.Produtos[0].Vendedor.nomeU,
                    email: compra.Produtos[0].Vendedor.email || 'N/A'
                },
                comprador: compra.Comprador,
                Transacao: compra.Transacao,
                Feedback: compra.Feedback,
                VersaoP: compra.Produtos[0].VersaoP,
                isPacote: false,
            };

            setCompraDetalhes(compraProduto);
        } else {
            const compraPacote = {
                vendedor: {
                    nomeU: compra.Pacotes[0].Produtos[0].Vendedor.nomeU,
                    email: compra.Pacotes[0].Produtos[0].Vendedor.email
                },
                comprador: compra.Comprador,
                dataCompra: compra.Compra.dataCompra,
                idCompra: compra.Compra.idCompra,
                transacao: compra.Transacao,
                feedback: compra.Feedback,
                pacotes: compra.Pacotes.map(pacote => {
                    // Rename Produtos to produtos
                    return {
                        ...pacote,
                        produtos: pacote.Produtos,
                        Produtos: undefined // This removes the Produtos key
                    };
                }),
                isPacote: true,
            };
            setCompraDetalhes(compraPacote);
        }
	}

    const parseTableData = (data) => {
		if (!data) return [];
		const parsedData = data.map((d) => {
			return {
				id: d.Compra.idCompra,
				nome: d.isPacote ? d.Pacotes[0].nomePacote : d.Produtos[0].nomeP,
                tipo: d.isPacote ? 'Pacote' : 'Produto',
                data: d.Compra.dataCompra,
                valor: d.isPacote ? `${d.Pacotes[0].valor.toFixed(2)}€` : `${d.Produtos[0].preco.toFixed(2)}€`,
				itemClickCallback: {
					itemKey: 'id',
					fn: () =>
						handleCompraClicked(d),
				},
			};
		});

		return parsedData;
	};

    const onSearch = (e) => {
        const searchValue = String(e.target.value);

		if (searchValue !== '') {
			const filteredData = comprasTableData.filter(
				(data) =>
					String(data.id).toLowerCase().includes(searchValue) ||
					data.nome.toLowerCase().includes(searchValue) ||
					String(data.valor).includes(searchValue)
			);

			setFilteredComprasTableData(filteredData);
		} else {
			setFilteredComprasTableData(parseTableData(compras));
		}
    }
    return (
        <main>
			<AdminNavbar onLogout={onLogout} />
            <div className='container-wrapper'>
                {
                    compraDetalhes && compraDetalhes.isPacote && <DetalhesCompraPacoteModal compraPacoteDetalhes={compraDetalhes} handleCloseModal={() => setCompraDetalhes(undefined)} />
                }
                {
                    compraDetalhes && !compraDetalhes.isPacote && <DetalhesCompraProdutoModal produtoCompra={compraDetalhes} handleCloseModal={() => setCompraDetalhes(undefined)} />
                }
				<div className='admin-pages-container'>
					<div className='admin-vendedores-resume-cards'>
						<ResumeCard
							icon={ComprasIcon}
							subtitle='Compras realizadas'
                            title={compras.length}
						/>
					</div>
				</div>
				<div className='admin-compradores-table-wrapper'>
					<div className='admin-compradores-table-wrapper-header'>
						<h1>Compras</h1>
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
						tableHeaders={['ID Compra', 'Nome', 'Tipo', 'Data', 'Montante']}
						tableData={filteredComprasTableData}
						rowsPerPage={5}
						customTableClassName='admin-compradores-table'
						tableHeadersKeys={[
							{
								key: 'id',
								label: 'ID Compra',
							},
							{
								key: 'nome',
								label: 'Nome',
							},
                            {
								key: 'tipo',
								label: 'Tipo',
							},
							{
								key: 'data',
								label: 'Data',
							},
                            {
								key: 'valor',
								label: 'Montante',
							},
						]}
					/>
				</div>
			</div>
			<Footer />
		</main>
    )
}