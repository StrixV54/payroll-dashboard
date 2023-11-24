import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { StylesConstant } from "../utils/constants";
import { FormEvent, useEffect, useState } from "react";
import {
  getUserDetailsAPI,
  collectionUserDetails,
  setUserDetailsAPI,
  collectionUser,
} from "../firebase/api";
import { UserInfoLogin, UserInfoPersonal } from "../utils/interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import toast from "react-hot-toast";
import { BootstrapInput } from "../material-ui/constants";

const displayFieldsBasic = [
  { title: "email", label: "Email", isDisabled: true },
  { title: "employeeId", label: "Employee ID", isDisabled: true },
  { title: "dateOfBirth", label: "DOB", isDisabled: true },
  { title: "displayName", label: "Name", isDisabled: true },
  { title: "role", label: "Role", isDisabled: true },
];

export default function ViewProfile() {
  const [basicInfo, setBasicInfo] = useState<UserInfoLogin>();
  const [basicInfoPersonal, setBasicInfoPersonal] =
    useState<UserInfoPersonal>();
  const uid = useSelector((state: RootState) => state.auth.user?.uid);

  useEffect(() => {
    const fetch = async () => {
      //Fetch user detail
      const userinfo = (await getUserDetailsAPI(
        collectionUser,
        uid!
      )) as UserInfoLogin;
      const infoPersonal = (await getUserDetailsAPI(
        collectionUserDetails,
        uid!
      )) as UserInfoPersonal;
      setBasicInfo(userinfo);
      // console.log(infoPersonal);
      setBasicInfoPersonal(infoPersonal);
    };
    fetch();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // prevent default effect of submit allover webpage
    event.preventDefault();

    if (basicInfoPersonal)
      setUserDetailsAPI(
        collectionUserDetails,
        basicInfoPersonal as UserInfoPersonal,
        uid!
      ).then(() => toast.success("Added new details"));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h5"
        sx={{ width: "100%", px: 4, py: 3 }}
        component={"p"}
      >
        Profile Details
      </Typography>
      <Box
        sx={{
          ...StylesConstant.fullScreenCover,
          display: "grid",
          gridTemplateColumns: { sm: "1fr 1fr" },
          gap: 4,
          p: 4,
        }}
        component="form"
        noValidate
        onSubmit={handleSubmit}
      >
        {displayFieldsBasic.map((item, index) => (
          <FormControl variant="standard" key={index} fullWidth>
            <InputLabel shrink htmlFor={item.title}>
              {item.label}
            </InputLabel>
            <BootstrapInput
              defaultValue="Add Input"
              value={basicInfo?.[item.title as keyof UserInfoLogin]}
              id={item.title}
              disabled={item.isDisabled}
            />
          </FormControl>
        ))}

        <FormControl variant="standard" fullWidth>
          <InputLabel shrink htmlFor="currentAddress">
            Current Address
          </InputLabel>
          <BootstrapInput
            value={basicInfoPersonal?.currentAddress}
            onChange={(event) => {
              setBasicInfoPersonal((prev) => {
                return {
                  ...(prev as UserInfoPersonal),
                  currentAddress: event.target.value,
                };
              });
            }}
            id="currentAddress"
            fullWidth
          />
        </FormControl>

        <FormControl variant="standard" fullWidth>
          <InputLabel shrink htmlFor="maritialStatus">
            Maritial Status
          </InputLabel>
          <BootstrapInput
            value={basicInfoPersonal?.maritialStatus}
            onChange={(event) => {
              setBasicInfoPersonal((prev) => {
                return {
                  ...(prev as UserInfoPersonal),
                  maritialStatus: event.target.value,
                };
              });
            }}
            id="maritialStatus"
            fullWidth
          />
        </FormControl>

        <FormControl variant="standard" fullWidth>
          <InputLabel shrink htmlFor="workSkills">
            Work Skills
          </InputLabel>
          <BootstrapInput
            value={basicInfoPersonal?.workSkills}
            onChange={(event) => {
              setBasicInfoPersonal((prev) => {
                return {
                  ...(prev as UserInfoPersonal),
                  workSkills: event.target.value,
                };
              });
            }}
            id="workSkills"
            fullWidth
          />
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          sx={{ m: "auto", width: "100%", padding: "16px" }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
