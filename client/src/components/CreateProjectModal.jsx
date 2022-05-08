import { useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT } from "graphql/mutations";
import { GET_PROJECTS } from "graphql/queries";
import { useDispatch } from "react-redux";
import { showMessage } from "store/features/message";
import { Form, Row, Col, Tooltip, Overlay } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreateProjectModal = () => {
  const [show, setShow] = useState(false);
  const [showTooltip, setTooltipShow] = useState(false);
  const target = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [mutateFunction] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
    onCompleted: () => {
      dispatch(
        showMessage({
          showMessage: true,
          title: "Projecto Creado",
          variant: "success",
          message: "A continuación crea un Dataset.",
        })
      );
      navigate("/projects");
      setShow(false);
    },
    onError: () => {
      showMessage({
        showMessage: true,
        title: "Error",
        variant: "danger",
        message: "Algo ha salido mal intenta mas tarde.",
      });
    },
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCreateProject = (event) => {
    event.preventDefault();
    let formData = new FormData(event.currentTarget);
    let name = formData.get("name");
    let category = formData.get("category");
    mutateFunction({ variables: { data: { name, category } } });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Crear Proyecto
      </Button>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
      >
        <Form onSubmit={handleCreateProject}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Proyecto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control name="name" type="text" />
                </Col>
                <Col md={6}>
                  <div className="d-flex justify-content-between">
                    <Form.Label>Descripción</Form.Label>
                    <i
                      ref={target}
                      onClick={() => setTooltipShow(!showTooltip)}
                      class="bi-info-circle"
                    ></i>

                    <Overlay
                      target={target.current}
                      show={showTooltip}
                      placement="top"
                    >
                      {(props) => (
                        <Tooltip id="overlay-example" {...props}>
                          Sube un archivo tipo .md que contenga una descripción
                          completa de tu proyecto, haz{" "}
                          <a
                            href="https://gist.github.com/Villanuevand/6386899f70346d4580c723232524d35a"
                            target="_blank"
                            rel="noreferrer"
                          >
                            clic aquí
                          </a>{" "}
                          para ver una guía
                        </Tooltip>
                      )}
                    </Overlay>
                  </div>
                  <Form.Control type="file" />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={6}>
                  <Form.Label>Categoría</Form.Label>
                  <Form.Control name="category" type="text" />
                </Col>
              </Row>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Crear
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CreateProjectModal;
