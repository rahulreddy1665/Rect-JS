import React, { useState, useEffect, useRef } from "react";
import BreadCrumb from "../../components/BreadCrumb"; // For breadcrumbs data import
import useStyles from "../../components/Style"; // Import the mantine custome styles from the compoents
import {
  Skeleton,
  Card,
  TextInput,
  Group,
  Text,
  Transition,
  Button,
  Drawer,
  Table,
  ScrollArea,
  NativeSelect,
  Select,
  Pagination,
  Menu,
  ActionIcon,
  Progress,
  NumberInput,
  Paper,
  LoadingOverlay,
} from "@mantine/core"; // Mantine all required compoennts imports list
import {
  Cash,
  CloudUpload,
  Dots,
  DotsCircleHorizontal,
  Eye,
  Pencil,
  Search,
  SearchOff,
  Trash,
} from "tabler-icons-react"; // For import the icons
import { useForm } from "@mantine/form"; // Mantine form import
import { CSVLink } from "react-csv"; // For export the data to excel format
import {
  handleDeleteCreateInvoice,
  handleGetClient,
  handleGetCreateInvoice,
  handleGetCreateInvoiceOne,
  handleGetTwoDate,
} from "../../helpers/apis"; // Import for axios requests list for this pages
import notificationHelper from "../../helpers/notification"; // Import notification for this page
import { Th, dataSearch, setSorting } from "../../helpers/tableFunction"; // For table data functions
import {
  customLoader,
  dataSlice,
  onDownload,
  selectFilter,
} from "../../helpers/common"; // Common fuctions uses for applications
import { useModals } from "@mantine/modals"; // Modal from mantine
import excel from "../../assets/images/excel.png"; // Image for excel export
import pdf from "../../assets/images/pdf.png"; // Image for pdf exports
import { useInterval } from "@mantine/hooks";
import readXlsxFile from "read-excel-file";
import { useNavigate } from "react-router-dom";
import PaymentInvoice from "../../helpers/PaymentInvoice";
import { DatePicker, DateRangePicker } from "@mantine/dates";
import jsPDF from "jspdf";
import dayjs from "dayjs";
import GoldCustomer from "../../helpers/GoldCustomer";

