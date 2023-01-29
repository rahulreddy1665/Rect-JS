import axios from "axios";

const URL = "https://dnsh.zevcore.cc/api/";
// var token = localStorage.getItem("token");
// var config = {
//   headers: {
//     "x-access-token": token,
//   },
// };

const fetchCredentials = async () => {
  try {
    // Retrieve the credentials
    const credentials = await localStorage.getItem("token");
    if (credentials) {
      return {
        headers: {
          "x-access-token": credentials,
        },
      };
    } else {
      console.log("No credentials stored");
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
  return false;
};

export const handleDashboard = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "dashboard", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleGetInvoice = async (request) => {
  try {
    const response = await axios.post(URL + "auth/signin", request);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleGetTenInvoice = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "tax_invoice10", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For login user
export const handelLogin = async (request) => {
  try {
    const response = await axios.post(URL + "auth/signin", request);

    return response;
  } catch (error) {
    return error.response;
  }
};

// For Client routes
export const handleGetClient = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "client", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleAddClient = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(URL + "client", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleEditClient = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.patch(URL + "client", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteClient = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.delete(URL + "client/" + request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleBulkClient = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(URL + "client_bulk", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleGetProduct = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "product", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleAddProduct = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(URL + "product", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleEditProduct = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.patch(URL + "product", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteProduct = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.delete(URL + "product/" + request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleBulkProduct = async (request) => {
  try {
    const response = await axios.get(URL + "product", request);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleGetDeliveryChallan = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "delivery_challan", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleGetOneDeliveryChallan = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(
      URL + "delivery_challan/" + request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleAddDeliveryChallan = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(
      URL + "delivery_challan",
      request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleEditDeliveryChallan = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.patch(
      URL + "delivery_challan",
      request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteDeliveryChallan = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.delete(
      URL + "delivery_challan/" + request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleBulkDeliveryChallan = async (request) => {
  try {
    const response = await axios.get(URL + "delivery_challan", request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For Group routes
export const handleGetGroup = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "group", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For add group data
export const handleAddGroup = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(URL + "group", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For edit group data with id
export const handleEditGroup = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.patch(URL + "group", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteGroup = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.delete(URL + "group/" + request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleBulkGroup = async (request) => {
  try {
    const response = await axios.get(URL + "group", request);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleUserCount = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "group", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For invoice create
export const handleAddCreateInvoice = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(URL + "tax_invoice", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For invoice update
export const handleAddUpdateInvoice = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.patch(URL + "tax_invoice", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleBulkCreateInvoice = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "group", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteCreateInvoice = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "group", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleEditCreateInvoice = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "group", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleGetCreateInvoice = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "tax_invoice", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleGetCreateInvoiceOne = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "tax_invoice/" + request.id, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handelGetPayments = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(
      URL + "tax_invoice_payment/" + request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleAddPayment = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(
      URL + "tax_invoice_payment",
      request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// Save Invoice
export const handelAddSaveInvoice = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(URL + "save_taxInvoice", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handelGetSaveInvoice = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "save_taxInvoice", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handelGetOneSaveInvoice = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(
      URL + "save_taxInvoice/" + request.id,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handelDeleteSaveInvoice = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.delete(
      URL + "save_taxInvoice/" + request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// Proforma invoices
export const handleGetCreateProforma = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "proforma_invoice", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleGetOneCreateProforma = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(
      URL + "proforma_invoice/" + request.id,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleAddCreateProforma = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(
      URL + "proforma_invoice",
      request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteCreateProforma = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.delete(
      URL + "proforma_invoice/" + request,

      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// Two date report
export const handleGetTwoDate = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(URL + "reportDate", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For get one user
export const handleOneUser = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "user_one", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleUpdate = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.patch(URL + "user", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleAddHSNTax = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(URL + "hsn_tax", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleEditHSNTax = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.patch(URL + "hsn_tax", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleGetHSNTax = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "hsn_tax", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteHSNTax = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.delete(URL + "hsn_tax/" + request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleBulkHSNTax = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "hsn_tax", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleGetAccount = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "accounting", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleAddAccount = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(URL + "accounting", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};
