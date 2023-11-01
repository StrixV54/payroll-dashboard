import { Box, Tab, Tabs, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { useLocation } from "react-router-dom";
import MainInfo from "./MainInfo";
import PersonalInfo from "./PersonalInfo";
import SalaryInfo from "./SalaryInfo";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function JobDetails() {
  const [value, setValue] = useState(0);
  // const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const location = useLocation();
  const { uid, displayName } = location?.state!;

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom mb={4} component={"p"}>
        User: {displayName}
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Main Details" />
            <Tab label="Personal Details" />
            <Tab label="Salary Details" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <MainInfo uid={uid} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <PersonalInfo uid={uid} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <SalaryInfo uid={uid} />
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
