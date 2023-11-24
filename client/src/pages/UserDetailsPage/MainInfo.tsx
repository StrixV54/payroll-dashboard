
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { UserInfoFirebase } from "../../utils/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  collectionUser,
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

const displayFieldsBasic = [
  { title: "status", label: "Status" },
  { title: "email", label: "Email" },
  { title: "employeeId", label: "Employee ID" },
  { title: "dateOfBirth", label: "DOB" },
  { title: "displayName", label: "Name" },
  { title: "phoneNumber", label: "Mobile Number" },
  { title: "role", label: "Role" },
  { title: "grade", label: "Grade" },
  { title: "department", label: "Department" },
];

const formdataFields = ["grade", "department", "role", "status"];

export default function MainInfo({ uid }: { uid: string }) {
  const [basicInfo, setBasicInfo] = useState<UserInfoFirebase>();
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const [isloading, setIsloading] = useState(true);

  const [formdata, setFormdata] = useState({
    role: "",
    grade: "",
    department: "",
    status: "",
  });

  const handleChange = (event: SelectChangeEvent<string>) => {
    setFormdata({
      ...formdata,
      [event.target.name]: event.target.value,
    } as any);
  };

  useEffect(() => {
    //Fetch user detail
    const fetch = async () => {
      const mainInfo = (await getUserDetailsAPI(
        collectionUser,
        uid as string
      )) as UserInfoFirebase;
      setBasicInfo(mainInfo);
      setIsloading(false);
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
      role: formdata?.role || basicInfo?.role!,
      uid: basicInfo?.uid,
      displayName: data.get("displayName") as string,
      status: formdata?.status || basicInfo?.status!,
      lastLoginAt: new Date().toLocaleString(),
      phoneNumber: data.get("phoneNumber") as string,
      dateOfBirth: data.get("dateOfBirth") as string,
      employeeId: data.get("employeeId") as string,
      grade: formdata?.grade || basicInfo?.grade!,
      department: formdata?.department || basicInfo?.department!,
    };

    console.log(userInfoMain);
    if (userInfoMain)
      setUserDetailsAPI(collectionUser, userInfoMain, uid!).then(() =>
        toast.success("Added new details")
      );
  };

  return isloading ? (
    <LoadingSection />
  ) : (
    <Box component="form" noValidate onSubmit={handleSubmitMain} sx={{ m: 3 }}>
      <Grid container spacing={4}>
        {displayFieldsBasic.map((item, index) => {
          if (formdataFields.includes(item.title))
            return (
              <Grid item xs={12} key={index}>
                <Dropdown
                  title={item.title}
                  label={item.label}
                  options={DropdownOptions[item.title]}
                  initValue={
                    basicInfo?.[item.title as keyof UserInfoFirebase] as string
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
                  basicInfo?.[item.title as keyof UserInfoFirebase] as string
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
