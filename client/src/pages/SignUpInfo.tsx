// import {
//   Grid,
//   Checkbox,
//   Button,
//   TextField,
//   FormControlLabel,
//   Link,
//   Box,
//   Typography,
//   Container,
//   Divider,
//   FormControl,
//   MenuItem,
//   Select,
//   FormHelperText,
//   SelectChangeEvent,
// } from "@mui/material";
// import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
// import { FormEvent, MouseEventHandler, useEffect, useState } from "react";
// import { MuiOtpInput } from "mui-one-time-password-input";
// import { firebaseAuth } from "../firebase/config";
// import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
// import { signInWithGoogleAPI, signUpAPI } from "../firebase/api";
// import { useDispatch } from "react-redux";
// import Loading from "./Loading";
// import { StylesConstant } from "../utils/constants";
// import { FcGoogle } from "react-icons/fc";
// import { UserInfoLogin } from "../utils/interface";

// export default function SignUpInfo() {
//   const [numberValue, setNumberValue] = useState<string>("");
//   const [otp, setOtp] = useState<string>("");
//   const [isErrorState, setisErrorState] = useState<boolean>(true);
//   const [toBeVerifiedOTP, setToBeVerifiedOTP] = useState(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isSignUPComplete, setIsSignUPComplete] = useState<boolean>(false);
//   const [project, setProject] = useState("bright");
//   const [department, setDepartment] = useState("tech");

//   // const authState = useSelector((state: RootState) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // checks current state of auth locally
//     // isSignUPComplete &&
//     //   firebaseAuth.onAuthStateChanged((user) => {
//     //     if (user) navigate("/");
//     //   });
//     // just to persist loading effect for sometime
//     setTimeout(() => setIsLoading(false), 500);
//   }, []);

//   const handleChangeProject = (event: SelectChangeEvent) => {
//     setProject(event.target.value as string);
//   };

//   const handleChangeDepartment = (event: SelectChangeEvent) => {
//     setDepartment(event.target.value as string);
//   };

//   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
//     // prevent default effect of submit allover webpage
//     event.preventDefault();
//     setIsLoading(true);
//     // get all input fields data with FormData function
//     const data = new FormData(event.currentTarget);
//     const userInfo: UserInfoLogin = {
//       email: data.get("email") as string,
//       password: data.get("password") as string,
//       first: data.get("firstName") as string,
//       last: data.get("lastName") as string,
//       phoneNumber: numberValue,
//     };
//     signUpAPI(
//       userInfo.first!.concat(userInfo.last!),
//       userInfo.email,
//       userInfo.password,
//       userInfo.phoneNumber!
//     ).finally(() => {
//       setIsLoading(false);
//     });
//   };

//   const handleGoogleBtn = () => {
//     setIsLoading(true);
//     // Sign In using Google OAuth
//     signInWithGoogleAPI().finally(() => {
//       setIsLoading(false);
//     });
//   };

//   const handleOTP = (newValue: string) => {
//     setOtp(newValue);
//   };

//   const handleMobile = (value: string) => {
//     matchIsValidTel(value) ? setisErrorState(false) : setisErrorState(true);
//     setNumberValue(value);
//   };

//   const handleSendOTPService = async () => {
//     const number = numberValue.slice(1);
//     console.log(number);
//     if (!isErrorState) {
//       setToBeVerifiedOTP(true);
//     }
//   };

//   //loading window for sometime meanwhile check auth
//   return isLoading ? (
//     <Loading message="Just loading to Say Hello !!" />
//   ) : (
//     <Container
//       component="main"
//       maxWidth="xs"
//       sx={{
//         ...StylesConstant.divCenterStyle,
//         ...StylesConstant.fullScreen,
//         flexDirection: "column",
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
//           <LockOutlinedIcon />
//         </Avatar> */}
//         <Typography component="h6" variant="h6">
//           Fill up more information
//         </Typography>
//         <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <FormHelperText>Project</FormHelperText>
//                 <Select
//                   value={project}
//                   onChange={handleChangeProject}
//                   displayEmpty
//                   aria-label="Project"
//                 >
//                   <MenuItem value="bright">Bright</MenuItem>
//                   <MenuItem value="modmed">Modmed</MenuItem>
//                   <MenuItem value="candence">Candence</MenuItem>
//                   <MenuItem value="t4bi">T4BI</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <FormHelperText>Department</FormHelperText>
//                 <Select
//                   value={department}
//                   onChange={handleChangeDepartment}
//                   displayEmpty
//                   aria-label="Department"
//                 >
//                   <MenuItem value="tech">Technology</MenuItem>
//                   <MenuItem value="support">Support</MenuItem>
//                   <MenuItem value="business">Business</MenuItem>
//                   <MenuItem value="hr">Human Resource</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <MuiTelInput
//                 required
//                 defaultCountry="IN"
//                 id="phoneNumber"
//                 name="phoneNumber"
//                 error={isErrorState}
//                 placeholder="Phone Number"
//                 value={numberValue}
//                 autoComplete="tel"
//                 fullWidth
//                 forceCallingCode
//                 disableFormatting
//                 onChange={handleMobile}
//                 sx={{
//                   ...StylesConstant.changeAutofillColor,
//                   "input[name=phoneNumber]": {
//                     paddingLeft: 1,
//                   },
//                   mt: 2,
//                 }}
//               />
//               <Typography variant="body2" marginTop={1} color="text.secondary">
//                 Kindly note, OTP will be sent to verify the given phone number.
//               </Typography>
//               <Button
//                 variant="text"
//                 onClick={handleSendOTPService}
//                 disabled={isErrorState}
//                 sx={{ my: 2, py: 0 }}
//               >
//                 Send OTP
//               </Button>
//             </Grid>
//             <Grid item xs={12} display="flex" justifyContent={"center"}>
//               {toBeVerifiedOTP && (
//                 <MuiOtpInput
//                   value={otp}
//                   onChange={handleOTP}
//                   width="90%"
//                   autoFocus
//                 />
//               )}
//             </Grid>
//           </Grid>
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 8, mb: 2, py: 1.5 }}
//           >
//             Sign Up
//           </Button>
//           <Grid container justifyContent="flex-end" mt={3}>
//             <Grid item>
//               <Link component={ReactRouterLink} to="/sign-in">
//                 Already have an account? Sign in
//               </Link>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//       <Typography variant="body2" color="text.secondary" align="center" mt={5}>
//         {"Copyright © "}
//         <Link color="inherit" href="/">
//           ZUCO
//         </Link>
//         &nbsp;
//         {new Date().getFullYear()}
//       </Typography>
//     </Container>
//   );
// }

export {}