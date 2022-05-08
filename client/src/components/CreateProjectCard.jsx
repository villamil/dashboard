import { Card } from "react-bootstrap";
import CreateProjectModal from "./CreateProjectModal";
const CreateProjectCard = () => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>Proyectos</Card.Title>
        <Card.Text className="mb-2">
          Desarrolla un proyecto y aprovecha el poder computacional de la
          comunidad.
        </Card.Text>
        <CreateProjectModal />
      </Card.Body>
    </Card>
  );
};

export default CreateProjectCard;
