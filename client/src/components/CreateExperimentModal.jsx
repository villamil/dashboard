import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_EXPERIMENT } from "graphql/mutations";
import { GET_DATASETS, GET_PROJECTS, GET_EXPERIMENTS } from "graphql/queries";
import { showMessage } from "store/features/message";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateExperimentModal = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createExperiment] = useMutation(CREATE_EXPERIMENT, {
    refetchQueries: [{ query: GET_EXPERIMENTS }],
    onCompleted: () => {
      dispatch(
        showMessage({
          showMessage: true,
          title: "Experimento Creado",
          variant: "success",
          message: "Iniciando el entrenamiento.",
        })
      );
      navigate("/experiments");
      setShow(false);
    },
  });
  const { data: { getDatasets: datasets } = {} } = useQuery(GET_DATASETS);
  const { data: { getProjects: projects } = {} } = useQuery(GET_PROJECTS);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCreateExperiment = (event) => {
    event.preventDefault();
    let formData = new FormData(event.currentTarget);
    let name = formData.get("name");
    let image = formData.get("image");
    let projectId = formData.get("projectId");
    let datasetId = formData.get("datasetId");
    let epochs = formData.get("epochs");
    let splits = formData.get("splits");

    createExperiment({
      variables: {
        data: {
          name,
          image,
          projectId,
          datasetId,
          epochs,
          splits,
        },
      },
    });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Crear un Experimento
      </Button>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
      >
        <Form onSubmit={handleCreateExperiment}>
          <Modal.Header closeButton>
            <Modal.Title>Crear un Experimento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Clasificador de Imágenes"
                    name="name"
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Imágen</Form.Label>
                  <Form.Control
                    name="image"
                    type="text"
                    placeholder="Imágen de Docker"
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={6}>
                  <Form.Label>Proyecto</Form.Label>
                  <Form.Select name="projectId">
                    <option>Selecciona un Proyecto</option>
                    {projects?.map((project) => (
                      <option value={project._id}>{project.name}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={6}>
                  <Form.Label>Dataset</Form.Label>
                  <Form.Select name="datasetId">
                    <option>Selecciona un Dataset</option>
                    {datasets?.map((dataset) => (
                      <option value={dataset._id}>{dataset.name}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={6}>
                  <Form.Label>Epochs</Form.Label>
                  <Form.Control name="epochs" type="number" placeholder="50" />
                </Col>
                <Col md={6}>
                  <Form.Label>Splits</Form.Label>
                  <Form.Control name="splits" type="number" placeholder="4" />
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
