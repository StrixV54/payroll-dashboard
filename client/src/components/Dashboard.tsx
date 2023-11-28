import { Box, Button, Grid, Paper, Typography, useTheme } from "@mui/material";
import {
  ColorConstant,
  DropdownOptions,
  StylesConstant,
} from "../utils/constants";
import GraphBar, { GraphBarWithLabel } from "./charts/GraphBar";
import PieChart from "./charts/PieChart";
import { lineDataMonth, lineDataYear } from "./charts/data";
import LineChart from "./charts/LineChart";
import MenuButton from "./MenuButton";
import { useEffect, useState } from "react";
import {
  employeeDepartmentAPI,
  getEmployeesStatusAPI,
  salaryAnalyticsDepartmentAPI,
  salaryDepartmentAPI,
  salaryRangeAPI,
} from "../firebase/api";
import { LoadingSection } from "../pages/Loading";
import { numberFormat } from "../utils/helper";
import Dropdown from "./Dropdown";

type GraphToggle = "year" | "month";
interface PieDataProps {
  id: string;
  label: string;
  value: number;
}
interface EmployeeVsDeptDataProps {
  department: any;
  employees: number;
}

interface SalaryVsDeptDataProps {
  department: any;
  salary: number;
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

export default function Dashboard() {
  const theme = useTheme();
  const [pieGraphData, setPieGraphData] = useState<PieDataProps[]>([]);
  const [pieGraphEmployeesStatusData, setPieGraphEmployeesStatusData] =
    useState<PieDataProps[]>([]);
  const [barGraphEmployeeDeptData, setBarGraphEmployeeDeptData] = useState<
    EmployeeVsDeptDataProps[]
  >([]);
  const [barGraphSalaryDeptData, setBarGraphSalaryDeptData] = useState<
    SalaryVsDeptDataProps[]
  >([]);
  const [barGraphSalaryMonthWiseData, setBarGraphSalaryMonthWiseData] =
    useState<SalaryMonthWiseDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);

  useEffect(() => {
    //Fetch user detail
    const fetch = async () => {
      const salaryRangeData = await salaryRangeAPI();
      const employeeVsDepartmentData = await employeeDepartmentAPI();
      const salaryVsDepartmentData = await salaryDepartmentAPI();
      const salaryAnalyticsMonthWise = await salaryAnalyticsDepartmentAPI(
        "2023"
      );
      const employeesStatusData = await getEmployeesStatusAPI();
      setPieGraphEmployeesStatusData(employeesStatusData);
      setBarGraphSalaryMonthWiseData(
        salaryAnalyticsMonthWise as SalaryMonthWiseDataProps[]
      );
      setPieGraphData(salaryRangeData);
      setBarGraphEmployeeDeptData(employeeVsDepartmentData.result);
      setBarGraphSalaryDeptData(salaryVsDepartmentData.result);
      setTotalEmployee(employeeVsDepartmentData.totalEmployee);
      setTotalSalary(salaryVsDepartmentData.totalSalarySpentOverall);
      setIsLoading(false);
    };
    fetch();
  }, []);

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
        <Grid item xs={7}>
          <Paper
            sx={{
              backgroundColor: theme.palette.background.paper,
              padding: 3,
              boxShadow: "none",
              borderRadius: 3,
              backgroundImage: "none",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography fontSize="0.8rem">Total Employees:</Typography>
              <Typography fontSize="1.5rem" variant="body1" fontWeight="bold">
                {totalEmployee}
              </Typography>
            </Box>
            <Box height={300}>
              <GraphBar
                data={barGraphEmployeeDeptData}
                keys={["employees"]}
                xaxis="Department"
                yaxis="Employees"
                indexBy="department"
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={5}>
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
            <Typography fontSize="1.2rem">
              Salary Range
              <Typography
                component={"span"}
                fontSize="0.8rem"
                sx={{ color: ColorConstant.GRAY }}
              >
                {" "}
                (No of Employee)
              </Typography>
            </Typography>
            <PieChart data={pieGraphData} />
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper
            sx={{
              backgroundColor: theme.palette.background.paper,
              padding: 3,
              boxShadow: "none",
              borderRadius: 3,
              backgroundImage: "none",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography fontSize="0.8rem">
                Total Salary Spent Annually:
              </Typography>
              <Typography fontSize="1.5rem" variant="body1" fontWeight="bold">
                {numberFormat(totalSalary)}
              </Typography>
            </Box>
            <Box height={300}>
              <GraphBar
                data={barGraphSalaryDeptData}
                keys={["salary"]}
                xaxis="Department"
                yaxis="Salary Spent"
                indexBy="department"
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={5}>
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
            <Typography fontSize="1.2rem">
              Employees Status
              <Typography
                component={"span"}
                fontSize="0.8rem"
                sx={{ color: ColorConstant.GRAY }}
              >
                {" "}
                (No of Employee)
              </Typography>
            </Typography>
            <PieChart data={pieGraphEmployeesStatusData} />
          </Paper>
        </Grid>
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
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography fontSize="1.0rem" mb={2}>
                Department Analytics for year 2023
              </Typography>
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
                xaxis="Month"
                yaxis="Total Salary"
                indexBy="month"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
