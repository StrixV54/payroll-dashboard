import React, { FormEvent, useEffect, useState } from "react";
import { UserInfoPersonal } from "../../utils/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  collectionUserDetails,
  getUserDetailsAPI,
  setUserDetailsAPI,
} from "../../firebase/api";
import { StylesConstant, UserRoleLevel } from "../../utils/constants";
import toast from "react-hot-toast";
import { Box, Button, Grid, TextField } from "@mui/material";

type Props = {};

const displayFieldsPersonal = [
  { title: "salary", label: "Current Salary" },
  { title: "aadhar", label: "Aadhar Card" },
  { title: "pancard", label: "PAN Card" },
  { title: "dateJoined", label: "Date Of Joining" },
  { title: "manager", label: "Current Manager" },
  { title: "pfaAccount", label: "PFA Account Number" },
  { title: "currentAddress", label: "Current Address" },
  { title: "maritialStatus", label: "Maritial Status" },
  { title: "workSkills", label: "Work Skills" },
];

export default function PersonalInfo({ uid }: { uid: string }) {
  const [basicInfoPersl, setBasicInfoPersl] = useState<UserInfoPersonal>();
  const role = useSelector((state: RootState) => state.auth.user?.role);

  useEffect(() => {
    //Fetch user detail
    const fetch = async () => {
      const infoPersonal = (await getUserDetailsAPI(
        collectionUserDetails,
        uid as string
      )) as UserInfoPersonal;
      setBasicInfoPersl(infoPersonal);
    };
    fetch();
  }, []);

  const handleSubmitPersonal = (event: FormEvent<HTMLFormElement>) => {
    if (role === UserRoleLevel.EMPLOYEE) return;
    // prevent default effect of submit allover webpage
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const userInfoPersl: UserInfoPersonal = {
      salary: data.get("salary") as string,
      aadhar: data.get("aadhar") as string,
      pancard: data.get("pancard") as string,
      dateJoined: data.get("dateJoined") as string,
      manager: data.get("manager") as string,
      pfaAccount: data.get("pfaAccount") as string,
      currentAddress: data.get("currentAddress") as string,
      maritialStatus: data.get("maritialStatus") as string,
      workSkills: data.get("workSkills") as string,
    };

    if (userInfoPersl)
      setUserDetailsAPI(collectionUserDetails, userInfoPersl, uid!).then(() =>
        toast.success("Added new details")
      );
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmitPersonal}
      sx={{ m: 3 }}
    >
      <Grid container spacing={4}>
        {displayFieldsPersonal.map((item, index) => (
          <Grid item xs={12} key={index}>
            <TextField
              name={item.title}
              fullWidth
              id={item.title}
              label={item.label}
              value={
                basicInfoPersl?.[item.title as keyof UserInfoPersonal] as string
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
