import { useEffect, useState } from "react";
import useSWR from "swr";
import { Grid, Typography, Box, Button, MenuItem, Select, Chip, IconButton, TextField, Drawer, Stack, List, ListItem, ListItemText, Divider } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Dropdown from "../components/Dropdown.js";
import Card from "../components/Card.js";
import Plot from "../components/Plot.js";
import DatePicker from "../components/DatePicker.js";
import Map from "../components/Map.js";
import useBookmarksState from "../use-bookmarks-state.js";
import useFilterPersistence from "../use-filter-persistence.js";
import { getNotes, createNote, deleteNote } from "../api/index.js";

import colors from "../_colors.scss";

const availableRegions = ["Thessaloniki", "Athens", "Patras"];
const availableMetrics = ["Revenue", "Expenses", "Profit", "Growth Rate"];
const filterMetricOptions = ["Revenue", "Customers", "Subscriptions"];
const generateRandomData = (min = 0, max = 10) => Math.random() * (max - min) + min;
const randomDate = () => new Date(new Date(2020, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2020, 0, 1).getTime()));

const toDayjs = (value) => (value ? dayjs(value) : null);
const toIso = (value) => (value && dayjs(value).isValid() ? dayjs(value).toISOString() : null);

const Dashboard = () => {
    const [selectedRegion, setSelectedRegion] = useState("Thessaloniki");
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [fromDate, setFromDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    const [toDate, setToDate] = useState(new Date());
    const [months, setMonths] = useState([]);
    const [data, setData] = useState({ keyMetric: { date: randomDate(), value: generateRandomData(0, 100) }, revenue: [], expenses: [], profit: [], growthRate: [] });

    const bookmarks = useBookmarksState((state) => state.bookmarks);
    const toggleBookmark = useBookmarksState((state) => state.toggle);
    const isBookmarked = bookmarks.includes("dashboard1");

    const [filterMetric, setFilterMetric, resetFilterMetric] = useFilterPersistence("sgarden-filter-metric", "Revenue");
    const [filterDateFrom, setFilterDateFrom, resetFilterDateFrom] = useFilterPersistence("sgarden-filter-date-from", null);
    const [filterDateTo, setFilterDateTo, resetFilterDateTo] = useFilterPersistence("sgarden-filter-date-to", null);

    const handleResetFilters = () => {
        resetFilterMetric();
        resetFilterDateFrom();
        resetFilterDateTo();
    };

    const [notesOpen, setNotesOpen] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [compareOpen, setCompareOpen] = useState(false);

    const { data: notesData, mutate: mutateNotes } = useSWR(notesOpen ? "notes" : null, () => getNotes().catch(() => ({ notes: [] })));
    const notes = (notesData && notesData.notes) || [];

    const handleAddNote = async () => {
        const trimmed = noteText.trim();
        if (!trimmed) return;
        try {
            await createNote({ text: trimmed });
            setNoteText("");
            mutateNotes();
        } catch {
            mutateNotes();
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await deleteNote(id);
        } catch {
            // re-sync below
        }

        mutateNotes();
    };

    const changePlotData = (fromD, toD) => {
        if (fromD && toD) {
            const from = new Date(fromD);
            const to = new Date(toD);
            const months = [];
            while (from <= to) {
                months.push(from.toLocaleString("en-GB", { month: "short", year: "numeric" }));
                from.setMonth(from.getMonth() + 1);
            }
            setMonths(months);

            const revenue = months.map((month) => generateRandomData(0, 20));
            const expenses = months.map((month) => generateRandomData(0, 30));
            const profit = months.map((month) => generateRandomData(0, 40));
            const growthRate = months.map((month) => generateRandomData(0, 50));
            setData({ revenue, expenses, profit, growthRate, keyMetric: data.keyMetric });
        }
    };

    const changeKeyMetricData = () => {
        const keyMetric = { date: randomDate(), value: generateRandomData(0, 100) };
        setData({ ...data, keyMetric });
    };

    useEffect(() => {
        changePlotData(fromDate, toDate);
    }, [fromDate, toDate]);

    useEffect(() => {
        changeKeyMetricData();
    }, [selectedMetric]);

    useEffect(() => {
        changeKeyMetricData();
        changePlotData(fromDate, toDate);
    }, [selectedRegion]);

    const halfIndex = Math.max(1, Math.floor(months.length / 2));
    const previousPeriod = {
        months: months.slice(0, halfIndex),
        revenue: data.revenue.slice(0, halfIndex),
        expenses: data.expenses.slice(0, halfIndex),
    };
    const currentPeriod = {
        months: months.slice(halfIndex),
        revenue: data.revenue.slice(halfIndex),
        expenses: data.expenses.slice(halfIndex),
    };
    const avg = (arr) => (arr.length ? (arr.reduce((acc, curr) => acc + curr, 0) / arr.length).toFixed(2) : "0.00");

    return (
        <Grid container py={2} flexDirection="column">
            <Box display="flex" alignItems="center" gap={1} mb={1} flexWrap="wrap">
                <Typography variant="h4" gutterBottom color="white.main" sx={{ mb: 0 }}>
                    Analytics
                </Typography>
                <IconButton
                    data-testid="bookmark-toggle-dashboard1"
                    aria-label="Toggle bookmark for dashboard1"
                    onClick={() => toggleBookmark("dashboard1")}
                    sx={{ color: "white" }}
                >
                    {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
                {isBookmarked && (
                    <Chip
                        data-testid="bookmark-active-dashboard1"
                        label="Bookmarked"
                        color="primary"
                        size="small"
                        icon={<BookmarkIcon />}
                    />
                )}
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    data-testid="notes-toggle-button"
                    variant="contained"
                    color="primary"
                    onClick={() => setNotesOpen((prev) => !prev)}
                >
                    {"Notes"}
                </Button>
                <Button
                    data-testid="compare-toggle"
                    variant="contained"
                    color="secondary"
                    onClick={() => setCompareOpen((prev) => !prev)}
                >
                    {compareOpen ? "Hide Compare" : "Compare"}
                </Button>
            </Box>

            {compareOpen && (
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                        <Button
                            data-testid="compare-close"
                            variant="outlined"
                            color="secondary"
                            startIcon={<CloseIcon />}
                            onClick={() => setCompareOpen(false)}
                            sx={{ color: "white", borderColor: "white" }}
                        >
                            {"Close Compare"}
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box data-testid="compare-panel-left" p={2} sx={{ background: colors.greyDark, borderRadius: 1 }}>
                            <Typography variant="h6" color="primary.main" gutterBottom>
                                {"Previous Period"}
                            </Typography>
                            <Typography variant="body2" color="white.main">
                                {`Range: ${previousPeriod.months[0] || "-"} → ${previousPeriod.months[previousPeriod.months.length - 1] || "-"}`}
                            </Typography>
                            <Typography variant="body2" color="white.main">
                                {`Avg Revenue: ${avg(previousPeriod.revenue)}%`}
                            </Typography>
                            <Typography variant="body2" color="white.main">
                                {`Avg Expenses: ${avg(previousPeriod.expenses)}%`}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box data-testid="compare-panel-right" p={2} sx={{ background: colors.greyDark, borderRadius: 1 }}>
                            <Typography variant="h6" color="primary.main" gutterBottom>
                                {"Current Period"}
                            </Typography>
                            <Typography variant="body2" color="white.main">
                                {`Range: ${currentPeriod.months[0] || "-"} → ${currentPeriod.months[currentPeriod.months.length - 1] || "-"}`}
                            </Typography>
                            <Typography variant="body2" color="white.main">
                                {`Avg Revenue: ${avg(currentPeriod.revenue)}%`}
                            </Typography>
                            <Typography variant="body2" color="white.main">
                                {`Avg Expenses: ${avg(currentPeriod.expenses)}%`}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            )}

            <Drawer
                anchor="right"
                open={notesOpen}
                onClose={() => setNotesOpen(false)}
                PaperProps={{ sx: { width: { xs: "100%", sm: 380 }, p: 2 } }}
            >
                <Box data-testid="notes-panel" role="region" aria-label="Notes">
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">{"Notes"}</Typography>
                        <IconButton onClick={() => setNotesOpen(false)} aria-label="Close notes">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Stack direction="row" spacing={1} mb={2}>
                        <TextField
                            data-testid="notes-add-input"
                            fullWidth
                            size="small"
                            placeholder="Write a note..."
                            value={noteText}
                            onChange={(event) => setNoteText(event.target.value)}
                            inputProps={{ "aria-label": "New note" }}
                        />
                        <Button
                            data-testid="notes-add-submit"
                            variant="contained"
                            onClick={handleAddNote}
                        >
                            {"Add"}
                        </Button>
                    </Stack>
                    <Divider />
                    <List dense>
                        {notes.length === 0 && (
                            <ListItem>
                                <ListItemText primary="No notes yet" />
                            </ListItem>
                        )}
                        {notes.map((note) => (
                            <ListItem
                                key={note._id}
                                secondaryAction={(
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteNote(note._id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            >
                                <ListItemText
                                    primary={note.text}
                                    secondary={note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box
                display="flex"
                alignItems="center"
                gap={2}
                mb={2}
                p={2}
                flexWrap="wrap"
                sx={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 1 }}
            >
                <Typography variant="subtitle2" color="white.main">{"Filters:"}</Typography>
                <Box minWidth={160}>
                    <Select
                        data-testid="filter-metric"
                        value={filterMetric || ""}
                        onChange={(event) => setFilterMetric(event.target.value)}
                        size="small"
                        displayEmpty
                        fullWidth
                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                    >
                        {filterMetricOptions.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </Box>
                <Box data-testid="filter-date-from" minWidth={180}>
                    <MuiDatePicker
                        label="From"
                        value={toDayjs(filterDateFrom)}
                        onChange={(value) => setFilterDateFrom(toIso(value))}
                        renderInput={(params) => <TextField {...params} size="small" sx={{ backgroundColor: "white", borderRadius: 1 }} />}
                    />
                </Box>
                <Box data-testid="filter-date-to" minWidth={180}>
                    <MuiDatePicker
                        label="To"
                        value={toDayjs(filterDateTo)}
                        onChange={(value) => setFilterDateTo(toIso(value))}
                        renderInput={(params) => <TextField {...params} size="small" sx={{ backgroundColor: "white", borderRadius: 1 }} />}
                    />
                </Box>
                <Button
                    data-testid="filter-reset-button"
                    variant="outlined"
                    size="small"
                    startIcon={<RestartAltIcon />}
                    onClick={handleResetFilters}
                    sx={{ color: "white", borderColor: "white" }}
                >
                    {"Reset"}
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
                <Grid container item sm={12} md={4} spacing={4}>
                        <Grid item width="100%">
                            <Card
                                title="Key Metric"
                                footer={(
                                    <Box
                                        width="100%"
                                        height="100px"
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="center"
                                        alignItems="center"
                                        backgroundColor="greyDark.main"
                                        py={1}
                                    >
                                        {selectedMetric && (
                                            <>
                                                <Typography variant="body">
                                                    {`Latest value of ${selectedMetric} for ${selectedRegion}`}
                                                </Typography>
                                                <Typography variant="body1" fontWeight="bold" color="primary.main">
                                                    {`${data.keyMetric.date.toLocaleString("en-GB", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })} - ${data.keyMetric.value.toFixed(2)}%`}
                                                </Typography>
                                            </>
                                        )}
                                        {!selectedMetric && (
                                            <>
                                                <Typography variant="body1" fontWeight="bold" color="white.main">
                                                    {"No metric selected"}
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                )}
                            >
                                <Box height="100px" display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography width="fit-content" variant="subtitle1">Metric:</Typography>
                                    <Dropdown
                                        width="50%"
                                        height="40px"
                                        size="small"
                                        placeholder="Select"
                                        background="greyDark"
                                        items={availableMetrics.map((metric) => ({ value: metric, text: metric }))}
                                        value={selectedMetric}
                                        onChange={(event) => setSelectedMetric(event.target.value)}
                                    />
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item width="100%">
                            <Card title="Regional Overview">
                                <Map />
                            </Card>
                        </Grid>
                </Grid>

                <Grid item sm={12} md={8}>
                    <Card title="Trends">
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Grid item xs={12} sm={6} display="flex" flexDirection="row" alignItems="center">
                                <Typography variant="subtitle1" align="center" mr={2}>
                                    {"From: "}
                                </Typography>
                                <DatePicker
                                    width="200px"
                                    views={["month", "year"]}
                                    inputFormat="MM/YYYY"
                                    label="From"
                                    background="greyDark"
                                    value={fromDate}
                                    onChange={(value) => setFromDate(value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
                                <Typography variant="subtitle1" align="center" mr={2}>
                                    {"To: "}
                                </Typography>
                                <DatePicker
                                    width="200px"
                                    views={["month", "year"]}
                                    inputFormat="MM/YYYY"
                                    label="To"
                                    background="greyDark"
                                    value={toDate}
                                    onChange={(value) => setToDate(value)}
                                />
                            </Grid>
                        </Box>
                        <Grid container spacing={1} width="100%">
                            <Grid item xs={12} md={6}>
                                <Plot
                                    data={[
                                        {
                                            x: months,
                                            y: data.revenue,
                                            type: "lines",
                                            fill: "tozeroy",
                                            color: "third",
                                            line: { shape: "spline", smoothing: 1},
                                            markerSize: 0,
                                            hoverinfo: "none",
                                        },
                                        {
                                            x: months,
                                            y: data.revenue,
                                            type: "scatter",
                                            mode: "markers",
                                            color: "primary",
                                            markerSize: 10,
                                            name: "",
                                            hoverinfo: "none",
                                        },
                                    ]}
                                    showLegend={false}
                                    title="Revenue"
                                    titleColor="primary"
                                    titleFontSize={16}
                                    displayBar={false}
                                    height="250px"
                                    annotations={[
                                        {
                                            x: months[data.revenue.indexOf(Math.min(...data.revenue))],
                                            y: Math.min(...data.revenue),
                                            xref: "x",
                                            yref: "y",
                                            text: `Min: ${Math.min(...data.revenue).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                        {
                                            x: months[data.revenue.indexOf(Math.max(...data.revenue))],
                                            y: Math.max(...data.revenue),
                                            xref: "x",
                                            yref: "y",
                                            text: `Max: ${Math.max(...data.revenue).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                    ]}
                                />
                                <Typography variant="body1" textAlign="center">
                                    {`Average: ${(data.revenue.reduce((acc, curr) => acc + curr, 0) / data.revenue.length).toFixed(2)}%`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Plot
                                    data={[
                                        {
                                            x: months,
                                            y: data.expenses,
                                            type: "lines",
                                            fill: "tozeroy",
                                            color: "third",
                                            line: { shape: "spline", smoothing: 1},
                                            markerSize: 0,
                                            hoverinfo: "none",
                                        },
                                        {
                                            x: months,
                                            y: data.expenses,
                                            type: "scatter",
                                            mode: "markers",
                                            color: "primary",
                                            markerSize: 10,
                                            name: "",
                                            hoverinfo: "none",
                                        },
                                    ]}
                                    showLegend={false}
                                    title="Expenses"
                                    titleColor="primary"
                                    titleFontSize={16}
                                    displayBar={false}
                                    height="250px"
                                    annotations={[
                                        {
                                            x: months[data.expenses.indexOf(Math.min(...data.expenses))],
                                            y: Math.min(...data.expenses),
                                            xref: "x",
                                            yref: "y",
                                            text: `Min: ${Math.min(...data.expenses).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                        {
                                            x: months[data.expenses.indexOf(Math.max(...data.expenses))],
                                            y: Math.max(...data.expenses),
                                            xref: "x",
                                            yref: "y",
                                            text: `Max: ${Math.max(...data.expenses).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                    ]}
                                />
                                <Typography variant="body1" textAlign="center">
                                    {`Average: ${(data.expenses.reduce((acc, curr) => acc + curr, 0) / data.expenses.length).toFixed(2)}%`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Plot
                                    data={[
                                        {
                                            x: months,
                                            y: data.profit,
                                            type: "lines",
                                            fill: "tozeroy",
                                            color: "third",
                                            line: { shape: "spline", smoothing: 1},
                                            markerSize: 0,
                                            hoverinfo: "none",
                                        },
                                        {
                                            x: months,
                                            y: data.profit,
                                            type: "scatter",
                                            mode: "markers",
                                            color: "primary",
                                            markerSize: 10,
                                            name: "",
                                            hoverinfo: "none",
                                        },
                                    ]}
                                    showLegend={false}
                                    title="Profit"
                                    titleColor="primary"
                                    titleFontSize={16}
                                    displayBar={false}
                                    height="250px"
                                    annotations={[
                                        {
                                            x: months[data.profit.indexOf(Math.min(...data.profit))],
                                            y: Math.min(...data.profit),
                                            xref: "x",
                                            yref: "y",
                                            text: `Min: ${Math.min(...data.profit).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                        {
                                            x: months[data.profit.indexOf(Math.max(...data.profit))],
                                            y: Math.max(...data.profit),
                                            xref: "x",
                                            yref: "y",
                                            text: `Max: ${Math.max(...data.profit).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                    ]}
                                />
                                <Typography variant="body1" textAlign="center">
                                    {`Average: ${(data.profit.reduce((acc, curr) => acc + curr, 0) / data.profit.length).toFixed(2)}%`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Plot
                                    data={[
                                        {
                                            x: months,
                                            y: data.growthRate,
                                            type: "lines",
                                            fill: "tozeroy",
                                            color: "third",
                                            line: { shape: "spline", smoothing: 1},
                                            markerSize: 0,
                                            hoverinfo: "none",
                                        },
                                        {
                                            x: months,
                                            y: data.growthRate,
                                            type: "scatter",
                                            mode: "markers",
                                            color: "primary",
                                            markerSize: 10,
                                            name: "",
                                            hoverinfo: "none",
                                        },
                                    ]}
                                    showLegend={false}
                                    title="Growth Rate"
                                    titleColor="primary"
                                    titleFontSize={16}
                                    displayBar={false}
                                    height="250px"
                                    annotations={[
                                        {
                                            x: months[data.growthRate.indexOf(Math.min(...data.growthRate))],
                                            y: Math.min(...data.growthRate),
                                            xref: "x",
                                            yref: "y",
                                            text: `Min: ${Math.min(...data.growthRate).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                        {
                                            x: months[data.growthRate.indexOf(Math.max(...data.growthRate))],
                                            y: Math.max(...data.growthRate),
                                            xref: "x",
                                            yref: "y",
                                            text: `Max: ${Math.max(...data.growthRate).toFixed(2)}%`,
                                            showarrow: true,
                                            font: {
                                                size: 16,
                                                color: "#ffffff"
                                            },
                                            align: "center",
                                            arrowhead: 2,
                                            arrowsize: 1,
                                            arrowwidth: 2,
                                            arrowcolor: colors.primary,
                                            borderpad: 4,
                                            bgcolor: colors.primary,
                                            opacity: 0.8
                                        },
                                    ]}
                                />
                                <Typography variant="body1" textAlign="center">
                                    {`Average: ${(data.growthRate.reduce((acc, curr) => acc + curr, 0) / data.growthRate.length).toFixed(2)}%`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
