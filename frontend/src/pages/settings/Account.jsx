import React, { useState, useEffect, useRef, useCallback } from "react";
import BreadCrumb from "../../components/BreadCrumb";
import axios from "axios";

// Mantine library
import { X, Check, CloudDownload } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";

import {
  Space,
  Card,
  Button,
  NumberInput,
  Group,
  createStyles,
  Text,
  TextInput,
  Skeleton,
  Input,
  Grid,
  Switch,
  useMantineTheme,
} from "@mantine/core"; //for import mantine required functions and theme

import "jspdf-autotable";

// For export images

// For bulk upload convert excel file to json

import {
  Dropzone,
  DropzoneStatus,
  MIME_TYPES,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons";

import { handleGetAccount, handleAddAccount } from "../../helpers/apis";
import notificationHelper from "../../helpers/notification";

//for   made mantine theme style change and write custome theme here
const useStyles = createStyles((theme) => ({
  control: {
    position: "absolute",
    width: 250,
    left: "calc(50% - 125px)",
    bottom: -20,
  },
  label: {
    position: "relative",
    zIndex: 1,
  },
  wrapper: {
    position: "relative",
    marginBottom: 30,
  },
  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },
}));

function getActiveColor(status, theme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.black;
}

function Account() {
  const [token, setToken] = useState(localStorage.getItem("token")); //get saved local storage data
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [URL, setURL] = useState(process.env.REACT_APP_BACKEND_URL);
  const [URLFILE, setURLFILE] = useState(process.env.REACT_APP_FILE);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [id, setId] = useState("");
  const [checked, setChecked] = useState(false);
  const [pincode, setPincode] = useState("");
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [city, setCity] = useState("");

  const theme = useMantineTheme();
  const { classes } = useStyles();
  const openRef = useRef();
  const [image, setImage] = useState("");
  const [upImg, setUpImg] = useState("");
  const [cropConfig, setCropConfig] = useState({
    unit: "%",
    width: 100,
    aspect: undefined,
  });
  const [crop, setCrop] = useState({
    unit: "%",
    width: 100,
    aspect: undefined,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const ref = useRef();

  const form = useForm({
    initialValues: {
      gstin: "",
      company: "",
      dl1: "",
      dl2: "",
      value: "",
    },
  });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        const response = await handleGetAccount();

        if (response.status === 200) {
          var datas = response.data;
          if (datas != null) {
            form.setFieldValue("gstin", datas.gstin);
            form.setFieldValue("company", datas.company);
            form.setFieldValue("dl1", datas.dl1);
            form.setFieldValue("dl2", datas.dl2);
            form.setFieldValue("value", datas.value);
          }
          setSkeletonLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAdd = async (e) => {
    // Set notification of saving and loader effects
    setSubmitLoading(true);

    // Main axios part for sending data to backend adding user data

    const response = await handleAddAccount(e);

    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Account data updated successfully",
      });

      setSubmitLoading(false);
    } else {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Account data updated successfully",
      });
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <Skeleton
        height="100%"
        width="100%"
        radius="md"
        visible={skeletonLoading}
      >
        <BreadCrumb Text="Account" Title="Settings" titleLink="/manages" />
      </Skeleton>
      <Space h="md" />
      {/* Main page start from here */}
      <Skeleton
        height="100%"
        width="100%"
        radius="md"
        sx={(theme) => ({
          boxShadow:
            "0 1px 3px rgb(0 0 0 / 5%), rgb(0 0 0 / 5%) 0px 10px 15px -5px, rgb(0 0 0 / 4%) 0px 7px 7px -5px",
        })}
        visible={skeletonLoading}
      >
        <Card shadow="sm" p="lg">
          <form onSubmit={form.onSubmit((values) => handleAdd(values))}>
            <Grid mb={15}>
              <Grid.Col md={3} lg={3} mt={1}>
                <TextInput
                  variant="filled"
                  mt={1}
                  value={form.values.company}
                  label="Company Name"
                  placeholder="Company Name"
                  {...form.getInputProps("company")}
                />
              </Grid.Col>
              <Grid.Col md={3} lg={3} mt={1}>
                <TextInput
                  variant="filled"
                  mt={1}
                  value={form.values.gstin}
                  label="GSTIN"
                  placeholder="GSTIN"
                  {...form.getInputProps("gstin")}
                />
              </Grid.Col>
              <Grid.Col md={3} lg={3} mt={1}>
                <TextInput
                  variant="filled"
                  mt={1}
                  value={form.values.dl1}
                  label="DL Number-1"
                  placeholder="CIN"
                  {...form.getInputProps("dl1")}
                />
              </Grid.Col>
              <Grid.Col md={3} lg={3} mt={1}>
                <TextInput
                  variant="filled"
                  mt={1}
                  value={form.values.dl2}
                  label="DL Number-2"
                  placeholder="Door No."
                  {...form.getInputProps("dl2")}
                />
              </Grid.Col>
            </Grid>

            <Group position="right" mt="md">
              <Button
                type="submit"
                variant="outline"
                color="gold"
                loading={submitLoading}
              >
                Submit
              </Button>
            </Group>
          </form>
        </Card>
      </Skeleton>
    </div>
  );
}

export default Account;
