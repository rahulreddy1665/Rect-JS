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
  Pagination,
  Menu,
  ActionIcon,
  Progress,
  NumberInput,
} from "@mantine/core"; // Mantine all required compoennts imports list
import {
  Cash,
  CloudUpload,
  Dots,
  DotsCircleHorizontal,
  Eye,
  Pencil,
  Search,
  Trash,
} from "tabler-icons-react"; // For import the icons
import { useForm } from "@mantine/form"; // Mantine form import
import { CSVLink } from "react-csv"; // For export the data to excel format
import {
  handelGetSaveInvoice,
  handleDeleteCreateInvoice,
  handleGetCreateInvoice,
  handleGetCreateInvoiceOne,
} from "../../helpers/apis"; // Import for axios requests list for this pages
import notificationHelper from "../../helpers/notification"; // Import notification for this page
import { Th, dataSearch, setSorting, print } from "../../helpers/tableFunction"; // For table data functions
import { dataSlice, onDownload } from "../../helpers/common"; // Common fuctions uses for applications
import { useModals } from "@mantine/modals"; // Modal from mantine
import excel from "../../assets/images/excel.png"; // Image for excel export
import pdf from "../../assets/images/pdf.png"; // Image for pdf exports
import { useInterval } from "@mantine/hooks";
import readXlsxFile from "read-excel-file";
import { useNavigate } from "react-router-dom";
import PaymentInvoice from "../../helpers/PaymentInvoice";

function SaveInvoice(props) {
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

  // Product golden
  const [paymentModal, setPaymentModal] = useState(false);
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

  //   For intial setting data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        //   For get all the invoice data list
        const response = await handelGetSaveInvoice();

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

      <td>{new Date(row.invoice_date).toLocaleDateString("en-UK")}</td>
      <td>{row.invoice_num}</td>
      <td>{row.client_name}</td>
      <td>{row.client_gst}</td>
      <td>{row.sub_total}</td>
      <td>{Number(Number(row.gst_amount) / 2).toFixed(2)}</td>
      <td>{Number(Number(row.gst_amount) / 2).toFixed(2)}</td>

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
              onClick={() => navigate("/edit_invoice/" + row.value)}
              icon={<Eye size={14} />}
            >
              Edit
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
    setVariables({ ...variables, submitLoading: true });
    const response = "";
    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Invoice added successfully",
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

  return (
    <div>
      {/* For breadcrumbs */}
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <BreadCrumb Text="All Invoice" />
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
                    headers={[{ label: " Invoice Name", key: "label" }]}
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
                  <button
                    className={classes.pdfExcel}
                    onClick={() =>
                      print({
                        data: variables.data,
                        list: ["label", "value"],
                        header: ["Invoice Name", "Id"],
                      })
                    }
                  >
                    <img
                      src={pdf}
                      alt="pdf"
                      width="19"
                      style={{ margin: "2px" }}
                    />
                  </button>
                  {/* Drawer open for adding new invoice data */}
                  <Button
                    variant="outline"
                    color="zevcore"
                    size="xs"
                    onClick={() =>
                      setVariables({ ...variables, addDrawer: true })
                    }
                  >
                    + Add Invoice
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

                  <Th>Date</Th>
                  <Th>Invoice ID</Th>
                  <Th>Client</Th>
                  <Th>Client GST</Th>
                  <Th>SubTotal</Th>
                  <Th>CGST</Th>
                  <Th>IGST</Th>

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
    </div>
  );
}
export default SaveInvoice;
