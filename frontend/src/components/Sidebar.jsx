import {
  ActionIcon,
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  ScrollArea,
  useMantineTheme,
  Menu,
  Text,
  Button,
  Group,
  Code,
  TextInput,
  Divider,
  SegmentedControl,
  Center,
  Box,
  HoverCard,
  Transition,
  Paper,
  Indicator,
  Container,
} from "@mantine/core"; //for import mantine required functions and theme
import React, { useState, useEffect } from "react";
import {
  MoonStars,
  Sun,
  Search,
  Settings,
  UserExclamation,
  Logout,
  X,
  WindowMinimize,
  WindowMaximize,
  Refresh,
  Minus,
  Archive,
  ChartLine,
  User,
  Dashboard,
  RotateClockwise2,
  Cash,
  BoxMultiple,
  Download,
  Bell,
} from "tabler-icons-react";
import { IconSearch } from "@tabler/icons";
import { useLocalStorage, useClickOutside } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { useNavigate, Outlet, useParams } from "react-router-dom"; // for import react dom navigation components
import {
  SpotlightProvider,
  useSpotlight,
  openSpotlight,
} from "@mantine/spotlight";

// For imports the logo images for navigation
import Icon from "../assets/images/icon.png";
import logo1 from "../assets/images/logo_1.png";
import logoD from "../assets/images/logo_dark.png";
// Import thte linksgroup
import { LinksGroup } from "./NavLinks";
import useStyles from "./Style"; // Import the mantine custome styles from the compoents
//for   made mantine theme style change and write custome theme here

import Home from "../pages/Home";

import Navigation from "./Navigation";

// For control the search of naviagation list
function SpotlightControl(props) {
  const spotlight = useSpotlight();
  return (
    <Group position="center" color="dark">
      <TextInput
        variant="filled"
        placeholder="Search"
        onClick={spotlight.openSpotlight}
        size="xs"
        width={50}
        shortcut={["ctrl + k", "mod + K", "⌘ + K"]}
        icon={<IconSearch size={12} stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code>Ctrl + K</Code>}
        styles={{ rightSection: { pointerEvents: "none" } }}
        mb="sm"
      />
    </Group>
  );
}

const scaleY = {
  in: { opacity: 1, transform: "scaleY(1)" },
  out: { opacity: 0, transform: "scaleY(0)" },
  common: { transformOrigin: "top" },
  transitionProperty: "transform, opacity",
};

// Side bar navigation list by array
const mockdata = [
  { label: "Dashboard", icon: Dashboard, link: "/" },
  {
    label: "Sales",
    icon: ChartLine,
    initiallyOpened: true,
    links: [
      { label: "Add Sale", link: "/add_sale" },
      { label: "Sales", link: "/sale" },
      { label: "Add Estimate", link: "/add_estimate" },
      { label: "Estimates", link: "/estimate" },
      { label: "KPI", link: "/kpi" },
      // { label: "HSN Report", link: "/hsn" },
    ],
  },
  {
    label: "Inventory",
    icon: Archive,
    initiallyOpened: true,
    links: [
      { label: "Vendors", link: "/vendors" },
      { label: "Stock In", link: "/stock_in" },
      { label: "Stock View", link: "/stock" },
      { label: "Purchase Order", link: "/po" },
    ],
  },
  {
    label: "Cash Ledger",
    icon: Box,
    initiallyOpened: true,
    links: [
      { label: "Cash Ledger ", link: "/cash" },
      { label: "Search Cash Ledger", link: "/search_cash" },
    ],
  },
  {
    label: "Products",
    icon: Box,
    initiallyOpened: true,
    links: [
      { label: "Brands", link: "/brands" },
      { label: "Groups", link: "/groups" },
      { label: "SubGroups", link: "/subgroups" },
      { label: "Products", link: "/products" },
    ],
  },
  { label: "Customers", icon: User, link: "/customers" },

  { label: "Settings", icon: Settings, link: "/manages" },
];

