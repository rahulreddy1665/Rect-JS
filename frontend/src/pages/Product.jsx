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
  Select,
  Paper,
} from "@mantine/core"; // Mantine all required compoennts imports list
import {
  CloudUpload,
  Dots,
  DotsCircleHorizontal,
  Pencil,
  Search,
  Trash,
} from "tabler-icons-react"; // For import the icons
import { useForm } from "@mantine/form"; // Mantine form import
import { CSVLink } from "react-csv"; // For export the data to excel format
import {
  handleAddProduct,
  handleBulkProduct,
  handleDeleteProduct,
  handleEditProduct,
  handleGetGroup,
  handleGetHSNTax,
  handleGetProduct,
} from "../helpers/apis"; // Import for axios requests list for this pages
import notificationHelper from "../helpers/notification"; // Import notification for this page
import { Th, dataSearch, setSorting } from "../helpers/tableFunction"; // For table data functions
import { dataSlice, onDownload, selectFilter } from "../helpers/common"; // Common fuctions uses for applications
import { useModals } from "@mantine/modals"; // Modal from mantine
import excel from "../assets/images/excel.png"; // Image for excel export
import pdf from "../assets/images/pdf.png"; // Image for pdf exports
import { useInterval } from "@mantine/hooks";
import readXlsxFile from "read-excel-file";
import jsPDF from "jspdf";

