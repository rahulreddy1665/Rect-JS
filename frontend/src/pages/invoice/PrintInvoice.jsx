/* 
Project name: Zevgold APOS
Author: Zevcore Private Limited
Description: Zevcore Private Limited Zevgold APOS style css file
Created Date: 31/03/2022
Version: 1.0
Required: React and mantine
*/

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // for import react dom navigation components
import { Avatar, Button, Text } from "@mantine/core"; //for import mantine required functions and theme
import "./invoice.css";
import { handleGetCreateInvoiceOne, handleGetClient } from "../../helpers/apis";
import { useLocalStorage } from "@mantine/hooks";

function PrintInvoice() {
  const [token, setToken] = useState(localStorage.getItem("token")); //get saved local storage data
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [URL, setURL] = useState(process.env.REACT_APP_BACKEND_URL);
  const [URLFILE, setURLFILE] = useState(process.env.REACT_APP_FILE);
  const [PROFILE, setPROFILE] = useState(process.env.REACT_APP_PROFILE_URL);
  const [customer, setCustomer] = useState("");
  const [bank, setBank] = useState("");
  const [address, setAddress] = useState("");
  let navigate = useNavigate();

  const [type, setType] = useLocalStorage({
    key: "printer-type",
    defaultValue: "1",
  });
  const [data, setData] = useState("");
  const [company, setCompany] = useState("");
  const params = useParams();
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        const reg = {
          id: params.id,
        };
        //   For get all the group data list
        const response = await handleGetCreateInvoiceOne(reg);

        // On Respose setting the data to variable
        if (response.status === 200) {
          setData(response.data);
        }

        const response6 = await handleGetClient();

        // On Respose setting the data to variable
        // if (response6.status === 200) {
        //   if (
        //     response.data.data.customer_id != null &&
        //     response.data.data.customer_id != "" &&
        //     typeof response.data.data.customer_id != "undefined"
        //   ) {
        //     var datas = response6.data.data,
        //       datas = datas.find(
        //         (img) => img.label === response.data.data.customer_id
        //       );
        //     setCustomer(datas);
        //   }
        // }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Js functions for convert the number to words to invioice
  const price_in_words = (price) => {
    var sglDigit = [
        "Zero",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
      ],
      dblDigit = [
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ],
      tensPlace = [
        "",
        "Ten",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ],
      handle_tens = function (dgt, prevDgt) {
        return 0 == dgt
          ? ""
          : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt]);
      },
      handle_utlc = function (dgt, nxtDgt, denom) {
        return (
          (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") +
          (0 != nxtDgt || dgt > 0 ? " " + denom : "")
        );
      };

    var str = "",
      digitIdx = 0,
      digit = 0,
      nxtDigit = 0,
      words = [];
    if (((price += ""), isNaN(parseInt(price)))) str = "";
    else if (parseInt(price) > 0 && price.length <= 10) {
      for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--)
        switch (
          ((digit = price[digitIdx] - 0),
          (nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0),
          price.length - digitIdx - 1)
        ) {
          case 0:
            words.push(handle_utlc(digit, nxtDigit, ""));
            break;
          case 1:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 2:
            words.push(
              0 != digit
                ? " " +
                    sglDigit[digit] +
                    " Hundred" +
                    (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2]
                      ? " and"
                      : "")
                : ""
            );
            break;
          case 3:
            words.push(handle_utlc(digit, nxtDigit, "Thousand"));
            break;
          case 4:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 5:
            words.push(handle_utlc(digit, nxtDigit, "Lakh"));
            break;
          case 6:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 7:
            words.push(handle_utlc(digit, nxtDigit, "Crore"));
            break;
          case 8:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 9:
            words.push(
              0 != digit
                ? " " +
                    sglDigit[digit] +
                    " Hundred" +
                    (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2]
                      ? " and"
                      : " Crore")
                : ""
            );
        }
      str = words.reverse().join("");
    } else if (parseInt(price) == 0) {
      str = "Zero";
    } else str = "";
    return str;
  };
  const price_in_words2 = (price) => {
    var split = price.toString().split(".");
    var nonDecimal = split[0];
    var decimal = split[1];

    return (
      `INR` +
      price_in_words(Number(nonDecimal)) +
      ` & 
` +
      price_in_words(Number(decimal)) +
      ` paise`
    );
  };
  return (
    // Start printing the page
    <div style={{}}>
      <div
        style={{
          textAlign: "right",
          padding: 10,
        }}
        className="noprint"
      >
        {/* for get the back screen */}
        <Button
          type="submit"
          color="zevcore"
          variant="outline"
          mt={15}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      <>
        {data != "" ? (
          <>
            {params.id >= 12456 ? (
              <div className="invoiceContainer">
                <table className="invoiceTable">
                  <tbody>
                    <tr>
                      <td className="tableText tableHeader" colspan="12">
                        <Text weight={600} size="md">
                          TAX Invoice
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    {/* Company details */}
                    <tr>
                      <td colspan="5" rowspan="3">
                        <Text
                          color="#b90707"
                          weight={700}
                          style={{ fontSize: 22 }}
                          component="span"
                        >
                          Dhanashree Surgicals
                        </Text>
                        <br />
                        <Text weight={500} size="lg">
                          #185 B1, 1st Stage Bisilumaramma Temple Road,
                        </Text>
                        <Text weight={500} size="lg">
                          {" "}
                          Gangothri Layout, Mysore-570009{" "}
                        </Text>

                        <Text weight={500} size="lg">
                          Phone: 9448386150, 9972450797, 9886655586
                        </Text>
                      </td>
                    </tr>
                    <tr>
                      {/* Invoice details */}
                      <td colspan="7">
                        {" "}
                        <Text weight={600} size="lg">
                          Invoice No: {data.invoice_num} &nbsp;
                        </Text>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="7">
                        <Text>
                          {" "}
                          <Text weight={600} size="lg" component="span">
                            {" "}
                            Date:
                          </Text>{" "}
                          {new Date(data.invoice_date).toLocaleDateString(
                            "en-UK"
                          )}
                        </Text>
                      </td>
                    </tr>
                    {/* Customer details name and gst */}
                    <tr>
                      <td colspan="5" rowspan="4">
                        <Text size="lg" weight={600}>
                          To,{data.client_name}&nbsp;
                        </Text>
                        <Text>
                          {" "}
                          <Text weight={600} component="span">
                            {" "}
                            Ref:
                          </Text>{" "}
                          {data.reference}
                        </Text>
                        <Text>
                          {" "}
                          <Text weight={600} component="span">
                            {" "}
                            GST:
                          </Text>{" "}
                          {data.client_gst}
                        </Text>

                        <Text>
                          {" "}
                          <Text weight={600} component="span">
                            {" "}
                            DL No:
                          </Text>{" "}
                          {data.dl_num}
                        </Text>
                      </td>
                    </tr>

                    <tr>
                      <td colspan="7">
                        {" "}
                        <Text>
                          {" "}
                          <Text weight={600} component="span">
                            {" "}
                            DC No:
                          </Text>{" "}
                          {data.dc_num}
                        </Text>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="7">
                        <Text>
                          {" "}
                          <Text weight={600} component="span">
                            {" "}
                            DL No
                          </Text>{" "}
                          : KA/MYSU/1/20B-709 <br />{" "}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                          KA/MYSU/1/21B-666
                        </Text>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="7">
                        <Text>
                          {" "}
                          <Text weight={600} component="span">
                            {" "}
                            GST:
                          </Text>{" "}
                          29BBEPS6455H1Z5
                        </Text>
                      </td>
                    </tr>
                    {/* Patient Details */}
                    <tr>
                      <td colspan="5" rowspan="2">
                        <Text weight={600}>Patient: {data.patient_name}</Text>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="7">
                        {" "}
                        <Text weight={600}>IP No : {data.ip_num}</Text>
                        <Text weight={600}>PO Number : {data.po_number}</Text>
                      </td>
                    </tr>
                  </tbody>
                  {/* List of invoice products with hsn and lot_number */}
                  <tbody>
                    <tr>
                      <td className="tableHeader">Sl.No.</td>
                      <td className="tableHeader2" colspan="4">
                        Particulars
                      </td>
                      <td className="tableHeader3">Lot&nbsp;No</td>
                      <td className="tableHeader3">HSN</td>
                      {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                      data.tax_invoice_transactions[0].mrp_display !== "--" ? (
                        <td className="tableHeader">MRP</td>
                      ) : null}

                      <td className="tableHeader" colspan="2">
                        Rate
                      </td>
                      <td className="tableHeader">Qty&nbsp;</td>

                      <td className="tableHeader4" colspan="2">
                        Amount
                      </td>
                    </tr>
                  </tbody>
                  <tbody className="invoiceProducts">
                    {data.tax_invoice_transactions.map((row, index) => (
                      <tr className="tableBottomBorderNo">
                        <td>{index + 1}</td>
                        <td colspan="4">
                          <span className="tableSpan"> {row.product_name}</span>
                        </td>
                        <td>
                          <span className="tableSpan">{row.lot_number}</span>
                        </td>
                        <td>
                          <span className="tableSpan">{row.hsn}</span>
                        </td>
                        {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                        data.tax_invoice_transactions[0].mrp_display !==
                          "--" ? (
                          <td>
                            <span className="tableSpan">{row.mrp_display}</span>
                          </td>
                        ) : null}

                        <td colspan="2">
                          <span className="tableSpan">{row.price}</span>
                        </td>
                        <td>
                          <span className="tableSpan">{row.quantity}</span>
                        </td>

                        <td colspan="2">
                          <span className="tableSpan">
                            {Number(
                              Number(row.price) * Number(row.quantity)
                            ).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* show the total of quantity and total with discount */}
                  <tbody>
                    <tr className="tableBottomBorderNo tableTopBorder">
                      <td></td>
                      <td colspan="4" className="tableTextRight tableTextBold">
                        Total Quantity | Sub-Total
                      </td>
                      <td></td>
                      {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                      data.tax_invoice_transactions[0].mrp_display !== "--" ? (
                        <td></td>
                      ) : null}
                      <td></td>
                      <td colspan="2"></td>
                      <td className="tableTextBold">
                        {Number(
                          Number(
                            data.tax_invoice_transactions.reduce(function (
                              sum,
                              current
                            ) {
                              return (
                                +Number(sum) + Number(Number(current.quantity))
                              );
                            },
                            0)
                          )
                        )}
                      </td>
                      <td className="tableTextBold" colspan="2">
                        {Number(
                          parseFloat(
                            data.tax_invoice_transactions.reduce(function (
                              sum,
                              current
                            ) {
                              return (
                                +Number(sum) +
                                Number(
                                  Number(current.price) *
                                    Number(current.quantity)
                                )
                              );
                            },
                            0)
                          ).toFixed(2)
                        ).toFixed(2)}
                      </td>
                    </tr>
                    {data.discount_amount != "NULL" &&
                    data.discount_amount != null &&
                    data.discount_amount != "" &&
                    data.discount_amount != 0 ? (
                      <tr className="tableBottomBorderNo">
                        <td></td>
                        <td
                          className="tableTextRight tableTextBold"
                          colspan="4"
                        >
                          Discount Percentage
                        </td>
                        {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                        data.tax_invoice_transactions[0].mrp_display !==
                          "--" ? (
                          <td></td>
                        ) : null}
                        <td></td> <td></td>
                        <td colspan="2"></td>
                        <td></td>
                        <td className="tableTextBold" colspan="2">
                          {data.discount_amount != "NULL" &&
                          data.discount_amount != null &&
                          data.discount_amount != "" &&
                          data.discount_amount != 0
                            ? Math.round(
                                parseFloat(
                                  (parseFloat(
                                    parseFloat(data.discount_amount)
                                  ) /
                                    (parseFloat(data.sub_totalamt) +
                                      parseFloat(data.discount_amount))) *
                                    100
                                ).toFixed(2)
                              )
                            : 0}
                          %
                        </td>
                      </tr>
                    ) : null}
                    {data.discount_amount != "NULL" &&
                    data.discount_amount != null &&
                    data.discount_amount != "" &&
                    data.discount_amount != 0 ? (
                      <tr className="tableBottomBorderNo">
                        <td></td>
                        <td
                          className="tableTextRight tableTextBold"
                          colspan="4"
                        >
                          R-off/Discount
                        </td>
                        {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                        data.tax_invoice_transactions[0].mrp_display !==
                          "--" ? (
                          <td></td>
                        ) : null}
                        <td></td> <td></td>
                        <td colspan="2"></td>
                        <td></td>
                        <td className="tableTextBold" colspan="2">
                          (-)
                          {data.discount_amount != "NULL" &&
                          data.discount_amount != null &&
                          data.discount_amount != ""
                            ? data.discount_amount
                            : 0}
                        </td>
                      </tr>
                    ) : null}
                    <tr className="tableBottomBorderNo">
                      <td></td>
                      <td colspan="4" className="tableTextRight tableTextBold">
                        CGST
                      </td>
                      {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                      data.tax_invoice_transactions[0].mrp_display !== "--" ? (
                        <td></td>
                      ) : null}
                      <td></td> <td></td>
                      <td colspan="2"></td>
                      <td></td>
                      <td className="tableTextBold" colspan="2">
                        {Number(Number(data.gst_amount) / 2).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="tableTextRight tableTextBold" colspan="4">
                        SCGST
                      </td>
                      {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                      data.tax_invoice_transactions[0].mrp_display !== "--" ? (
                        <td></td>
                      ) : null}
                      <td></td> <td></td>
                      <td colspan="2"></td>
                      <td></td>
                      <td className="tableTextBold" colspan="2">
                        {Number(Number(data.gst_amount) / 2).toFixed(2)}
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="tableTextRight tableTextBold" colspan="4">
                        <Text weight={700} size="lg">
                          Grand Total
                        </Text>
                      </td>
                      {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                      data.tax_invoice_transactions[0].mrp_display !== "--" ? (
                        <td></td>
                      ) : null}
                      <td></td> <td></td>
                      <td colspan="2"></td>
                      <td></td>
                      <td colspan="2">
                        <Text weight={700} size="lg">
                          {Number(data.total_amount).toFixed(2)}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td colspan="12">
                        Amount (in words): <br />{" "}
                        <span className="tableSpan">
                          {price_in_words2(data.total_amount)}
                        </span>
                      </td>
                    </tr>
                  </tbody>

                  {/* <tbody>
                <tr>
                  <td className="tableHeader" colSpan="3" rowspan="2">
                    HSN/Sac
                  </td>

                  <td className="tableHeader" rowspan="2">
                    Taxable Amt
                  </td>
                  <td className="tableHeader" colSpan="2">
                    Central Tax
                  </td>
                  <td className="tableHeader" colSpan="2">
                    State Tax
                  </td>

                  <td className="tableHeader" colSpan="3" rowspan="2">
                    Total Tax Amount
                  </td>
                </tr>
                <tr>
                  <td className="tableHeader">Rate</td>
                  <td className="tableHeader">Amount</td>
                  <td className="tableHeader">Rate</td>
                  <td className="tableHeader">Amount</td>
                </tr>
              </tbody>

              <tbody>
                {data.invoice_items.map((row, index) => (
                  <tr className="tableBottomBorderNo">
                    <td colSpan="3">{row.hsn}</td>
                    <td>{row.amount}</td>

                    <td>{Number(row.tax) / 2}</td>
                    <td>{Number(row.tax_rate) / 2}</td>
                    <td>{Number(row.tax) / 2}</td>
                    <td>{Number(row.tax_rate) / 2}</td>
                    <td colSpan="3">{row.tax_rate}</td>
                  </tr>
                ))}
              </tbody> */}
                  {/* <tbody>
                <tr className="tableTopBorder">
                  <td className="tableTextRight" colSpan="3">
                    Total
                  </td>

                  <td>{data.sub_totalamt}</td>
                  <td></td>

                  <td>{Number(Number(data.gst_amount) / 2).toFixed(2)}</td>
                  <td></td>

                  <td>{Number(Number(data.gst_amount) / 2).toFixed(2)}</td>
                  <td colSpan="3">{Number(data.gst_amount)}</td>
                </tr>
              </tbody> */}
                  {/* <tbody>
                <tr className="tableBottomBorderNo">
                  <td colspan="12">
                    Tax Amount (in words): <br />
                    <span className="tableSpan">
                      {price_in_words2(data.gst_amount)}
                    </span>
                    <br />
                  </td>
                </tr>
              </tbody> */}

                  <tbody>
                    <tr>
                      <td colspan="6" className="tableSpan">
                        Subject to Mysore Jursdiction only
                      </td>
                      <td colspan="6" className="tableTextRight tableSpan">
                        <span className="tableSpan">
                          {" "}
                          For Dhanashree Surgicals
                        </span>{" "}
                        <br /> &nbsp; <br />
                        <span className="tableSpan"> Authorized Signature</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ textAlign: "center" }}>
                  {" "}
                  <p style={{ fontSize: 10 }}>
                    This is a Computer generated Invoice
                  </p>{" "}
                </div>
                <div className="invoicePrint noprint">
                  <button
                    type="submit"
                    color="orange"
                    variant="outline"
                    onClick={() => {
                      window.print();
                    }}
                  >
                    Print
                  </button>
                </div>
              </div>
            ) : (
              <div className="invoiceContainer">
                <table className="invoiceTable">
                  <tbody>
                    <tr>
                      <td className="tableText tableHeader" colspan="12">
                        <Text weight={600} size="md">
                          TAX Invoice
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    {/* Company details */}
                    <tr>
                      <td colspan="5" rowspan="3">
                        <Text
                          color="#b90707"
                          weight={700}
                          style={{ fontSize: 22 }}
                          component="span"
                        >
                          Dhanashree Surgicals
                        </Text>
                        <br />
                        <Text weight={500} size="lg">
                          #185 B1, 1st Stage Bisilumaramma Temple Road,
                        </Text>
                        <Text weight={500} size="lg">
                          {" "}
                          Gangothri Layout, Mysore-570009{" "}
                        </Text>

                        <Text weight={500} size="lg">
                          Phone: 9448386150, 9972450797, 9886655586
                        </Text>
                      </td>
                    </tr>
                    <tr>
                      {/* Invoice details */}
                      <td colspan="7">
                        {" "}
                        <Text weight={600} size="lg">
                          Invoice No: {data.invoice_num} &nbsp;
                        </Text>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="7">
                        <Text>
                          {" "}
                          <Text weight={600} size="lg" component="span">
                            {" "}
                            Date:
                          </Text>{" "}
                          {new Date(data.invoice_date).toLocaleDateString(
                            "en-UK"
                          )}
                        </Text>
                      </td>
                    </tr>
                    {/* Customer details name and gst */}
                    <tr>
                      <td colspan="5" rowspan="4">
                        <Text size="lg" weight={600}>
                          To,{data.client_name}&nbsp;
                        </Text>
                        <Text>
                          {" "}
                          <Text weight={600} component="span">
                            {" "}
                            Ref:
                          </Text>{" "}
                          {data.reference}
                        </Text>
                        <Text>
                          {" "}
                          <Text weight={600} component="span">
                            {" "}
                            GST:
                          </Text>{" "}
                          {data.client_gst}
                        </Text>

                        <Text>
                          {" "}
                          <Text weight={600} component="span">
                            {" "}
                            DL No:
                          </Text>{" "}
                          {data.dl_num}
                        </Text>
                      </td>
                    </tr>

                    <tr>
                      <td colspan="7">
                        {" "}
                        <Text>
                          {" "}
                          <Text weight={600} component="span">
                            {" "}
                            DC No:
                          </Text>{" "}
                          {data.dc_num}
                        </Text>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="7">
                        <Text>
                          {" "}
                          <Text weight={600} component="span">
                            {" "}
                            DL No
                          </Text>{" "}
                          : KA/MYSU/1/20B-709 <br />{" "}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                          KA/MYSU/1/21B-666
                        </Text>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="7">
                        <Text>
                          {" "}
                          <Text weight={600} component="span">
                            {" "}
                            GST:
                          </Text>{" "}
                          29BBEPS6455H1Z5
                        </Text>
                      </td>
                    </tr>
                    {/* Patient Details */}
                    <tr>
                      <td colspan="5" rowspan="2">
                        <Text weight={600}>Patient: {data.patient_name}</Text>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="7">
                        {" "}
                        <Text weight={600}>IP No : {data.ip_num}</Text>
                        <Text weight={600}>PO Number : {data.po_number}</Text>
                      </td>
                    </tr>
                  </tbody>
                  {/* List of invoice products with hsn and lot_number */}
                  <tbody>
                    <tr>
                      <td className="tableHeader">Sl.No.</td>
                      <td className="tableHeader2" colspan="4">
                        Particulars
                      </td>
                      <td className="tableHeader3">Lot&nbsp;No</td>
                      <td className="tableHeader3">HSN</td>
                      {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                      data.tax_invoice_transactions[0].mrp_display !== "--" ? (
                        <td className="tableHeader">MRP</td>
                      ) : null}

                      <td className="tableHeader" colspan="2">
                        Rate
                      </td>
                      <td className="tableHeader">Qty&nbsp;</td>

                      <td className="tableHeader4" colspan="2">
                        Amount
                      </td>
                    </tr>
                  </tbody>
                  <tbody className="invoiceProducts">
                    {data.tax_invoice_transactions.map((row, index) => (
                      <tr className="tableBottomBorderNo">
                        <td>{index + 1}</td>
                        <td colspan="4">
                          <span className="tableSpan"> {row.product_name}</span>
                        </td>
                        <td>
                          <span className="tableSpan">{row.lot_number}</span>
                        </td>
                        <td>
                          <span className="tableSpan">{row.hsn}</span>
                        </td>
                        {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                        data.tax_invoice_transactions[0].mrp_display !==
                          "--" ? (
                          <td>
                            <span className="tableSpan">{row.mrp_display}</span>
                          </td>
                        ) : null}

                        <td colspan="2">
                          <span className="tableSpan">{row.price}</span>
                        </td>
                        <td>
                          <span className="tableSpan">{row.quantity}</span>
                        </td>

                        <td colspan="2">
                          <span className="tableSpan">{row.total_amount}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* show the total of quantity and total with discount */}
                  <tbody>
                    <tr className="tableBottomBorderNo tableTopBorder">
                      <td></td>
                      <td colspan="4" className="tableTextRight tableTextBold">
                        Total Quantity | Sub-Total
                      </td>
                      <td></td>
                      {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                      data.tax_invoice_transactions[0].mrp_display !== "--" ? (
                        <td></td>
                      ) : null}
                      <td></td>
                      <td colspan="2"></td>
                      <td className="tableTextBold">
                        {data.tax_invoice_transactions.length}
                      </td>
                      <td className="tableTextBold" colspan="2">
                        {Number(data.sub_totalamt).toFixed(2)}
                      </td>
                    </tr>
                    {data.discount_amount != "NULL" &&
                    data.discount_amount != null &&
                    data.discount_amount != "" &&
                    data.discount_amount != 0 ? (
                      <tr className="tableBottomBorderNo">
                        <td></td>
                        <td
                          className="tableTextRight tableTextBold"
                          colspan="4"
                        >
                          Discount Percentage
                        </td>
                        {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                        data.tax_invoice_transactions[0].mrp_display !==
                          "--" ? (
                          <td></td>
                        ) : null}
                        <td></td> <td></td>
                        <td colspan="2"></td>
                        <td></td>
                        <td className="tableTextBold" colspan="2">
                          {data.discount_amount != "NULL" &&
                          data.discount_amount != null &&
                          data.discount_amount != "" &&
                          data.discount_amount != 0
                            ? Math.round(
                                parseFloat(
                                  (parseFloat(
                                    parseFloat(data.discount_amount)
                                  ) /
                                    (parseFloat(data.sub_totalamt) +
                                      parseFloat(data.discount_amount))) *
                                    100
                                ).toFixed(2)
                              )
                            : 0}
                          %
                        </td>
                      </tr>
                    ) : null}

                    {data.discount_amount != "NULL" &&
                    data.discount_amount != null &&
                    data.discount_amount != "" &&
                    data.discount_amount != 0 ? (
                      <tr className="tableBottomBorderNo">
                        <td></td>
                        <td
                          className="tableTextRight tableTextBold"
                          colspan="4"
                        >
                          R-off/Discount
                        </td>
                        {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                        data.tax_invoice_transactions[0].mrp_display !==
                          "--" ? (
                          <td></td>
                        ) : null}
                        <td></td> <td></td>
                        <td colspan="2"></td>
                        <td></td>
                        <td className="tableTextBold" colspan="2">
                          (-)
                          {data.discount_amount != "NULL" &&
                          data.discount_amount != null &&
                          data.discount_amount != ""
                            ? data.discount_amount
                            : 0}
                        </td>
                      </tr>
                    ) : null}

                    <tr className="tableBottomBorderNo">
                      <td></td>
                      <td colspan="4" className="tableTextRight tableTextBold">
                        CGST
                      </td>
                      {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                      data.tax_invoice_transactions[0].mrp_display !== "--" ? (
                        <td></td>
                      ) : null}
                      <td></td> <td></td>
                      <td colspan="2"></td>
                      <td></td>
                      <td className="tableTextBold" colspan="2">
                        {Number(Number(data.gst_amount) / 2).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="tableTextRight tableTextBold" colspan="4">
                        SCGST
                      </td>
                      {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                      data.tax_invoice_transactions[0].mrp_display !== "--" ? (
                        <td></td>
                      ) : null}
                      <td></td> <td></td>
                      <td colspan="2"></td>
                      <td></td>
                      <td className="tableTextBold" colspan="2">
                        {Number(Number(data.gst_amount) / 2).toFixed(2)}
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="tableTextRight tableTextBold" colspan="4">
                        <Text weight={700} size="lg">
                          Grand Total
                        </Text>
                      </td>
                      {data.tax_invoice_transactions[0].mrp_display !== "-" &&
                      data.tax_invoice_transactions[0].mrp_display !== "--" ? (
                        <td></td>
                      ) : null}
                      <td></td> <td></td>
                      <td colspan="2"></td>
                      <td></td>
                      <td colspan="2">
                        <Text weight={700} size="lg">
                          {Number(data.total_amount).toFixed(2)}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td colspan="12">
                        Amount (in words): <br />{" "}
                        <span className="tableSpan">
                          {price_in_words2(data.total_amount)}
                        </span>
                      </td>
                    </tr>
                  </tbody>

                  {/* <tbody>
                <tr>
                  <td className="tableHeader" colSpan="3" rowspan="2">
                    HSN/Sac
                  </td>

                  <td className="tableHeader" rowspan="2">
                    Taxable Amt
                  </td>
                  <td className="tableHeader" colSpan="2">
                    Central Tax
                  </td>
                  <td className="tableHeader" colSpan="2">
                    State Tax
                  </td>

                  <td className="tableHeader" colSpan="3" rowspan="2">
                    Total Tax Amount
                  </td>
                </tr>
                <tr>
                  <td className="tableHeader">Rate</td>
                  <td className="tableHeader">Amount</td>
                  <td className="tableHeader">Rate</td>
                  <td className="tableHeader">Amount</td>
                </tr>
              </tbody>

              <tbody>
                {data.invoice_items.map((row, index) => (
                  <tr className="tableBottomBorderNo">
                    <td colSpan="3">{row.hsn}</td>
                    <td>{row.amount}</td>

                    <td>{Number(row.tax) / 2}</td>
                    <td>{Number(row.tax_rate) / 2}</td>
                    <td>{Number(row.tax) / 2}</td>
                    <td>{Number(row.tax_rate) / 2}</td>
                    <td colSpan="3">{row.tax_rate}</td>
                  </tr>
                ))}
              </tbody> */}
                  {/* <tbody>
                <tr className="tableTopBorder">
                  <td className="tableTextRight" colSpan="3">
                    Total
                  </td>

                  <td>{data.sub_totalamt}</td>
                  <td></td>

                  <td>{Number(Number(data.gst_amount) / 2).toFixed(2)}</td>
                  <td></td>

                  <td>{Number(Number(data.gst_amount) / 2).toFixed(2)}</td>
                  <td colSpan="3">{Number(data.gst_amount)}</td>
                </tr>
              </tbody> */}
                  {/* <tbody>
                <tr className="tableBottomBorderNo">
                  <td colspan="12">
                    Tax Amount (in words): <br />
                    <span className="tableSpan">
                      {price_in_words2(data.gst_amount)}
                    </span>
                    <br />
                  </td>
                </tr>
              </tbody> */}

                  <tbody>
                    <tr>
                      <td colspan="6" className="tableSpan">
                        Subject to Mysore Jursdiction only
                      </td>
                      <td colspan="6" className="tableTextRight tableSpan">
                        <span className="tableSpan">
                          {" "}
                          For Dhanashree Surgicals
                        </span>{" "}
                        <br /> &nbsp; <br />
                        <span className="tableSpan"> Authorized Signature</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ textAlign: "center" }}>
                  {" "}
                  <p style={{ fontSize: 10 }}>
                    This is a Computer generated Invoice
                  </p>{" "}
                </div>
                <div className="invoicePrint noprint">
                  <button
                    type="submit"
                    color="orange"
                    variant="outline"
                    onClick={() => {
                      window.print();
                    }}
                  >
                    Print
                  </button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </>
    </div>
  );
}

export default PrintInvoice;
