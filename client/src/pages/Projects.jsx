import { useState } from "react";
import { Form, Card } from "react-bootstrap";
import ProjectList from "components/ProjectList";
import CreateProjectModal from "components/CreateProjectModal";
import { useQuery } from "@apollo/client";
import { GET_PROJECTS } from "graphql/queries";

const Projects = () => {
  const [showAll, setShowAll] = useState(false);
  const { data } = useQuery(GET_PROJECTS);
  console.log(data);
  return (
    <Card className="p-5">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1>Proyectos</h1>

          <Form.Check
            type="switch"
            id="custom-switch"
            label="Todos los proyectos"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
        </div>
        <div>
          <CreateProjectModal />
        </div>
      </div>
      <ProjectList showAll={showAll} data={data} />
    </Card>
  );
};

export default Projects;
