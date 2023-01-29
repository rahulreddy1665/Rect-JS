import React, { useState, useEffect, useRef } from "react";
import BreadCrumb from "../components/BreadCrumb"; // For breadcrumbs data import
import useStyles from "../components/Style"; // Import the mantine custome styles from the compoents
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
  Pagination,
  Menu,
  ActionIcon,
  Progress,
  NumberInput,
  Grid,
  HoverCard,
} from "@mantine/core"; // Mantine all required compoennts imports list
import {
  CloudUpload,
  Dots,
  DotsCircleHorizontal,
  InfoCircle,
  Pencil,
  Search,
  Trash,
} from "tabler-icons-react"; // For import the icons
import { useForm } from "@mantine/form"; // Mantine form import
import { CSVLink } from "react-csv"; // For export the data to excel format
import {
  handleAddClient,
  handleBulkClient,
  handleDeleteClient,
  handleEditClient,
  handleGetClient,
  handleGetClientHistory,
  handleGetTwoDate,
} from "../helpers/apis"; // Import for axios requests list for this pages
import notificationHelper from "../helpers/notification"; // Import notification for this page
import { Th, dataSearch, setSorting } from "../helpers/tableFunction"; // For table data functions
import { dataSlice, onDownload } from "../helpers/common"; // Common fuctions uses for applications
import { useModals } from "@mantine/modals"; // Modal from mantine
import excel from "../assets/images/excel.png"; // Image for excel export
import pdf from "../assets/images/pdf.png"; // Image for pdf exports
import { useInterval } from "@mantine/hooks";
import readXlsxFile from "read-excel-file";
import jsPDF from "jspdf";
import "jspdf-autotable";
import GoldCustomer from "../helpers/GoldCustomer";

