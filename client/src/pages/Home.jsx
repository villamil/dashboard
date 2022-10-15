import { Card, Row, Col } from "react-bootstrap";
import CreateProjectCard from "components/CreateProjectCard";
import CreateVolunteerCard from "components/CreateVolunteerCard";
import { useQuery } from "@apollo/client";
import { GET_RANKINGS } from "graphql/queries";

function Home() {
  const { data: { getRankings: rankings } = {} } = useQuery(GET_RANKINGS);

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
              <Card.Text className="display-6">0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3 align-items-stretch">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total Proyectos</Card.Title>
              <Card.Text className="display-6">0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Top Voluntarios</Card.Title>
          <hr />
          {rankings?.map((voluntario) => (
            <>
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <i className="bi-person"></i>
                  <p className="ms-3">{voluntario?.user?.name}</p>
                </div>

                <div className="d-flex align-items-center me-5">
                  <p className="me-3">+{voluntario?.rank}</p>
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
