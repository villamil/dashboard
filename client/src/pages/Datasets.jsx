import { Card } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_DATASETS } from "graphql/queries";
import DatasetList from "components/DatasetList";
import CreateDatasetModal from "components/CreateDatasetModal";

const Datasets = () => {
  const { data } = useQuery(GET_DATASETS);
  console.log(data);
  return (
    <Card className="p-5">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1>Datasets</h1>
        </div>

        <div>
          <CreateDatasetModal />
        </div>
      </div>
      <DatasetList data={data} />
    </Card>
  );
};

export default Datasets;
