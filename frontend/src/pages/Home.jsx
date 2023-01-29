import {
  Grid,
  Card,
  Text,
  Image,
  Avatar,
  Group,
  Tabs,
  Button,
  Drawer,
  Skeleton,
  Menu,
  TextInput,
  Paper,
  ScrollArea,
  Table,
  ActionIcon,
} from "@mantine/core";
import React, { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import {
  Box,
  Cash,
  CashBanknote,
  CreditCard,
  CurrencyRupee,
  LineHeight,
  Receipt2,
  ReportAnalytics,
  Dots,
  Eye,
  SunLow,
  Timeline,
  Trash,
  UserCircle,
  InfoSquare,
  InfoCircle,
  Notebook,
  FileText,
  DotsCircleHorizontal,
} from "tabler-icons-react";
import admin from "../assets/images/admin.svg";
import ReactApexChart from "react-apexcharts";
import BreadCrumb from "../components/BreadCrumb";
import {
  handleDashboard,
  handleGetCreateInvoice,
  handleGetCreateInvoiceOne,
  handleGetTenInvoice,
} from "../helpers/apis";
import useStyles from "../components/Style";
import { DatePicker, TimeInput } from "@mantine/dates";
import notificationHelper from "../helpers/notification";
import { useModals } from "@mantine/modals";
import { Th } from "../helpers/tableFunction";
import { dataSlice, nFormatter } from "../helpers/common";
import { useNavigate, useParams } from "react-router-dom";
import PaymentInvoice from "../helpers/PaymentInvoice";
import GoldCustomer from "../helpers/GoldCustomer";

function Home(props) {
  const params = useParams();
  let navigate = useNavigate();
  const modals = useModals();
  const [sortedData, setSortedData] = useState([]);
  const { classes } = useStyles();
  const [variables, setVariables] = useState({
    chartType: "area",
    reminder: [],
    depletion: "",
    reminderToday: [],
    refreshChart: new Date(),
    total_sale: "",
    total_amount_sale: "",
    total_product_sold: "",

    total_customer: "",
    cash_expense: "",
    cash_income: "",
    skeletonLoading: true,
    addDrawer: false,
    submitLoading: false,
    depletionDrawer: false,
    deleteIndex: 0,
  });
  const [series, setSeries] = useState([
    {
      name: "Sales",
      type: variables.chartType,
      data: [0],
      color: "#043c64",
    },
  ]);

  const [options, setOptions] = useState({
    dataLabels: {
      enabled: false,
    },
    chart: {
      height: 350, //adding height
      type: variables.chartType,
      stroke: {
        curve: "smooth",
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: true,
          zoomout: true,
          pan: false,
          customIcons: [
            {
              icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chart-line" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <line x1="4" y1="19" x2="20" y2="19"></line>
              <polyline points="4 15 8 9 12 11 16 6 20 10"></polyline>
           </svg>`,
              index: 0,
              title: "Chart Type",
              class: "custom-icon",
              click: (e) => {
                var data = series;
                if (data[0].type == "area") {
                  data[0] = {
                    name: data[0].name,
                    type: "bar",
                    data: data[0].data,
                    color: "#043c64",
                  };
                } else {
                  data[0] = {
                    name: data[0].name,
                    type: "area",
                    data: data[0].data,
                    color: "#043c64",
                  };
                }
                setSeries(data);
                setVariables((variables) => {
                  return {
                    ...variables,
                    refreshChart: new Date(),
                  };
                });
              },
            },
          ],
        },
        export: {
          csv: {
            filename: "sales.csv",
          },
          svg: {
            filename: "sales.svg",
          },
          png: {
            filename: "sales.png",
          },
        },
      },
    },

    xaxis: {
      //added month vise data
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  });
  const [opened1, setOpened1] = useState(1);
  useEffect(() => {
    if (opened1 == 1) {
      setVariables((variables) => {
        return {
          ...variables,
          depletionDrawer: false,
        };
      });
      setOpened1(2);
    } else {
      setVariables((variables) => {
        return {
          ...variables,
          depletionDrawer: true,
        };
      });
    }
  }, [props.schemeDrawer]);
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const response = await handleDashboard();

      if (response.status == 200) {
        setVariables({
          ...variables,
          total_sale: response.data[0],
          skeletonLoading: false,
          total_customer: response.data[1],
          depletion: response.data[2],
          cash_income: response.data[3],
        });
        var data = response.data[4];
        var clean = data.map((data) => ({
          timeStamp: new Date(data.invoice_date).toLocaleString(),
        }));
        const result = clean.reduce((r, { timeStamp }) => {
          let dateObj = new Date(timeStamp);
          let monthyear = dateObj.toLocaleString("en-us", {
            month: "long",
          });
          if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
          else r[monthyear].entries++;
          return r;
        }, {});
        var result2 = Object.values(result).map(Object.values);

        var month = [];
        var values = [];
        for (let i = 0; i < result2.length; i++) {
          month[i] = result2[i][0];
          values[i] = result2[i][1];
        }
      }
      const response4 = await handleGetTenInvoice();

      if (response4.status === 200) {
        const datas = dataSlice({
          data: response4.data.data,
          page: 1,
          total: 10,
        });
        setSortedData(datas);
      }
      setTimeout(() => {
        series[0].data = values;
        setVariables((variables) => {
          return {
            ...variables,
            chartType: "area",
            refreshChart: new Date(),
          };
        });
      }, 600);
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {}, [variables.refreshChart]);

  const form = useForm({
    initialValues: {
      reminder: "",
      date: new Date(),
      time: new Date(),
    },
    validate: {
      reminder: (value) => (value.length < 1 ? " Reminder is required" : null),
    },
  });

  const AddReminder = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = "";
    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Reminder added successfully",
      });
      form.reset();

      setVariables({
        ...variables,
        submitLoading: false,
        reminder: response.data.data[0],
        reminderToday: response.data.data[1],
      });
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
    }
  };
  //For delete confirm modal show                                               Delete
  const openConfirmModal = (e) => {
    setVariables({ ...variables, deleteIndex: e });
    modals.openConfirmModal({
      title: "Do you want to delete this reminder data",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleConfirmDelete(e),
    });
  };

  //   For delete db data from table and db
  const handleConfirmDelete = async (e) => {
    const response = await "";
    // Check the response for notification and actions

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Reminder deleted successfully",
      });
      var filter = variables.reminder;
      filter = filter.filter((img) => img.value !== e);
      var filter2 = variables.reminderToday;
      filter2 = filter2.filter((img) => img.value !== e);
      setVariables({
        ...variables,
        submitLoading: false,
        reminder: filter,
        reminderToday: filter2,
      });
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
    }
  };

  // Product golden
  const [paymentModal, setPaymentModal] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [goldTitle, setGoldTitle] = useState("");
  const [goldValue, setGoldValue] = useState("");
  const [goldData, setGoldData] = useState("");

  // Table data arrabnge by using function and loop throw each data rrange to table body
  const rows = sortedData.map((row, index) => (
    <tr key={row.label}>
      <td>{index + 1}</td>

      <td>{new Date(row.invoice_date).toLocaleDateString("en-UK")}</td>
      <td>{row.invoice_num}</td>
      <td>
        <Group>
          {row.client_name}
          <ActionIcon
            onClick={async () => {
              var date = new Date();
              var firstDay = new Date(date.getFullYear(), 0, 1); //get first day of the year
              var lastDay = new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
              );

              setCustomerModal(true);

              setGoldTitle(row.client_name);
              setGoldValue(row.client_id);
            }}
            ml={-10}
            color="zevcore"
            variant="transparent"
          >
            <DotsCircleHorizontal size={20} />
          </ActionIcon>
        </Group>
      </td>
      <td>{row.client_gst}</td>
      <td>{row.tax_invoice_transactions.length}</td>
      <td>{row.sub_totalamt}</td>

      <td>
        {row.gst_amount != null
          ? Number(Number(row.gst_amount) / 2).toFixed(2)
          : 0}
      </td>
      <td>
        {row.gst_amount != null
          ? Number(Number(row.gst_amount) / 2).toFixed(2)
          : 0}
      </td>
      <td>{row.total_amount}</td>
      <td>{row.due_amount}</td>

      {/* For action drop down edit and delete the data */}
      <td justifycontent="right" align="right">
        <Menu shadow="sm" size="xs">
          <Menu.Target>
            <ActionIcon
              color="zevcore"
              type="button"
              style={{ marginLeft: 10 }}
              size="xs"
            >
              <Dots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => navigate("/invoice_print/" + row.value)}
              icon={<Eye size={14} />}
            >
              View
            </Menu.Item>
            <Menu.Item
              onClick={async () => {
                const reg = {
                  id: row.value,
                };
                const data = await handleGetCreateInvoiceOne(reg);

                const list = data.data;
                setPaymentModal(true);
                setGoldData(list);
                setGoldTitle(row.invoice_num);
                setGoldValue(row.value);
              }}
              icon={<Cash size={14} />}
            >
              Payment
            </Menu.Item>
            {/* <Menu.Item
              onClick={() => openConfirmModal(row.value)}
              icon={<Trash size={14} />}
            >
              Delete
            </Menu.Item> */}
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));

  return (
    <div>
      <BreadCrumb Text="Dashboard" />

      <Grid mt={15}>
        <Grid.Col span={12}>
          <Skeleton radius="md" visible={variables.skeletonLoading}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Text align="center">Top 10 latest sale</Text>
              <Table
                horizontalSpacing="md"
                verticalSpacing="xs"
                className={classes.striped}
              >
                {/* Table header defines */}
                <thead>
                  <tr>
                    <Th>Sl.No</Th>
                    <Th>Invoice Date</Th>
                    <Th>Invoice Num</Th>
                    <Th>Customer</Th>
                    <Th>Client GST</Th>
                    <Th>Total Item</Th>
                    <Th>Subtotal</Th>
                    <Th>CGST</Th>
                    <Th>SGST</Th>
                    <Th>Total</Th>
                    <Th>Due Amount</Th>

                    <Th>Action</Th>
                  </tr>
                </thead>
                {/* Table body defines from rows function */}
                <tbody>
                  {rows.length > 0 ? (
                    rows
                  ) : (
                    <tr>
                      <td>
                        <Text weight={500} align="center">
                          Nothing found
                        </Text>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Skeleton>
        </Grid.Col>
        <Grid.Col span={12}>
          <Grid>
            <Grid.Col span={3}>
              <Skeleton radius="md" visible={variables.skeletonLoading}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ flexDirection: "column", marginTop: 10 }}>
                      <Text size="sm">Total Customer</Text>
                      <div
                        style={{
                          display: "flex",
                          marginTop: 5,
                        }}
                      >
                        <Text size={25} mt={-6}>
                          {variables.total_customer}
                        </Text>
                      </div>
                    </div>
                    <Avatar color="lime" radius="xl" size={70}>
                      <UserCircle size={36} />
                    </Avatar>
                  </div>
                </Card>
              </Skeleton>
            </Grid.Col>
            <Grid.Col span={3}>
              <Skeleton radius="md" visible={variables.skeletonLoading}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ flexDirection: "column", marginTop: 10 }}>
                      <Text size="sm"> Total Product</Text>
                      <div
                        style={{
                          display: "flex",
                          marginTop: 5,
                        }}
                      >
                        <Text size={25} mt={-6}>
                          {variables.depletion}
                        </Text>
                      </div>
                    </div>
                    <Avatar color="yellow" radius="xl" size={70}>
                      <Box size={36} />
                    </Avatar>
                  </div>
                </Card>
              </Skeleton>
            </Grid.Col>
            <Grid.Col span={3}>
              <Skeleton radius="md" visible={variables.skeletonLoading}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ flexDirection: "column", marginTop: 10 }}>
                      <Text size="sm">Total Proforma-Invoices</Text>
                      <div
                        style={{
                          display: "flex",
                          marginTop: 5,
                        }}
                      >
                        <Text size={25} mt={-6}>
                          {variables.cash_income}
                        </Text>
                      </div>
                    </div>
                    <Avatar color="grape" radius="xl" size={70}>
                      <FileText size={36} />
                    </Avatar>
                  </div>
                </Card>
              </Skeleton>
            </Grid.Col>
            <Grid.Col span={3}>
              <Skeleton radius="md" visible={variables.skeletonLoading}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ flexDirection: "column", marginTop: 10 }}>
                      <Text size="sm">Total Tax-Invoices</Text>
                      <div
                        style={{
                          display: "flex",
                          marginTop: 5,
                        }}
                      >
                        <Text size={25} mt={-6}>
                          {variables.total_sale}
                        </Text>
                      </div>
                    </div>
                    <Avatar color="red" radius="xl" size={70}>
                      <Timeline size={36} />
                    </Avatar>
                  </div>
                </Card>
              </Skeleton>
            </Grid.Col>
          </Grid>
        </Grid.Col>

        <Grid.Col span={12}>
          <Skeleton radius="md" visible={variables.skeletonLoading}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <div key={variables.refreshChart}>
                <ReactApexChart
                  options={options}
                  series={series}
                  type={variables.chartType}
                  height={285}
                  width="95%"
                />
              </div>
            </Card>
          </Skeleton>
        </Grid.Col>
      </Grid>

      {/* Brand Add drawer */}
      <Drawer
        opened={variables.addDrawer}
        onClose={() => setVariables({ ...variables, addDrawer: false })}
        title="Add Reminder"
        classNames={{
          header: classes.header,
          drawer: classes.drawer,
          closeButton: classes.closeButton,
        }}
        size="xl"
        position="right"
      >
        {/* Drawer content */}
        <div className="zc-p-3">
          {/* Brand adding form name */}
          <form onSubmit={form.onSubmit((values) => AddReminder(values))}>
            <TextInput
              variant="filled"
              value={form.values.name}
              label="Reminder "
              placeholder="Enter Reminder"
              {...form.getInputProps("reminder")}
            />
            <DatePicker
              label="Select Date"
              value={form.values.date}
              placeholder="Reminder Date"
              {...form.getInputProps("date")}
            />
            <TimeInput
              label="Select Date"
              value={form.values.time}
              format="12"
              placeholder="Reminder Time"
              {...form.getInputProps("time")}
            />
            <Button
              mt="xl"
              type="submit"
              fullWidth
              color="zevcore"
              loading={variables.submitLoading}
            >
              Submit
            </Button>
          </form>
        </div>
      </Drawer>

      <PaymentInvoice
        value={goldValue}
        title={goldTitle}
        list={goldData}
        paymentModal={paymentModal}
        setPaymentModal={setPaymentModal}
      />

      <GoldCustomer
        value={goldValue}
        title={goldTitle}
        list={goldData}
        customerModal={customerModal}
        setCustomerModal={setCustomerModal}
      />
      {/* Brand add drawer end */}
    </div>
  );
}

export default Home;
