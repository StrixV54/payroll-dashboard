import { Fragment, MutableRefObject, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  UserInfoFirebase,
  UserInfoPersonal,
  UserInfoSalary,
} from "../utils/interface";
import { RootState } from "../redux/store";
import {
  collectionUser,
  collectionUserDetails,
  getAllPayMonthRecordAPI,
  getUserDetailsAPI,
} from "../firebase/api";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import jsPDF from "jspdf";

export default function SalaryDetail() {
  const [basicInfoSalary, setBasicInfoSalary] = useState<UserInfoSalary[]>();
  const [basicInfoSalaryMonth, setBasicInfoSalaryMonth] =
    useState<UserInfoSalary>();
  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const userDetailRef: MutableRefObject<UserInfoFirebase | null> = useRef(null);
  const additionalDetailRef: MutableRefObject<UserInfoPersonal | null> =
    useRef(null);
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
      const infouserDetailRef = (await getUserDetailsAPI(
        collectionUserDetails,
        uid as string
      )) as UserInfoPersonal;
      userDetailRef.current = infoUser;
      additionalDetailRef.current = infouserDetailRef;
      setBasicInfoSalary(infoSalaryDetails as UserInfoSalary[]);
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
            <Button size="small" variant="text" onClick={savePDF}>
              Download as PDF
            </Button>
          </CardActions>
          </Card>
        ) : (
          <div>No Data Found</div>
        )}
      </Box>
    </Fragment>
  );
}
