import { Container, Typography } from "@mui/material";
import { useLocation, useRouteError } from "react-router-dom";
import { StylesConstant } from "../utils/constants";

export default function ErrorPage() {
  const error: any = useRouteError();
  const location = useLocation();

  return (
    <Container
      maxWidth="md"
      sx={{
        ...StylesConstant.divCenterStyle,
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Typography variant="h2" gutterBottom>
        404
      </Typography>
      <Typography variant="body1" gutterBottom>
        Sorry, You might not be authorized. Please check with your
        administrator.
      </Typography>
      <Typography variant="body2" gutterBottom>
        No match for <code>{location.pathname}</code>. &nbsp;
        {/* {error.statusText || error.message} */}
      </Typography>
    </Container>
  );
}
