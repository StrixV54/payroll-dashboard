import React, { FormEvent, useEffect, useState } from "react";
import { UserInfoPersonal } from "../../utils/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  collectionUserDetails,
  getUserDetailsAPI,
  setUserDetailsAPI,
} from "../../firebase/api";
import {
  DropdownOptions,
  StylesConstant,
  UserRoleLevel,
} from "../../utils/constants";
import toast from "react-hot-toast";
import { Box, Button, Grid, SelectChangeEvent, TextField } from "@mui/material";
import { LoadingSection } from "../Loading";
import Dropdown from "../../components/Dropdown";

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

const formdataFields = ["maritialStatus"];

export default function PersonalInfo({ uid }: { uid: string }) {
  const [basicInfoPersl, setBasicInfoPersl] = useState<UserInfoPersonal>();
  const [isLoading, setIsLoading] = useState(true);
  const role = useSelector((state: RootState) => state.auth.user?.role);

  const [formdata, setFormdata] = useState({
    maritialStatus: "",
  });
  useEffect(() => {
    //Fetch user detail
    const fetch = async () => {
      const infoPersonal = (await getUserDetailsAPI(
        collectionUserDetails,
        uid as string
      )) as UserInfoPersonal;
      setBasicInfoPersl(infoPersonal);
      setIsLoading(false);
    };
    fetch();
  }, []);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setFormdata({
      ...formdata,
      [event.target.name]: event.target.value,
    } as any);
  };

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
      maritialStatus: formdata?.maritialStatus,
      workSkills: data.get("workSkills") as string,
      uid
    };

    if (userInfoPersl)
      setUserDetailsAPI(collectionUserDetails, userInfoPersl, uid!).then(() =>
        toast.success("Added new details")
      );
  };

  return isLoading ? (
    <LoadingSection />
  ) : (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmitPersonal}
      sx={{ m: 3 }}
    >
      <Grid container spacing={4}>
        {displayFieldsPersonal.map((item, index) => {
          if (formdataFields.includes(item.title))
            return (
              <Grid item xs={12} key={index}>
                <Dropdown
                  title={item.title}
                  label={item.label}
                  options={DropdownOptions[item.title]}
                  initValue={
                    basicInfoPersl?.[
                      item.title as keyof UserInfoPersonal
                    ] as string
                  }
                  onChange={handleChange}
                />
              </Grid>
            );

          return (
            <Grid item xs={12} key={index}>
              <TextField
                name={item.title}
                fullWidth
                id={item.title}
                label={item.label}
                defaultValue={
                  basicInfoPersl?.[
                    item.title as keyof UserInfoPersonal
                  ] as string
                }
                color="primary"
                sx={StylesConstant.changeAutofillColor}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          );
        })}
      </Grid>
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 6, mb: 2, py: 1.5, px: 4.5 }}
        disabled={role !== UserRoleLevel.SUPER_ADMIN}
      >
        Save
      </Button>
    </Box>
  );
}
