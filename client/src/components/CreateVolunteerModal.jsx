import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "api/api";
import fileDownload from 'js-file-download'

const DownloadList = () => {
  const onDonwload = (params) => api.get('/api/agent', {
    responseType: 'blob',
    params
  }).then((res) => {
    fileDownload(res.data, `${params?.os}-agent`)
  });

  const downloadLinux = () => onDonwload({ os: 'linux' });
  const downloadMac = () => onDonwload({ os: 'mac' });
  const downloadWindows = () => onDonwload({ os: 'windows' });

  return (
    <div className="d-flex justify-content-center pt-5 pb-5">
      <Button variant="primary" className="me-5" onClick={downloadWindows}>
        <i className="bi bi-windows" /> Windows
      </Button>
      <Button variant="primary" className="me-5" onClick={downloadMac}>
        <i className="bi bi-apple" /> MacOS
      </Button>
      <Button variant="primary" onClick={downloadLinux}>
        <i className="fa-brands fa-linux" /> Linux
      </Button>
    </div>
  );
};

const CreateVolunteerModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Contribuir a un Proyecto
      </Button>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Descarga el agente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DownloadList />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateVolunteerModal;