// Sidebar start
function Sidebar({ children }) {
  const params = useParams();
  const [opened, setOpened] = useState(false);
  const [customerDrawer, setCustomerDrawer] = useState(false);
  const [stockDrawer, setStockDrawer] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [name, setName] = useState("");
  const [pathURL, setPathURL] = useState("");

  const theme = useMantineTheme();
  const clickOutsideRef = useClickOutside(() => setName(""));

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const dark = colorScheme === "dark";
  const { classes } = useStyles();
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));
  const [note, setNote] = useState(true);
  const [pCount, setPCount] = useLocalStorage({
    key: "depletion",
    defaultValue: 0,
  });
  const [notificationDrawer, setNotificationDrawer] = useState(false);
  useEffect(() => {
    console.log(window.location.href);
    setPathURL(window.location.href);
  });

  const modals = useModals();
  let navigate = useNavigate();

  const actions = [
    {
      title: "Dashboard",
      onTrigger: () => navigate("/"),
    },
    {
      title: "Client",
      onTrigger: () => navigate("/client"),
    },
    { title: "Group", onTrigger: () => navigate("/group") },
    { title: "Product", onTrigger: () => navigate("/products") },

    { title: "Proforma", onTrigger: () => navigate("/proforma") },

    { title: "Create Proforma", onTrigger: () => navigate("/create_proforma") },

    { title: "Invoice", onTrigger: () => navigate("/create_invoice") },
    { title: "Week Report", onTrigger: () => navigate("/week_report") },

    { title: "Daily Report", onTrigger: () => navigate("/daily_report") },

    { title: "Month report", onTrigger: () => navigate("/month_report") },

    {
      title: "Delivery Challan",
      onTrigger: () => navigate("/delivery_challan"),
    },
    { title: "Profile Setting", onTrigger: () => navigate("/profile") },

    { title: "Account Settings", onTrigger: () => navigate("/account") },

    { title: "HSN Tax", onTrigger: () => navigate("/tax") },
  ];

  return (
    <div>
      <AppShell
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
        // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
        navbarOffsetBreakpoint="sm"
        // fixed prop on AppShell will be automatically added to Header and Navbar
        fixed
        header={
          <Header
            height={42}
            style={{
              borderBottom: "0px",
            }}
            className="border-bottom noprint"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  backgroundColor:
                    theme.colorScheme === "dark" ? "#2d2d2d" : "#EEEEEE",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 5,
                  paddingTop: 6,
                }}
              >
                <div
                  className="no-drag"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Navigation />
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <ActionIcon
                    className="zc-mt-1 no-drag"
                    color={dark ? "yellow" : "blue"}
                    onClick={() => toggleColorScheme()}
                    title="Toggle dark light"
                  >
                    {dark ? (
                      <Sun strokeWidth="0.8" size={20} />
                    ) : (
                      <MoonStars strokeWidth="0.8" size={20} />
                    )}
                  </ActionIcon>

                  {/* <ActionIcon
                    className="zc-mt-1 no-drag"
                    color="dark"
                    onClick={() => setNotificationDrawer(!notificationDrawer)}
                    title="Page refresh"
                  >
                    <Indicator disabled={note} color="red">
                      <Bell strokeWidth="0.8" size={20} />
                    </Indicator>
                  </ActionIcon> */}

                  {/* For Profile Dropdown list */}
                  <Menu shadow="md" className="no-drag zc-mr-1" width={200}>
                    <Menu.Target>
                      <ActionIcon
                        className="zc-mt-1"
                        color="dark"
                        type="button"
                        title="Setting"
                      >
                        <Settings strokeWidth="0.8" size={20} />
                      </ActionIcon>
                    </Menu.Target>
                    {/* Profile setting page */}
                    <Menu.Dropdown>
                      {/* <Menu.Item
                        icon={<UserExclamation size={14} />}
                        onClick={() => navigate("/profile")}
                      >
                        Profile Settings
                      </Menu.Item> */}
                      <Menu.Item
                        icon={<Settings size={14} />}
                        onClick={() => navigate("/manages")}
                      >
                        Settings
                      </Menu.Item>
                      {/* For logout button */}
                      <Menu.Item
                        onClick={() => {
                          modals.openConfirmModal({
                            title: "Confirm Logout ",
                            children: (
                              <Text size="sm">Do you want to logout.</Text>
                            ),

                            labels: {
                              confirm: "Confirm",
                              cancel: "Cancel",
                            },
                            confirmProps: { color: "red" },
                            onCancel: () => console.log("Cancel"),
                            onConfirm: () => {
                              localStorage.clear();
                              navigate("/login");
                            },
                          });
                        }}
                        color="red"
                        icon={<Logout size={14} />}
                      >
                        Log Out
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>

                  <SpotlightProvider
                    className="no-drag"
                    actions={actions}
                    searchPlaceholder="Search..."
                    shortcut={["ctrl + k", "mod + K", "⌘ + K"]}
                    nothingFoundMessage="Nothing found..."
                  >
                    <div
                      style={{ width: 150 }}
                      className="no-drag"
                      onClick={openSpotlight}
                    >
                      <TextInput
                        variant="filled"
                        placeholder="Search"
                        onClick={openSpotlight}
                        size="xs"
                        pt={2}
                        pb={1}
                        shortcut={["ctrl + k", "mod + K", "⌘ + K"]}
                        icon={<IconSearch size={12} stroke={1.5} />}
                        rightSectionWidth={70}
                        rightSection={<Code>Ctrl + K</Code>}
                      />
                    </div>
                  </SpotlightProvider>
                </div>
              </div>
            </div>
          </Header>
        }
      >
        <Outlet />
        {pathURL == "http://localhost:3000/#/manages" ||
        pathURL == "https://test.dhanashreesurgicals.com/#/manages" ||
        pathURL == "https://dhanashreesurgicals.com/#/manages" ? (
          <footer className={classes.footer}>
            <Container className={classes.afterFooter}>
              <Text color="dimmed" size="sm" align="center">
                © {new Date().getFullYear()}. Zevcore Private Limited. All
                Rights Reserved.
              </Text>
              {theme.colorScheme === "dark" ? (
                <div
                  style={{
                    marginTop: 20,
                    textAlign: "center",
                  }}
                >
                  <img src={logoD} width={150} />
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 20,
                    textAlign: "center",
                  }}
                >
                  <img src={logo1} width={150} />
                </div>
              )}
            </Container>
          </footer>
        ) : (
          <footer className={classes.footer}>
            <Container className={classes.afterFooter}>
              <Text color="dimmed" size="sm" align="center">
                © {new Date().getFullYear()}. Zevcore Private Limited. All
                Rights Reserved.
              </Text>
            </Container>
          </footer>
        )}
      </AppShell>
      <div style={{ display: "none" }}>
        <Home schemeDrawer={notificationDrawer} />
      </div>
    </div>
  );
}

export default Sidebar;
