import { Container, Typography } from "@mui/material";
import { RotateLoader } from "react-spinners";
import { StylesConstant } from "../utils/constants";

export default function Loading({ message }: { message?: string }) {
  return (
    <Container
      maxWidth={false}
      sx={{
        ...StylesConstant.divCenterStyle,
        ...StylesConstant.fullScreenVWPort,
        flexDirection: "column",
      }}
    >
      <RotateLoader color="#36d7b7" size={20} />
      <Typography variant="h6" mt={10}>
        {message || ""}
      </Typography>
    </Container>
  );
}
