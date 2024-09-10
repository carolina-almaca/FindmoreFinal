import { Modal } from 'react-bootstrap';
import '../styles/modalDetalhesProduto.css';

const DetalhesCompletosProdutoModal = ({ produto, handleCloseModal }) => {
	const renderVersaoProduto = () => {
		if (produto.nomeVersaoP) {
			return produto.nomeVersaoP;
		}

		if (produto.versaoPs && produto.versaoPs.length >=1) {
			return produto.versaoPs[0].nomeVersaoP;
		}

		return 'N/A';
	}
	return (
		<Modal
			show={true}
			onHide={handleCloseModal}
			className='modal-detalhes-produto'
		>
			<Modal.Header closeButton>
				<span className='modal-detalhes-compra-produto-header'>
					Detalhes Produto
				</span>
			</Modal.Header>
			<Modal.Body>
				<div className='modal-detalhes-produtos-content'>
					<h1>{produto.nomeP}</h1>
					<h2>
						Stock: <span>{produto.stock}</span>
					</h2>
					<h2>
						Preço: <span>{`${produto.preco.toFixed(2)}€`}</span>
					</h2>
					<h2>
						Mini Descrição: <span>{produto.miniDescricao}</span>
					</h2>
					<h2>
						Descrição: <span>{produto.descricao}</span>
					</h2>
					<h2>
						Categoria: <span>{produto.categoria}</span>
					</h2>
					<h2>
						Versão: <span>{renderVersaoProduto()}</span>
					</h2>
					<h2>
						Licença: <span>{produto.licenca}</span>
					</h2>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default DetalhesCompletosProdutoModal;
