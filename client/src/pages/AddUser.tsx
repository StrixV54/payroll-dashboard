import { FormEvent } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DropdownOptions, StylesConstant } from "../utils/constants";
import { createNewUserAPI } from "../firebase/api";
import toast from "react-hot-toast";
import Dropdown from "../components/Dropdown";

const displayFieldsBasic = [
  { title: "email", label: "Email" },
  { title: "password", label: "Password" },
  { title: "dateOfBirth", label: "Date Of Birth" },
  { title: "first", label: "First Name" },
  { title: "last", label: "Last Name" },
  { title: "phoneNumber", label: "Mobile Number" },
  { title: "role", label: "Role" },
  { title: "grade", label: "Grade" },
  { title: "department", label: "Department" },
];

export default function AddUser() {
  const handleSubmitMain = async (event: FormEvent<HTMLFormElement>) => {
    // prevent default effect of submit allover webpage
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const userInfoMain: any = {
      email: data.get("email") as string,
      password: data.get("password") as string,
      role: data.get("role") as string,
      first: data.get("first") as string,
      last: data.get("last") as string,
      phoneNumber: data.get("phoneNumber") as string,
      dateOfBirth: data.get("dateOfBirth") as string,
      grade: data.get("grade") as string,
      department: data.get("department") as string,
    };

    createNewUserAPI(userInfoMain).then(() =>
      toast.success("Created new user")
    );
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmitMain} sx={{ m: 3 }}>
      <Grid container spacing={4}>
        {displayFieldsBasic.map((item, index) => {
          if (item.title === "grade")
            return (
              <Grid item xs={12} key={index}>
                <Dropdown
                  title={item.title}
                  label={item.label}
                  options={DropdownOptions.grade}
                />
              </Grid>
            );
          if (item.title === "department")
            return (
              <Grid item xs={12} key={index}>
                <Dropdown
                  title={item.title}
                  label={item.label}
                  options={DropdownOptions.department}
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
      >
        Save
      </Button>
    </Box>
  );
}
