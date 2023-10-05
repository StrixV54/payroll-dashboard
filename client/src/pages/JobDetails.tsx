import { Box, Button, Grid, TextField } from "@mui/material";
import { StylesConstant, UserRoleLevel } from "../utils/constants";
import { FormEvent, useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/config";
import { UserInfoJob, UserInfoPersonal } from "../utils/interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import toast from "react-hot-toast";
import {
  collectionUserJobDetails,
  getUserDetailsAPI,
  setUserDetailsAPI,
} from "../firebase/api";

const displayFieldsJob = [
  { title: "salary", label: "Current Salary" },
  { title: "aadhar", label: "Aadhar Card" },
  { title: "pancard", label: "PAN Card" },
  { title: "datejoined", label: "Date Of Joining" },
  { title: "manager", label: "Current Manager" },
  { title: "pfaaccount", label: "PFA Account Number" },
];

export default function JobDetails() {
  const [basicInfoJob, setBasicInfoJob] = useState<UserInfoJob>();
  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const role = useSelector((state: RootState) => state.auth.user?.role);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      //Fetch user detail
      const infoJob = (await getUserDetailsAPI(
        collectionUserJobDetails,
        user!.uid
      )) as UserInfoJob;
      setBasicInfoJob(infoJob);
    });

    return () => unsubscribe();
  }, []);

  console.log(basicInfoJob);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (role === UserRoleLevel.EMPLOYEE) return;
    // prevent default effect of submit allover webpage
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const userInfoJob: UserInfoJob = {
      salary: data.get("salary") as string,
      aadhar: data.get("aadhar") as string,
      pancard: data.get("pancard") as string,
      datejoined: data.get("datejoined") as string,
      manager: data.get("manager") as string,
      pfaaccount: data.get("pfaaccount") as string,
    };

    if (userInfoJob)
      setUserDetailsAPI(collectionUserJobDetails, userInfoJob, uid!).then(() =>
        toast.success("Added new details")
      );
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ m: 3 }}>
      <Grid container spacing={4}>
        {displayFieldsJob.map((item, index) => (
          <Grid item xs={12} key={index}>
            <TextField
              name={item.title}
              fullWidth
              id={item.title}
              label={item.label}
              defaultValue={
                basicInfoJob?.[item.title as keyof UserInfoJob] as string
              }
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
  );
}
