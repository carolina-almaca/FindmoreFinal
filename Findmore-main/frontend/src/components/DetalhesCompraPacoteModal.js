import { Modal } from 'react-bootstrap';
import '../styles/modalDetalhesCompraProduto.css';
import UserIcon from '../images/user-icon.svg';
import { FaStar } from 'react-icons/fa';

const meses = [
	'Janeiro',
	'Fevereiro',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro',
];

const DetalhesCompraPacoteModal = ({
	compraPacoteDetalhes,
	handleCloseModal,
}) => {
	const {
		vendedor,
		comprador,
		dataCompra,
		idCompra,
		transacao,
		feedback,
		pacotes,
	} = compraPacoteDetalhes;

	const pacote = pacotes[0];

	const renderDataCol = (value) => {
		const date = new Date(value);
		return `${date.getDate()} de ${
			meses[date.getUTCMonth()]
		}, ${date.getFullYear()}`;
	};

	const renderAvalicaoCol = (avaliacao) => {
		if (!avaliacao) return 'N/A';
		return (
			<div className='star-rating'>
				{[1, 2, 3, 4, 5].map((value) => (
					<FaStar
						key={value}
						size={20}
						color={value <= avaliacao ? '#ffc107' : '#e4e5e9'}
					/>
				))}
			</div>
		);
	};

	return (
		<Modal
			show={true}
			onHide={handleCloseModal}
			className='modal-detalhes-compra-produto'
		>
			<Modal.Header closeButton>
				<span className='modal-detalhes-compra-produto-header'>
					Detalhes Compra
				</span>
			</Modal.Header>
			<Modal.Body>
				<div className='modal-detalhes-compra-produtos-content'>
					<div className='modal-detalhes-compra-produtos-content-header'>
						<h1>{renderDataCol(dataCompra)}</h1>
						<h2>{`#ID: ${idCompra}`}</h2>
					</div>
					<div className='modal-detalhes-compra-produtos-content-section'>
						<div className='modal-detalhes-compra-produtos-content-section-user'>
							<img src={UserIcon} alt='' />
							<div>
								<h1>Vendedor</h1>
								<h2>{vendedor.nomeU || 'N/A'}</h2>
								{<h2>{vendedor.email}</h2>}
							</div>
						</div>
						<div className='modal-detalhes-compra-produtos-content-section-user'>
							<img src={UserIcon} alt='' />
							<div>
								<h1>Comprador</h1>
								<h2>{comprador.nomeU}</h2>
								<h2>{comprador.email}</h2>
							</div>
						</div>
					</div>
					<div className='modal-detalhes-compra-produtos-content-section'>
						<div className='modal-detalhes-compra-produtos-content-section-detalhes'>
							<h1>Detalhes de Pagamento</h1>
							<div className='modal-detalhes-compra-produtos-content-section-detalhes-item'>
								<span>Nome do cartão:</span>{' '}
								<h2>{transacao.nomeCartao}</h2>
							</div>
							<div className='modal-detalhes-compra-produtos-content-section-detalhes-item'>
								<span>Número do cartão: </span>{' '}
								<h2>
									{`${String(transacao.numeroCartao).slice(0,3)}**********`}
								</h2>
							</div>
						</div>
						<div className='modal-detalhes-compra-produtos-content-section-detalhes'>
							<h1>Feedback</h1>
							<div className='modal-detalhes-compra-produtos-content-section-detalhes-avaliacao'>
								<span>Avaliação: </span>
								{feedback.avaliacao ? (
									renderAvalicaoCol(feedback.avaliacao)
								) : (
									<h2>N/A</h2>
								)}
							</div>
							<div className='modal-detalhes-compra-produtos-content-section-detalhes-item'>
								<span>Comentário: </span>{' '}
								<h2> {feedback.comentario || 'N/A'}</h2>
							</div>
						</div>
					</div>
					<h1 className='modal-detalhes-compra-produtos-content-title'>{`${pacote.nomePacote} - ${pacote.valor}€`}</h1>
					<div className='admin-dashboard-compras-recentes'>
						<table>
							<thead>
								<tr>
									<th>Nome</th>
									<th>Mini Descrição</th>
									<th>Quantidade</th>
									<th>Total</th>
								</tr>
							</thead>
							<tbody>
								{pacote.produtos.map((produto) => {
									return (
										<tr key={`p-${produto.idProduto}`}>
											<td>{produto.nomeP}</td>
											<td>{produto.miniDescricao}</td>
											<td>{produto.stock}</td>
											<td>{`${produto.preco}€`}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default DetalhesCompraPacoteModal;
