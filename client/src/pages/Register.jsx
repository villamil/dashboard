import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Form, Row, Col, Card, Button } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { showMessage } from "store/features/message"

export default function Register() {
  const [data, setData] = useState();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, data)
        .then(data => {
          dispatch(showMessage({
            showMessage: true,
            title: 'Usuario Creado',
            variant: 'success',
            message: 'Ya puedes ingresar al sistema.',
          }))
          navigate("/Login");
        });
  };

  const handleOnChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  return (
    <div className="pt-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <Card className="p-5">
            <h1>Regístrate</h1>

            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control name="name" type="text" onChange={handleOnChange}></Form.Control>

                <Form.Label className="mt-2">Correo Electronico</Form.Label>
                <Form.Control name="email" type="email" onChange={handleOnChange}></Form.Control>

                <Form.Label className="mt-2">Contraseña</Form.Label>
                <Form.Control name="password" type="password" onChange={handleOnChange}></Form.Control>

                <div className="mt-4">
                  <Link to="/Login">Regresar</Link>
                  <Button className="float-end" variant="primary" type="submit">
                    Crear Cuenta
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </Card>
        </Col>

        
      </Row>
    </div>
  );
}
