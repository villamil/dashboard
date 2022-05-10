import { forwardRef } from "react";
import Table from "utils/Table";
import useAuth from "hooks/useAuth";
import { Dropdown } from "react-bootstrap";
import DeleteButton from "./DeleteButton";

const EmptyData = () => {
  return (
    <div>
      <hr />
      <div className="d-flex justify-content-center">
        <p>Aún no has creado un experimento</p>
      </div>
    </div>
  );
};

const CustomToggle = forwardRef(({ onClick }, ref) => (
  <i
    role="button"
    className="fa-solid fa-ellipsis-vertical"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

const ExperimentList = (props) => {
  const { data = [] } = props;
  let { user } = useAuth();

  const columns = [
    {
      Header: "Nombre",
      accessor: "name",
    },
    {
      Header: "Projecto",
      accessor: "project.name",
    },
    {
      Header: "Imagen",
      accessor: "image",
    },
    {
      Header: "Dataset",
      accessor: "dataset.name",
    },
    {
      Header: "Epochs",
      accessor: "epochs",
    },
    {
      Header: "Splits",
      accessor: "splits",
    },
    {
      Header: "Estatus",
      accessor: "status",
    },
    {
      Header: "Descargar Modelo",
      accessor: "download",
      Cell: ({ value }) => {
        return <a href={value}>Descargar</a>;
      },
    },
    {
      Header: " ",
      accessor: "owner",
      Cell: ({ value }) => {
        return value === user ? (
          <DeleteButton>
            <DeleteButton.Cancel />
            <DeleteButton.Confirm />
          </DeleteButton>
        ) : null;
      },
      disableClick: true,
    },
    {
      Header: " ",
      accessor: "options",
      Cell: ({ row }) => {
        return (
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
              Custom toggle
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Detener</Dropdown.Item>
              <Dropdown.Item>Reiniciar</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
      disableClick: true,
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      emptyData={<EmptyData />}
      disableClick
    />
  );
};

export default ExperimentList;
