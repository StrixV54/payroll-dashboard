import {
  Box,
  Button,
  FormControl,
  InputBase,
  InputLabel,
  alpha,
  styled,
} from "@mui/material";
import { StylesConstant } from "../utils/constants";
import { FormEvent, useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/config";
import {
  getUserDetailsAPI,
  collectionUserDetails,
  collectionUserJobDetails,
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
  { title: "employeeid", label: "Employee ID", isDisabled: true },
  { title: "dateofbirth", label: "DOB", isDisabled: true },
  { title: "displayName", label: "Name", isDisabled: true },
  { title: "role", label: "Role", isDisabled: true },
];

// const displayFieldsPersonal = [
//   { title: "currentaddress", label: "Current Address", isDisabled: false },
//   { title: "maritialstatus", label: "Maritial Status", isDisabled: false },
//   { title: "workskills", label: "Work Skills", isDisabled: false },
// ];

export default function ViewProfile() {
  const [basicInfo, setBasicInfo] = useState<UserInfoLogin>();
  const [basicInfoPersonal, setBasicInfoPersonal] =
    useState<UserInfoPersonal>();
  const basicInfoObject = Object.values(basicInfo ?? {});
  const uid = useSelector((state: RootState) => state.auth.user?.uid);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      //Fetch user detail
      const userinfo = (await getUserDetailsAPI(collectionUser, user!.uid)) as UserInfoLogin;
      const infoPersonal = (await getUserDetailsAPI(
        collectionUserDetails,
        user!.uid
      )) as UserInfoPersonal;
      setBasicInfoPersonal(infoPersonal);
      // console.log(info);
      console.log(infoPersonal);
      setBasicInfo(userinfo);
    });

    return () => unsubscribe();
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
        <InputLabel shrink htmlFor="currentaddress">
          Current Address
        </InputLabel>
        <BootstrapInput
          value={basicInfoPersonal?.currentaddress}
          onChange={(event) => {
            setBasicInfoPersonal((prev) => {
              return {
                ...(prev as UserInfoPersonal),
                currentaddress: event.target.value,
              };
            });
          }}
          id="currentaddress"
          fullWidth
        />
      </FormControl>

      <FormControl variant="standard" fullWidth>
        <InputLabel shrink htmlFor="maritialstatus">
          Maritial Status
        </InputLabel>
        <BootstrapInput
          value={basicInfoPersonal?.maritialstatus}
          onChange={(event) => {
            setBasicInfoPersonal((prev) => {
              return {
                ...(prev as UserInfoPersonal),
                maritialstatus: event.target.value,
              };
            });
          }}
          id="maritialstatus"
          fullWidth
        />
      </FormControl>

      <FormControl variant="standard" fullWidth>
        <InputLabel shrink htmlFor="workskills">
          Work Skills
        </InputLabel>
        <BootstrapInput
          value={basicInfoPersonal?.workskills}
          onChange={(event) => {
            setBasicInfoPersonal((prev) => {
              return {
                ...(prev as UserInfoPersonal),
                workskills: event.target.value,
              };
            });
          }}
          id="workskills"
          fullWidth
        />
      </FormControl>

      {/* {displayFieldsPersonal.map((item, index) => (
        <FormControl variant="standard" key={index} fullWidth>
          <InputLabel shrink htmlFor={item.title}>
            {item.label}
          </InputLabel>
          <BootstrapInput
            defaultValue={
              basicInfoPersonal?.[item.title as keyof UserInfoPersonal]
            }
            id={item.title}
            disabled={item.isDisabled}
            fullWidth
          />
        </FormControl>
      ))} */}
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>
        Save
      </Button>
    </Box>
  );
}
