import Table from "utils/Table";

const EmptyData = () => {
  return (
    <div>
      <hr />
      <div className="d-flex justify-content-center">
        <p>Aún no has creado un dataset</p>
      </div>
    </div>
  );
};

const DatasetList = (props) => {
  const { data } = props;
  const columns = [
    {
      Header: "Nombre",
      accessor: "name",
    },
    {
      Header: "Descripción",
      accessor: "description",
    },
    {
      Header: "Estatus",
      accessor: "ready",
      Cell: ({ value }) => (value ? "Disponible" : "Procesando"),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data?.getDatasets || []}
      emptyData={<EmptyData />}
    />
  );
};

export default DatasetList;