function Product(props) {
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
  const [sortedData2, setSortedData2] = useState([]);
  // Setting the variables data list here
  const [variables, setVariables] = useState({
    skeletonLoading: true,
    submitLoading: false,
    data: [],
    groupList: [],
    hsnList: [],
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
      quantity: 0,
      price: 0,
      group_id: "",
      hsn_id: "",
      lot_number: "",
    },
  });

  //   For edit form data validation
  const formEdit = useForm({
    initialValues: {
      value: "",
      label: "",
      sku_code: "",
      hsn_code: "",
      quantity: 0,
      price: 0,
      group_id: "",
      hsn_id: "",
      lot_number: "",
    },
  });

  //   For intial setting data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        //   For get all the product data list
        const response = await handleGetProduct();

        // On Respose setting the data to variable
        if (response.status === 200) {
          setSortedData2(response.data.data);
          setVariables((variables) => {
            return {
              ...variables,
              data: response.data.data,
              skeletonLoading: false,
            };
          });
          const datas = dataSlice({
            data: response.data.data,
            page: 1,
            total: 10,
          });
          setSortedData(datas);
        }

        const response1 = await handleGetGroup();

        // On Respose setting the data to variable
        if (response1.status === 200) {
          const listGroup = await selectFilter({
            data: response1.data.data,
          });
          setVariables((variables) => {
            return {
              ...variables,
              groupList: listGroup,
              skeletonLoading: false,
            };
          });
        }

        const response2 = await handleGetHSNTax();

        // On Respose setting the data to variable
        if (response2.status === 200) {
          const listGroup = await selectFilter({
            data: response2.data.data,
          });
          setVariables((variables) => {
            return {
              ...variables,
              hsnList: listGroup,
              skeletonLoading: false,
            };
          });
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
      <td>{row.group.label}</td>
      <td>{row.label}</td>
      <td>{row.sku_code}</td>
      <td>{row.hsn_tax.label}</td>
      <td>{row.quantity}</td>
      <td>{row.price}</td>

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
      title: "Do you want to delete this product value",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleConfirmDelete(e),
    });
  };
  //   For delete db data from table and db
  const handleConfirmDelete = async (e) => {
    const response = await handleDeleteProduct(e);
    // Check the response for notification and actions

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Product deleted successfully",
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
    formEdit.setFieldValue("group_id", datas.group_id.toString());
    formEdit.setFieldValue("sku_code", datas.sku_code);
    formEdit.setFieldValue("hsn_id", datas.hsn_id.toString());
    formEdit.setFieldValue("quantity", datas.quantity);
    formEdit.setFieldValue("price", datas.price);
    formEdit.setFieldValue("lot_number", datas.lot_number);
    setVariables({ ...variables, deleteIndex: e, openEdit: true });
  };

  // Edit product data compoennt
  const EditProduct = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleEditProduct(e);

    // Check for respose data for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Product updated successfully",
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
      setRefreshTable(new Date());
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
    }
  };

  // Add new product data
  const AddProduct = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleAddProduct(e);
    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Product added successfully",
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
  // Upload bulk json data product
  const BulkDataUpload = async () => {
    setVariables({ ...variables, submitLoading: true });

    const response = await handleBulkProduct(bulkData);
    // Check for response for actions
    if (response.status === 200) {
      interval.stop();
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Bulk product added successfully",
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
        el.group.label,
        el.label,
        el.sku_code,
        el.hsn_tax.label,
        el.quantity,
        el.price,
      ]),
    ];
    doc.autoTable({
      bodyStyles: { lineColor: [0, 0, 0], textColor: [0, 0, 0] },
      head: [["Group", "Name", "SKU", "HSN", "Quantity", "Price"]],
      body: body,
    });
    doc.save("product.pdf");
  };

  const [selectGroup, setSelectGroup] = useState("");
  const [selectHSN, setSelectHSN] = useState("");

  const AddInvoice = () => {
    var datas = sortedData2;
    var filter = "";
    var date2 = "";
    if (selectGroup != "") {
      datas = datas.filter(function (item) {
        if (Number(selectGroup) != Number(item.group_id)) {
          return false;
        }

        return true;
      });
    }
    if (selectHSN != "") {
      datas = datas.filter(function (item) {
        if (Number(selectHSN) != Number(item.hsn_id)) {
          return false;
        }

        return true;
      });
    }
    setVariables((variables) => {
      return {
        ...variables,
        data: datas,
        skeletonLoading: false,
      };
    });
    const datas2 = dataSlice({
      data: datas,
      page: 1,
      total: 10,
    });
    setSortedData(datas2);
  };
  return (
    <div>
      {/* For breadcrumbs */}
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <BreadCrumb Text="All Products" />
      </Skeleton>

      <Paper mb={5} p={15} className="border">
        <Group>
          <Select
            label="Select Group"
            variant="filled"
            fullWidth
            dropdownPosition="bottom"
            searchable
            clearable
            placeholder="Select Group"
            data={variables.groupList}
            value={selectGroup}
            onChange={(e) => {
              setSelectGroup(e);
            }}
            mr={2}
          />
          <Select
            label="Select HSN"
            variant="filled"
            value={selectHSN}
            onChange={(e) => {
              setSelectHSN(e);
            }}
            placeholder="Select HSN"
            data={variables.hsnList}
          />

          <Button
            loading={variables.submitLoading}
            onClick={() => AddInvoice()}
            mt={22}
            leftIcon={<Search size={14} />}
          >
            Search
          </Button>
          <Button
            loading={variables.submitLoading}
            onClick={() => {
              setSelectHSN("");
              setSelectGroup("");
              setVariables((variables) => {
                return {
                  ...variables,
                  data: sortedData2,
                  skeletonLoading: false,
                };
              });
              const datas2 = dataSlice({
                data: sortedData2,
                page: 1,
                total: 10,
              });
              setSortedData(datas2);
            }}
            mt={22}
          >
            Clear
          </Button>
        </Group>
      </Paper>

      {/* Main start here */}
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <Card className="border">
          <ScrollArea>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex" }}>
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
              </div>
              <div>
                <Group spacing="xs">
                  {/* For export the the table data to pdf and excels */}
                  <Text size="xs">Exports :</Text>
                  <CSVLink
                    data={variables.data}
                    headers={[
                      { label: "Group", key: "group.label" },
                      { label: "Name", key: "label" },
                      { label: "SKU", key: "sku_code" },
                      { label: "HSN", key: "hsn_tax.label" },
                      { label: "Price", key: "price" },
                    ]}
                    filename="product.csv"
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
                  {/* Drawer open for adding new product data */}
                  <Button
                    variant="outline"
                    color="zevcore"
                    size="xs"
                    onClick={() =>
                      setVariables({ ...variables, addDrawer: true })
                    }
                  >
                    + Add Product
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
                  <Th>Group</Th>
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
                    Product
                  </Th>
                  <Th>SKU Code</Th>
                  <Th>HSN Code</Th>
                  <Th>Quantity</Th>
                  <Th>Price</Th>
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

      {/* Product Add drawer */}
      <Drawer
        opened={variables.addDrawer}
        onClose={() => setVariables({ ...variables, addDrawer: false })}
        title="Add Product"
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
              {/* Product adding form name */}
              <form onSubmit={form.onSubmit((values) => AddProduct(values))}>
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Group"
                  searchable
                  required
                  clearable
                  placeholder="Select Group"
                  {...form.getInputProps("group_id")}
                  data={variables.groupList}
                />
                <TextInput
                  required
                  variant="filled"
                  value={form.values.label}
                  label="Product Name"
                  placeholder="Product Name"
                  {...form.getInputProps("label")}
                />
                <TextInput
                  variant="filled"
                  value={form.values.sku_code}
                  label="Product SKU"
                  placeholder="Product SKU"
                  {...form.getInputProps("sku_code")}
                />
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select HSN"
                  searchable
                  required
                  clearable
                  placeholder="Select HSN"
                  {...form.getInputProps("hsn_id")}
                  data={variables.hsnList}
                />
                <NumberInput
                  variant="filled"
                  value={form.values.quantity}
                  label="Quantity"
                  placeholder="Quantity"
                  {...form.getInputProps("quantity")}
                />

                <NumberInput
                  variant="filled"
                  value={form.values.price}
                  label="Price"
                  placeholder="Price"
                  {...form.getInputProps("price")}
                />
                <TextInput
                  variant="filled"
                  value={form.values.lot_number}
                  label="Product Lot Number"
                  placeholder="Product Lot Number"
                  {...form.getInputProps("lot_number")}
                />
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
      {/* Product add drawer end */}

      {/* Product Edit drawer */}
      <Drawer
        opened={variables.openEdit}
        onClose={() => setVariables({ ...variables, openEdit: false })}
        title="Add Product"
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
              {/* Product Editing form name */}
              <form
                onSubmit={formEdit.onSubmit((values) => EditProduct(values))}
              >
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Group"
                  searchable
                  required
                  clearable
                  placeholder="Select Group"
                  {...formEdit.getInputProps("group_id")}
                  data={variables.groupList}
                />
                <TextInput
                  required
                  variant="filled"
                  value={formEdit.values.label}
                  label="Product Name"
                  placeholder="Product Name"
                  {...formEdit.getInputProps("label")}
                />
                <TextInput
                  variant="filled"
                  value={formEdit.values.sku_code}
                  label="Product SKU"
                  placeholder="Product SKU"
                  {...formEdit.getInputProps("sku_code")}
                />
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select HSN"
                  searchable
                  required
                  clearable
                  placeholder="Select HSN"
                  {...formEdit.getInputProps("hsn_id")}
                  data={variables.hsnList}
                />
                <NumberInput
                  variant="filled"
                  value={formEdit.values.quantity}
                  label="Quantity"
                  placeholder="Quantity"
                  {...formEdit.getInputProps("quantity")}
                />

                <NumberInput
                  variant="filled"
                  value={formEdit.values.price}
                  label="Price"
                  placeholder="Price"
                  {...formEdit.getInputProps("price")}
                />
                <TextInput
                  variant="filled"
                  value={formEdit.values.lot_number}
                  label="Product Lot Number"
                  placeholder="Product Lot Number"
                  {...formEdit.getInputProps("lot_number")}
                />
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
      {/* Product edit drawer end */}

      {/* Product Bulk drawer */}
      <Drawer
        opened={variables.bulkDrawer}
        onClose={() => setVariables({ ...variables, bulkDrawer: false })}
        title="Product Bulk"
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
              onClick={() => onDownload({ data: "product" })}
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
          {/* Product Bulk add file */}
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

      {/* Product Bulk drawer end */}
    </div>
  );
}
export default Product;
