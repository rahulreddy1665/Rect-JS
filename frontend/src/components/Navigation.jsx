import { Button, Menu, Transition } from "@mantine/core";
import React, { useState } from "react";
import {
  Dashboard,
  ChartLine,
  Archive,
  Box,
  Cash,
  User,
  Settings,
  Report,
  FileText,
  ClipboardList,
} from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import useStyles from "./Style";
import { useLocalStorage } from "@mantine/hooks";
import { terminologies } from "../helpers/common";

function Navigation() {
  const [terminology, setTerminology] = useState(terminologies);
  const [colorScheme, setGroupCheck] = useLocalStorage({
    key: "groupCheck",
    defaultValue: "1",
  });
  const isAuthenticated = localStorage.getItem("groupCheck");

  let navigate = useNavigate();
  const { classes } = useStyles();
  const [active, setActive] = useState("");
  const handlePage = (e) => {
    if (typeof e != "undefined") {
      navigate(e);
      setActive(e);
    }
  };

  return (
    <div>
      {" "}
      <Button
        color="zevcore"
        variant="subtle"
        className={active === "/" ? classes.navButtonActive : classes.navButton}
        size="xs"
        onClick={() => handlePage("/")}
        leftIcon={<Dashboard size={14} />}
      >
        Dashboard
      </Button>
      <Button
        color="zevcore"
        variant="subtle"
        className={
          active === "/client" ? classes.navButtonActive : classes.navButton
        }
        size="xs"
        onClick={() => handlePage("/client")}
        leftIcon={<User size={14} />}
      >
        Clients
      </Button>
      <Menu width={200} shadow="md" position="bottom-start" withArrow>
        <Menu.Target>
          <Button
            color="zevcore"
            className={
              active === "/products" || active === "/group"
                ? classes.navButtonActive
                : classes.navButton
            }
            variant="subtle"
            size="xs"
            leftIcon={<Box size={14} />}
          >
            Product
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item color="zevcore" onClick={() => handlePage("/products")}>
            Products
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/group")}>
            Groups
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Menu width={200} shadow="md" position="bottom-start" withArrow>
        <Menu.Target>
          <Button
            color="zevcore"
            className={
              active === "/create_proforma" || active === "/proforma"
                ? classes.navButtonActive
                : classes.navButton
            }
            variant="subtle"
            size="xs"
            leftIcon={<FileText size={14} />}
          >
            Proforma
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            color="zevcore"
            onClick={() => handlePage("/create_proforma")}
          >
            Create Proforma
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/proforma")}>
            Proforma
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Button
        color="zevcore"
        variant="subtle"
        className={
          active === "/create_invoice"
            ? classes.navButtonActive
            : classes.navButton
        }
        size="xs"
        onClick={() => handlePage("/create_invoice")}
        leftIcon={<ChartLine size={14} />}
      >
        Sale
      </Button>
      <Menu width={200} shadow="md" position="bottom-start" withArrow>
        <Menu.Target>
          <Button
            color="zevcore"
            className={
              active === "/week_report" ||
              active === "/daily_report" ||
              active === "/month_report"
                ? classes.navButtonActive
                : classes.navButton
            }
            variant="subtle"
            size="xs"
            leftIcon={<Report size={14} />}
          >
            Reports
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            color="zevcore"
            onClick={() => handlePage("/daily_report")}
          >
            View Sales
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/week_report")}>
            Weekly Sales
          </Menu.Item>
          <Menu.Item
            color="zevcore"
            onClick={() => handlePage("/month_report")}
          >
            Monthly Sales
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/gst_report")}>
            GST Report
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Button
        color="zevcore"
        variant="subtle"
        className={
          active === "/delivery_challan"
            ? classes.navButtonActive
            : classes.navButton
        }
        size="xs"
        onClick={() => handlePage("/delivery_challan")}
        leftIcon={<ClipboardList size={14} />}
      >
        Delivery Challan
      </Button>
    </div>
  );
}

export default Navigation;
