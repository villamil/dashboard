import { Card, Row, Col } from "react-bootstrap";
import CreateProjectCard from "components/CreateProjectCard";
import CreateVolunteerCard from "components/CreateVolunteerCard";
import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "graphql/queries";

const topVoluntarios = [
  {
    name: "Luis Villamil",
    harts: 12,
  },
  {
    name: "Luis Villamil",
    harts: 12,
  },
  {
    name: "Luis Villamil",
    harts: 12,
  },
  {
    name: "Luis Villamil",
    harts: 12,
  },
];
function Home() {
  const { data } = useQuery(GET_BOOKS);

  return (
    <>
      <h1 className="text-secondary">Inicio</h1>
      <Row>
        <Col md={3} className="mb-3 align-items-stretch">
          <CreateProjectCard />
        </Col>
        <Col md={3} className="mb-3 align-items-stretch">
          <CreateVolunteerCard />
        </Col>
        <Col md={3} className="mb-3 align-items-stretch">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total Voluntarios</Card.Title>
              <Card.Text className="display-6">12,342</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3 align-items-stretch">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total Proyectos</Card.Title>
              <Card.Text className="display-6">12,342</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Top Voluntarios</Card.Title>
          <hr />
          {topVoluntarios.map((voluntario) => (
            <>
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <i className="bi-person"></i>
                  <p className="ms-3">{voluntario.name}</p>
                </div>

                <div className="d-flex align-items-center me-5">
                  <p className="me-3">+{voluntario.harts}</p>
                  <i className="fa-solid fa-fire"></i>
                </div>
              </div>
              <hr />
            </>
          ))}
        </Card.Body>
      </Card>
    </>
  );
}

export default Home;
