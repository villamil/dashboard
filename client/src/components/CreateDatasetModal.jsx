import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import api from "api/api";
import { useNavigate } from "react-router-dom";
import { showMessage } from "store/features/message";
import { useDispatch } from "react-redux";

const CreateExperimentModal = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCreateDataset = (event) => {
    event.preventDefault();
    let formData = new FormData(event.currentTarget);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    api
      .post(`${process.env.REACT_APP_API_URL}/api/upload/dataset`, formData, {
        headers: {
          authorization: token,
        },
        params: {
          userId,
        },
      })
      .then((data) => {
        dispatch(
          showMessage({
            showMessage: true,
            title: "Dataset Creado",
            variant: "success",
            message: "Ya puedes crear experimentos!.",
          })
        );
        navigate("/datasets");
        setShow(false);
      });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Crear un Dataset
      </Button>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
      >
        <Form onSubmit={handleCreateDataset}>
          <Modal.Header closeButton>
            <Modal.Title>Crear un Dataset</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tiny Image Net"
                    name="name"
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Dataset</Form.Label>
                  <Form.Control
                    name="dataset"
                    type="file"
                    placeholder="Formato Zip"
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={6}>
                  <Form.Label>Folder Principal</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="TinyImageNet"
                    name="rootFolder"
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control name="description" as="textarea" rows={3} />
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

export default CreateExperimentModal;
