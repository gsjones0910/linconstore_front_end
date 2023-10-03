import Head from "next/head";
import React, { useState } from "react";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { ArrowBack, Message } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useGetSellerRefunds, useSellerUpdateRefund } from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Image from "next/image";

type TProduct = {
  title: string;
};
interface IRefund {
  reason: string;
  productId: TProduct;
  status: string;
}
const Refund: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const [refunds, setRefund] = useState<IRefund[]>([]);
  const onSuccess = (data: IRefund[]) => {
    setRefund(data);
  };
  const { isLoading, isFetched, refetch } = useGetSellerRefunds(onSuccess);
  useTokenRefetch(refetch)
  const { t } = useTranslation();

  const gotoConversation = (refund: any) => {
    if (refund.status == "pending" || refund.status == "active") {
      const productDetail = {
        buyerInfo: refund.userId,
        id: refund.productId._id,
      };
      const roomName = `refund:${refund.productId.owner?.owner?._id}:${refund._id}`;
      localStorage.setItem("currentChatRoomName", roomName);
      localStorage.setItem("product_detail", JSON.stringify(productDetail));
      if (refund.status != "active") {
        updateRefund({ id: refund._id, status: "active" })
      } else {
        router.push("/seller/chat");
      }
    }
  };

  const handleInitiatedRefund = (refund: any) => {
    if (refund.status == "active") {
      updateInitRefund({ id: refund._id, status: "RF-initiated" })
    }
  };

  const onRefundSuccess = () => {
    router.push("/seller/chat");
  }
  const onRefundInitSuccess = () => {
    refetch()
  }
  const { isLoading: isUpdating, mutate: updateRefund } = useSellerUpdateRefund(onRefundSuccess)
  const { isLoading: isInitUpdating, mutate: updateInitRefund } = useSellerUpdateRefund(onRefundInitSuccess)

  return (
    <>
      <Head>
        <title>{t("pagetitle.Refund")}</title>
        <meta name={"Refund Request"} content={"These are Refund Request"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
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
        {refunds.length === 0 && (
          <Typography variant={"body1"}>{t("seller.refund.no_msg")}</Typography>
        )}
        {refunds.length > 0 && (
          <Box sx={{ borderRadius: "5px", overflow: 'hidden' }}>
            {refunds.map((refund, index) => (
              <Box
                key={index}
                sx={{
                  py: 1,
                  px: 2,
                  bgcolor: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <Box >
                  <Typography fontSize={!isMobile ? "18px" : "14px"} textAlign={"center"}>
                    {refund.productId?.title}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography fontSize={!isMobile ? "18px" : "14px"} textAlign={"center"} mr={2}>
                    {refund.reason} : {t("seller.refund.reply")}
                  </Typography>
                  <Button onClick={() => gotoConversation(refund)} disabled={refund.status !== "pending" && refund.status !== "active"}>
                    <Message sx={{ color: "#25d3cc", fontSize: !isMobile ? "24px" : "18px" }} />
                  </Button>
                </Box>
                <Button
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => handleInitiatedRefund(refund)}
                  disabled={refund.status !== "active"}
                >
                  <Typography fontSize={!isMobile ? "18px" : "14px"} textAlign={"center"} mr={1}>
                    {t("seller.refund.issue")}
                  </Typography>
                  <Image
                    width={!isMobile ? 35 : 25}
                    height={!isMobile ? 27 : 20}
                    style={{
                      marginTop: 30,
                      width: "100%",
                      height: "100%",
                    }}
                    placeholder="blur"
                    blurDataURL={
                      "https://via.placeholder.com/300.png/09f/fff"
                    }
                    src={"/assets/img/refund-icon.png"}
                    alt={"refund img"}
                  />
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Card>
    </>
  );
};
export default Refund;
