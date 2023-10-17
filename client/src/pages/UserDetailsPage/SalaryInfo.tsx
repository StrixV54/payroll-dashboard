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
  getUserDetailsAPI,
  getUserSalaryAPI,
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
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { orderBy } from "firebase/firestore";

type eachDoc = {
  document: UserInfoSalary;
};

const displayFieldsSalary = [
  { title: "month", label: "Month" },
  { title: "year", label: "Year" },
  { title: "totalSalary", label: "Total Salary" },
  { title: "hra", label: "HRA" },
  { title: "taxDeduction", label: "Tax Deduction" },
  { title: "basicSalary", label: "Basic Salary" },
];

export default function SalaryInfo({ uid }: { uid: string }) {
  const [basicInfoSalary, setBasicInfoSalary] = useState<any[]>();
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const employeeId: MutableRefObject<string | null> = useRef(null);

  useEffect(() => {
    //Fetch user detail
    const fetch = async () => {
      const infoSalary = (await getUserSalaryAPI(
        collectionUserSalaryDetails,
        uid as string,
        new Date().getFullYear().toString()
      )) as UserInfoSalary[];
      setBasicInfoSalary(infoSalary);
      const infoUser = (await getUserDetailsAPI(
        collectionUser,
        uid as string
      )) as UserInfoFirebase;
      employeeId.current = infoUser?.employeeId;
      console.log(infoSalary);
    };
    fetch();
  }, []);

  const handleSubmitSalary = (event: FormEvent<HTMLFormElement>) => {
    if (role === UserRoleLevel.EMPLOYEE) return;
    // prevent default effect of submit allover webpage
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const userInfoSalary: UserInfoSalary = {
      month: data.get("month") as string,
      year: data.get("year") as string,
      employeeId: employeeId.current as string,
      totalSalary: data.get("totalSalary") as string,
      hra: data.get("hra") as string,
      taxDeduction: data.get("taxDeduction") as string,
      basicSalary: data.get("basicSalary") as string,
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
      {basicInfoSalary?.map((item: eachDoc, index) => (
        <Card
          variant="outlined"
          key={index}
          sx={{ backgroundColor: ColorConstant.TEAL_BG, mb: 2 }}
        >
          <CardContent>
            <Typography sx={{ fontSize: 18 }} component="div" gutterBottom>
              Month: {item?.document?.month} , Year: {item?.document?.year}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              Employee Id: {item?.document?.employeeId} <br />
              Total Salary : {item?.document?.totalSalary} <br />
              Basic Salary: {item?.document?.basicSalary} <br />
              HRA: {item?.document?.hra} <br />
              Tax Deduction: {item?.document?.taxDeduction} <br />
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" variant="text">
              Edit
            </Button>
          </CardActions>
        </Card>
      ))}
    </Fragment>
  );
}
