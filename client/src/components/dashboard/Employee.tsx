import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import {
  DropdownOptions,
  StylesConstant,
} from "../../utils/constants";
import { useEffect, useRef, useState } from "react";
import { LoadingSection } from "../../pages/Loading";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  salaryAnalyticsEmployeeYearAPI,
  salaryBifurcationLastMonthsAPI,
} from "../../firebase/api";
import { GraphBarWithLabel } from "../charts/GraphBar";
import PieChart from "../charts/PieChart";
import Dropdown from "../Dropdown";

const lastMonthsSpecific: { [key: string]: any } = {
  "Last Month": 1,
  "Last 3 Months": 3,
  "Last 6 Months": 6,
  "For a Year": 12,
};

export default function Employee() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const [barGraphEmployeeSalaryAnaytics, setBarGraphEmployeeSalaryAnaytics] =
    useState<any[]>([]);
  const [
    pieGraphEmployeeSalaryBifurcation,
    setPieGraphEmployeeSalaryBifurcation,
  ] = useState<any[]>([]);
  const [pieGraphToggle, setPieGraphToggle] = useState(
    lastMonthsSpecific["Last Month"]
  );
  const rangeText = useRef("");

  useEffect(() => {
    const fetch = async () => {
      const employeeSalaryYearData = await salaryAnalyticsEmployeeYearAPI(
        uid!,
        "2023"
      );
      setBarGraphEmployeeSalaryAnaytics(employeeSalaryYearData);
      setIsLoading(false);
    };
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const salaryBifurcationData = await salaryBifurcationLastMonthsAPI(
        uid!,
        pieGraphToggle
      );
      setPieGraphEmployeeSalaryBifurcation(salaryBifurcationData.result);
      rangeText.current = salaryBifurcationData.range!;
    };
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieGraphToggle]);

  return isLoading ? (
    <LoadingSection message="Loading... Please wait" />
  ) : (
    <Box
      sx={{
        ...StylesConstant.fullScreenCover,
        flexGrow: 1,
        display: "flex",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              backgroundColor: theme.palette.background.paper,
              padding: 3,
              boxShadow: "none",
              borderRadius: 3,
              backgroundImage: "none",
            }}
          >
            <Typography fontSize="1.2rem">Salary Chart Monthly</Typography>
            <Box height={300}>
              <GraphBarWithLabel
                data={barGraphEmployeeSalaryAnaytics}
                keys={["Basic Salary", "HRA", "Tax Deduction", "Total Salary"]}
                xaxis="Month"
                yaxis="Salary"
                indexBy="month"
                mode="grouped"
                enableLabel={false}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            sx={{
              height: 400,
              backgroundColor: theme.palette.background.paper,
              padding: 3,
              borderRadius: 3,
              backgroundImage: "none",
              boxShadow: "none",
            }}
          >
            <Box display="flex" flexDirection="row">
              <Typography fontSize="1.2rem" flexGrow={1}>
                Salary
                <Typography
                  component="span"
                  fontSize="0.8rem"
                  ml={1}
                  sx={{ opacity: 0.8 }}
                >
                  ( {rangeText.current} )
                </Typography>
              </Typography>
              <Dropdown
                fullWidth={false}
                title=""
                label=""
                initValue={lastMonthsSpecific["Last Month"]}
                onChange={(event) => {
                  setPieGraphToggle(event.target.value);
                }}
                options={DropdownOptions["monthDurationRange"]}
              />
            </Box>
            <PieChart data={pieGraphEmployeeSalaryBifurcation} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
