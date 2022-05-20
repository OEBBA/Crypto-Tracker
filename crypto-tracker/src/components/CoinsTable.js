
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { CoinList } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { ThemeProvider } from '@emotion/react';
import { makeStyles, createTheme, Typography, Container, TextField, TableContainer, LinearProgress, Table, TableRow, TableHead, TableCell, TableBody } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import Pagination from '@material-ui/lab/Pagination';

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const darkTheme = createTheme({
    palette: {
        primary: {
            main: "#0000",
        },
        type: "dark",
    },
});

const useStyle = makeStyles({
    row: {
        backgroundColor: "#829abf",
        "&:hover": {
            backgroundColor: "#50617a",
        },
        fontFamily: "Monserrat",
    }
});


const CoinsTable = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState();
    const [page, setPage] = useState(1);
    const history = useHistory();
    const classes = useStyle();

    const { currency, symbol } = CryptoState();

    const fetchCoins = async () => {
        const { data } = await axios.get(CoinList(currency));

        setCoins(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchCoins();
    }, [currency]);

    const handleSearch = () => {
        return coins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(search) ||
                coin.symbol.toLowerCase().includes(search)
        );
    };


    return (<ThemeProvider theme={darkTheme}>
        <Container style={{
            textAlign: "center",
            borderRadius: 10,
            borderStyle: 'solid',
            borderWidth: '.5px',
            borderColor: 'white',
            backgroundColor: '#3e4857',
        }}>
            <Typography variant="h4" style={{ margin: 20 }}>
                Cryptocurrency Prices According to Market Cap
            </Typography>
            <TextField
                label="Search For a Specific Crypto Currency.."
                variant="outlined"
                style={{ marginBottom: 20, width: "100%" }}
                onChange={(e) => setSearch(e.target.value)}
            />
            <TableContainer>
                {loading ? (
                    <LinearProgress style={{ backgroundColor: "gold" }} />
                ) : (
                    <Table>
                        <TableHead style={{
                            backgroundColor: "#adbac1"
                        }} >
                            <TableRow>
                                {["Coin", "Price", "Recent Change", "Market Cap"].map((head) => (
                                    <TableCell style={{ color: "black", fontWeight: "700", fontFamily: "Montserrat" }} key={head} align={head === "Coin" ? "" : "right"}>
                                        {head}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {handleSearch()
                                .slice((page - 1) * 10, (page - 1) * 10 + 10)
                                .map((row) => {
                                    const profit = row.price_change_percentage_24h > 0;

                                    return (
                                        <TableRow
                                            className={classes.row}
                                            key={row.name}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                style={{
                                                    display: "flex",
                                                    gap: 15,
                                                }}
                                            >
                                                <img
                                                    src={row?.image}
                                                    height="50"
                                                    alt={row.name}
                                                    style={{ marginBottom: 10 }}
                                                />
                                                <div
                                                    style={{ display: "flex", flexDirection: "column" }}
                                                >
                                                    <span
                                                        style={{
                                                            textTransform: "uppercase",
                                                            fontSize: 22,
                                                        }}
                                                    >
                                                        {row.symbol}
                                                    </span>
                                                    <span style={{ color: "darkgrey" }}>
                                                        {row.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">
                                                {symbol}{" "}
                                                {numberWithCommas(row.current_price.toFixed(2))}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                style={{
                                                    color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {profit && "+"}
                                                {row.price_change_percentage_24h.toFixed(2)}%
                                            </TableCell>
                                            <TableCell align="right">
                                                {symbol}{" "}
                                                {numberWithCommas(
                                                    row.market_cap.toString().slice(0, -6)
                                                )}
                                                M
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <Pagination
                count={(handleSearch()?.length / 10).toFixed(0)}
                style={{
                    padding: 20,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
                onChange={(_, value) => {
                    setPage(value);
                    window.scroll(0, 450);
                }}
            />
        </Container>
    </ThemeProvider >)
}

export default CoinsTable

