import { Alert, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { showMessage } from "store/features/message";

const initialState = {
  showMessage: false,
  title: "",
  variant: "",
  message: "",
};

export default function Alerts() {
  const {
    showMessage: showMessageValue,
    variant,
    title,
    message,
  } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  if (showMessageValue) {
    return (
      <div className="container-fluid bg-white">
        <Container>
          <Alert
            variant={variant}
            onClose={() => dispatch(showMessage(initialState))}
            dismissible
          >
            <Alert.Heading>{title}</Alert.Heading>
            <p>{message}</p>
          </Alert>
        </Container>
      </div>
    );
  }
  return null;
}
