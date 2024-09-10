import { Modal } from 'react-bootstrap';
import '../styles/modalDetalhesPacote.css';

const DetalhesCompletosPacoteModal = ({ pacote, handleCloseModal }) => {
	return (
		<Modal
			show={true}
			onHide={handleCloseModal}
			className='modal-detalhes-pacote'
		>
			<Modal.Header closeButton>
				<span className='modal-detalhes-compra-produto-header'>
					Detalhes Pacote
				</span>
			</Modal.Header>
			<Modal.Body>
				<div className='modal-detalhes-pacote-content'>
					<h1>{pacote.nomePacote}</h1>
					<h2>
						Stock: <span>{pacote.quantidadePacote}</span>
					</h2>
					<h2>
						Preço: <span>{`${pacote.valor.toFixed(2)}€`}</span>
					</h2>
					<h2>
						Produtos
					</h2>

                    <ul>
                        {
                            pacote.produtos.map((produto) => {
                                return <li key={`p-${produto.idProduto}`}>{`${produto.nomeP} - Stock: ${produto.stock} - Preço: ${produto.preco.toFixed(2)}€ - Licença: ${produto.licenca} - Categoria: ${produto.categoria}`}</li>
                            })
                        }
                    </ul>
					
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default DetalhesCompletosPacoteModal;
