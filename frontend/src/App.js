import React from "react";
import { Route, Routes } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications"; // For show the notification import
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import ProtectedRoute from "./components/ProtectRoute";
import ErrorBoundary from "./components/Error";
import Sidebar from "./components/Sidebar";

import Login from "./pages/auth/Login";

// Import pages
import Home from "./pages/Home";
import Client from "./pages/Client";
import Product from "./pages/Product";
import CreateInvoice from "./pages/invoice/CreateInvoice";
import Invoice from "./pages/invoice/Invoices";
import PrintInvoice from "./pages/invoice/PrintInvoice";
import SaveInvoice from "./pages/invoice/SaveInvoice";
import SaveEdit from "./pages/invoice/SaveEdit";
import CreateProforma from "./pages/invoice/CreatePerformaInvoice";
import ProformaInvoice from "./pages/invoice/ProformaInvoice";
import PrintProforma from "./pages/invoice/PrintProforma";
import DeliveryChallan from "./pages/invoice/DeliveryChallan";

import WeekReport from "./pages/report/Week";
import GSTReport from "./pages/report/GST";
import Monthly from "./pages/report/Monthly";
import Daily from "./pages/report/Daily";

import Manages from "./pages/settings/Manage";
import Tax from "./pages/settings/Tax";
import Profile from "./pages/settings/Profile";
import Account from "./pages/settings/Account";
import Groups from "./pages/Group";
import ChallanPrint from "./pages/invoice/ChallanPrint";
import EditInvoice from "./pages/invoice/EditInvoice";

function App() {
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });
  const [color] = useLocalStorage({
    key: "color",
    defaultValue: "#043c64",
  });

  const LightenDarkenColor = (col, amt) => {
    var usePound = false;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    var b = ((num >> 8) & 0x00ff) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    var g = (num & 0x0000ff) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  };
  return (
    // Colorscheme provider is used for toggling between light and dark modes
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      {/* Mantine provider is used for customizing our own theme */}
      <MantineProvider
        theme={{
          "::-webkit-scrollbar": {
            backgroundColor: LightenDarkenColor(color, 120),
            width: "5px",
            height: "10px",
            borderRadius: 5,
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: LightenDarkenColor(color, 120),
            borderRadius: 5,
            // "#D50000"
          },
          fontFamily: "Inter",
          fontWeight: 300,
          colorScheme,
          colors: {
            zevcore: [
              LightenDarkenColor(color, 140),
              LightenDarkenColor(color, 130),
              LightenDarkenColor(color, 120),
              LightenDarkenColor(color, 110),
              LightenDarkenColor(color, 100),
              LightenDarkenColor(color, 90),
              LightenDarkenColor(color, 50),
              LightenDarkenColor(color, 80),
              LightenDarkenColor(color, 50),
              LightenDarkenColor(color, 20),
            ],
          },
        }}
      >
        <NotificationsProvider autoClose={3000}>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<Sidebar />}>
                <Route
                  exact
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/client"
                  element={
                    <ProtectedRoute>
                      <Client />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/group"
                  element={
                    <ProtectedRoute>
                      <Groups />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <Product />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/create_invoice"
                  element={
                    <ProtectedRoute>
                      <CreateInvoice />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/invoice"
                  element={
                    <ProtectedRoute>
                      <Invoice />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/save_invoice"
                  element={
                    <ProtectedRoute>
                      <SaveInvoice />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/invoice_edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditInvoice />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/edit_invoice/:id"
                  element={
                    <ProtectedRoute>
                      <SaveEdit />
                    </ProtectedRoute>
                  }
                />

                <Route
                  exact
                  path="/create_proforma"
                  element={
                    <ProtectedRoute>
                      <CreateProforma />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/proforma"
                  element={
                    <ProtectedRoute>
                      <ProformaInvoice />
                    </ProtectedRoute>
                  }
                />

                <Route
                  exact
                  path="/week_report"
                  element={
                    <ProtectedRoute>
                      <WeekReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/gst_report"
                  element={
                    <ProtectedRoute>
                      <GSTReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/month_report"
                  element={
                    <ProtectedRoute>
                      <Monthly />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/daily_report"
                  element={
                    <ProtectedRoute>
                      <Daily />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/manages"
                  element={
                    <ProtectedRoute>
                      <Manages />
                    </ProtectedRoute>
                  }
                />

                <Route
                  exact
                  path="/tax"
                  element={
                    <ProtectedRoute>
                      <Tax />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/delivery_challan"
                  element={
                    <ProtectedRoute>
                      <DeliveryChallan />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                exact
                path="/invoice_print/:id"
                element={
                  <ProtectedRoute>
                    <PrintInvoice />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/invoice_proforma/:id"
                element={
                  <ProtectedRoute>
                    <PrintProforma />
                  </ProtectedRoute>
                }
              />

              <Route
                exact
                path="/challan_print/:id"
                element={
                  <ProtectedRoute>
                    <ChallanPrint />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ErrorBoundary>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
