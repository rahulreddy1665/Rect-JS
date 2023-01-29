import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // for import react dom navigation components
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Container,
  Group,
} from "@mantine/core"; //for import mantine required functions and theme
import BG from "../../assets/images/bg.jpg";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import Logo from "../../assets/images/logo.png";
import LogoText from "../../assets/images/logo-text.png";
import { useForm } from "@mantine/form";
import { handelLogin } from "../../helpers/apis";

//for   made mantine theme style change and write custome theme here
const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: "100%",
    backgroundSize: "cover",
    minWidth: "100%",
    position: "fixed",
    backgroundImage: `url(${BG})`,
  },

  form: {
    minHeight: 1000,
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,

    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: "#EAA855",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

function Login() {
  const { classes } = useStyles();
  const [URL, setURL] = useState(process.env.REACT_APP_BACKEND_URL);
  let navigate = useNavigate();
  const location = useLocation();
  const [submitLoading, setSubmitLoading] = useState(false);
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  useEffect(() => {
    if (isAuthenticated == "true") {
      navigate("/");
    }
  }, []);

  // Submit login by email and password
  const LoginUser = async (e) => {
    setSubmitLoading(true);
    // submit login to api
    const response = await handelLogin(e);

    if (response.status == 200) {
      setTimeout(() => {
        // After login success store this data in local storage
        localStorage.setItem("notification", "yes");
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", response.data.roles);
        // window.location.reload();
        navigate("/");
      }, 300);
      showNotification({
        color: "green",
        title: "Login....",
        message: "You have login successfully.. 😉",
        icon: <Check />,
      });
      setSubmitLoading(false);
    } else {
      // Error show notification
      showNotification({
        color: "red",
        title: "Login Error",
        message: response.data.message,
        icon: <X />,
      });
      setSubmitLoading(false);
    }
  };
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (value.length < 1 ? "Email is required" : null),
      password: (value) => (value.length < 1 ? "Password is required" : null),
    },
  });
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <div justify="center" align="center" style={{ marginBottom: 25 }}>
          <img
            src={Logo}
            alt=""
            className="zc-pt-3"
            style={{ width: "300px" }}
          />
        </div>
        {/* For login form inputs */}
        <form onSubmit={form.onSubmit((values) => LoginUser(values))}>
          <TextInput
            value={form.values.email}
            label="Email or Phone No"
            placeholder="Email or Phone No"
            size="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            value={form.values.password}
            {...form.getInputProps("password")}
          />

          <Button
            mt="xl"
            type="submit"
            fullWidth
            color="zevcore"
            loading={submitLoading}
          >
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default Login;
