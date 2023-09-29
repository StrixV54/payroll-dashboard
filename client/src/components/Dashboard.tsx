import { Box } from "@mui/material";
import { ColorConstant, StylesConstant } from "../utils/constants";

export default function Dashboard() {
  return (
    <Box
      sx={{
        ...StylesConstant.fullScreenCover,
      }}
      bgcolor={ColorConstant.BLACK}
    >
      Dashboard
    </Box>
  );
}
