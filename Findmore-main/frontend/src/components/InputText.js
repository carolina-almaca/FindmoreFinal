import Form from 'react-bootstrap/Form';

function FormInput(props) {
    const { label, type, id, helpBlockTxt, onChange, value, defaultValue, placeholder, disabled=false, pattern, } = props;

    return (
        <div className='form-input'>
            <Form.Label htmlFor={id}>{label}</Form.Label>
            <Form.Control
                type={type}
                id={id}
                aria-describedby="inputHelpBlock"
                onChange={onChange}
                value={value}
                defaultValue={defaultValue}
                placeholder={placeholder}
                disabled={disabled}
                pattern={pattern}
            />
            <Form.Text id="inputHelpBlock" muted>
                {helpBlockTxt}
            </Form.Text>
        </div>
    );
}

export default FormInput;