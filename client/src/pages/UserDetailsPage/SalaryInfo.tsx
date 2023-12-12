import {
  FormEvent,
  Fragment,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import {
  UserInfoFirebase,
  UserInfoPersonal,
  UserInfoSalary,
} from "../../utils/interface";
import { RootState } from "../../redux/store";
import {
  collectionUser,
  collectionUserDetails,
  collectionUserSalaryDetails,
  getAllPayMonthRecordAPI,
  getUserDetailsAPI,
  setUserSalaryAPI,
} from "../../firebase/api";
import { StylesConstant, UserRoleLevel } from "../../utils/constants";
import toast from "react-hot-toast";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { monthIntToLongFormat } from "../../utils/helper";
import { jsPDF } from "jspdf";

const displayFieldsSalary = [
  { title: "totalSalary", label: "Total Salary" },
  { title: "hra", label: "HRA" },
  { title: "taxable", label: "Taxable" },
  { title: "basicSalary", label: "Basic Salary" },
  { title: "pf", label: "PF Amount" },
  { title: "reimbursement", label: "Reimbursement Amount" },
  { title: "mealAllowance", label: "Meal Allowance" },
];

export default function SalaryInfo({ uid }: { uid: string }) {
  const [basicInfoSalary, setBasicInfoSalary] = useState<UserInfoSalary[]>();
  const [basicInfoSalaryMonth, setBasicInfoSalaryMonth] =
    useState<UserInfoSalary>();
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const userDetailRef: MutableRefObject<UserInfoFirebase | null> = useRef(null);
  const additionalDetailRef: MutableRefObject<UserInfoPersonal | null> =
    useRef(null);
  const date = new Date();
  const [monthYear, setMonthYear] = useState({
    year: date.getFullYear().toString(),
    month: date.toLocaleString("default", { month: "long" }),
  });
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
      const infouserDetailRef = (await getUserDetailsAPI(
        collectionUserDetails,
        uid as string
      )) as UserInfoPersonal;
      const infoSalaryDetails = await getAllPayMonthRecordAPI(uid);
      setBasicInfoSalary(infoSalaryDetails as UserInfoSalary[]);
      userDetailRef.current = infoUser;
      additionalDetailRef.current = infouserDetailRef;
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const salaryList = basicInfoSalary?.map((item) => {
    return {
      label: item.month + " - " + item.year,
      month: item.month,
      year: item.year,
    };
  });

  const savePDF = () => {
    //Save as PDF
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Salary Slip", 105, 30, undefined, "center");

    doc.setFont("times", "normal");
    doc.text("Name: " + userDetailRef.current?.displayName, 25, 70);
    doc.text(
      "Month - Year: " +
        viewPayslipMonthYear.month +
        "-" +
        viewPayslipMonthYear.year,
      25,
      80
    );
    doc.text("Department: " + userDetailRef.current?.department, 25, 90);
    doc.text("Grade: " + userDetailRef.current?.grade, 25, 100);
    doc.text("Role: " + userDetailRef.current?.role, 25, 110);
    doc.text("Employee Id: " + basicInfoSalaryMonth?.employeeId, 25, 120);
    doc.text("Date Of Birth: " + userDetailRef.current?.dateOfBirth, 25, 130);
    doc.text(
      "Current Manager: " + additionalDetailRef.current?.manager,
      25,
      140
    );
    doc.text("PAN: " + additionalDetailRef.current?.pancard, 25, 150);
    doc.text("Salary: " + additionalDetailRef.current?.salary, 25, 160);
    doc.text("PF Number: " + additionalDetailRef.current?.pfNumber, 25, 170);
    doc.text("UAN: " + additionalDetailRef.current?.uanNumber, 25, 180);
    doc.text("Basic Salary: " + basicInfoSalaryMonth?.basicSalary, 25, 190);
    doc.text("HRA: " + basicInfoSalaryMonth?.hra, 25, 200);
    doc.text("Tax Deduction: " + basicInfoSalaryMonth?.taxable, 25, 210);
    doc.setFont("helvetica", "bold");
    doc.text("Total Salary: " + basicInfoSalaryMonth?.totalSalary, 25, 220);
    //fileName
    doc.save(
      userDetailRef.current?.employeeId +
        "-" +
        viewPayslipMonthYear.month +
        "-" +
        viewPayslipMonthYear.year
    );
  };

  const handleSubmitSalary = (event: FormEvent<HTMLFormElement>) => {
    if (role === UserRoleLevel.EMPLOYEE) return;
    // prevent default effect of submit allover webpage
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const userInfoSalary: UserInfoSalary = {
      month: monthYear.month.toString(),
      year: monthYear.year.toString(),
      employeeId: userDetailRef.current?.employeeId as string,
      uid,
      totalSalary: data.get("totalSalary") as string,
      hra: data.get("hra") as string,
      taxable: data.get("taxable") as string,
      basicSalary: data.get("basicSalary") as string,
      department: userDetailRef.current?.department as string,
      pf: data.get("pf") as string,
      reimbursement: data.get("reimbursement") as string,
      mealAllowance: data.get("mealAllowance") as string,
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
        <Autocomplete
          onChange={(event, value) => {
            setViewPayslipMonthYear({
              month: value?.month!,
              year: value?.year!,
            });
            const list = basicInfoSalary?.filter(
              (item) => item.month === value?.month && item.year === value?.year
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
              Name: {userDetailRef.current?.displayName} <br />
              Department: {userDetailRef.current?.department} <br />
              Grade: {userDetailRef.current?.grade} <br />
              Role: {userDetailRef.current?.role} <br />
              Employee Id: {basicInfoSalaryMonth?.employeeId} <br />
              DOB: {userDetailRef.current?.dateOfBirth} <br />
              Current Manager: {additionalDetailRef.current?.manager} <br />
              PAN: {additionalDetailRef.current?.pancard} <br />
              Salary: {additionalDetailRef.current?.salary} <br />
              PF Number: {additionalDetailRef.current?.pfNumber} <br />
              UAN: {additionalDetailRef.current?.uanNumber} <br />
              Basic Salary: {basicInfoSalaryMonth?.basicSalary} <br />
              HRA: {basicInfoSalaryMonth?.hra} <br />
              Tax Deduction: {basicInfoSalaryMonth?.taxable} <br />
              Total Salary : {basicInfoSalaryMonth?.totalSalary} <br />
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" variant="text">
              Edit
            </Button>
            <Button size="small" variant="text" onClick={savePDF}>
              Export PDF
            </Button>
          </CardActions>
        </Card>
      ) : (
        <div>No Data Found</div>
      )}
    </Fragment>
  );
}
