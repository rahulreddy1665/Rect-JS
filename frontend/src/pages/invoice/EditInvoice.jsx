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
  handleAddProduct,
  handleAddUpdateInvoice,
  handleGetClient,
  handleGetCreateInvoice,
  handleGetCreateInvoiceOne,
  handleGetGroup,
  handleGetHSNTax,
  handleGetProduct,
} from "../../helpers/apis";
import { dataSlice, selectFilter } from "../../helpers/common";
import { useForm } from "@mantine/form"; // Mantine form import
import { DatePicker } from "@mantine/dates";
import {
  Plus,
  Trash,
  X,
  Dots,
  Eye,
  Search,
  ChevronsDownLeft,
} from "tabler-icons-react";
import useStyles from "../../components/Style";
import notificationHelper from "../../helpers/notification";

import { RichTextEditor } from "@mantine/rte";
import { useNavigate, useParams } from "react-router-dom";
import { useModals } from "@mantine/modals";
import { dataSearch, Th } from "../../helpers/tableFunction";

function EditInvoice() {
  const { classes } = useStyles();
  const [cart, setCart] = useState([]);
  const [saleTypeValue, setSaleTypeValue] = useState("Cash");
  const [saleTypeBank, setSaleTypeBank] = useState(null);
  const [detailsModal, setDetailModal] = useState(false);
  const [tableRefresh, setTableRefresh] = useState(new Date());
  const [validateBarcode, setValidateBarcode] = useState(0);
  const [customer, setCustomer] = useState(null);

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
    productEdit: false,
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
      value: "",
      invoice_date: "",
      invoice_num: "",
      reference: "",
      patient_name: "",
      ip_num: "",
      dl_num: "",
      dc_num: "",
      po_number: "",
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
      discount_per: 0,
      barcode: "",
      price: 0,
      mrp: 0,
      discount_type: "number",
    },
  });

  const formCustomer = useForm({
    initialValues: {
      credit_limit: 0,
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
      label: (value) => (value.length < 1 ? "Customer name is required" : null),
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
      lot_number: "",
    },
  });

  const formProductEdit = useForm({
    initialValues: {
      label: "",
      lot_number: "",
      sku_code: "",
      hsn_code: "",
      quantity: 0,
      price: 0,
      group_id: "",
      hsn_id: "",
      product_name: "",
      product_type: "Implant",
      product_id: "",
      product: "",
      qty: 1,
      discount: 0,
      discount_per: 0,
      barcode: "",
      mrp: 0,
      discount_type: "number",
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
      setCustomer(listGroup[0].value);

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
          submitLoading: false,
          productList: listSubgroup,
          productData: listGroup,
          skeletonLoading: false,
        };
      });

      var product = response.data.data;
      var data44 = product[0];
      formBarcode.setFieldValue("price", Number(data44.price));
      formBarcode.setFieldValue("mrp", Number(data44.mrp));
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
      label: "",
      doctor_name: "",
    },
  });
  const params = useParams();

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const response4 = await handleGetCreateInvoiceOne({
        id: params.id,
      });

      if (response4.status === 200) {
        var list = response4.data;
        var list2 = response4.data.tax_invoice_transactions;
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
            value: list2[i].value,
            type: list2[i].type,
            tax: Number((tax / 100) * Number(list2[i].total_amount)).toFixed(2),
            price: list2[i].price,
            qty: list2[i].quantity,
            lot_number: list2[i].lot_number,
            discount: Number(list2[i].discount),
            mrp: list2[i].mrp_display == "-" ? 0 : Number(list2[i].mrp_display),
            total: list2[i].total_amount,
          };
          save_cart.push(det);
        }

        setCustomer(list.client_id);
        form.setFieldValue("invoice_num", list.invoice_num);
        form.setFieldValue("value", list.value);
        form.setFieldValue("reference", list.reference);
        form.setFieldValue("ip_num", list.ip_num);
        form.setFieldValue("patient_name", list.patient_name);
        form.setFieldValue("dl_num", list.dl_num);
        form.setFieldValue("dc_num", list.dc_num);
        form.setFieldValue("po_number", list.po_number);
        form.setFieldValue("invoice_date", new Date(list.invoice_date));
        setVariables((variables) => {
          return {
            ...variables,
            invoiceDate: new Date(list.invoice_date),
          };
        });
        setCart(save_cart);
        setVariables({ ...variables, saveModal: false });
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
                      lot_number: list2[i].lot_number,
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
                  form.setFieldValue("po_number", list.po_number);
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
    console.log(e);
    var check = cart.findIndex((img) => img.product.label == e);
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
    var product2 = variables.productData.find((img) => img.label === e.product);
    var tax = Number(product2.hsn_tax.tax);
    var product = {
      label: product2.label,
      hsn_code: product2.hsn_tax.label,
      sku_code: product2.sku,
      price: product2.price,
      lot_number: product2.lot_number,
    };

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
        mrp: e.mrp,
        value: "",
        price: e.price,
        type: e.product_type,
        tax_per: tax,
        tax: Number((tax / 100) * Number(total)).toFixed(2),
        qty: Number(e.qty) + Number(dataList[check].qty),
        lot_number: e.lot_number,
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
        value: "",
        tax_per: tax,
        type: e.product_type,
        tax: Number((tax / 100) * Number(total)).toFixed(2),
        mrp: e.mrp,
        price: e.price,
        qty: e.qty,
        lot_number: e.lot_number,
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

  const AddProduct2 = (e) => {
    var check = cart.find((img) => img.product.label === e.product);
    var product2 = variables.productData.find((img) => img.label === e.product);
    var tax = Number(product2.hsn_tax.tax);
    var product = {
      label: product2.label,
      hsn_code: product2.hsn_tax.label,
      sku_code: product2.sku,
      price: product2.price,
      lot_number: product2.lot_number,
    };

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
        (Number(e.price) - Number(discount)) * Number(e.qty)
      ).toFixed(2);

      var list = {
        product: product,
        mrp: e.mrp,
        value: "",
        price: e.price,
        type: e.product_type,
        tax_per: tax,
        tax: Number((tax / 100) * Number(total)).toFixed(2),
        qty: Number(e.qty),
        lot_number: e.lot_number,
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
        value: "",
        tax_per: tax,
        type: e.product_type,
        tax: Number((tax / 100) * Number(total)).toFixed(2),
        mrp: e.mrp,
        price: e.price,
        qty: e.qty,
        lot_number: e.lot_number,
        discount: discount,
        total: total,
      };

      var data = cart;
      data.push(list);
      setCart(data);
    }
    formProductEdit.reset();
    setVariables({ ...variables, productEdit: false });
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
      form.setFieldValue("mrp", Number(finding.product.price));
    } else {
      input0.current.focus();
      setValidateBarcode(2);
    }
    setTimeout(() => {
      setValidateBarcode(0);
    }, 3000);
  };
  const selRef = useRef();
  // Add the new invoice with data
  const AddSaleData = async () => {
    setVariables({ ...variables, submitLoading: true });
    // Once the invoice add check for date validation for
    var first = new Date(lastInvoice).setHours(0, 0, 0, 0);
    var second = new Date(variables.invoiceDate).setHours(0, 0, 0, 0);
    var third = new Date().setHours(0, 0, 0, 0);

    var check = 0;
    if (lastInvoice != "") {
      if (first <= second && second <= third) {
        check = 0;
      } else {
        check = 1;
      }
    }

    if (check == 0) {
      var customerId = null;
      var customerGST = null;
      var customerIID = null;
      if (customer !== null && customer !== "") {
        var data = variables.customer.find((img) => img.value === customer);
        customerId = data.label;
        customerGST = data.gstin;
        customerIID = customer;
      }
      // Adding the invoice data list
      const reg = {
        discount_amount: cart
          .reduce(function (sum, current) {
            return (
              +Number(sum) + Number(current.discount) * Number(current.qty)
            );
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
        customer_id: customerIID,
        customerGST: customerGST,
        reference: form.values.reference,
        invoice_num: form.values.invoice_num,
        value: form.values.value,
        po_number: form.values.po_number,
        patient_name: form.values.patient_name,
        ip_num: form.values.ip_num,
        dl_num: form.values.dl_num,
        dc_num: form.values.dc_num,
        date: form.values.invoice_date,
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

        challan: formDetails.values.label,
        doctor_name: formDetails.values.doctor_name,
      };
      // handle the invoice add to database
      const response = await handleAddUpdateInvoice(reg);

      if (response.status === 200) {
        navigate("/invoice_print/" + response.data[0].value);

        notificationHelper({
          color: "green",
          title: "Success",
          message: "Invoice updated successfully",
        });
      } else {
        setVariables({ ...variables, submitLoading: false });
        notificationHelper({
          color: "red",
          title: "Failed! Please enter correct details",
          message: response.data.message,
        });
      }
    } else {
      setVariables({ ...variables, submitLoading: false });
      alert("Please select date correctly");
    }
  };
  // For adding invoice to save for later table
  const AddSaveData = async () => {
    var customerId = null;
    var customerGST = null;
    var customerIID = null;
    if (customer !== null && customer !== "") {
      var data = variables.customer.find((img) => img.value === customer);
      customerId = data.label;
      customerGST = data.gstin;
      customerIID = customer;
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
      customer_id: customerIID,
      customerGST: customerGST,
      reference: form.values.reference,
      po_number: form.values.po_number,
      patient_name: form.values.patient_name,
      ip_num: form.values.ip_num,
      dl_num: form.values.dl_num,
      dc_num: form.values.dc_num,
      date: form.values.invoice_date,
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
    };

    const response = await handelAddSaveInvoice(reg);
    if (response.status === 200) {
      window.location.reload();
      navigate(
        "/print_invoice/" + response.data.data[0].dataValues.invoice_number
      );

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
      {/* For adding customer and product from this left side */}
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
              <Text
                color="#ffffff"
                weight={500}
                style={{ paddingTop: -15, paddingLeft: 7 }}
              >
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
                    value={form.values.invoice_date}
                    {...form.getInputProps("invoice_date")}
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
                <Grid.Col span={6}>
                  <TextInput
                    size="xs"
                    variant="filled"
                    value={form.values.po_number}
                    label="PO Number"
                    placeholder="PO Number"
                    {...form.getInputProps("po_number")}
                  />
                </Grid.Col>
              </Grid>
              <Divider
                pt={2}
                mb={0}
                label="Product Select"
                labelPosition="center"
              />
              {/* Adding product for cart */}
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
                      data={variables.groupList}
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
                          {/* Button for adding new product */}
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
                            formBarcode.setFieldValue("mrp", Number(pp.price));
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
                            formBarcode.setFieldValue("mrp", Number(pp.price));
                            formBarcode.setFieldValue("product", pp.label);
                            formBarcode.setFieldValue("product_id", e);
                          }}
                        />
                      </>
                    )}
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      ref={input5}
                      size="xs"
                      variant="filled"
                      value={formBarcode.values.lot_number}
                      label="Product Lot Number"
                      placeholder="Product Lot Number"
                      {...formBarcode.getInputProps("lot_number")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input5}
                      required
                      size="xs"
                      variant="filled"
                      value={formBarcode.values.mrp}
                      label="Product MRP"
                      placeholder="Product MRP"
                      {...formBarcode.getInputProps("mrp")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input5}
                      required
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
                      required
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
                      ref={input7}
                      required
                      size="xs"
                      variant="filled"
                      label="Enter Discount Percentage"
                      value={formBarcode.values.discount_per}
                      onChange={(e) => {
                        var discount = e;
                        formBarcode.setFieldValue(
                          "discount",
                          (discount / 100) * formBarcode.values.price
                        );
                        formBarcode.setFieldValue("discount_per", discount);
                      }}
                      placeholder="Enter Discount Percentage"
                    ></NumberInput>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input7}
                      required
                      size="xs"
                      variant="filled"
                      label="Enter Discount Value"
                      value={formBarcode.values.discount}
                      {...formBarcode.getInputProps("discount")}
                      placeholder="Enter Whole Number"
                    ></NumberInput>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input4}
                      required
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
                </Grid>
                <div style={{ display: "flex", marginTop: 15 }}>
                  <Button
                    size="xs"
                    fullWidth
                    type="submit"
                    onClick={() => setDetailModal(true)}
                    color="zevcore"
                  >
                    Challan Detail
                  </Button>
                  <Button
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
        {/* For show the product list and delete product and add invoice here */}
        <Grid.Col xs={8}>
          <Card className="border" pt={2}>
            <div style={{ paddingBottom: 10 }}>
              <div className="invoiceItemHeight">
                {/* Display all the products list here */}
                <table className="tableBorder ">
                  <thead>
                    <tr>
                      <th>Sl.No</th>
                      <th>Description / Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Total</th>
                      <th>Lot Number</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody key={tableRefresh}>
                    {cart.length > 0 ? (
                      <>
                        {cart.map((row, index) => (
                          <tr className="products">
                            <td>{index + 1}</td>
                            <td
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                setVariables({
                                  ...variables,
                                  productEdit: true,
                                });
                                console.log(
                                  formProductEdit.values.discount_per
                                );
                                var product_id = variables.productList.find(
                                  (img) => img.label == row.product.label
                                );
                                console.log(product_id, row);
                                formProductEdit.setFieldValue(
                                  "label",
                                  row.product.label
                                );
                                formProductEdit.setFieldValue(
                                  "product",
                                  row.product.label
                                );
                                formProductEdit.setFieldValue(
                                  "product_id",
                                  product_id.value.toString()
                                );
                                formProductEdit.setFieldValue(
                                  "product_type",
                                  product_id.group.toString()
                                );
                                formProductEdit.setFieldValue(
                                  "lot_number",
                                  row.lot_number
                                );
                                formProductEdit.setFieldValue(
                                  "hsn_code",
                                  row.hsn
                                );
                                formProductEdit.setFieldValue(
                                  "qty",
                                  Number(row.qty)
                                );
                                formProductEdit.setFieldValue(
                                  "price",
                                  Number(row.price)
                                );
                                formProductEdit.setFieldValue(
                                  "group_id",
                                  row.group_id
                                );
                                formProductEdit.setFieldValue(
                                  "hsn_id",
                                  row.hsn_id
                                );
                                formProductEdit.setFieldValue(
                                  "mrp",
                                  Number(row.mrp)
                                );
                                formProductEdit.setFieldValue(
                                  "discount",
                                  Number(row.discount)
                                );
                                formProductEdit.setFieldValue(
                                  "discount_per",
                                  (Number(row.discount) / Number(row.price)) *
                                    100
                                );
                              }}
                            >
                              {row.product.label}
                            </td>
                            <td>{row.qty}</td>
                            <td>{row.price}</td>

                            <td>{row.discount * row.qty}</td>
                            <td>{row.total}</td>
                            <td>{row.lot_number}</td>
                            <td
                              onClick={() => DeleteProduct(row.product.label)}
                            >
                              <Button
                                color="red"
                                size="xs"
                                style={{ fontSize: 8, padding: 2, height: 15 }}
                              >
                                Delete
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
                <div
                  style={{
                    marginTop: 32,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* <Button
                      disabled={cart.length == 0 ? true : false}
                      color="zevcore"
                      size="xs"
                      onClick={() => AddSaveData()}
                    >
                      Save Invoice
                    </Button>
                    <Button
                      ml={5}
                      color="zevcore"
                      size="xs"
                      onClick={() =>
                        setVariables({ ...variables, saveModal: true })
                      }
                    >
                      View Saved
                    </Button> */}
                  </div>

                  <Button
                    color="zevcore"
                    disabled={cart.length == 0 ? true : false}
                    size="xs"
                    loading={variables.submitLoading}
                    onClick={() => AddSaleData()}
                  >
                    Update Invoice
                  </Button>
                </div>
              </Grid.Col>

              <Grid.Col span={4} mt={4}>
                <table className="tableBorder">
                  <tbody>
                    <tr>
                      <td>Sub-Total</td>
                      <td>
                        ₹
                        {cart.reduce(function (sum, current) {
                          return +Number(sum) + Number(current.total);
                        }, 0)}
                      </td>
                    </tr>
                    <tr>
                      <td>Discount</td>
                      <td>
                        ₹
                        {cart.reduce(function (sum, current) {
                          return (
                            +Number(sum) +
                            Number(current.discount) * Number(current.qty)
                          );
                        }, 0)}
                      </td>
                    </tr>
                    <tr>
                      <td>CGST</td>
                      <td>
                        ₹
                        {cart
                          .reduce(function (sum, current) {
                            return +Number(sum) + Number(current.tax);
                          }, 0)
                          .toFixed(2) / 2}
                      </td>
                    </tr>
                    <tr>
                      <td>SGST</td>
                      <td>
                        ₹
                        {cart
                          .reduce(function (sum, current) {
                            return +Number(sum) + Number(current.tax);
                          }, 0)
                          .toFixed(2) / 2}
                      </td>
                    </tr>
                    <tr
                      style={{
                        backgroundColor: "#043c64",
                        fontWeight: 500,
                        color: "#ffffff",
                      }}
                    >
                      <td>Grand Total</td>
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
              Challan details
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
              <Grid.Col span={6}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.label}
                  label="Delivery Challan"
                  placeholder="Delivery Challan"
                  {...formDetails.getInputProps("label")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.doctor_name}
                  label="Doctor Name"
                  placeholder="Doctor Name"
                  {...formDetails.getInputProps("doctor_name")}
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
      <Modal
        withCloseButton={false}
        overlayOpacity={0.55}
        padding={0}
        overlayBlur={3}
        size={"80%"}
        opened={variables.saveModal}
        onClose={() => setVariables({ ...variables, saveModal: false })}
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
              Saved Invoices
            </Text>
            <ActionIcon
              onClick={() => setVariables({ ...variables, saveModal: false })}
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
                    <Th>Total</Th>
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
          </div>
        </div>
      </Modal>

      <Modal
        withCloseButton={false}
        overlayOpacity={0.55}
        padding={0}
        overlayBlur={3}
        size={"80%"}
        opened={variables.productEdit}
        onClose={() => setVariables({ ...variables, productEdit: false })}
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
              Product Edit
            </Text>
            <ActionIcon
              onClick={() => setVariables({ ...variables, productEdit: false })}
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
            <div>
              <form
                ref={formRef}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                onSubmit={formProductEdit.onSubmit((values) =>
                  AddProduct2(values)
                )}
              >
                <Grid grow gutter="xs">
                  <Grid.Col span={6}>
                    <Select
                      size="xs"
                      variant="filled"
                      label="Product Type"
                      placeholder="Product one"
                      data={variables.groupList}
                      value={formProductEdit.values.product_type}
                      {...formProductEdit.getInputProps("product_type")}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    {formProductEdit.values.product_type == "Implant" ? (
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
                          {/* Button for adding new product */}
                        </div>

                        <Select
                          ref={input3}
                          size="xs"
                          variant="filled"
                          fullWidth
                          placeholder="Select Product"
                          data={variables.productList.filter(
                            (raw) =>
                              raw.group == formProductEdit.values.product_type
                          )}
                          searchable
                          maxDropdownHeight={400}
                          nothingFound="Nobody here"
                          value={formProductEdit.values.product_id}
                          onChange={(e) => {
                            var pp = variables.productList.find(
                              (img) => Number(img.value) === Number(e)
                            );

                            formProductEdit.setFieldValue(
                              "price",
                              Number(pp.price)
                            );
                            formProductEdit.setFieldValue(
                              "mrp",
                              Number(pp.price)
                            );
                            formProductEdit.setFieldValue("product", pp.label);
                            formProductEdit.setFieldValue("product_id", e);
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
                          {/* <Button
                            color="zevcore"
                            onClick={() =>
                              setVariables({ ...variables, addDrawer2: true })
                            }
                            style={{ fontSize: 10, padding: 2, height: 15 }}
                          >
                            Add <Plus size={10} />
                          </Button> */}
                        </div>
                        <Select
                          ref={input3}
                          size="xs"
                          variant="filled"
                          fullWidth
                          placeholder="Select Product"
                          data={variables.productList.filter(
                            (raw) =>
                              raw.group == formProductEdit.values.product_type
                          )}
                          searchable
                          maxDropdownHeight={400}
                          nothingFound="Nobody here"
                          value={formProductEdit.values.product_id}
                          onChange={(e) => {
                            var pp = variables.productList.find(
                              (img) => Number(img.value) === Number(e)
                            );

                            formProductEdit.setFieldValue(
                              "price",
                              Number(pp.price)
                            );
                            formProductEdit.setFieldValue(
                              "mrp",
                              Number(pp.price)
                            );
                            formProductEdit.setFieldValue("product", pp.label);
                            formProductEdit.setFieldValue("product_id", e);
                          }}
                        />
                      </>
                    )}
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      ref={input5}
                      size="xs"
                      variant="filled"
                      value={formProductEdit.values.lot_number}
                      label="Product Lot Number"
                      placeholder="Product Lot Number"
                      {...formProductEdit.getInputProps("lot_number")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input5}
                      required
                      size="xs"
                      variant="filled"
                      value={formProductEdit.values.mrp}
                      label="Product MRP"
                      placeholder="Product MRP"
                      {...formProductEdit.getInputProps("mrp")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input5}
                      required
                      size="xs"
                      variant="filled"
                      value={formProductEdit.values.qty}
                      label="Product Quantity"
                      placeholder="Product Quantity"
                      {...formProductEdit.getInputProps("qty")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input4}
                      required
                      size="xs"
                      variant="filled"
                      value={formProductEdit.values.price}
                      label="Product Price"
                      placeholder="Product Price"
                      {...formProductEdit.getInputProps("price")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input7}
                      required
                      size="xs"
                      variant="filled"
                      label="Enter Discount Percentage"
                      value={formProductEdit.values.discount_per}
                      onChange={(e) => {
                        var discount = e;
                        formProductEdit.setFieldValue(
                          "discount",
                          (discount / 100) * formProductEdit.values.price
                        );
                        formProductEdit.setFieldValue("discount_per", discount);
                      }}
                      placeholder="Enter Discount Percentage"
                    ></NumberInput>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input7}
                      required
                      size="xs"
                      variant="filled"
                      label="Enter Discount Value"
                      value={formProductEdit.values.discount}
                      {...formProductEdit.getInputProps("discount")}
                      placeholder="Enter Whole Number"
                    ></NumberInput>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input4}
                      size="xs"
                      variant="filled"
                      value={
                        (formProductEdit.values.price -
                          formProductEdit.values.discount) *
                        formProductEdit.values.qty
                      }
                      label="Total Price"
                      placeholder="Total Price"
                    />
                  </Grid.Col>
                </Grid>
                <div style={{ display: "flex", marginTop: 15 }}>
                  <Button
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
          </div>
        </div>
      </Modal>
      {/*  */}
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
                <TextInput
                  variant="filled"
                  value={formProduct.values.lot_number}
                  label="Product Lot Number"
                  placeholder="Product Lot Number"
                  {...formProduct.getInputProps("lot_number")}
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

export default EditInvoice;
