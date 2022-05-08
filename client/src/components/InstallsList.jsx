import Table from "utils/Table";

const columns = [
  {
    Header: "Nombre",
    accessor: "user.name",
  },
  {
    Header: "Sistema Operativo",
    accessor: "os",
  },

  {
    Header: "Conectado",
    accessor: "status",
    Cell: ({ value }) => {
      return value === "Conectado" ? (
        <i className="fa-solid fa-circle text-primary ms-4" />
      ) : (
        <i className="fa-solid fa-circle text-secondary ms-4" />
      );
    },
  },
];

const EmptyData = () => {
  return (
    <div>
      <hr />
      <div className="d-flex justify-content-center">
        <p>Aún no has instalado el agente</p>
      </div>
    </div>
  );
};

const InstallsList = (props) => {
  const { data = [] } = props;
  return <Table columns={columns} data={data} emptyData={<EmptyData />} />;
};

export default InstallsList;
