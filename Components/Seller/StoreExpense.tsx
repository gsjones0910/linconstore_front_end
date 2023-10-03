/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Card,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { AccountBalanceWallet, ArrowBack, Payments } from "@mui/icons-material";
import { numberWithCommas } from "../../Helpers/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import CardManagement from "./CardManagement";
import { useDispatch, useSelector } from "react-redux";
import Transfer from "./Transfer";
import Billing from "./Billing";
import Button from "@mui/material/Button";
import {
  useStoreExpenseOrders,
  useGetSellerDeliveredOrders,
  useGetSellerFunds,
  useGetSellerInfo,
  useGetSellerLink,
  useGetSellerRequestMessage,
  useGetStore,
  useGetStoreActivity,
} from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import { useRefresh, useTokenRefetch } from "../../hooks/useRefresh";
import {
  IAdminProducts,
  ISellerRequestMes,
  addAddress,
} from "../../Helpers/Types";
import {
  openCloseSellerWithdrawModal,
  openSellerPayoutModal,
} from "../../Store/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { reCreateDate } from "../../Helpers/getDate";
import SellerPayoutModal from "../Utils/Seller/SellerPayoutModal";
import SellerWithdrawModal from "../Utils/Seller/SellerWithdrawModa";
import PaypalModal from "../Utils/Seller/PaypalModal";
//
type TSeller = {
  isActive: boolean;
  isVerified: boolean;
  isPausedPayout: boolean;
  accId: string;
  paypal: string;
  _id: string;
};
type TProduct = {
  photo: string[];
  title: string;
};
type IStore = {
  bill: number;
  type: string;
  name: string;
  createdAt: Date;
  productId: TProduct;
};
interface IActivity {
  totalBill: number;
  activity: IStore[];
}
export interface Idata {
  icon: any;
  title: string;
}
type TStore = {
  currency: string;
};
type TLink = {
  url: string;
};
type TCurrency = {
  currency: {
    currency: string;
  };
};
type stepper = {
  stepper: {
    step: number;
  };
};

