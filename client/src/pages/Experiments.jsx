import { Card } from "react-bootstrap";
import ExperimentList from "components/ExperimentList";
import CreateExperimentModal from "components/CreateExperimentModal";
import { useQuery } from "@apollo/client";
import { GET_EXPERIMENTS } from "graphql/queries";

const Experiments = () => {
  const { data: { getExperiments: experiments } = {} } =
    useQuery(GET_EXPERIMENTS);
  console.log(experiments);
  return (
    <Card className="p-5">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1>Experimentos</h1>
        </div>

        <div>
          <CreateExperimentModal />
        </div>
      </div>
      <ExperimentList data={experiments} />
    </Card>
  );
};

export default Experiments;
