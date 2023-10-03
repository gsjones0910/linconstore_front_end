import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useFetchAllOrders } from "../../hooks/useDataFetch";
import {useTokenRefetch} from "../../hooks/useRefresh";
import Header, { SearchOptionType } from "./Header";
import DashboardOrders from "../Utils/Admin/DashboardOrders";
import ContextApi from "../../Store/context/ContextApi";
import {key} from "../../Helpers/Exchange";
import axios from "axios";
import TransactionTable from "../Utils/Admin/TransactionTable";

const Transaction: React.FC = () => {

    type TOrders = {
        _id: string,
        name: string,
        price: number,
        status: string,
        quantity: number,
        shippingCost: number
    }

    const isMobile = useMediaQuery("(max-width: 600px)");
    const router = useRouter();

    const searchFields = ['Type', 'ID', 'Account', 'Method',]

    const [searchOption, setSearchOption] = useState<SearchOptionType>({
        field: searchFields[0],
        keyword: '',
    });
  
    const [transactions, setTransactions] = useState([]);  

    useEffect(() => {
        //TODO Implement search functionality here using searchOption
        
    }, [searchOption])

    const onSuccess = (data) => {
        setTransactions(data)
    }
    
    //TODO Update fetch function
    // const { refetch, isFetched, isFetching, data: ordersData} = useFetchAllOrders(onSuccess);

    return (
        <>
            <Header 
                title="Transaction" 
                searchFields={searchFields} 
                searchOption={searchOption}
                calendar
                setSearchOption={setSearchOption}
            />
            <Card
                elevation={0}
                sx={{ background: "white", mt: 1, px: 2, minHeight: "90vh" }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    {isMobile && (
                        <ArrowBack onClick={() => router.back()} className={"pointer"} />
                    )}
                </Box>
                <Box>
                    {/* {isFetching && <CircularProgress />}
                    {isFetched && orders.length > 0 && ( */}
                        <TransactionTable transactions={transactions} />
                    {/* )} */}
                </Box>
            </Card>
        </>
    );
};
export default Transaction;
