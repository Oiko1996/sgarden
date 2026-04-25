import { useEffect, useState } from "react";
import { Grid, Typography, Box, IconButton, Button } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DownloadIcon from "@mui/icons-material/Download";
import Dropdown from "../components/Dropdown.js";
import Card from "../components/Card.js";
import Plot from "../components/Plot.js";

import { getData } from "../api/index.js";
import useBookmarksState from "../use-bookmarks-state.js";
import { downloadCsv } from "../utils/csv-export.js";

const availableRegions = ["Thessaloniki", "Athens", "Patras"];

const monthLabels = ["January", "February", "March", "April", "May", "June"];

const Dashboard = () => {
    const [selectedRegion, setSelectedRegion] = useState("Thessaloniki");
    const [data, setData] = useState({ quarterlySalesDistribution: {}, budgetVsActual: {}, timePlot: {} });
    const bookmarks = useBookmarksState((state) => state.bookmarks);
    const toggleBookmark = useBookmarksState((state) => state.toggle);
    const isBookmarked = bookmarks.includes("dashboard2");

    const handleExportQuarterlySales = () => {
        const distribution = data?.quarterlySalesDistribution || {};
        const quarters = ["Q1", "Q2", "Q3"];
        const rows = [];
        for (const quarter of quarters) {
            const values = distribution[quarter] || [];
            for (const value of values) rows.push([quarter, value]);
        }

        downloadCsv("quarterly-sales.csv", rows, ["Quarter", "Value"]);
    };

    const handleExportBudgetVsActual = () => {
        const budgetMap = data?.budgetVsActual || {};
        const entries = Object.values(budgetMap);
        const rows = monthLabels.map((month, index) => {
            const entry = entries[index] || {};
            return [month, entry.budget ?? "", entry.actual ?? "", entry.forecast ?? ""];
        });
        downloadCsv("budget-vs-actual.csv", rows, ["Month", "Budget", "Actual", "Forecast"]);
    };

    const handleExportPerformance = () => {
        const timePlot = data?.timePlot || {};
        const projected = timePlot.projected || [];
        const actual = timePlot.actual || [];
        const historical = timePlot.historicalAvg || [];
        const length = Math.max(projected.length, actual.length, historical.length);
        const rows = [];
        for (let index = 0; index < length; index++) {
            rows.push([index + 1, projected[index] ?? "", actual[index] ?? "", historical[index] ?? ""]);
        }

        downloadCsv("performance.csv", rows, ["Period", "Projected", "Actual", "HistoricalAvg"]);
    };

    useEffect(() => {
        getData().then((tempData) => {
            const { success, quarterlySalesDistribution, budgetVsActual, timePlot } = tempData;

            if (success) {
                setData({ quarterlySalesDistribution, budgetVsActual, timePlot });
            }
        });
    }, [selectedRegion]);

    return (
        <Grid container py={2} flexDirection="column">
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="h4" gutterBottom color="white.main" sx={{ mb: 0 }}>
                    Insights
                </Typography>
                <IconButton
                    data-testid="bookmark-toggle-dashboard2"
                    aria-label="Toggle bookmark for dashboard2"
                    onClick={() => toggleBookmark("dashboard2")}
                    sx={{ color: "white" }}
                >
                    {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
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
                <Grid item sm={12} md={6}>
                    <Card title="Quarterly Sales Distribution">
                        <Box display="flex" justifyContent="flex-end" mb={1}>
                            <Button
                                data-testid="export-csv-quarterly-sales"
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={handleExportQuarterlySales}
                            >
                                {"Export CSV"}
                            </Button>
                        </Box>
                        <Plot
                            data={[
                                {
                                    title: "Q1",
                                    y: data?.quarterlySalesDistribution?.Q1,
                                    type: "box",
                                    color: "primary",
                                },
                                {
                                    title: "Q2",
                                    y: data?.quarterlySalesDistribution?.Q2,
                                    type: "box",
                                    color: "secondary",
                                },
                                {
                                    title: "Q3",
                                    y: data?.quarterlySalesDistribution?.Q3,
                                    type: "box",
                                    color: "third",
                                },
                            ]}
                            showLegend={false}
                            displayBar={false}
                            height="300px"
                            marginBottom="40"
                        />
                    </Card>
                </Grid>
                <Grid item sm={12} md={6}>
                    <Card title="Budget vs Actual Spending">
                        <Box display="flex" justifyContent="flex-end" mb={1}>
                            <Button
                                data-testid="export-csv-budget-vs-actual"
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={handleExportBudgetVsActual}
                            >
                                {"Export CSV"}
                            </Button>
                        </Box>
                        <Plot
                            data={[
                                {
                                    x: ["January", "February", "March", "April", "May", "June"],
                                    y: Object.values(data?.budgetVsActual).map(month => month.budget),
                                    type: "bar",
                                    color: "primary",
                                    title: "Budget",
                                },
                                {
                                    x: ["January", "February", "March", "April", "May", "June"],
                                    y: Object.values(data?.budgetVsActual).map(month => month.actual),
                                    type: "bar",
                                    color: "secondary",
                                    title: "Actual",
                                },
                                {
                                    x: ["January", "February", "March", "April", "May", "June"],
                                    y: Object.values(data?.budgetVsActual).map(month => month.forecast),
                                    type: "bar",
                                    color: "third",
                                    title: "Forecast",
                                },
                            ]}
                            showLegend={true}
                            displayBar={false}
                            height="300px"
                            marginBottom="40"
                        />
                    </Card>
                </Grid>
                <Grid item sm={12}>
                    <Card title="Performance Over Time">
                        <Box display="flex" justifyContent="flex-end" mb={1}>
                            <Button
                                data-testid="export-csv-performance"
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={handleExportPerformance}
                            >
                                {"Export CSV"}
                            </Button>
                        </Box>
                        <Plot
                            data={[
                                {
                                    title: "Projected",
                                    x: Array.from({ length: 20 }, (_, i) => i + 1),
                                    y: data?.timePlot?.projected,
                                    type: "line",
                                    color: "primary",
                                },
                                {
                                    title: "Actual",
                                    x: Array.from({ length: 20 }, (_, i) => i + 1),
                                    y: data?.timePlot?.actual,
                                    type: "line",
                                    color: "secondary",
                                },
                                {
                                    title: "Historical Avg",
                                    x: Array.from({ length: 20 }, (_, i) => i + 1),
                                    y: data?.timePlot?.historicalAvg,
                                    type: "line",
                                    color: "third",
                                },
                            ]}
                            showLegend={true}
                            displayBar={false}
                            height="300px"
                            marginBottom="40"
                        />
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
