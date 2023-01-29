import {
  Grid,
  Card,
  Select,
  TextInput,
  Button,
  NumberInput,
  Text,
  ScrollArea,
  ActionIcon,
  Group,
  Drawer,
  Menu,
  Divider,
  Modal,
  Avatar,
  Table,
  NativeSelect,
  Pagination,
} from "@mantine/core";
import React, { useEffect, useState, useRef } from "react";
import {
  handelAddSaveInvoice,
  handelDeleteSaveInvoice,
  handelGetOneSaveInvoice,
  handelGetSaveInvoice,
  handleAddClient,
  handleAddCreateInvoice,
  handleAddCreateProforma,
  handleAddProduct,
  handleGetClient,
  handleGetCreateInvoice,
  handleGetGroup,
  handleGetHSNTax,
  handleGetProduct,
} from "../../helpers/apis";
import { dataSlice, selectFilter } from "../../helpers/common";
import { useForm } from "@mantine/form"; // Mantine form import
import { DatePicker } from "@mantine/dates";
import { Plus, Trash, X, Dots, Eye, Search } from "tabler-icons-react";
import useStyles from "../../components/Style";
import notificationHelper from "../../helpers/notification";

import { RichTextEditor } from "@mantine/rte";
import { useNavigate } from "react-router-dom";
import { useModals } from "@mantine/modals";
import { dataSearch, Th } from "../../helpers/tableFunction";

