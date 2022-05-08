import { Card } from "react-bootstrap";
import InstallsList from "components/InstallsList";
import CreateVolunteerModal from "components/CreateVolunteerModal";
import { useQuery } from "@apollo/client";
import { GET_CONNECTIONS } from "graphql/queries";

const Installs = () => {
  const { data: { getConnections: connections } = {} } =
    useQuery(GET_CONNECTIONS);
  console.log(connections);
  return (
    <Card className="p-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Instalaciones</h1>
        <div>
          <CreateVolunteerModal />
        </div>
      </div>
      <InstallsList data={connections} />
    </Card>
  );
};

export default Installs;
