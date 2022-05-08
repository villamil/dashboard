import { forwardRef } from "react";
import Table from "utils/Table";
import { Dropdown } from "react-bootstrap";
import useAuth from "hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useOwner from "hooks/useOwner";
import CreateExperimentModal from "components/CreateExperimentModal";
import VolunteerConfigModal from "components/VolunteerConfigModal";

import DeleteButton from "./DeleteButton";

const EmptyData = () => {
  return (
    <div>
      <hr />
      <div className="d-flex justify-content-center">
        <p>Aún no has creado un proyecto</p>
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

const ProjectList = (props) => {
  const { data } = props;
  console.log(data);
  let { user } = useAuth();
  const navigate = useNavigate();
  const { isUserOwner } = useOwner();

  const columns = [
    {
      Header: "Proyecto",
      accessor: "name",
    },
    {
      Header: "Investigador",
      accessor: "user.name",
    },
    {
      Header: "Categoría",
      accessor: "category",
    },
    {
      Header: " ",
      accessor: "options",
      Cell: ({ row }) => {
        console.log(row?.original?._id);
        const projectId = row?.original?._id;
        const isOwner = isUserOwner(row?.original?.user);
        return (
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
              Custom toggle
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <VolunteerConfigModal project={row?.original} />
              </Dropdown.Item>
              <Dropdown.Item>Ver voluntarios</Dropdown.Item>
              {isOwner && (
                <>
                  <Dropdown.Item
                    onClick={() => navigate(`/${projectId}/experiments`)}
                  >
                    Ver Experimentos
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <CreateExperimentModal projectId={projectId} />
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        );
      },
      disableClick: true,
    },
    {
      Header: " ",
      accessor: "owner",
      Cell: ({ row }) => {
        const isOwner = isUserOwner(row?.original?.user);
        return isOwner ? (
          <DeleteButton>
            <DeleteButton.Cancel />
            <DeleteButton.Confirm />
          </DeleteButton>
        ) : null;
      },
      disableClick: true,
    },
  ];

  const redirectToDetails = (row) => {
    navigate(`/projects/${row.original._id}`);
  };

  return (
    <Table
      columns={columns}
      data={data?.getProjects || []}
      emptyData={<EmptyData />}
      onRowClick={redirectToDetails}
    />
  );
};

export default ProjectList;
