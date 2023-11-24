import {
  Grid,
  Checkbox,
  Button,
  TextField,
  FormControlLabel,
  Link,
  Box,
  Typography,
  Container,
  Divider,
} from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import {
  generateEmployeeIdAPI,
  signInWithGoogleAPI,
  signUpAPI,
} from "../firebase/api";
import { useDispatch } from "react-redux";
import Loading from "./Loading";
import { StylesConstant } from "../utils/constants";
import { FcGoogle } from "react-icons/fc";
import { UserInfoLogin } from "../utils/interface";
import { firebaseAuth } from "../firebase/config";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dateofbirth, setDateofbirth] = useState<string | null>();

  // const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    //checks current state of auth locally
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) navigate("/");

      //just to persist loading effect for sometime
      setTimeout(() => setIsLoading(false), 500);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // prevent default effect of submit allover webpage
    event.preventDefault();
    setIsLoading(true);
    // get all input fields data with FormData function
    const data = new FormData(event.currentTarget);

    const userInfo: UserInfoLogin = {
      email: data.get("email") as string,
      password: data.get("password") as string,
      first: data.get("firstName") as string,
      last: data.get("lastName") as string,
      dateOfBirth: dateofbirth!,
      status: "new",
      employeeId: await generateEmployeeIdAPI(
        data.get("firstName") as string,
        data.get("lastName") as string
      ),
    };

    // navigate("/fill-info", { state: userInfo });
    signUpAPI(userInfo)
      // .then(() => navigate("/signin"))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleBtn = () => {
    setIsLoading(true);
    // Sign In using Google OAuth
    signInWithGoogleAPI().finally(() => {
      setIsLoading(false);
      // firebaseAuth.signOut();
    });
  };

  const handleDOBPicker = (newValue: any) => {
    const dob =
      (newValue.$M + 1).toString().padStart(2, "0") +
      "/" +
      newValue.$D.toString().padStart(2, "0") +
      "/" +
      newValue.$y;
    setDateofbirth(dob);
  };

  // const handleOTP = (newValue: string) => {
  //   setOtp(newValue);
  // };

  // const handleMobile = (value: string) => {
  //   matchIsValidTel(value) ? setisErrorState(false) : setisErrorState(true);
  //   setNumberValue(value);
  // };

  //loading window for sometime meanwhile check auth
  return isLoading ? (
    <Loading message="Just loading to Say Hello !!" />
  ) : (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        ...StylesConstant.divCenterStyle,
        ...StylesConstant.fullScreenVWPort,
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleBtn}
          sx={{ mt: 3, mb: 2, py: 1.0, backgroundColor: "#0e171d" }}
        >
          <FcGoogle style={{ height: 30, width: 30, marginRight: "8px" }} />
          Google
        </Button>
        <Divider flexItem>OR</Divider>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                color="primary"
                sx={StylesConstant.changeAutofillColor}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                sx={StylesConstant.changeAutofillColor}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                sx={StylesConstant.changeAutofillColor}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                sx={StylesConstant.changeAutofillColor}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Of Birth*"
                  sx={{ width: "100%" }}
                  onChange={handleDOBPicker}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} mt={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="allowExtraEmails"
                    color="primary"
                    defaultChecked
                  />
                }
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end" mt={3}>
            <Grid item>
              <Link component={ReactRouterLink} to="/signin">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" align="center" mt={5}>
        {"Copyright © "}
        <Link color="inherit" href="/">
          ZUCO
        </Link>
        &nbsp;
        {new Date().getFullYear()}
      </Typography>
    </Container>
  );
}