function Client(props) {
  // Mantine custome style use
  const { classes } = useStyles();
  const modals = useModals();

  // Setting the variables data for table data
  const [sortedData, setSortedData] = useState([]); // For table data
  const [activePage, setPage] = useState(1); // For set table active page
  const [total, setTotal] = useState(10); // For set total list show in page
  const [search, setSearch] = useState(""); // For set the search value name of table
  const [sortBy, setSortBy] = useState(null); // Seting the sortby table type
  const [reverseSortDirection, setReverseSortDirection] = useState(false); // For set the reverse sort direction
  const [refreshTable, setRefreshTable] = useState(Date.now()); // For refresh table

  const [customerModal, setCustomerModal] = useState(false);
  const [goldTitle, setGoldTitle] = useState("");
  const [goldValue, setGoldValue] = useState("");
  const [goldData, setGoldData] = useState("");

  // Setting the variables data list here
  const [variables, setVariables] = useState({
    skeletonLoading: true,
    submitLoading: false,
    data: [],
    addDrawer: false,
    bulkDrawer: false,
    openEdit: false,
    deleteIndex: 0,
  });

  // For form validation
  const form = useForm({
    initialValues: {
      label: "",
      email1: "",
      email2: "",
      email3: "",
      phone_number: "",
      credit_limit: 0,
      alternate: "",
      gstin: "",
      address: "",
      state: "",
    },
  });

  //   For edit form data validation
  const formEdit = useForm({
    initialValues: {
      value: "",
      label: "",
      email1: "",
      email2: "",
      email3: "",
      phone_number: "",
      credit_limit: 0,
      alternate: "",
      gstin: "",
      address: "",
      state: "",
    },
  });

  //   For intial setting data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        //   For get all the client data list
        const response = await handleGetClient();

        // On Respose setting the data to variable
        if (response.status === 200) {
          setVariables({
            ...variables,
            data: response.data.data,
            skeletonLoading: false,
          });
          const datas = dataSlice({
            data: response.data.data,
            page: 1,
            total: 10,
          });
          setSortedData(datas);
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
      <td>
        <Group>
          {row.label}
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

              setGoldTitle(row.label);
              setGoldValue(row.value);
            }}
            ml={-10}
            color="zevcore"
            variant="transparent"
          >
            <DotsCircleHorizontal size={20} />
          </ActionIcon>
        </Group>
      </td>
      <td>{row.phone_number}</td>
      <td>{row.email1}</td>
      <td>{row.email2}</td>
      <td>{row.email3}</td>
      <td>{row.state}</td>
      <td>{new Date(row.createdAt).toLocaleDateString()}</td>
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
              onClick={() => handleEdit(row.value)}
              icon={<Pencil size={14} />}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              onClick={() => openConfirmModal(row.value)}
              icon={<Trash size={14} />}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));

  //For delete confirm modal show                                               Delete
  const openConfirmModal = (e) => {
    setVariables({ ...variables, deleteIndex: e });
    modals.openConfirmModal({
      title: "Do you want to delete this client value",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleConfirmDelete(e),
    });
  };
  //   For delete db data from table and db
  const handleConfirmDelete = async (e) => {
    const response = await handleDeleteClient(e);
    // Check the response for notification and actions

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Client deleted successfully",
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

  //   set editable data to form                                                        Edit form
  const handleEdit = (e) => {
    var datas = variables.data.find((img) => img.value === e);
    formEdit.setFieldValue("value", datas.value);
    formEdit.setFieldValue("label", datas.label);
    formEdit.setFieldValue("email1", datas.email1);
    formEdit.setFieldValue("phone_number", datas.phone_number);
    formEdit.setFieldValue("email2", datas.email2);
    formEdit.setFieldValue("email3", datas.email3);
    formEdit.setFieldValue("alternate", datas.alternate);
    formEdit.setFieldValue("gstin", datas.gstin);
    formEdit.setFieldValue("credit_limit", Number(datas.credit_limit));
    formEdit.setFieldValue("address", datas.address);
    formEdit.setFieldValue("state", datas.state);
    setVariables({ ...variables, deleteIndex: e, openEdit: true });
  };

  // Edit client data compoennt
  const EditClient = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleEditClient(e);

    // Check for respose data for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Client updated successfully",
      });
      setVariables({
        ...variables,
        submitLoading: false,
        data: response.data.data,
      });
      const datas = dataSlice({
        data: response.data.data,
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

  // Add new client data
  const AddClient = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleAddClient(e);
    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Client added successfully",
      });
      form.reset();
      setVariables({
        ...variables,
        submitLoading: false,
        data: response.data.data,
      });
      const datas = dataSlice({
        data: response.data.data,
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
  // For bulk upload
  const [bulkData, setBulkData] = useState([]);
  const ref = useRef();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const bulkFile789 = async (event) => {
    let xlsxfile = event.target.files ? event.target.files[0] : null;

    var data = [];
    readXlsxFile(xlsxfile).then((rows) => {
      data = rows;
      setBulkData(data);
    });

    ref.current.value = "";
  };
  const interval = useInterval(
    () =>
      setProgress((current) => {
        if (current < 100) {
          return current + 1;
        }
        return 0;
      }),
    20
  );
  // Upload bulk json data client
  const BulkDataUpload = async () => {
    setVariables({ ...variables, submitLoading: true });

    const response = await handleBulkClient(bulkData);
    // Check for response for actions
    if (response.status === 200) {
      interval.stop();
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Bulk client added successfully",
      });
      form.reset();
      setVariables({
        ...variables,
        submitLoading: false,
        data: response.data.data,
      });
      const datas = dataSlice({
        data: response.data.data,
        page: activePage,
        total: total,
      });
      setSortedData(datas);
    } else {
      interval.stop();
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
        el.label,
        el.email1,

        el.phone_number,

        el.gstin,

        el.state,
      ]),
    ];
    doc.autoTable({
      bodyStyles: { lineColor: [0, 0, 0], textColor: [0, 0, 0] },
      head: [["Name", "Email1", "Phone No.", "GSTIN", "State"]],
      body: body,
    });
    doc.save("client.pdf");
  };

  return (
    <div>
      {/* For breadcrumbs */}
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <BreadCrumb Text="All Clients" />
      </Skeleton>

      {/* Main start here */}
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <Card className="border">
          <ScrollArea>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* For search the table data input forms */}
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
              <div>
                <Group spacing="xs">
                  {/* For export the the table data to pdf and excels */}
                  <Text size="xs">Exports :</Text>
                  <CSVLink
                    data={variables.data}
                    headers={[
                      { label: "Client Name", key: "label" },
                      { label: "Email1", key: "email1" },
                      { label: "Email2", key: "email2" },
                      { label: "Email3", key: "email3" },
                      { label: "Phone No.", key: "phone_number" },
                      { label: "Alternate Phone No.", key: "alternate" },
                      { label: "GSTIN", key: "gstin" },
                      { label: "Address", key: "address" },
                      { label: "Credit Limit", key: "credit_limit" },
                      { label: "State", key: "state" },
                    ]}
                    filename="client.csv"
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
                  {/* Drawer open for adding new client data */}
                  <Button
                    variant="outline"
                    color="zevcore"
                    size="xs"
                    onClick={() =>
                      setVariables({ ...variables, addDrawer: true })
                    }
                  >
                    + Add Client
                  </Button>
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
                  <Th
                    sorted={sortBy === "label"}
                    reversed={reverseSortDirection}
                    onSort={async () => {
                      const reversed =
                        "label" === sortBy ? !reverseSortDirection : false;
                      setReverseSortDirection(reversed);
                      setSortBy("label");
                      const datas = await setSorting({
                        data: variables.data,
                        sortby: "label",
                        reversed: reversed,
                        search: search,
                        activePage: activePage,
                        total: total,
                      });
                      setSortedData(datas);
                      setRefreshTable(new Date());
                    }}
                  >
                    Client
                  </Th>
                  <Th>Phone Number</Th>
                  <Th>Email1</Th>
                  <Th>Email2</Th>
                  <Th>Email3</Th>
                  <Th>State</Th>
                  <Th>Created At</Th>
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

      {/* Client Add drawer */}
      <Drawer
        opened={variables.addDrawer}
        onClose={() => setVariables({ ...variables, addDrawer: false })}
        title="Add Client"
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div></div>
            <Button
              variant="outline"
              color="zevcore"
              size="xs"
              onClick={() =>
                setVariables({
                  ...variables,
                  bulkDrawer: true,
                  addDrawer: false,
                })
              }
            >
              Bulk Import
            </Button>
          </div>
          <ScrollArea
            style={{ height: 520 }}
            type="scroll"
            offsetScrollbars
            scrollbarSize={5}
          >
            <div className="zc-pr-3 zc-pl-3">
              {/* Client adding form name */}
              <form onSubmit={form.onSubmit((values) => AddClient(values))}>
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      required
                      variant="filled"
                      value={form.values.label}
                      label="Client Name"
                      placeholder="Client Name"
                      {...form.getInputProps("label")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={form.values.email1}
                      label="Email Address 1"
                      placeholder="Email Address 1"
                      {...form.getInputProps("email1")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    {" "}
                    <TextInput
                      variant="filled"
                      value={form.values.email2}
                      label="Email Address 2"
                      placeholder="Email Address 2"
                      {...form.getInputProps("email2")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={form.values.email3}
                      label="Email Address 3"
                      placeholder="Email Address 3"
                      {...form.getInputProps("email3")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={form.values.phone_number}
                      label="Phone Number"
                      placeholder="Phone Number"
                      {...form.getInputProps("phone_number")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={form.values.alternate}
                      label="Alternate Phone Number"
                      placeholder="Alternate Phone Number"
                      {...form.getInputProps("alternate")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={form.values.gstin}
                      label="GSTIN"
                      placeholder="GSTIN"
                      {...form.getInputProps("gstin")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={form.values.address}
                      label=" Address"
                      placeholder="Address"
                      {...form.getInputProps("address")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={form.values.state}
                      label=" State"
                      placeholder=" State"
                      {...form.getInputProps("state")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text weight={500} size="sm">
                      Credit Limit
                      <HoverCard shadow="md" openDelay={600}>
                        <HoverCard.Target>
                          <InfoCircle mt={5} size={16} />
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm">
                            Set 0 for unlimited credit limit
                          </Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Text>

                    <NumberInput
                      variant="filled"
                      value={form.values.credit_limit}
                      placeholder=" Credit Limit"
                      {...form.getInputProps("credit_limit")}
                    />
                  </Grid.Col>
                </Grid>

                <Button
                  mt="xl"
                  mb={60}
                  type="submit"
                  fullWidth
                  color="zevcore"
                  loading={variables.submitLoading}
                >
                  Submit
                </Button>
              </form>
            </div>
          </ScrollArea>
        </div>
      </Drawer>
      {/* Client add drawer end */}

      {/* Client Edit drawer */}
      <Drawer
        opened={variables.openEdit}
        onClose={() => setVariables({ ...variables, openEdit: false })}
        title="Add Client"
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
          <ScrollArea
            style={{ height: 520 }}
            type="scroll"
            offsetScrollbars
            scrollbarSize={5}
          >
            <div className="zc-pr-3 zc-pl-3">
              {/* Client adding form name */}
              <form
                onSubmit={formEdit.onSubmit((values) => EditClient(values))}
              >
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      required
                      variant="filled"
                      value={formEdit.values.label}
                      label="Client Name"
                      placeholder="Client Name"
                      {...formEdit.getInputProps("label")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formEdit.values.email1}
                      label="Email Address 1"
                      placeholder="Email Address 1"
                      {...formEdit.getInputProps("email1")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    {" "}
                    <TextInput
                      variant="filled"
                      value={formEdit.values.email2}
                      label="Email Address 2"
                      placeholder="Email Address 2"
                      {...formEdit.getInputProps("email2")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formEdit.values.email3}
                      label="Email Address 3"
                      placeholder="Email Address 3"
                      {...formEdit.getInputProps("email3")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formEdit.values.phone_number}
                      label="Phone Number"
                      placeholder="Phone Number"
                      {...formEdit.getInputProps("phone_number")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formEdit.values.alternate}
                      label="Alternate Phone Number"
                      placeholder="Alternate Phone Number"
                      {...formEdit.getInputProps("alternate")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formEdit.values.gstin}
                      label="GSTIN"
                      placeholder="GSTIN"
                      {...formEdit.getInputProps("gstin")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formEdit.values.address}
                      label=" Address"
                      placeholder="Address"
                      {...formEdit.getInputProps("address")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formEdit.values.state}
                      label=" State"
                      placeholder=" State"
                      {...formEdit.getInputProps("state")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      variant="filled"
                      value={formEdit.values.credit_limit}
                      label=" Credit Limit"
                      placeholder=" Credit Limit"
                      {...formEdit.getInputProps("credit_limit")}
                    />
                  </Grid.Col>
                </Grid>
                <Button
                  mt="xl"
                  mb={60}
                  type="submit"
                  fullWidth
                  color="zevcore"
                  loading={variables.submitLoading}
                >
                  Update
                </Button>
              </form>
            </div>
          </ScrollArea>
        </div>
      </Drawer>
      {/* Client edit drawer end */}

      {/* Client Bulk drawer */}
      <Drawer
        opened={variables.bulkDrawer}
        onClose={() => setVariables({ ...variables, bulkDrawer: false })}
        title="Client Bulk"
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div></div>

            <div
              onClick={() => onDownload({ data: "client" })}
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                cursor: "pointer",
                paddingTop: 5,
              }}
            >
              <img
                src={excel}
                alt="excel"
                width="25"
                style={{ margin: "2px" }}
              />
            </div>
          </div>
          {/* Client Bulk add file */}
          <label className="zc-custom-file-upload">
            <input type="file" ref={ref} onChange={bulkFile789} />
            <CloudUpload size={15}></CloudUpload> Upload Bulk Excel File
          </label>
          <Group position="right" mt="md">
            <Button
              color="zevcore"
              fullWidth
              style={{
                position: "relative",
                transition: "background-color 150ms ease",
              }}
              onClick={() => {
                loaded
                  ? setLoaded(false)
                  : !interval.active && interval.start();
                BulkDataUpload();
              }}
            >
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {progress !== 0
                  ? "Uploading Each Data...."
                  : loaded
                  ? "Bulk Upload Completed"
                  : "Upload files"}
              </div>
              {progress !== 0 && (
                <Progress
                  value={progress}
                  className={classes.progress}
                  color="zevcore"
                  radius="sm"
                />
              )}
            </Button>
          </Group>
        </div>
      </Drawer>

      <GoldCustomer
        value={goldValue}
        title={goldTitle}
        list={goldData}
        customerModal={customerModal}
        setCustomerModal={setCustomerModal}
      />

      {/* Client Bulk drawer end */}
    </div>
  );
}
export default Client;