function AddEstimate() {
  const { classes } = useStyles();
  const [cart, setCart] = useState([]);
  const [saleTypeValue, setSaleTypeValue] = useState("Cash");
  const [saleTypeBank, setSaleTypeBank] = useState(null);
  const [detailsModal, setDetailModal] = useState(false);
  const [tableRefresh, setTableRefresh] = useState(new Date());
  const [validateBarcode, setValidateBarcode] = useState(0);
  const [customer, setCustomer] = useState("");

  //  Setting the variables data for table data
  const [sortedData, setSortedData] = useState([]); // For table data
  const [activePage, setPage] = useState(1); // For set table active page
  const [total, setTotal] = useState(10); // For set total list show in page
  const [search, setSearch] = useState(""); // For set the search value name of table
  const [sortBy, setSortBy] = useState(null); // Seting the sortby table type
  const [reverseSortDirection, setReverseSortDirection] = useState(false); // For set the reverse sort direction
  const [refreshTable, setRefreshTable] = useState(Date.now()); // For refresh table
  const [lastInvoice, setLastInvoice] = useState(Date.now());

  let navigate = useNavigate();
  const [variables, setVariables] = useState({
    addDrawer: false,
    addDrawer2: false,
    skeletonLoading: false,
    submitLoading: false,
    productBarcode: false,
    saveModal: false,
    brandList: [],
    data: [],
    productList: [],
    productData: [],
    groupList2: [],
    hsnList2: [],
    subgroupList: [],
    taxList: [],
    customer: [],
    saleType: [],
    banksList: [],
    amountPaid: 0,
    groupList: [],
    hsnList: [],
    stocks: [],
    invoiceDate: new Date(),
  });

  const form = useForm({
    initialValues: {
      customer: "",
      reference: "",
      patient_name: "",
      ip_num: "",
      dl_num: "",
      dc_num: "",
    },
  });

  const formBarcode = useForm({
    initialValues: {
      barcode: "",
      product_name: "",
      product_type: "Implant",
      product_id: "",
      product: "",
      gst: "",
      qty: 1,
      discount: 0,
      barcode: "",
      price: 0,
      discount_type: "number",
    },
  });

  const formCustomer = useForm({
    initialValues: {
      credit_limit: 5000,
      label: "",
      email1: "",
      email2: "",
      email3: "",
      phone_number: "",
      alternate: "",
      gstin: "",
      address: "",
      state: "",
    },
    validate: {
      name: (value) => (value.length < 1 ? "Customer name is required" : null),
      phone_number: (value) =>
        value.length < 10 ? "Phone name is required" : null,
    },
  });

  const formProduct = useForm({
    initialValues: {
      label: "",
      sku_code: "",
      hsn_code: "",
      quantity: 0,
      price: 0,
      group_id: "",
      hsn_id: "",
    },
  });

  const AddCustomer = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleAddClient(e);
    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Customer added successfully",
      });
      formCustomer.reset();
      const listGroup = await selectFilter({
        data: response.data.data,
      });

      setVariables((variables) => {
        return {
          ...variables,
          customer: listGroup,
          submitLoading: false,
        };
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

  const AddProductExtra = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleAddProduct(e);
    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Product added successfully",
      });
      formProduct.reset();
      const listGroup = await response.data.data.map((data) => ({
        ...data,
        value: data.value.toString(),
        label: data.label.toString(),
      }));
      listGroup.forEach(function (item) {
        delete item.createdAt;
        delete item.updatedAt;
      });
      const listSubgroup = await response.data.data.map((data) => ({
        value: data.value.toString(),
        label: data.label.toString(),
        price: data.price.toString(),
        group: data.group.label,
      }));
      setVariables((variables) => {
        return {
          ...variables,
          productList: listSubgroup,
          productData: listGroup,
          skeletonLoading: false,
        };
      });

      var product = response.data.data;
      var data44 = product.pop();
      formBarcode.setFieldValue("price", Number(data44.price));
      formBarcode.setFieldValue("product", data44.label);
      formBarcode.setFieldValue("product_id", data44.value.toString());
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
    }
  };

  const formDetails = useForm({
    initialValues: {
      deliver_note: "",
      suppliers_ref: "",
      other_ref: "",
      buyer_order_no: "",
      dated: "",
      despatch_doc_no: "",
      delivery_note_date: "",
      despatched_through: "",
      destination: "",
      terms_of_delivery: "",
      remark: "",
    },
  });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const response2 = await handleGetClient();
      // On Respose setting the data to variable
      if (response2.status === 200) {
        const listGroup = await response2.data.data.map((data) => ({
          ...data,
          value: data.value.toString(),
          label: data.label.toString(),
        }));

        setVariables((variables) => {
          return {
            ...variables,
            customer: listGroup,
          };
        });
      }

      const response3 = await handleGetProduct();

      if (response3.status === 200) {
        const listGroup = await response3.data.data.map((data) => ({
          ...data,
          value: data.value.toString(),
          label: data.label.toString(),
        }));
        listGroup.forEach(function (item) {
          delete item.createdAt;
          delete item.updatedAt;
        });
        const listSubgroup = await response3.data.data.map((data) => ({
          value: data.value.toString(),
          label: data.label.toString(),
          price: data.price.toString(),
          group: data.group.label.toString(),
        }));

        setVariables((variables) => {
          return {
            ...variables,
            productList: listSubgroup,
            productData: listGroup,
            skeletonLoading: false,
          };
        });

        const response = await handelGetSaveInvoice();

        // On Respose setting the data to variable
        if (response.status === 200) {
          setVariables((variables) => {
            return {
              ...variables,
              data: response.data.data,
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
          const listGroup = await response1.data.data.map((data) => ({
            value: data.label.toString(),
            label: data.label.toString(),
          }));
          const listGroup2 = await selectFilter({
            data: response1.data.data,
          });
          setVariables((variables) => {
            return {
              ...variables,
              groupList: listGroup,
              groupList2: listGroup2,
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

        const response5 = await handleGetCreateInvoice();

        // On Respose setting the data to variable
        if (response5.status === 200) {
          if (response5.data.data.length > 0) {
            var data77 = response5.data.data;
            var datao = data77[data77.length - 1];
            setLastInvoice(datao.invoice_date);
          } else {
            setLastInvoice("");
          }
        }
      }
      // On Respose setting the data to variable
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // For save invoice table data selections
  const rows = sortedData.map((row, index) => (
    <tr key={row.label}>
      <td>{activePage * total - total + index + 1}</td>

      <td>{new Date(row.invoice_date).toLocaleDateString("en-UK")}</td>
      <td>{row.invoice_num}</td>
      <td>{row.client_name}</td>
      <td>{row.client_gst}</td>
      <td>{row.sub_totalamt}</td>
      <td>{Number(Number(row.gst_amount) / 2).toFixed(2)}</td>
      <td>{Number(Number(row.gst_amount) / 2).toFixed(2)}</td>
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
              onClick={async () => {
                const reg = {
                  id: row.value,
                };
                form.reset();
                const response = await handelGetOneSaveInvoice(reg);

                if (response.status === 200) {
                  var list = response.data;
                  var list2 = response.data.save_tax_invoice_transactions;
                  var save_cart = [];
                  for (let i = 0; i < list2.length; i++) {
                    var tax = 0;
                    if (list2[i].type == "Implant") {
                      tax = 5;
                    } else {
                      tax = 12;
                    }
                    var det = {
                      product: {
                        label: list2[i].product_name,
                        hsn_code: list2[i].hsn,
                        sku_code: list2[i].sku,
                        price: list2[i].mrp_display,
                      },
                      tax_per: tax,
                      type: list2[i].type,
                      tax: Number(
                        (tax / 100) * Number(list2[i].total_amount)
                      ).toFixed(2),
                      price: list2[i].price,
                      qty: list2[i].quantity,
                      discount: 0,
                      total: list2[i].total_amount,
                    };
                    save_cart.push(det);
                  }

                  setCustomer(list.client_id);
                  form.setFieldValue("reference", list.reference);
                  form.setFieldValue("ip_num", list.ip_num);
                  form.setFieldValue("patient_name", list.patient_name);
                  form.setFieldValue("dl_num", list.dl_num);
                  form.setFieldValue("dc_num", list.dc_num);
                  form.setFieldValue("invoiceDate", list.date);
                  setCart(save_cart);
                  setVariables({ ...variables, saveModal: false });
                }
              }}
            >
              Load
            </Menu.Item>

            <Menu.Item onClick={() => openConfirmModal(row.value)}>
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));
  const modals = useModals();
  //For delete confirm modal show                                               Delete
  const openConfirmModal = (e) => {
    setVariables({ ...variables, deleteIndex: e, saveModal: false });
    modals.openConfirmModal({
      title: "Do you want to delete this save invoice",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => setVariables({ ...variables, saveModal: false }),
      onConfirm: () => handleConfirmDelete(e),
    });
  };
  //   For delete db data from table and db
  const handleConfirmDelete = async (e) => {
    const response = await handelDeleteSaveInvoice(e);
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
      setVariables({ ...variables, submitLoading: false, saveModal: true });
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false, saveModal: true });
    }
  };

  const DeleteProduct = (e) => {
    var check = cart.findIndex(
      (img) => Number(img.product.value) === Number(e)
    );
    var data = cart;
    data.splice(check, 1);
    setCart(data);
    setTableRefresh(new Date());
  };
  var mergeTwoLists = function (list1, list2) {
    var array = [];
    for (let i = 0; i < list1; i++) {
      array[i].push(list1[i], list2[i]);
    }
    return array;
  };
  const AddProduct = (e) => {
    var check = cart.find((img) => img.product.label === e.product);
    var tax = 0;
    var product = "";

    // For adding tax for product type impland and
    if (e.product_type == "Implant") {
      tax = 0;
      product = variables.productList.find((img) => img.label === e.product);
    } else {
      tax = 0;
      product = { label: e.product, hsn_code: 9018, sku_code: "", price: "-" };
    }
    if (check !== null && typeof check != "undefined") {
      var dataList = cart;
      var check = cart.findIndex((img) => img.product.label === e.product);
      var discount = 0;

      if (e.discount_type == "number") {
        discount = e.discount;
      } else {
        discount = (Number(e.discount) / 100) * e.price;
      }

      var total = Number(
        (Number(e.price) - Number(discount)) *
          (Number(e.qty) + Number(dataList[check].qty))
      ).toFixed(2);

      var list = {
        product: product,
        price: e.price,
        type: e.product_type,
        tax_per: tax,
        tax: Number((tax / 100) * Number(total)).toFixed(2),
        qty: Number(e.qty) + Number(dataList[check].qty),
        discount: discount,
        total: total,
      };
      dataList[check] = list;
      setCart(dataList);
    } else {
      var discount = 0;

      if (e.discount_type == "number") {
        discount = e.discount;
      } else {
        discount = (Number(e.discount) / 100) * e.price;
      }

      var total = Number(
        (Number(e.price) - Number(discount)) * Number(e.qty)
      ).toFixed(2);

      var list = {
        product: product,
        tax_per: tax,
        type: e.product_type,
        tax: Number((tax / 100) * Number(total)).toFixed(2),
        price: e.price,
        qty: e.qty,
        discount: discount,
        total: total,
      };

      var data = cart;
      data.push(list);
      setCart(data);
    }
    formBarcode.reset();
    setVariables({ ...variables, productBarcode: false });
  };

  const handelKeyPress = (e) => {
    if (e.key === "Enter") {
      input0.current.blur();
      input1.current.focus();
    }
  };
  const formRef = useRef();
  const input0 = useRef();
  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();
  const input4 = useRef();
  const input5 = useRef();
  const input6 = useRef();
  const input7 = useRef();
  const input8 = useRef();

  const barcode = (e) => {
    var barcode = e.target.value;
    const stockList = variables.stocks;

    const finding = stockList.find((img) => img.barcode === barcode);
    if (typeof finding != "undefined" && finding != "" && finding != null) {
      formBarcode.setFieldValue("barcode", "");
      form.setFieldValue("product", finding.product.value.toString());
      form.setFieldValue("brand", finding.product.brand.value.toString());
      form.setFieldValue("group", finding.product.group.value.toString());
      form.setFieldValue("subgroup", finding.product.subgroup.value.toString());
      form.setFieldValue("price", Number(finding.product.price));
    } else {
      input0.current.focus();
      setValidateBarcode(2);
    }
    setTimeout(() => {
      setValidateBarcode(0);
    }, 3000);
  };
  const selRef = useRef();

  const AddSaleData = async () => {
    var customerId = "";
    var customerGST = "";
    if (customer !== null && customer !== "") {
      var data = variables.customer.find((img) => img.value === customer);
      customerId = data.label;
      customerGST = data.gstin;
    }

    const reg = {
      discount_amount: cart
        .reduce(function (sum, current) {
          return +Number(sum) + Number(current.discount);
        }, 0)
        .toFixed(2),
      sub_totalamt: cart.reduce(function (sum, current) {
        return +Number(sum) + Number(current.total);
      }, 0),
      totalTax: Number(
        cart.reduce(function (sum, current) {
          return +Number(sum) + Number(current.tax);
        }, 0)
      ).toFixed(2),
      sale_type: saleTypeValue,
      customer: customerId,
      customer_id: customer,
      customerGST: customerGST,
      reference: form.values.reference,
      patient_name: form.values.patient_name,
      ip_num: form.values.ip_num,
      dl_num: form.values.dl_num,
      dc_num: form.values.dc_num,
      date: form.values.invoiceDate,
      total_amount:
        cart.reduce(function (sum, current) {
          return +Number(sum) + Number(current.total);
        }, 0) +
        cart.reduce(function (sum, current) {
          return +Number(sum) + Number(current.tax);
        }, 0),
      list: cart,
      due_amount:
        cart.reduce(function (sum, current) {
          return +Number(sum) + Number(current.total);
        }, 0) +
        cart.reduce(function (sum, current) {
          return +Number(sum) + Number(current.tax);
        }, 0) -
        Number(variables.amountPaid),
      paid: variables.amountPaid,
      date: variables.invoiceDate,
    };

    const response = await handleAddCreateProforma(reg);

    if (response.status === 200) {
      navigate("/invoice_proforma/" + response.data.data[0].value);

      notificationHelper({
        color: "green",
        title: "Success",
        message: "Invoice added successfully",
      });
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
    }
  };

  return (
    <div>
      {" "}
      <Grid pb={0} gutter="xs" classNames="zc-hide-scroll">
        <Grid.Col xs={4}>
          <Card p={0} className="border">
            <div
              style={{
                display: "flex",
                padding: 6,
                margin: 0,
                justifyContent: "space-between",
                background: "#043c64",
                borderTopRightRadius: 3,
                borderTopLeftRadius: 3,
              }}
            >
              <Text color="#ffffff" weight={500} style={{ paddingTop: -15 }}>
                Create Invoice
              </Text>
            </div>

            <div style={{ padding: 15 }}>
              {/* For add new customer or selct customer */}

              <Grid grow gutter="xs">
                <Grid.Col span={12}>
                  <div
                    style={{
                      display: "flex",
                      marginTop: 0,
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 14 }} weight={500}>
                      Select Customer
                    </Text>
                    <Button
                      color="zevcore"
                      onClick={() =>
                        setVariables({ ...variables, addDrawer: true })
                      }
                      style={{ fontSize: 10, padding: 2, height: 15 }}
                    >
                      Add <Plus size={10} />
                    </Button>
                  </div>

                  <Select
                    variant="filled"
                    fullWidth
                    size="xs"
                    required
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
                </Grid.Col>
                <Grid.Col span={6}>
                  <DatePicker
                    variant="filled"
                    size="xs"
                    value={variables.invoiceDate}
                    onChange={(e) =>
                      setVariables({
                        ...variables,
                        invoiceDate: e.target.value,
                      })
                    }
                    label="Invoice Date"
                    placeholder="Pick date"
                    required
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    size="xs"
                    variant="filled"
                    value={form.values.reference}
                    label="Reference"
                    placeholder="Reference"
                    {...form.getInputProps("reference")}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    size="xs"
                    variant="filled"
                    value={form.values.patient_name}
                    label="Patient Name"
                    placeholder="Patient Name"
                    {...form.getInputProps("patient_name")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    size="xs"
                    variant="filled"
                    value={form.values.ip_num}
                    label="IP No."
                    placeholder="IP No."
                    {...form.getInputProps("ip_num")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    size="xs"
                    variant="filled"
                    value={form.values.dl_num}
                    label="DL No."
                    placeholder="DL No."
                    {...form.getInputProps("dl_num")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    size="xs"
                    variant="filled"
                    value={form.values.dc_num}
                    label="DC No."
                    placeholder="DC No."
                    {...form.getInputProps("dc_num")}
                  />
                </Grid.Col>
              </Grid>
              <Divider
                pt={2}
                mb={0}
                label="Product Select"
                labelPosition="center"
              />
              <form
                ref={formRef}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                onSubmit={formBarcode.onSubmit((values) => AddProduct(values))}
              >
                <Grid grow gutter="xs">
                  <Grid.Col span={6}>
                    <Select
                      size="xs"
                      variant="filled"
                      label="Product Type"
                      placeholder="Product one"
                      data={[
                        { value: "Implant", label: "Implant" },
                        { value: "Instrumental", label: "Instrumental" },
                      ]}
                      value={formBarcode.values.product_type}
                      {...formBarcode.getInputProps("product_type")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    {formBarcode.values.product_type == "Implant" ? (
                      <>
                        <div
                          style={{
                            display: "flex",
                            marginTop: 0,
                            marginTop: 6,
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontSize: 12 }} weight={500}>
                            Select Product
                          </Text>
                          <Button
                            color="zevcore"
                            onClick={() =>
                              setVariables({ ...variables, addDrawer2: true })
                            }
                            style={{ fontSize: 10, padding: 2, height: 15 }}
                          >
                            Add <Plus size={10} />
                          </Button>
                        </div>

                        <Select
                          ref={input3}
                          size="xs"
                          variant="filled"
                          fullWidth
                          placeholder="Select Product"
                          data={variables.productList.filter(
                            (raw) =>
                              raw.group == formBarcode.values.product_type
                          )}
                          searchable
                          maxDropdownHeight={400}
                          nothingFound="Nobody here"
                          value={formBarcode.values.product_id}
                          onChange={(e) => {
                            var pp = variables.productList.find(
                              (img) => Number(img.value) === Number(e)
                            );

                            formBarcode.setFieldValue(
                              "price",
                              Number(pp.price)
                            );
                            formBarcode.setFieldValue("product", pp.label);
                            formBarcode.setFieldValue("product_id", e);
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            display: "flex",
                            marginTop: 0,
                            marginTop: 6,
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontSize: 12 }} weight={500}>
                            Select Product
                          </Text>
                          <Button
                            color="zevcore"
                            onClick={() =>
                              setVariables({ ...variables, addDrawer2: true })
                            }
                            style={{ fontSize: 10, padding: 2, height: 15 }}
                          >
                            Add <Plus size={10} />
                          </Button>
                        </div>
                        <Select
                          ref={input3}
                          size="xs"
                          variant="filled"
                          fullWidth
                          placeholder="Select Product"
                          data={variables.productList.filter(
                            (raw) =>
                              raw.group == formBarcode.values.product_type
                          )}
                          searchable
                          maxDropdownHeight={400}
                          nothingFound="Nobody here"
                          value={formBarcode.values.product_id}
                          onChange={(e) => {
                            var pp = variables.productList.find(
                              (img) => Number(img.value) === Number(e)
                            );

                            formBarcode.setFieldValue(
                              "price",
                              Number(pp.price)
                            );
                            formBarcode.setFieldValue("product", pp.label);
                            formBarcode.setFieldValue("product_id", e);
                          }}
                        />
                      </>
                    )}
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input5}
                      size="xs"
                      variant="filled"
                      value={formBarcode.values.qty}
                      label="Product Quantity"
                      placeholder="Product Quantity"
                      {...formBarcode.getInputProps("qty")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input4}
                      size="xs"
                      variant="filled"
                      value={formBarcode.values.price}
                      label="Product Price"
                      placeholder="Product Price"
                      {...formBarcode.getInputProps("price")}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input4}
                      size="xs"
                      variant="filled"
                      value={
                        (formBarcode.values.price -
                          formBarcode.values.discount) *
                        formBarcode.values.qty
                      }
                      label="Total Price"
                      placeholder="Total Price"
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input7}
                      size="xs"
                      variant="filled"
                      label="Enter Discount Value"
                      value={formBarcode.values.discount}
                      {...formBarcode.getInputProps("discount")}
                      placeholder="Enter whole number"
                    ></NumberInput>
                  </Grid.Col>
                </Grid>
                <div style={{ display: "flex", marginTop: 15 }}>
                  <Button
                    ref={input8}
                    ml={5}
                    size="xs"
                    fullWidth
                    type="submit"
                    color="zevcore"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </Grid.Col>
        <Grid.Col xs={8}>
          <Card className="border" pt={2}>
            <div style={{ paddingBottom: 10 }}>
              <div className="invoiceItemHeight">
                <table className="tableBorder ">
                  <thead>
                    <tr>
                      <th>Sl.No</th>
                      <th>Description / Item</th>
                      <th>Qty</th>
                      <th>Price</th>

                      <th>Discount</th>
                      <th>Total</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody key={tableRefresh}>
                    {cart.length > 0 ? (
                      <>
                        {cart.map((row, index) => (
                          <tr className="products">
                            <td>{index + 1}</td>
                            <td>{row.product.label}</td>
                            <td>{row.qty}</td>
                            <td>{row.price}</td>

                            <td>{row.discount}</td>
                            <td>{row.total}</td>
                            <td
                              onClick={() => DeleteProduct(row.product.value)}
                            >
                              <Button
                                color="red"
                                size="xs"
                                style={{ fontSize: 8, padding: 2, height: 15 }}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <Divider my="xs" />
            <Grid gutter="xs">
              <Grid.Col span={8}>
                <Grid>
                  <Grid.Col span={4} pb={0} pt={1}>
                    {" "}
                    <TextInput
                      size="xs"
                      variant="filled"
                      value={variables.amountPaid}
                      label="Amount Paid"
                      onChange={(e) =>
                        setVariables({
                          ...variables,
                          amountPaid: e.target.value,
                        })
                      }
                      placeholder="Amount Paid"
                    />
                  </Grid.Col>
                  <Grid.Col span={4} pb={0} pt={1}>
                    <TextInput
                      size="xs"
                      ml={5}
                      variant="filled"
                      readOnly
                      value={
                        cart.reduce(function (sum, current) {
                          return +Number(sum) + Number(current.total);
                        }, 0) +
                        cart.reduce(function (sum, current) {
                          return +Number(sum) + Number(current.tax);
                        }, 0) -
                        Number(variables.amountPaid)
                      }
                      label="Balance"
                      placeholder="Balance"
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>

              <Grid.Col span={4} mt={4}>
                <table className="tableBorder">
                  <tbody>
                    <tr
                      style={{
                        backgroundColor: "#043c64",
                        fontWeight: 500,
                        color: "#ffffff",
                      }}
                    >
                      <td> Total</td>
                      <td>
                        {" "}
                        ₹
                        {Math.round(
                          cart.reduce(function (sum, current) {
                            return +Number(sum) + Number(current.total);
                          }, 0) +
                            cart.reduce(function (sum, current) {
                              return +Number(sum) + Number(current.tax);
                            }, 0)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Grid.Col>
            </Grid>
            <div
              style={{
                marginTop: 32,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div></div>
              <Button
                color="zevcore"
                disabled={cart.length == 0 ? true : false}
                size="xs"
                onClick={() => AddSaleData()}
              >
                Create Proforma
              </Button>
            </div>
          </Card>
        </Grid.Col>
      </Grid>
      <Drawer
        opened={variables.addDrawer}
        onClose={() => setVariables({ ...variables, addDrawer: false })}
        title="Add Customer"
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
            style={{ height: 620 }}
            type="scroll"
            offsetScrollbars
            scrollbarSize={5}
          >
            <div className="zc-pr-3 zc-pl-3">
              {/* Customer adding form name */}
              <form
                onSubmit={formCustomer.onSubmit((values) =>
                  AddCustomer(values)
                )}
              >
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      required
                      variant="filled"
                      value={formCustomer.values.label}
                      label="Client Name"
                      placeholder="Client Name"
                      {...formCustomer.getInputProps("label")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formCustomer.values.email1}
                      label="Email Address 1"
                      placeholder="Email Address 1"
                      {...formCustomer.getInputProps("email1")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    {" "}
                    <TextInput
                      variant="filled"
                      value={formCustomer.values.email2}
                      label="Email Address 2"
                      placeholder="Email Address 2"
                      {...formCustomer.getInputProps("email2")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formCustomer.values.email3}
                      label="Email Address 3"
                      placeholder="Email Address 3"
                      {...formCustomer.getInputProps("email3")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formCustomer.values.phone_number}
                      label="Phone Number"
                      placeholder="Phone Number"
                      {...formCustomer.getInputProps("phone_number")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formCustomer.values.alternate}
                      label="Alternate Phone Number"
                      placeholder="Alternate Phone Number"
                      {...formCustomer.getInputProps("alternate")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formCustomer.values.gstin}
                      label="GSTIN"
                      placeholder="GSTIN"
                      {...formCustomer.getInputProps("gstin")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formCustomer.values.address}
                      label=" Address"
                      placeholder="Address"
                      {...formCustomer.getInputProps("address")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      variant="filled"
                      value={formCustomer.values.state}
                      label=" State"
                      placeholder=" State"
                      {...formCustomer.getInputProps("state")}
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
      <Modal
        withCloseButton={false}
        overlayOpacity={0.55}
        padding={0}
        overlayBlur={3}
        size={"60%"}
        opened={detailsModal}
        onClose={() => setDetailModal(false)}
      >
        <div>
          <div
            style={{
              display: "flex",
              padding: 0,
              margin: 0,
              justifyContent: "space-between",
              background: "#043c64",
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
            }}
          >
            <Text color="#ffffff" m={5} mt={7} ml={15}>
              Additional details
            </Text>
            <ActionIcon
              onClick={() => setDetailModal(false)}
              m={5}
              sx={{
                "&[data-disabled]": { opacity: 1 },
                "&[data-loading]": { backgroundColor: "#ffffff" },
              }}
            >
              <X size={18} />
            </ActionIcon>
          </div>
          <div
            style={{
              padding: 15,
            }}
          >
            <Grid>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.deliver_note}
                  label="Delivery Note"
                  placeholder="Delivery Note"
                  {...formDetails.getInputProps("deliver_note")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.deliver_note}
                  label="Delivery Note"
                  placeholder="Delivery Note"
                  {...formDetails.getInputProps("deliver_note")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                {" "}
                <TextInput
                  variant="filled"
                  value={formDetails.values.suppliers_ref}
                  label="Supplier's Ref"
                  placeholder="Supplier's Ref"
                  {...formDetails.getInputProps("suppliers_ref")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.other_ref}
                  label="Other Ref"
                  placeholder="Other Ref"
                  {...formDetails.getInputProps("other_ref")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                {" "}
                <TextInput
                  variant="filled"
                  value={formDetails.values.buyer_order_no}
                  label="Buyer's Order No."
                  placeholder="Buyer's Order No."
                  {...formDetails.getInputProps("buyer_order_no")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.dated}
                  label="Dated"
                  placeholder="dd/mm/yyyy"
                  {...formDetails.getInputProps("dated")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.despatch_doc_no}
                  label="Despatch Document No."
                  placeholder="Despatch Document No."
                  {...formDetails.getInputProps("despatch_doc_no")}
                />
              </Grid.Col>

              <Grid.Col span={4}>
                {" "}
                <TextInput
                  variant="filled"
                  value={formDetails.values.delivery_note_date}
                  label="Deliver Note Date"
                  placeholder="Deliver Note Date"
                  {...formDetails.getInputProps("delivery_note_date")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                {" "}
                <TextInput
                  variant="filled"
                  value={formDetails.values.despatched_through}
                  label="Despatched Through"
                  placeholder="Despatched Through"
                  {...formDetails.getInputProps("despatched_through")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                {" "}
                <TextInput
                  variant="filled"
                  value={formDetails.values.destination}
                  label="Destination"
                  placeholder="Destination"
                  {...formDetails.getInputProps("destination")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.terms_of_delivery}
                  label="Terms Of Delivery"
                  placeholder="Terms Of Delivery"
                  {...formDetails.getInputProps("terms_of_delivery")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.remark}
                  label="Remark"
                  placeholder="Remark"
                  {...formDetails.getInputProps("remark")}
                />
              </Grid.Col>
            </Grid>

            <Group position="right" mt="md" mb="lg">
              <Button
                type="submit"
                color="zevcore"
                onClick={() => setDetailModal(false)}
              >
                Submit
              </Button>
            </Group>
          </div>
        </div>
      </Modal>
      <Modal
        withCloseButton={false}
        overlayOpacity={0.55}
        padding={0}
        overlayBlur={3}
        size={"60%"}
        opened={variables.productBarcode}
        onClose={() => setVariables({ ...variables, productBarcode: false })}
      >
        <div>
          <div
            style={{
              display: "flex",
              padding: 0,
              margin: 0,
              justifyContent: "space-between",
              background: "#043c64",
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
            }}
          >
            <Text color="#ffffff" m={5} mt={7} ml={15}>
              {formBarcode.values.product}
            </Text>
            <ActionIcon
              onClick={() =>
                setVariables({ ...variables, productBarcode: false })
              }
              m={5}
              sx={{
                "&[data-disabled]": { opacity: 1 },
                "&[data-loading]": { backgroundColor: "#ffffff" },
              }}
            >
              <X size={18} />
            </ActionIcon>
          </div>
          <div
            style={{
              padding: 15,
            }}
          >
            <form
              onSubmit={formBarcode.onSubmit((values) => AddProduct(values))}
            >
              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    size="xs"
                    variant="filled"
                    required
                    value={formBarcode.values.price}
                    label="Product Price"
                    placeholder="Product Price"
                    {...formBarcode.getInputProps("price")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    size="xs"
                    required
                    variant="filled"
                    value={formBarcode.values.qty}
                    label="Product Quantity"
                    placeholder="Product Quantity"
                    {...formBarcode.getInputProps("qty")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    size="xs"
                    variant="filled"
                    fullWidth
                    label="Select Discount Type"
                    searchable
                    dropdownPosition="bottom"
                    clearable
                    placeholder="Select Discount Type"
                    data={[
                      { value: "percentage", label: "Percentage (%)" },
                      { value: "number", label: "Whole Number" },
                    ]}
                    value={formBarcode.values.discount_type}
                    {...formBarcode.getInputProps("discount_type")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  {formBarcode.values.discount_type == "percentage" ? (
                    <NumberInput
                      size="xs"
                      variant="filled"
                      label="Enter Value"
                      value={formBarcode.values.discount}
                      placeholder="Enter percentage value"
                      {...formBarcode.getInputProps("discount")}
                    ></NumberInput>
                  ) : (
                    <NumberInput
                      size="xs"
                      variant="filled"
                      label="Enter Value"
                      value={formBarcode.values.discount}
                      {...formBarcode.getInputProps("discount")}
                      placeholder="Enter whole number"
                    ></NumberInput>
                  )}
                </Grid.Col>
              </Grid>

              <Group position="right" mt="md" mb="lg">
                <Button
                  type="submit"
                  color="zevcore"
                  onClick={() => setDetailModal(false)}
                >
                  Submit
                </Button>
              </Group>
            </form>
          </div>
        </div>
      </Modal>
      <Drawer
        opened={variables.addDrawer2}
        onClose={() => setVariables({ ...variables, addDrawer2: false })}
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
            style={{ height: 620 }}
            type="scroll"
            offsetScrollbars
            scrollbarSize={5}
          >
            <div className="zc-pr-3 zc-pl-3">
              {/* Customer adding form name */}
              <form
                onSubmit={formProduct.onSubmit((values) =>
                  AddProductExtra(values)
                )}
              >
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Group"
                  searchable
                  required
                  clearable
                  placeholder="Select Group"
                  {...formProduct.getInputProps("group_id")}
                  data={variables.groupList2}
                />
                <TextInput
                  required
                  variant="filled"
                  value={formProduct.values.label}
                  label="Product Name"
                  placeholder="Product Name"
                  {...formProduct.getInputProps("label")}
                />
                <TextInput
                  variant="filled"
                  value={formProduct.values.sku_code}
                  label="Product SKU"
                  placeholder="Product SKU"
                  {...formProduct.getInputProps("sku_code")}
                />
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select HSN"
                  searchable
                  required
                  clearable
                  placeholder="Select HSN"
                  {...formProduct.getInputProps("hsn_id")}
                  data={variables.hsnList}
                />
                <NumberInput
                  variant="filled"
                  value={formProduct.values.quantity}
                  label="Quantity"
                  placeholder="Quantity"
                  {...formProduct.getInputProps("quantity")}
                />

                <NumberInput
                  variant="filled"
                  value={formProduct.values.price}
                  label="Price"
                  placeholder="Price"
                  {...formProduct.getInputProps("price")}
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
    </div>
  );
}

export default AddEstimate;
