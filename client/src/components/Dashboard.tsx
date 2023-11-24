import { Box, Button, Grid, Paper, Typography, useTheme } from "@mui/material";
import {
  ColorConstant,
  DropdownOptions,
  StylesConstant,
} from "../utils/constants";
import GraphBar from "./charts/GraphBar";
import PieChart from "./charts/PieChart";
import {
  barData,
  barDataEmployee,
  lineDataMonth,
  lineDataYear,
  pieData,
} from "./charts/data";
import LineChart from "./charts/LineChart";
import MenuButton from "./MenuButton";
import { useEffect, useState } from "react";
import {
  employeeDepartmentAPI,
  salaryDepartmentAPI,
  salaryRangeAPI,
} from "../firebase/api";
import { LoadingSection } from "../pages/Loading";
import { numberFormat } from "../utils/helper";

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

export default function Dashboard() {
  const theme = useTheme();
  const [pieGraphData, setPieGraphData] = useState<PieDataProps[]>([]);
  const [barGraphEmployeeDeptData, setBarGraphEmployeeDeptData] = useState<
    EmployeeVsDeptDataProps[]
  >([]);
  const [barGraphSalaryDeptData, setBarGraphSalaryDeptData] = useState<
    SalaryVsDeptDataProps[]
  >([]);
  const [graphToggle, setGraphToggle] = useState<GraphToggle>("year");
  const [isLoading, setIsLoading] = useState(true);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);

  useEffect(() => {
    //Fetch user detail
    const fetch = async () => {
      const salaryRangeData = await salaryRangeAPI();
      const employeeVsDepartmentData = await employeeDepartmentAPI();
      const salaryVsDepartmentData = await salaryDepartmentAPI();
      console.log(salaryVsDepartmentData);
      // console.log(infoUser);
      setPieGraphData(salaryRangeData);
      setBarGraphEmployeeDeptData(employeeVsDepartmentData.result);
      setBarGraphSalaryDeptData(salaryVsDepartmentData.result);
      setTotalEmployee(employeeVsDepartmentData.totalEmployee);
      setTotalSalary(salaryVsDepartmentData.totalSalarySpentOverall);
      setIsLoading(false);
    };
    fetch();
  }, []);

  const handleCoverage = () => {
    setGraphToggle((prev) => (prev === "year" ? "month" : "year"));
  };

  return isLoading ? (
    <LoadingSection />
  ) : (
    <Box
      sx={{
        ...StylesConstant.fullScreenCover,
        flexGrow: 1,
        display: "flex",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper
            sx={{
              padding: 3,
              backgroundColor: theme.palette.background.box,
              height: "210px",
              borderRadius: 3,
              position: "relative",
              backgroundImage: "none",
              overflow: "hidden",
              display: "flex",
              boxShadow: "none",
              flexDirection: "column",
              ...StylesConstant[
                theme.palette.mode === "light"
                  ? "lightGradientEffectDark"
                  : "gradientEffectDark"
              ],
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                zIndex: 10,
              }}
            >
              <MenuButton />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "flex-end",
                color: theme.palette.common.white,
              }}
            >
              <Typography fontSize="1.8rem" variant="body1" fontWeight="bold">
                $543.51
              </Typography>
              <Typography fontSize="1.2rem">Total Profit Margin</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            sx={{
              padding: 3,
              backgroundColor: theme.palette.background.paper,
              height: "210px",
              borderRadius: 3,
              position: "relative",
              display: "flex",
              flexDirection: "row",
              boxShadow: "none",
              overflow: "hidden",
              backgroundImage: "none",
              ...StylesConstant.gradientEffectLight,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography fontSize="1.2rem">Global Spike</Typography>
                <Typography fontSize="1.5rem" variant="body1" fontWeight="bold">
                  $342.33
                </Typography>
              </Box>
              <Box
                sx={{
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  width: "180px",
                }}
              >
                <Button
                  onClick={handleCoverage}
                  sx={{
                    fontSize: "0.7rem",
                    backgroundColor:
                      graphToggle === "year"
                        ? theme.palette.background.btn
                        : "none",
                    color: theme.palette.text.primary,
                  }}
                >
                  Year
                </Button>
                <Button
                  onClick={handleCoverage}
                  sx={{
                    fontSize: "0.7rem",
                    ml: 1,
                    backgroundColor:
                      graphToggle === "month"
                        ? theme.palette.background.btn
                        : "none",
                    color: theme.palette.text.primary,
                  }}
                >
                  Month
                </Button>
              </Box>
            </Box>
            <LineChart
              data={graphToggle === "year" ? lineDataYear : lineDataMonth}
            />
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
                sx={{ color: ColorConstant.LIGHT_GRAY }}
              ></Typography>
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
              mb: 3,
              backgroundImage: "none",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography fontSize="0.8rem">Total Salary Spent:</Typography>
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
      </Grid>
    </Box>
  );
}