function WeekReport(props) {
  // Mantine custome style use
  const { classes } = useStyles();
  const modals = useModals();
  let navigate = useNavigate();
  // Setting the variables data for table data
  const [sortedData, setSortedData] = useState([]); // For table data
  const [activePage, setPage] = useState(1); // For set table active page
  const [total, setTotal] = useState(10); // For set total list show in page
  const [search, setSearch] = useState(""); // For set the search value name of table
  const [sortBy, setSortBy] = useState(null); // Seting the sortby table type
  const [reverseSortDirection, setReverseSortDirection] = useState(false); // For set the reverse sort direction
  const [refreshTable, setRefreshTable] = useState(Date.now()); // For refresh table
  const [firstDate, setFirstDate] = useState("");
  // Product golden
  const [paymentModal, setPaymentModal] = useState(false);
  const [goldTitle, setGoldTitle] = useState("");
  const [goldValue, setGoldValue] = useState("");
  const [goldData, setGoldData] = useState("");
  const [dateRangeYear, setDateRangeYear] = useState(
    new Date().getFullYear().toString()
  );
  const [dateRange, setDateRange] = useState("");
  const [dateRange2, setDateRange2] = useState("");
  const [customer, setCustomer] = useState("");

  const [years, setYears] = useState([
    { value: "2019", label: "2019" },
    { value: "2020", label: "2020" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
    { value: "2028", label: "2028" },
    { value: "2029", label: "2029" },
    { value: "2030", label: "2030" },
    { value: "2031", label: "2031" },
    { value: "2032", label: "2032" },
  ]);
  // Setting the variables data list here
  const [variables, setVariables] = useState({
    skeletonLoading: true,
    submitLoading: false,
    data: [],
    customer: [],
    addDrawer: false,
    bulkDrawer: false,
    openEdit: false,
    deleteIndex: 0,
  });

  // For form validation
  const form = useForm({
    initialValues: {
      label: "",
      sku_code: "",
      hsn_code: "",
      quantity: "",
      price: "",
    },
  });

  //   For edit form data validation
  const formEdit = useForm({
    initialValues: {
      value: "",
      label: "",
      sku_code: "",
      hsn_code: "",
      quantity: "",
      price: "",
    },
  });

  const [customerModal, setCustomerModal] = useState(false);

  //   For intial setting data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1); //get first day of the year
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); //get last date date of the year

        // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1); //get first day of the year
        // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        //   For get all the invoice data list
        const req = {
          date1: new Date(firstDay),
          date2: new Date(lastDay),
        };
        const response = await handleGetTwoDate(req);

        // On Respose setting the data to variable
        if (response.status === 200) {
          setVariables((variables) => {
            return {
              ...variables,
              data: response.data.data[0],
              skeletonLoading: false,
            };
          });
          const datas = dataSlice({
            data: response.data.data[0],
            page: 1,
            total: 10,
          });
          setSortedData(datas);
        }

        const response2 = await handleGetClient();
        // On Respose setting the data to variable
        if (response2.status === 200) {
          const listGroup = await selectFilter({
            data: response2.data.data,
          });

          setVariables((variables) => {
            return {
              ...variables,
              customer: listGroup,
            };
          });
        }

        const response3 = await handleGetCreateInvoiceOne({
          id: 1,
        });
        console.log(response3);
        if (response3.status == 200) {
          if (response3.data != null && response3.data != "") {
            setFirstDate(new Date(response3.data.invoice_date));
            var year = new Date(response3.data.invoice_date).getFullYear();
            console.log(year);
            var data = [];
            while (year <= new Date().getFullYear()) {
              data.push({ value: year.toString(), label: year.toString() });
              year++;
            }
            setYears(data);
          }
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Table data arrabnge by using function and loop throw each data rrange to table body
  const rows = sortedData.map((row, index) => (
    <tr key={row.label}>
      <td>{activePage * total - total + index + 1}</td>

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
      <td>{row.patient_name}</td>
      <td>{row.ip_num}</td>
      <td>{row.tax_invoice_transactions.length}</td>
      <td>{row.sub_totalamt}</td>
      <td>{row.gst_amount}</td>
      <td>{row.total_amount}</td>
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
              onClick={() => navigate("/invoice_edit/" + row.value)}
              icon={<Pencil size={14} />}
            >
              Edit
            </Menu.Item>
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

  //For delete confirm modal show                                               Delete
  const openConfirmModal = (e) => {
    setVariables({ ...variables, deleteIndex: e });
    modals.openConfirmModal({
      title: "Do you want to delete this invoice value",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleConfirmDelete(e),
    });
  };
  //   For delete db data from table and db
  const handleConfirmDelete = async (e) => {
    const response = await handleDeleteCreateInvoice(e);
    // Check the response for notification and actions

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Invoice deleted successfully",
      });
      var filter = variables.data;
      filter = filter.filter((img) => img.value !== e);
      setVariables({
        ...variables,
        submitLoading: false,
        data: filter,
      });
      const datas = dataSlice({
        data: filter,
        page: activePage,
        total: total,
      });
      setSortedData(datas);
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
    }
  };

  const handleEdit = async (e) => {
    console.log("hi");
  };

  // Add new invoice data
  const AddInvoice = async (e) => {
    if (dateRange == "" && dateRange == null) {
    }
    var firstDay =
      dateRange != "" && dateRange != null
        ? new Date(dateRange)
        : new Date(Number(dateRangeYear), 1 - 1, 1); //get first day of the year
    var lastDay =
      dateRange2 != "" && dateRange2 != null
        ? new Date(dateRange2)
        : new Date(Number(dateRangeYear), 12, 1);

    const req = {
      date1: firstDay,
      date2: lastDay,
      customer: customer,
    };
    console.log(req);
    setVariables({ ...variables, submitLoading: true });
    const response = await handleGetTwoDate(req);
    console.log(response);
    // Check for response for actions
    if (response.status === 200) {
      setVariables((variables) => {
        return {
          ...variables,
          data: response.data.data[0],
          submitLoading: false,
        };
      });
      const datas = dataSlice({
        data: response.data.data[0],
        page: 1,
        total: 10,
      });
      setSortedData(datas);
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
    }
  };

  const print = () => {
    const doc = new jsPDF("landscape");
    var body = [
      ...variables.data.map((el) => [
        el.invoice_date,
        el.invoice_num,
        el.client_name,
        el.client_gst,
        el.patient_name,
        el.ip_num,
        el.sub_totalamt,
        el.gst_amount,
        el.total_amount,
      ]),
    ];
    doc.autoTable({
      bodyStyles: { lineColor: [0, 0, 0], textColor: [0, 0, 0] },
      head: [
        [
          "Invoice Date",
          "Invoice Number",

          "Hospital Name",
          "Hospital GST",
          "Patient Name",
          "IP No",
          "Basic Total",
          "GST ",

          "Total Amount",
        ],
      ],
      body: body,
    });
    doc.save("invoice.pdf");
  };

  return (
    <div>
      {/* For breadcrumbs */}
      <Skeleton mb={5} radius="md" visible={variables.skeletonLoading}>
        <BreadCrumb Text="All Sales" />
      </Skeleton>
      {variables.skeletonLoading == false ? (
        <Paper mb={5} p={15} className="border">
          <Group>
            <Select
              label="Select Customer"
              variant="filled"
              fullWidth
              dropdownPosition="bottom"
              searchable
              clearable
              placeholder="Select Customer"
              data={variables.customer}
              value={customer}
              onChange={(e) => {
                setCustomer(e);
              }}
              mr={2}
            />
            <Select
              label="Select Year"
              variant="filled"
              value={dateRangeYear}
              onChange={setDateRangeYear}
              placeholder="Select Year"
              data={years}
            />

            <DatePicker
              variant="filled"
              label="Pick From Date / Date"
              zIndex={5}
              fullWidth
              placeholder="Pick Date "
              value={dateRange}
              onChange={(e) => {
                var year = new Date(e).getFullYear();
                console.log(year, e);
                setDateRange(e);
                setDateRangeYear(year.toString());
              }}
              minDate={dayjs(new Date(firstDate))
                .startOf("year")
                .add(0, "days")
                .toDate()}
              maxDate={dayjs(new Date())
                .endOf("year")
                .subtract(0, "days")
                .toDate()}
            />
            <DatePicker
              variant="filled"
              label="Pick To Date "
              zIndex={5}
              fullWidth
              placeholder="Pick Date "
              value={dateRange2}
              onChange={setDateRange2}
            />

            <Button
              loading={variables.submitLoading}
              onClick={() => AddInvoice()}
              mt={22}
              leftIcon={<Search size={14} />}
            >
              Search
            </Button>
          </Group>
        </Paper>
      ) : null}

      {/* Main start here */}

      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <LoadingOverlay
          visible={variables.submitLoading}
          loader={customLoader}
          overlayBlur={2}
        />
        <Card className="border">
          <ScrollArea zIndex={3}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* For search the table data input forms */}
              <div>
                <TextInput
                  variant="filled"
                  placeholder="Search by any field"
                  mb="md"
                  size="xs"
                  value={search}
                  icon={<Search size={14} />}
                  onChange={async (e) => {
                    // On change search ofr the data that is enter
                    setSearch(e.currentTarget.value);
                    setPage(1);
                    const datas = await dataSearch({
                      data: variables.data,
                      value: e.currentTarget.value,
                      activePage: activePage,
                      total: total,
                    });
                    setSortedData(datas);
                    setRefreshTable(new Date());
                  }}
                  sx={{ width: 250 }}
                />
              </div>

              <div>
                <Group spacing="xs">
                  {/* For export the the table data to pdf and excels */}
                  <Text size="xs">Exports :</Text>
                  <CSVLink
                    data={variables.data}
                    headers={[
                      { label: " Invoice Date", key: "invoice_date" },
                      { label: " Invoice Num", key: "invoice_num" },
                      { label: "Hospital Name", key: "client_name" },
                      { label: "GSTIN", key: "client_gst" },

                      { label: " Patient Name", key: "patient_name" },
                      { label: "IP Num", key: "ip_num" },

                      { label: "Basic Total", key: "sub_totalamt" },
                      { label: "GST Amount", key: "gst_amount" },

                      { label: "Total Amount", key: "total_amount" },
                    ]}
                    filename="invoice.csv"
                    className={classes.pdfExcel}
                  >
                    <img
                      src={excel}
                      alt="excel"
                      width="25"
                      style={{ margin: "2px" }}
                    />
                  </CSVLink>
                  <button className={classes.pdfExcel} onClick={print}>
                    <img
                      src={pdf}
                      alt="pdf"
                      width="19"
                      style={{ margin: "2px" }}
                    />
                  </button>
                  {/* Drawer open for adding new invoice data */}
                  {/* <Button
                    variant="outline"
                    color="zevcore"
                    size="xs"
                    onClick={() =>
                      setVariables({ ...variables, addDrawer: true })
                    }
                  >
                    + Add Invoice
                  </Button> */}
                </Group>
              </div>
            </div>
            {/* Table data view */}
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
                  <Th>Invoice Number</Th>
                  <Th>Hospital Name</Th>
                  <Th>GSTIN</Th>
                  <Th>Patient Name</Th>
                  <Th>IP No</Th>
                  <Th>Items</Th>
                  <Th>Basic Amount</Th>
                  <Th>GST Amount</Th>
                  <Th>Total Amount</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              {/* Table body defines from rows function */}
              <tbody key={refreshTable}>
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
          </ScrollArea>
          {/* For display the pagination and no of per pages list */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 15,
            }}
          >
            {/* For number of rows display in table */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text size="xs" className="zc-pr-3 zc-pt-1">
                Per Page
              </Text>
              <NativeSelect
                size="xs"
                onChange={async (e) => {
                  setTotal(Number(e.currentTarget.value));
                  setPage(1);
                  const datas = await dataSlice({
                    data: variables.data,
                    page: 1,
                    total: Number(e.currentTarget.value),
                  });
                  setSortedData(datas);
                  setRefreshTable(new Date());
                }}
                data={["10", "20", "50", "100"]}
                rightSectionWidth={20}
                sx={{ width: 70 }}
              />
            </div>
            {/* For pagination */}
            <Pagination
              size="sm"
              page={activePage}
              onChange={async (e) => {
                setPage(Number(e));
                const datas = await dataSlice({
                  data: variables.data,
                  page: Number(e),
                  total: total,
                });
                setSortedData(datas);
                setRefreshTable(new Date());
              }}
              total={Math.ceil(variables.data.length / total)}
              color="zevcore"
            />
          </div>
        </Card>
      </Skeleton>

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
    </div>
  );
}
export default WeekReport;
