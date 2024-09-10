import { Modal, Button } from "react-bootstrap";

export default function ConfirmationDialog({
	show,
	handleClose,
	handleConfirm,
	message,
}) {
	return (
		<Modal show={show} onHide={handleClose} className="modal-dialog-confirmation">
			<Modal.Body
				style={{
					color: "#A82489",
					fontWeight: "bolder",
					fontSize: "32px",
				}}
			>
				{message}
			</Modal.Body>
			<Modal.Footer
				style={{
					justifyContent: "space-between",
				}}
			>
				<Button variant='secondary' onClick={handleConfirm}>
					Sim
				</Button>
				<Button variant='primary' onClick={handleClose}>
					Não
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