interface IOrders {
  productId: IAdminProducts;
  _id: string;
  status: string;
  active: boolean;
  address: string;
  type: string;
  shipping: string;
  shippingProvider: string;
  trackingId: string;
  quantity: number;
  createdAt: Date;
}
interface INewOrders {
  order: IOrders;
  address: addAddress;
}
const StoreExpense: React.FC = () => {
  const stepper = useSelector((state: stepper) => state.stepper.step);
  const { t } = useTranslation();
  const [seller, setSeller] = useState<TSeller>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [sellerFunds, setFunds] = useState(null);

  const onSuccess = (data: TSeller) => {
    if (data && data.isVerified) {
      setSeller(data);
    } else {
      router.push("/seller/permission");
    }
  };

  const data: Idata[] = [
    {
      icon: <FontAwesomeIcon fontSize={"large"} icon={faMoneyBillTransfer} />,
      title: "Transfer",
    },
  ];

  useEffect(() => {
    if (!seller?.isActive) {
      refreshRequest();
    }
  }, [seller]);

  const [message, setMessage] = useState<string>("");
  const onSellerRequestSuccess = (data: ISellerRequestMes) => {
    setMessage(data.message);
  };
  const { isSuccess, refetch: refreshRequest } = useGetSellerRequestMessage(
    onSellerRequestSuccess
  );
  const {
    isLoading,
    isFetched,
    refetch: refresh,
    isError,
  } = useGetSellerInfo(onSuccess);

  useEffect(() => {
    if (isError) {
      return;
    }
  }, [isError]);
  useTokenRefetch(refresh);
  // const [currency, setCurrency] = useState<string>('');
  const currency: string = useSelector(
    (state: TCurrency) => state.currency.currency
  );
  const [isShow, setIsShow] = useState<boolean>(false);
  const onStoreSuccess = (data: TStore) => {
    // setCurrency(data.currency)
  };
  const dispatch = useDispatch();
  const router = useRouter();
  useGetStore(onStoreSuccess);
  const [totalBill, setTotalBill] = useState<number>(0);
  const [activities, setActivities] = useState<IStore[]>([]);
  const onActivitySuccess = (data: IActivity) => {
    setTotalBill(data.totalBill);
    setActivities(data.activity);
  };
  const { isLoading: isFetching, refetch: activityRefetch } =
    useGetStoreActivity(onActivitySuccess);

  useTokenRefetch(activityRefetch);

  const onOrderDeliveredSuccess = (data: any) => {
    setIsShow(data.isShow);
  };

  const { refetch: refetchOrders } = useGetSellerDeliveredOrders(
    onOrderDeliveredSuccess
  );

  useTokenRefetch(refetchOrders);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const onOrderLoadSuccess = (orderData: any[] | string) => {
    if (orderData !== "No Orders") {
      // @ts-ignore
      setTransactions(orderData);
    }
  };
  const {
    data: orderData,
    isLoading: orderIsLoading,
    isFetched: orderLoadIsFetch,
    refetch: orderRetch,
  } = useStoreExpenseOrders(onOrderLoadSuccess);

  const onSellerFundsSuccess = (data) => {
    setFunds(data);
  };

  const {
    data: sellerFund,
    isLoading: sellerFundsLoading,
    refetch: sellerFundsRefetch,
  } = useGetSellerFunds(onSellerFundsSuccess);

  useTokenRefetch(orderRetch);
  useTokenRefetch(sellerFundsRefetch);

  return (
    <>
      <Head>
        <title>{t("pagetitle.StoreExpense")}</title>
        <meta
          name={"Store Expenses"}
          content={"Here you can find details about the expenses of your store"}
        />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      {stepper === 1 && (
        // <CssBaseline/>
        <Card elevation={0} sx={{ bgcolor: "transparent", mt: 1, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {isMobile && (
              <ArrowBack onClick={() => router.back()} className={"pointer"} />
            )}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {isLoading ||
              sellerFundsLoading ||
              (orderIsLoading && (
                <Typography textAlign={"center"}>
                  <CircularProgress />
                </Typography>
              ))}
            {isFetched && !seller?.isActive && isSuccess && (
              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                sx={{
                  background: "#a6a3a3",
                  p: 1,
                  display: "flex",
                  borderRadius: "10px",
                }}
              >
                <Typography
                  flexGrow={1}
                  gutterBottom
                  variant="body1"
                  component="div"
                >
                  {message}
                </Typography>
                <Button
                  variant={"contained"}
                  onClick={() => router.push("/seller/additional_verification")}
                  sx={{ minWidth: 180, maxHeight: 50 }}
                  color={"success"}
                >
                  {t("seller.store_expense.btn_upload")}
                </Button>
              </Stack>
            )}

            <Box my={2}>
              <Swiper
                effect={"fade"}
                pagination={{
                  clickable: true,
                }}
                breakpoints={{
                  900: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                }}
                className="mySwiper"
              >
                <SwiperSlide>
                  <Card
                    sx={{
                      boxShadow: "none",
                      borderRadius: "10px",
                      p: 1,
                      width: "100%",
                      mb: isMobile ? 5 : 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography gutterBottom variant={"body2"}>
                        {t("seller.store_expense.pending_payout")}
                      </Typography>
                      <Typography color={"primary"}>
                        {currency} {sellerFunds?.pendingPayout?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Card>
                </SwiperSlide>

                <SwiperSlide>
                  <Card
                    sx={{
                      boxShadow: "none",
                      borderRadius: "10px",
                      p: 1,
                      width: "100%",
                      mb: isMobile ? 5 : 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <Typography gutterBottom variant={"body2"}>
                        {t("seller.store_expense.available_payout")}
                      </Typography>
                      <Button
                        sx={{
                          position: "absolute",
                          left: 0,
                          bottom: 0,
                          textTransform: "capitalize",
                          gap: 1,
                          p: 0,
                        }}
                        disabled={seller?.isPausedPayout || !seller?.isActive}
                        onClick={() =>
                          dispatch(openCloseSellerWithdrawModal(true))
                        }
                      >
                        <Payments />
                        <Typography fontSize={14}>{t("seller.store_expense.Withdraw")}</Typography>
                      </Button>
                      <Typography color={"primary"}>
                        {currency}
                        {numberWithCommas(sellerFunds?.availablePayout)}
                      </Typography>
                    </Box>
                  </Card>
                </SwiperSlide>

                <SwiperSlide>
                  <Card
                    sx={{
                      boxShadow: "none",
                      borderRadius: "10px",
                      p: 1,
                      width: "100%",
                      mb: isMobile ? 5 : 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography gutterBottom variant={"body2"}>
                        {t("seller.store_expense.payout_method")}
                      </Typography>
                      <Button
                        sx={{ p: 0, textTransform: "unset" }}
                        onClick={() => {
                          if (seller?.accId) {
                            localStorage.setItem("seller_accId", seller?.accId)
                          }
                          dispatch(openSellerPayoutModal(true))
                        }}
                        startIcon={<AccountBalanceWallet />}
                      >
                        {seller?.paypal ? t("seller.store_expense.Paypal_Account") : seller?.accId ? t("seller.store_expense.Bank_Account") : t("seller.store_expense.Add_payment_method")}
                      </Button>
                    </Box>
                  </Card>
                </SwiperSlide>
              </Swiper>
            </Box>
          </Box>

          <TableContainer
            component={Paper}
            sx={{ maxHeight: "calc(100% - 200px)" }}
          >
            <Table stickyHeader size={"small"}>
              <TableHead>
                <TableRow>
                  <TableCell>{t("seller.store_expense.transaction")}</TableCell>
                  <TableCell>{t("seller.store_expense.date")}</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>{t("seller.store_expense.amount")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length > 0 &&
                  transactions
                    .slice()
                    .reverse()
                    .map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              variant={"circular"}
                              src={item.orderId?.productId.photo[0]}
                              sx={{ width: 37, height: 34 }}
                            />
                            <Typography
                              fontSize={12}
                              sx={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                maxWidth: "250px",
                                minWidth: "250px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.orderId?.productId
                                ? item.orderId?.productId.title
                                : item.orderId?.productId.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontSize={12}>
                              {reCreateDate(item?.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: "right" }}>
                            <Typography color={"primary"} fontSize={12}>
                              {currency + " "}
                              {(item.amountDue).toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
      {stepper === 2 && <CardManagement />}
      {stepper === 3 && <Transfer />}
      {stepper === 4 && <Billing />}
      {isShow && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            minWidth: "100%",
            my: 2,
            mb: 8,
            display: "flex",
            px: 2,
            py: 2,
            flexDirection: "row",
            justifyContent: "space-evenly",
            bgcolor: "#25D366",
          }}
        >
          <Stack spacing={2} sx={{ color: "#fff" }}>
            <Typography variant={"body2"}>{t("seller.store_expense.Available_Payout")}</Typography>
            <Typography variant={"body2"}>
              {currency} {numberWithCommas(totalBill)}
            </Typography>
          </Stack>
          <Button
            onClick={() => dispatch(openSellerPayoutModal(true))}
            variant={"contained"}
            className={"buttonClass"}
            sx={{ color: "green", bgcolor: "#fff", borderRadius: "10px" }}
          >
            {t("seller.store_expense.Add_Payout_Method")}
          </Button>
        </Box>
      )}
      <SellerWithdrawModal totalBill={numberWithCommas(sellerFunds?.availablePayout)} currency={currency} />
      <PaypalModal />
    </>
  );
};
export default StoreExpense;
