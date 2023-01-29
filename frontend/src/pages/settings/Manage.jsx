import React, { useState, useEffect } from "react";
import BreadCrumb from "../../components/BreadCrumb";
import { Card, Grid, Center, Text } from "@mantine/core/cjs";
import {
  AdjustmentsAlt,
  ArrowAutofitWidth,
  BuildingBank,
  CircleCheck,
  DatabaseImport,
  Discount2,
  FileInvoice,
  Location,
  Pencil,
  Percentage,
  Printer,
  Refresh,
  Settings,
  TableExport,
  TriangleSquareCircle,
  UserExclamation,
  UserPlus,
} from "tabler-icons-react";
import {
  Avatar,
  Container,
  createStyles,
  Box,
  Modal,
  Progress,
} from "@mantine/core"; //for import mantine required functions and theme
import useStyles from "../../components/Style";
import logo from "../../assets/images/logo.png";
import logo1 from "../../assets/images/logo_1.png";
import logoD from "../../assets/images/logo_dark.png";
import { useNavigate } from "react-router-dom"; // for import react dom navigation components
import {
  handleGetAccount,
  handleOneUser,
  handleUpdate,
} from "../../helpers/apis";

function Setting() {
  let navigate = useNavigate();
  const [data, setData] = useState("");
  const [data2, setData2] = useState("");
  const links = [
    { label: "Profile Setting", icon: UserExclamation, link: "/profile" },
    { label: "Account Settings", icon: AdjustmentsAlt, link: "/account" },
    { label: "HSN Tax", icon: Percentage, link: "/tax" },
  ];

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const response = await handleOneUser();
      if (response.status == 200) {
        setData(response.data.data);
      }

      const response2 = await handleGetAccount();
      if (response2.status == 200) {
        setData2(response2.data);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const handlePage = (e) => {
    navigate(e);
  };
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  const [opened2, setOpened2] = useState(false);
  const [counter, setCounter] = useState(0);
  const [complete, setComplete] = useState(false);
  const updateCheck = async (e) => {
    if ("/activation" == e) {
      setOpened2(true);
    } else {
      setCounter(0);
      setOpened(true);

      const progressCount = setInterval(() => {
        setCounter((counter) => counter + 10);
      }, 500);

      setTimeout(function () {
        clearInterval(progressCount);
      }, 5500);
      const response = await handleUpdate();
    }
  };
  return (
    <div>
      <div
        justify="center"
        align="center"
        style={{
          marginBottom: 15,
          marginTop: 75,
        }}
      >
        {data != "" ? (
          <>
            <Avatar
              color="zevcore"
              radius="xl"
              style={{ width: 60, height: 60 }}
            >
              <Text style={{ fontSize: 40 }}>{data.name.slice(0, 1)}</Text>
            </Avatar>
            <Text className={classes.Text1} mt={5} weight={600}>
              {data.name}
            </Text>
            <Text className={classes.Text2} size="xs" mt={5}>
              {data2.company}
            </Text>
          </>
        ) : null}
      </div>
      <Container style={{ width: "50%", margin: "auto" }}>
        <Grid grow gutter="xs">
          {links.map((item, index) => (
            <Grid.Col md={4} lg={4}>
              <div
                className={classes.SettingBox2}
                onClick={() => {
                  "/update" == item.link || "/activation" == item.link
                    ? updateCheck(item.link)
                    : navigate(item.link);
                }}
              >
                <Pencil className={classes.editIcon2} size={15} />
                <Box>
                  <item.icon size={50} strokeWidth="0.9" />
                  <Text sx={{ fontSize: "12px" }}>{item.label}</Text>
                </Box>
              </div>
            </Grid.Col>
          ))}
        </Grid>
        <div
          style={{
            marginTop: 30,
            textAlign: "center",
          }}
        >
          <img src={logo} width={150} />
        </div>
      </Container>

      <Modal centered opened={opened} onClose={() => setOpened(false)}>
        {counter >= 100 ? (
          <Text>Your software is upto date V-0.1.0</Text>
        ) : (
          <>
            <Progress value={counter} animate />
            <Text>Checking for latest update</Text>
          </>
        )}
      </Modal>
      <Modal
        withCloseButton={false}
        centered
        opened={opened2}
        onClose={() => setOpened2(false)}
      >
        <Text>
          Activated On - {new Date(data.createdAt).toLocaleDateString("en-UK")}
        </Text>
        {new Date(data.createdAt).getMonth() == "01" ? (
          <>
            {new Date(data.createdAt).getDate() == "29" ? (
              <Text>
                Next AMC -{" "}
                {new Date(
                  new Date("March 01, 2022 00:20:18").setFullYear(
                    new Date().getFullYear() + 1
                  )
                ).toLocaleDateString("en-UK")}
              </Text>
            ) : (
              <Text>
                Next AMC -{" "}
                {new Date(
                  new Date(data.createdAt).setFullYear(
                    new Date().getFullYear() + 1
                  )
                ).toLocaleDateString("en-UK")}
              </Text>
            )}
          </>
        ) : (
          <Text>
            Next AMC -{" "}
            {new Date(
              new Date(data.createdAt).setFullYear(new Date().getFullYear() + 1)
            ).toLocaleDateString("en-UK")}
          </Text>
        )}

        <Text>Email - {data.email}</Text>
        <Text>Phone Number - {data.phone_number} </Text>
      </Modal>
    </div>
  );
}

export default Setting;
