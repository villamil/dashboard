import { OverlayTrigger, Popover, Button } from "react-bootstrap";

const DeleteButton = ({ children }) => {
  return (
    <OverlayTrigger
      trigger="click"
      placement="right"
      overlay={
        <Popover id={`popover-delete`}>
          <Popover.Body className="d-flex flex-column">
            ¿Estás seguro?
            <div className="d-flex justify-content-around mt-2">{children}</div>
          </Popover.Body>
        </Popover>
      }
    >
      <i role="button" className="fa-solid fa-trash text-danger" />
    </OverlayTrigger>
  );
};

const Confirm = ({ onClick }) => (
  <Button variant="danger" className="btn-sm" onClick={onClick}>
    Si
  </Button>
);

const Cancel = ({ onClick }) => (
  <Button variant="primary" className="btn-sm" onClick={onClick}>
    No
  </Button>
);

DeleteButton.Confirm = Confirm;
DeleteButton.Cancel = Cancel;

export default DeleteButton;
