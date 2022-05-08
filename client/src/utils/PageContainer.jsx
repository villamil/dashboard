export const PageContainer = ({ children }) => {
  return <div className="d-flex justify-content-between">{children}</div>;
};

export const PageTitle = ({ children }) => {
  return <h1>{children}</h1>;
};
