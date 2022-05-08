import { useNavigate, useLocation, Link } from "react-router-dom";
import { Form, Row, Col, Card, Button } from "react-bootstrap";
import useAuth from "hooks/useAuth";

export default function Login() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/home";

  function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let email = formData.get("email");
    let password = formData.get("password");
    


    auth.signin({ email, password }, (error) => {
      console.log(error);
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true });
    });
  }

  return (
    <div className="pt-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <Card className="p-5">
            <h1>Iniciar sesión</h1>

            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Correo Electronico</Form.Label>
                <Form.Control name="email" type="email"></Form.Control>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control name="password" type="password"></Form.Control>
              </Form.Group>
              <div className="mt-4">
                <Link to="/register">Crear una cuenta</Link>
                <Button className="float-end" variant="primary" type="submit">
                  Acceder
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
