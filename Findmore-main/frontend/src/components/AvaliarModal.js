import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import FormInput from './InputText';
import Logo2 from '../images/logo-2.png';
import { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

export default function AvaliarModal({
	handleCloseModal,
	handleProdutoAvaliado,
	produtoAvaliar,
}) {
	const [comentario, setComentario] = useState(produtoAvaliar.comentario || '');
	const [rating, setRating] = useState(produtoAvaliar.avaliacao || 0);
	const [hover, setHover] = useState(0);

	const onGravar = async (e) => {
		e.preventDefault();

		const { idCompra, idFeedback } = produtoAvaliar;

		try {
			await axios.put(`http://localhost:3001/feedback/${idFeedback}`, {
				idFeedback,
				idCompra,
				comentario,
				avaliacao: rating,
			});

			handleProdutoAvaliado();
		} catch (error) {}
		return;
	};

	const handleClick = (value) => {
		setRating(value);
	};

	return (
		<Modal show={true} onHide={handleCloseModal} className='login-modal'>
			<Modal.Header closeButton>
				<Modal.Title>Avaliar</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<img src={Logo2} alt='' />
				</Container>
				<Form>
					<Form.Group>
						<Form.Label>Avaliação</Form.Label>
						<div className='star-rating'>
							{[1, 2, 3, 4, 5].map((value) => (
								<FaStar
									key={value}
									size={30}
									color={
										value <= (hover || rating)
											? '#ffc107'
											: '#e4e5e9'
									}
									onMouseEnter={() => setHover(value)}
									onMouseLeave={() => setHover(0)}
									onClick={() => handleClick(value)}
								/>
							))}
						</div>
						<FormInput
							label='Comentário'
							type='text'
							id='comentario'
							helpBlockTxt=''
							defaultValue={comentario}
							onChange={(e) =>
								setComentario(e.currentTarget.value)
							}
						/>
					</Form.Group>
				</Form>
				<Container className='form-container'>
					<Row className='group-btns'>
						<Col className='d-grid'>
							<Button
								className='btn-secondary'
								size='lg'
								onClick={(e) => onGravar(e)}
								disabled={!rating || !comentario}
							>
								Gravar
							</Button>
						</Col>
					</Row>
				</Container>
			</Modal.Body>
		</Modal>
	);
}
