import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { GET_VOLUNTEER_CONFIG } from "graphql/queries";
import { useQuery } from "@apollo/client";
import convert from "json-to-plain-text";

const VolunteerConfigModal = (props) => {
  const {
    project: { name, _id },
  } = props;

  const { data: { getVolunteerConfig: configs } = {} } =
    useQuery(GET_VOLUNTEER_CONFIG);

  const userId = localStorage.getItem("userId");

  let agentConfig = { ...configs };

  if (agentConfig) {
    agentConfig.user_id = userId;
    agentConfig.project_id = _id;
  }

  const dataInString = convert.toPlainText(agentConfig);
  console.log(dataInString);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([dataInString], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "config.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Contribuir
      </Button>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Descargar configuración</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Descarga el archivo de configuración y agregalo a la misma carpeta
            donde se encuentra el agente para ejecutarlo y así poder realizar
            tareas de entrenamiento para este proyecto.
          </p>
          <div
            className="mt-4"
            style={{ padding: "1.5rem", backgroundColor: "#f7f7f9" }}
          >
            <pre style={{ padding: 0, margin: 0 }}>
              ./index-linux config.txt
            </pre>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={downloadTxtFile}>
            Descargar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VolunteerConfigModal;
