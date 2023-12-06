import {
  Fragment,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { UserInfoFirebase, UserInfoSalary } from "../utils/interface";
import { RootState } from "../redux/store";
import {
  collectionUser,
  getAllPayMonthRecordAPI,
  getUserDetailsAPI,
} from "../firebase/api";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

export default function SalaryDetail() {
  const [basicInfoSalary, setBasicInfoSalary] = useState<UserInfoSalary[]>();
  const [basicInfoSalaryMonth, setBasicInfoSalaryMonth] =
    useState<UserInfoSalary>();
  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const employeeId: MutableRefObject<string | null> = useRef(null);
  const department: MutableRefObject<string | null> = useRef(null);
  const date = new Date();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [viewPayslipMonthYear, setViewPayslipMonthYear] = useState({
    year: date.getFullYear().toString(),
    month: date.toLocaleString("default", { month: "long" }),
  });

  useEffect(() => {
    //Fetch user detail
    const fetch = async () => {
      const infoUser = (await getUserDetailsAPI(
        collectionUser,
        uid as string
      )) as UserInfoFirebase;
      const infoSalaryDetails = await getAllPayMonthRecordAPI(uid!);
      setBasicInfoSalary(infoSalaryDetails as UserInfoSalary[]);
      employeeId.current = infoUser?.employeeId;
      department.current = infoUser?.department;
    };
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const salaryList = basicInfoSalary?.map((item) => {
    return {
      label: item.month + " - " + item.year,
      month: item.month,
      year: item.year,
    };
  });

  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            mt: 6,
            mb: 2,
          }}
        >
          <Box flexGrow={1}>
            <Typography gutterBottom variant="h6">
              View PaySlip
            </Typography>
            <Divider sx={{ mb: 4, backgroundColor: "#3d3d3d" }} />
          </Box>
          <Autocomplete
            onChange={(event, value) => {
              setViewPayslipMonthYear({
                month: value?.month!,
                year: value?.year!,
              });
              const list = basicInfoSalary?.filter(
                (item) =>
                  item.month === value?.month && item.year === value?.year
              );
              setBasicInfoSalaryMonth(list?.at(0));
            }}
            options={salaryList!}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Salary Slip" />
            )}
          />
        </Box>
        {basicInfoSalaryMonth ? (
          <Card
            variant="outlined"
            sx={{ backgroundColor: "background.paper", mb: 2 }}
          >
            <CardContent>
              <Typography sx={{ fontSize: 18 }} component="div" gutterBottom>
                Month: {basicInfoSalaryMonth?.month} , Year:
                {basicInfoSalaryMonth?.year}
              </Typography>
              <Typography
                sx={{ fontSize: 14, lineHeight: "2rem" }}
                color="text.secondary"
              >
                Employee Id: {basicInfoSalaryMonth?.employeeId} <br />
                Total Salary : {basicInfoSalaryMonth?.totalSalary} <br />
                Basic Salary: {basicInfoSalaryMonth?.basicSalary} <br />
                HRA: {basicInfoSalaryMonth?.hra} <br />
                Tax Deduction: {basicInfoSalaryMonth?.taxDeduction} <br />
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <div>No Data Found</div>
        )}
      </Box>
    </Fragment>
  );
}
