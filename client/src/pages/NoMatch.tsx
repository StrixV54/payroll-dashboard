import { Container, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { StylesConstant } from "../utils/constants";

export default function NoMatch() {
  let location = useLocation();

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
        No match for <code>{location.pathname}</code>
      </Typography>
    </Container>
  );
}

// export default function ErrorPage() {
//   const error: any = useRouteError();
//   console.error(error);

//   return (
//     <div id="error-page">
//       <h1>Oops!</h1>
//       <p>Sorry, an unexpected error has occurred.</p>
//       <p>
//         <i>{error.statusText || error.message}</i>
//       </p>
//     </div>
//   );
// }
