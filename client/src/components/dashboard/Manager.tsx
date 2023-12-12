import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import {
  ColorConstant,
  DropdownOptions,
  StylesConstant,
} from "../../utils/constants";
import { GraphBarWithLabel } from "../charts/GraphBar";
import { useEffect, useState } from "react";
import {
  employeeDepartmentStatusYearAPI,
  salaryAnalyticsHalfYearDepartmentAPI,
  salaryAnalyticsQuarterDepartmentAPI,
  salaryAnalyticsYearDepartmentAPI,
} from "../../firebase/api";
import { LoadingSection } from "../../pages/Loading";
import Dropdown from "../Dropdown";

interface EmployeeStatusDataProps {
  Active: number;
  Inactive: number;
  Promoted: number;
  department: string;
}

interface SalaryMonthWiseDataProps {
  month: string;
  Sales: number;
  Finance: number;
  HR: number;
  "IT Support": number;
  Marketing: number;
  Engineering: number;
}

export default function Manager() {
  const theme = useTheme();
  const [barGraphEmployeesStatusData, setBarGraphEmployeesStatusData] =
    useState<EmployeeStatusDataProps[]>([]);
  const [barGraphSalaryMonthWiseData, setBarGraphSalaryMonthWiseData] =
    useState<SalaryMonthWiseDataProps[]>([]);
  const [yearQuarterToggle, setYearQuarterToggle] = useState("Year");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiToggle: { [key: string]: any } = {
      Year: salaryAnalyticsYearDepartmentAPI,
      "Half Yearly": salaryAnalyticsHalfYearDepartmentAPI,
      Quarterly: salaryAnalyticsQuarterDepartmentAPI,
    };

    //Fetch user detail
    const fetch = async () => {
      const salaryAnalyticsMonthWise = await apiToggle[yearQuarterToggle](
        new Date().getFullYear().toString()
      );
      const employeesStatusData = await employeeDepartmentStatusYearAPI("2023");
      setBarGraphEmployeesStatusData(employeesStatusData);
      console.log(employeesStatusData);
      setBarGraphSalaryMonthWiseData(
        salaryAnalyticsMonthWise as SalaryMonthWiseDataProps[]
      );
      setIsLoading(false);
    };
    fetch();
  }, [yearQuarterToggle]);

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
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography fontSize="1.0rem" mb={2} flex={1}>
                Department Analytics: 2023
              </Typography>
              <Dropdown
                title="Range"
                label="Range"
                initValue={"Year"}
                fullWidth={false}
                options={DropdownOptions["yearQuarter"]}
                onChange={(event) => setYearQuarterToggle(event.target.value)}
              />
            </Box>
            <Box height={300}>
              <GraphBarWithLabel
                data={barGraphSalaryMonthWiseData}
                keys={[
                  "Engineering",
                  "Finance",
                  "HR",
                  "IT Support",
                  "Marketing",
                  "Sales",
                ]}
                xaxis={
                  yearQuarterToggle === "Year"
                    ? "Month"
                    : yearQuarterToggle === "Half Yearly"
                    ? "Half Year"
                    : "Quarter"
                }
                yaxis="Total Salary"
                indexBy={
                  yearQuarterToggle === "Year"
                    ? "month"
                    : yearQuarterToggle === "Half Yearly"
                    ? "halfyear"
                    : "quarter"
                }
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
            <Typography fontSize="1rem">
              Employees Status
              <Typography
                component={"span"}
                fontSize="0.8rem"
                sx={{ color: ColorConstant.GRAY }}
              >
                {" (No of Employee)"}
              </Typography>
            </Typography>
            <Box height={300}>
              <GraphBarWithLabel
                data={barGraphEmployeesStatusData}
                keys={["Active", "Inactive", "Promoted"]}
                xaxis="Department"
                yaxis="Status"
                indexBy="department"
                mode="grouped"
                tickValues={[]}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
