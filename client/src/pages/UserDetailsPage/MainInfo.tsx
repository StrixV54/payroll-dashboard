import React, { FormEvent, useEffect, useState } from "react";
import { UserInfoFirebase } from "../../utils/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  collectionUser,
  getUserDetailsAPI,
  setUserDetailsAPI,
} from "../../firebase/api";
import { StylesConstant, UserRoleLevel } from "../../utils/constants";
import toast from "react-hot-toast";
import { Box, Button, Grid, TextField } from "@mui/material";

const displayFieldsBasic = [
  { title: "email", label: "Email" },
  { title: "employeeId", label: "Employee ID" },
  { title: "dateOfBirth", label: "DOB" },
  { title: "displayName", label: "Name" },
  { title: "phoneNumber", label: "Mobile Number" },
  { title: "role", label: "Role" },
  { title: "grade", label: "Grade" },
  { title: "department", label: "Department" },
];

export default function MainInfo({ uid }: { uid: string }) {
  const [basicInfo, setBasicInfo] = useState<UserInfoFirebase>();
  const role = useSelector((state: RootState) => state.auth.user?.role);

  useEffect(() => {
    //Fetch user detail
    const fetch = async () => {
      const mainInfo = (await getUserDetailsAPI(
        collectionUser,
        uid as string
      )) as UserInfoFirebase;
      setBasicInfo(mainInfo);
    };
    fetch();
  }, []);

  const handleSubmitMain = (event: FormEvent<HTMLFormElement>) => {
    if (role === UserRoleLevel.EMPLOYEE) return;
    // prevent default effect of submit allover webpage
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const userInfoMain: UserInfoFirebase = {
      email: data.get("email") as string,
      role: data.get("role") as string,
      uid: basicInfo?.uid,
      displayName: data.get("displayName") as string,
      lastLoginAt: new Date().toLocaleString(),
      phoneNumber: data.get("phoneNumber") as string,
      dateOfBirth: data.get("dateOfBirth") as string,
      employeeId: data.get("employeeId") as string,
      grade: data.get("grade") as string,
      department: data.get("department") as string,
    };

    if (userInfoMain)
      setUserDetailsAPI(collectionUser, userInfoMain, uid!).then(() =>
        toast.success("Added new details")
      );
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmitMain} sx={{ m: 3 }}>
      <Grid container spacing={4}>
        {displayFieldsBasic.map((item, index) => (
          <Grid item xs={12} key={index}>
            <TextField
              name={item.title}
              fullWidth
              id={item.title}
              label={item.label}
              value={
                basicInfo?.[item.title as keyof UserInfoFirebase] as string
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
