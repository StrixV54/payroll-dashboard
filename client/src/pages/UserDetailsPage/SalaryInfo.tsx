import {
  FormEvent,
  Fragment,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { UserInfoFirebase, UserInfoSalary } from "../../utils/interface";
import { RootState } from "../../redux/store";
import {
  collectionUser,
  collectionUserSalaryDetails,
  getAllPayMonthRecordAPI,
  getUserDetailsAPI,
  getUserSalarySpecificMonthAPI,
  getUserSalarySpecificYearAPI,
  setUserSalaryAPI,
} from "../../firebase/api";
import {
  ColorConstant,
  StylesConstant,
  UserRoleLevel,
} from "../../utils/constants";
import toast from "react-hot-toast";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { orderBy } from "firebase/firestore";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { monthIntToLongFormat } from "../../utils/helper";

const displayFieldsSalary = [
  { title: "totalSalary", label: "Total Salary" },
  { title: "hra", label: "HRA" },
  { title: "taxDeduction", label: "Tax Deduction" },
  { title: "basicSalary", label: "Basic Salary" },
];

export default function SalaryInfo({ uid }: { uid: string }) {
  const [basicInfoSalary, setBasicInfoSalary] = useState<UserInfoSalary[]>();
  const [basicInfoSalaryMonth, setBasicInfoSalaryMonth] =
    useState<UserInfoSalary>();
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const employeeId: MutableRefObject<string | null> = useRef(null);
  const department: MutableRefObject<string | null> = useRef(null);
  const date = new Date();
  const [monthYear, setMonthYear] = useState({
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
      const infoSalaryDetails = await getAllPayMonthRecordAPI(uid);
      setBasicInfoSalary(infoSalaryDetails as UserInfoSalary[]);
      employeeId.current = infoUser?.employeeId;
      department.current = infoUser?.department;
    };
    fetch();
  }, []);

  const isDisabledMonth = (date: Dayjs) => {
    basicInfoSalary?.forEach((item) => {
      if (
        item.month === monthIntToLongFormat(date.month()) &&
        item.year === date.year().toString()
      ) {
        return true;
      }
    });
    return false;
  };

  const handlePayslipView: (value: Dayjs | null) => void = async (
    eventValue
  ) => {
    const infoSalary = await getUserSalarySpecificMonthAPI(
      collectionUserSalaryDetails,
      monthIntToLongFormat(eventValue?.month()!),
      eventValue?.year().toString()!,
      uid
    );
    setBasicInfoSalaryMonth(infoSalary as UserInfoSalary);
  };

  const handleSubmitSalary = (event: FormEvent<HTMLFormElement>) => {
    if (role === UserRoleLevel.EMPLOYEE) return;
    // prevent default effect of submit allover webpage
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const userInfoSalary: UserInfoSalary = {
      month: monthYear.month.toString(),
      year: monthYear.year.toString(),
      employeeId: employeeId.current as string,
      uid,
      totalSalary: data.get("totalSalary") as string,
      hra: data.get("hra") as string,
      taxDeduction: data.get("taxDeduction") as string,
      basicSalary: data.get("basicSalary") as string,
      department: department.current as string,
    };

    setUserSalaryAPI(
      collectionUserSalaryDetails,
      userInfoSalary,
      uid!,
      userInfoSalary.year,
      userInfoSalary.month
    )
      .then(() => toast.success("Added new details"))
      .catch((error) => toast.error(error));
  };

  return (
    <Fragment>
      <Accordion sx={{ margin: "2rem 0" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>CREATE NEW SLIP</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmitSalary}
            sx={{ m: 3 }}
          >
            <Grid container spacing={4} marginTop={3}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Month-Year"
                    views={["year", "month"]}
                    defaultValue={dayjs()}
                    shouldDisableMonth={isDisabledMonth}
                    onAccept={(value) =>
                      setMonthYear({
                        year: value?.year().toString()!,
                        month: monthIntToLongFormat(value?.month()!),
                      })
                    }
                  />
                </LocalizationProvider>
              </Grid>
              {displayFieldsSalary.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <TextField
                    name={item.title}
                    fullWidth
                    id={item.title}
                    label={item.label}
                    disabled={role === UserRoleLevel.EMPLOYEE}
                    color="primary"
                    sx={StylesConstant.changeAutofillColor}
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 6, mb: 2, py: 1.5, px: 4.5 }}
              disabled={role === UserRoleLevel.EMPLOYEE}
            >
              Save
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Choose Month-Year"
            views={["year", "month"]}
            onAccept={handlePayslipView}
            disableFuture
          />
        </LocalizationProvider>
      </Box>
      {basicInfoSalaryMonth ? (
        <Card
          variant="outlined"
          sx={{ backgroundColor: "background.paper", mb: 2 }}
        >
          <CardContent>
            <Typography sx={{ fontSize: 18 }} component="div" gutterBottom>
              Month: {basicInfoSalaryMonth?.month} , Year:{" "}
              {basicInfoSalaryMonth?.year}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              Employee Id: {basicInfoSalaryMonth?.employeeId} <br />
              Total Salary : {basicInfoSalaryMonth?.totalSalary} <br />
              Basic Salary: {basicInfoSalaryMonth?.basicSalary} <br />
              HRA: {basicInfoSalaryMonth?.hra} <br />
              Tax Deduction: {basicInfoSalaryMonth?.taxDeduction} <br />
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" variant="text">
              Edit
            </Button>
          </CardActions>
        </Card>
      ) : (
        <div>No Data Found</div>
      )}
    </Fragment>
  );
}
