import {
  Grid,
  Checkbox,
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Link,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { FormEvent, useEffect, useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { firebaseAuth } from "../firebase/firebase";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { signUpAPI } from "../firebase/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { userIsAuthentic } from "../redux/auth";
import Loading from "./Loading";
import { StylesConstant } from "../utils/constants";

export default function SignUp() {
  const [numberValue, setNumberValue] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isErrorState, setisErrorState] = useState<boolean>(false);
  const [toBeVerifiedOTP, setToBeVerifiedOTP] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // checks current state of auth locally
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(userIsAuthentic(user.uid));
        navigate("/");
      }
      // just to persist loading effect for sometime
      setTimeout(() => setIsLoading(false), 1000);
    });
  });

  interface UserInfoLogin {
    email: string;
    password: string;
    first?: string;
    last?: string;
    phoneNumber?: string;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    const userInfo: UserInfoLogin = {
      email: data.get("email") as string,
      password: data.get("password") as string,
      first: data.get("firstName") as string,
      last: data.get("lastName") as string,
      phoneNumber: data.get("phoneNumber") as string,
    };
    await signUpAPI(
      userInfo.first!.concat(userInfo.last!),
      userInfo.email,
      userInfo.password
    )
      .then(() => {})
      .catch((error) => {
        console.error(error?.code);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOTP = (newValue: string) => {
    setOtp(newValue);
  };

  const handleMobile = (value: string) => {
    matchIsValidTel(value) ? setisErrorState(false) : setisErrorState(true);
    setNumberValue(value);
  };

  return isLoading ? (
    <Loading message="Just loading to Say Hello !!" />
  ) : (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        ...StylesConstant.divCenterStyle,
        ...StylesConstant.fullScreen,
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
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
              <MuiTelInput
                defaultCountry="IN"
                id="phoneNumber"
                name="phoneNumber"
                error={isErrorState}
                placeholder="Phone Number"
                value={numberValue}
                autoComplete="tel"
                fullWidth
                forceCallingCode
                onChange={handleMobile}
                sx={StylesConstant.changeAutofillColor}
              />
              <Typography variant="body2" marginTop={1} color="text.secondary">
                Kindly note, OTP will be sent to verify the given phone number.
              </Typography>
              {toBeVerifiedOTP && (
                <MuiOtpInput value={otp} onChange={handleOTP} />
              )}
            </Grid>
            <Grid item xs={12} mt={3}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
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
              <Link component={ReactRouterLink} to="/sign-in">
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
