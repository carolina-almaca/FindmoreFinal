import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Logo2 from '../images/logo-2.png';
import { Col, Container, Form, Row } from 'react-bootstrap';
import FormInput from '../components/InputText';
import { useState } from 'react';
import axios from 'axios';

export default function Registar(props) {
    const { handleRegistarClose, handleLoginClick } = props;

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');

    const onRoleClick = (roleClicked) => {
        if (roleClicked === role) {
            setRole('');
        } else {
            setRole(roleClicked);
        }
    }

    const onRegistarRequest = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:3001/autenticar/register", { nomeU:nome, email, password, ativo: true, perfil:role });

            if (res === "" || res === false) return;

            handleRegistarClose();
            handleLoginClick();
          } catch (e) {
            setMessage(e.message)
          }
    }

    const isRegistarBtnDisabled = () => {
        return !nome || !email | !password || !passwordConfirmation || !role || (password !== passwordConfirmation);
    }
    
    return (
        <Modal show={true} onHide={handleRegistarClose} className='login-modal'>
            <Modal.Header closeButton>
                <Modal.Title>
                    Registar
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <img src={Logo2} alt='' />
                </Container>
                <Form>
                    <Form.Group>
                        <FormInput label="Nome" type="text" id="nome" helpBlockTxt="" onChange={(e)=> setNome(e.currentTarget.value)} />
                        <FormInput label="Email" type="email" id="email" helpBlockTxt="" onChange={(e)=> setEmail(e.currentTarget.value)} />
                        <FormInput label="Password" type="password" id="password" helpBlockTxt="" onChange={(e)=> setPassword(e.currentTarget.value)} />
                        <FormInput label="Confirmar password" type="password" id="passwordConfirmation" helpBlockTxt="" onChange={(e)=> setPasswordConfirmation(e.currentTarget.value)} />
                    </Form.Group>
                    {message && (
                        <div className="form-group">
                        <div className="alert alert-danger" role="alert"> {message}
                        </div> </div>
                    )}
                </Form>
                <Container className='form-container'>
                    <Row className='form-container-roles'>
                        <Col>
                            <Button className={`${role === 'comprador' ? 'btn-secondary' : ''}`} onClick={() => onRoleClick('comprador')}>Comprador</Button>
                        </Col>
                        <Col>
                            <Button className={`${role === 'vendedor' ? 'btn-secondary' : ''}`} onClick={() => onRoleClick('vendedor')}>Vendedor</Button>
                        </Col>
                    </Row>
                    <Row className='group-btns'>
                        <Col className='d-grid'>
                            <Button className={`btn-secondary${isRegistarBtnDisabled() ? ' disabled' : ''}`} size='lg' onClick={(e) => onRegistarRequest(e)}>Registar</Button>
                        </Col>
                        <Col className='d-grid'>
                            <Button size='lg' onClick={handleLoginClick}>Entrar</Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    )
}