import { useEffect, useState } from "react";
import { Grid, Typography, Box, IconButton, Button } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DownloadIcon from "@mui/icons-material/Download";

import Dropdown from "../components/Dropdown.js";
import Card from "../components/Card.js";
import Plot from "../components/Plot.js";
import useBookmarksState from "../use-bookmarks-state.js";
import { downloadCsv } from "../utils/csv-export.js";

const availableRegions = ["Thessaloniki", "Athens", "Patras"];
const generateRandomData = (minimum = 0, maximum = 100) => {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

const formatNumber = (number, symbol = "", showSign = true) => {
    if (!number) return "-";

    let formattedNumber = (number > 0 && showSign) ? "+" : "";
    formattedNumber += number;
    formattedNumber += symbol;

    return formattedNumber;
};

const Dashboard = () => {
    const [selectedRegion, setSelectedRegion] = useState("Thessaloniki");
    const [data, setData] = useState({});
    const bookmarks = useBookmarksState((state) => state.bookmarks);
    const toggleBookmark = useBookmarksState((state) => state.toggle);
    const isBookmarked = bookmarks.includes("dashboard");

    const handleExportWeeklySales = () => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const sales = data?.weeklySales || [];
        const rows = days.map((day, index) => [day, sales[index] ?? ""]);
        downloadCsv("weekly-sales.csv", rows, ["Day", "Sales"]);
    };

    useEffect(() => {
        const newData = {
            monthlyRevenue: {
                value: generateRandomData(),
                change: generateRandomData(-100, 100),
            },
            newCustomers: {
                value: generateRandomData(0, 10_000),
                change: generateRandomData(-100, 100),
            },
            activeSubscriptions: {
                value: generateRandomData(0, 100_000),
                change: generateRandomData(-100, 100),
            },
            weeklySales: Array.from({ length: 7 }, () => generateRandomData(0, 100)),
            revenueTrend: Array.from({ length: 12 }, () => generateRandomData(0, 500)),
            customerSatisfaction: Array.from({ length: 12 }, () => generateRandomData(0, 500)),
        };

        setData(newData);
    }, [selectedRegion]);

    return (
        <Grid container py={2} flexDirection="column">
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="h4" gutterBottom color="white.main" sx={{ mb: 0 }}>
                    Overview
                </Typography>
                <IconButton
                    data-testid="bookmark-toggle-dashboard"
                    aria-label="Toggle bookmark for dashboard"
                    onClick={() => toggleBookmark("dashboard")}
                    sx={{ color: "white" }}
                >
                    {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
                <Button
                    data-testid="export-csv-weekly-sales"
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportWeeklySales}
                    sx={{ color: "white", borderColor: "white", ml: 1 }}
                >
                    {"Export Weekly Sales"}
                </Button>
            </Box>

            <Grid item style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" }}>
                <Typography variant="body1" style={{ marginRight: "10px" }} color="white.main">Region:</Typography>
                <Dropdown
                    items={availableRegions.map((region) => ({ value: region, text: region }))}
                    value={selectedRegion}
                    onChange={(event) => setSelectedRegion(event.target.value)}
                />
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Card title="Monthly Revenue">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h3" fontWeight="bold" color="secondary.main">{formatNumber(data?.monthlyRevenue?.value, "%", false)}</Typography>
                            <Grid item display="flex" flexDirection="row">
                                <Typography variant="body" color={data?.monthlyRevenue?.change > 0 ? "success.main" : "error.main"}>
                                    {formatNumber(data?.monthlyRevenue?.change, "%")}
                                </Typography>
                                <Typography variant="body" color="secondary.main" ml={1}>
                                    {"than last month"}
                                </Typography>
                            </Grid>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card title="New Customers">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h3" fontWeight="bold" color="secondary.main">{formatNumber(data?.newCustomers?.value, "", false)}</Typography>
                            <Grid item display="flex" flexDirection="row">
                                <Typography variant="body" color={data?.newCustomers?.change > 0 ? "success.main" : "error.main"}>
                                    {formatNumber(data?.newCustomers?.change, "%")}
                                </Typography>
                                <Typography variant="body" color="secondary.main" ml={1}>
                                    {"than last month"}
                                </Typography>
                            </Grid>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card title="Active Subscriptions">
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h3" fontWeight="bold" color="secondary.main">{formatNumber(data?.activeSubscriptions?.value, "", false)}</Typography>
                            <Grid item display="flex" flexDirection="row">
                                <Typography variant="body" color={data?.activeSubscriptions?.change > 0 ? "success.main" : "error.main"}>
                                    {formatNumber(data?.activeSubscriptions?.change, "%")}
                                </Typography>
                                <Typography variant="body" color="secondary.main" ml={1}>
                                    {"than last month"}
                                </Typography>
                            </Grid>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card
                        title="Weekly Sales"
                        footer={(
                            <Grid sx={{ width: "100%", borderTop: "1px solid gray" }}>
                                <Typography variant="body2" component="p" sx={{ marginTop: "10px" }}>{"🕗 averages (last month)"}</Typography>
                            </Grid>
                        )}
                        footerBackgroundColor="white"
                        footerColor="gray"
                    >
                        <Plot
                            data={[
                                {
                                    x: ["M", "T", "W", "T", "F", "S", "S"],
                                    y: data?.weeklySales,
                                    type: "bar",
                                    color: "third",
                                },
                            ]}
                            showLegend={false}
                            title="Number of transactions per day"
                            titleColor="primary"
                            titleFontSize={16}
                            displayBar={false}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card
                        title="Revenue Trend"
                        footer={(
                            <Grid sx={{ width: "100%", borderTop: "1px solid gray" }}>
                                <Typography variant="body2" component="p" sx={{ marginTop: "10px" }}>{"🕗 updated 4min ago"}</Typography>
                            </Grid>
                        )}
                        footerBackgroundColor="white"
                        footerColor="gray"
                    >
                        <Plot
                            data={[{
                                x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Dec"],
                                y: data?.revenueTrend,
                                type: "lines+markers",
                                color: "third",
                            }]}
                            showLegend={false}
                            title="15% increase in revenue this month"
                            titleColor="primary"
                            titleFontSize={16}
                            displayBar={false}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card
                        title="Customer Satisfaction"
                        footer={(
                            <Grid sx={{ width: "100%", borderTop: "1px solid gray" }}>
                                <Typography variant="body2" component="p" sx={{ marginTop: "10px" }}>{"🕗 just updated"}</Typography>
                            </Grid>
                        )}
                        footerBackgroundColor="white"
                        footerColor="gray"
                    >
                        <Plot
                            data={[{
                                x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Dec"],
                                y: data?.customerSatisfaction,
                                type: "lines+markers",
                                color: "third",
                            }]}
                            showLegend={false}
                            title="Customer satisfaction score over time"
                            titleColor="primary"
                            titleFontSize={16}
                            displayBar={false}
                        />
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
