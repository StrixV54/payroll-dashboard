import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { FirebaseErrorMessages, StylesConstant } from "../utils/constants";
import { signInAPI } from "../firebase/api";
import { firebaseAuth } from "../firebase/firebase";
import { userIsAuthentic } from "../redux/auth";
import { useDispatch } from "react-redux";
import Loading from "./Loading";
import toast from "react-hot-toast";

interface UserInfoLogin {
  email: string;
  password: string;
  first?: string;
  last?: string;
  phoneNumbe?: string;
}

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loaderWaitAndRemove = () => setTimeout(() => setIsLoading(false), 1000);

  useEffect(() => {
    // checks current state of auth locally
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(userIsAuthentic(user.uid));
        navigate("/");
      }
      // just to persist loading effect for sometime
      loaderWaitAndRemove();
    });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // prevent default effect of submit allover webpage
    event.preventDefault();
    // setIsLoading(true);

    // get all input fields data with FormData function
    const data = new FormData(event.currentTarget);
    const userInfo: UserInfoLogin = {
      email: data.get("email") as string,
      password: data.get("password") as string,
    };
    //calling api
    // await signInAPI(userInfo.email, userInfo.password)
    //   .then(() => {
    //     toast.success("Successfully Logged In");
    //   })
    //   .catch((error) => {
    //     toast.error(`ERROR : ${error?.code}`);
    //   })
    //   .finally(() => {
    //     loaderWaitAndRemove();
    //   });

    //works same as above
    toast.promise(signInAPI(userInfo.email, userInfo.password), {
      loading: "Loading",
      success: (data) => `Successfully Logged In`,
      error: (err) =>
        `ERROR: ${
          FirebaseErrorMessages(err?.code).quickMessage
        }`,
    });
  };

  //loading window for sometime meanwhile check auth
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
          Sign in
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            sx={StylesConstant.changeAutofillColor}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            sx={StylesConstant.changeAutofillColor}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            onClick={(e) => console.log(e)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Sign In
          </Button>
          <Grid container mt={3}>
            <Grid item xs>
              <Link to="/" component={ReactRouterLink}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/sign-up" component={ReactRouterLink}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        mt={8}
        mb={4}
      >
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
