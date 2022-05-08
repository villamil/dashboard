import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import raw from "../mocks/markdown.md";

const ProjectDetails = () => {
  const [markdown, setMarkdown] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    fetch(raw)
      .then((r) => r.text())
      .then((text) => {
        setMarkdown(text);
      });
  }, []);
  return (
    <Card className="p-5">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <Button className="p-0" variant="link" onClick={() => navigate(-1)}>
            Regresar
          </Button>
          <h1>Proyecto</h1>
        </div>
      </div>
      <ReactMarkdown className="mt-4" children={markdown} />
    </Card>
  );
};

export default ProjectDetails;
