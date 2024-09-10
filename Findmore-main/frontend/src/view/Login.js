import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Logo2 from '../images/logo-2.png';
import { Col, Container, Form, Row } from 'react-bootstrap';
import FormInput from '../components/InputText';
import { useState } from 'react';
import authService from './auth.service';

export default function Login(props) {
    const { handleLoginClose, handleRegistarClick, onLoginSuccess } = props;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');

    const onRoleClick = (roleClicked) => {
        if (roleClicked === role) {
            setRole('');
        } else {
            setRole(roleClicked);
        }
    }

    const onLoginRequest = async (e) => {
        e.preventDefault();

        // change this to authService.login
        authService.login(email, password, role).then((res) => {
            if (res === "" || res === false) return;

            handleLoginClose();
            onLoginSuccess();
        }).catch(e => {
            setMessage(e.message)
        });
    }

    return (
        <Modal show={true} onHide={handleLoginClose} className='login-modal'>
            <Modal.Header closeButton>
                <Modal.Title>
                    ENTRAR
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <img src={Logo2} alt='' />
                </Container>
                <Form>
                    <Form.Group>
                        <FormInput label="Email" type="email" id="email" helpBlockTxt="" onChange={(e)=> setEmail(e.currentTarget.value)} />
                        <FormInput label="Password" type="password" id="password" helpBlockTxt="" onChange={(e)=> setPassword(e.currentTarget.value)} />
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
                        <Col>
                            <Button className={`${role === 'admin' ? 'btn-secondary' : ''}`} onClick={() => onRoleClick('admin')}>Administrador</Button>
                        </Col>
                    </Row>
                    <Row className='group-btns'>
                        <Col className='d-grid'>
                            <Button className={`btn-secondary ${!email || !password || !role ? 'disabled' : ''}`} size='lg' onClick={(e) => onLoginRequest(e)}>Entrar</Button>
                        </Col>
                        <Col className='d-grid'>
                            <Button size='lg' onClick={handleRegistarClick}>Registar</Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    )
}