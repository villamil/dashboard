import { Card } from "react-bootstrap";
import CreateVolunteerModal from "./CreateVolunteerModal";

const CreateVolunteerCard = () => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>Voluntario</Card.Title>
        <Card.Text className="mb-2">
          Conecta tu computadora para entrenar modelos de aprendizaje automatico
        </Card.Text>
        <CreateVolunteerModal />
      </Card.Body>
    </Card>
  );
};

export default CreateVolunteerCard;
