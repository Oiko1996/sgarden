import { memo, useCallback, useState } from "react";
import useSWR from "swr";
import {
	Box,
	Button,
	Grid,
	MenuItem,
	Paper,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";

import { getReports, createReport, deleteReport } from "../api/index.js";
import { dayjs, useSnackbar } from "../utils/index.js";

const CHART_OPTIONS = [
	{ value: "bar", label: "Bar" },
	{ value: "line", label: "Line" },
	{ value: "pie", label: "Pie" },
];

const formatTimestamp = (value) => {
	if (!value) return "";
	const d = dayjs(value);
	return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : "";
};

const Reports = () => {
	const { success, error } = useSnackbar();
	const [wizardOpen, setWizardOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [chartType, setChartType] = useState("bar");
	const [isSaving, setIsSaving] = useState(false);

	const { data, mutate, isLoading } = useSWR("reports", () => getReports());

	const rows = data?.rows || [];

	const onOpenWizard = useCallback(() => {
		setTitle("");
		setChartType("bar");
		setWizardOpen(true);
	}, []);

	const onCloseWizard = useCallback(() => {
		setWizardOpen(false);
	}, []);

	const onSave = useCallback(async () => {
		if (!title.trim()) {
			error("Title is required");
			return;
		}

		setIsSaving(true);
		try {
			const response = await createReport({ title: title.trim(), chartType, config: {} });
			if (response?.success) {
				success("Report saved");
				setWizardOpen(false);
				await mutate();
			} else {
				error(response?.message || "Failed to save report");
			}
		} catch {
			error("Failed to save report");
		}

		setIsSaving(false);
	}, [chartType, error, mutate, success, title]);

	const onDelete = useCallback(async (id) => {
		try {
			const response = await deleteReport(id);
			if (response?.success) {
				success("Report deleted");
				await mutate();
			} else {
				error(response?.message || "Failed to delete report");
			}
		} catch {
			error("Failed to delete report");
		}
	}, [error, mutate, success]);

	return (
		<Box data-testid="reports-page" sx={{ width: "100%", p: 2 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
				<Typography variant="h5" sx={{ color: "white" }}>
					{"Reports"}
				</Typography>
				<Button
					variant="contained"
					color="secondary"
					data-testid="reports-create-button"
					onClick={onOpenWizard}
				>
					{"Create Report"}
				</Button>
			</Stack>

			{wizardOpen && (
				<Paper data-testid="report-wizard" sx={{ p: 3, mb: 2 }}>
					<Typography variant="h6" sx={{ mb: 2 }}>{"New Report"}</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label="Title"
								value={title}
								inputProps={{ "data-testid": "report-wizard-title" }}
								onChange={(event) => setTitle(event.target.value)}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Select
								fullWidth
								value={chartType}
								data-testid="report-wizard-chart-select"
								onChange={(event) => setChartType(event.target.value)}
							>
								{CHART_OPTIONS.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</Select>
						</Grid>
						<Grid item xs={12} display="flex" justifyContent="flex-end">
							<Stack direction="row" spacing={1}>
								<Button
									variant="outlined"
									color="secondary"
									disabled={isSaving}
									onClick={onCloseWizard}
								>
									{"Cancel"}
								</Button>
								<Button
									variant="contained"
									color="secondary"
									disabled={isSaving}
									data-testid="report-wizard-save"
									onClick={onSave}
								>
									{"Save"}
								</Button>
							</Stack>
						</Grid>
					</Grid>
				</Paper>
			)}

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>{"Title"}</TableCell>
							<TableCell>{"Chart Type"}</TableCell>
							<TableCell>{"Created"}</TableCell>
							<TableCell align="right">{"Actions"}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading && (
							<TableRow>
								<TableCell colSpan={4}>{"Loading..."}</TableCell>
							</TableRow>
						)}
						{!isLoading && rows.length === 0 && (
							<TableRow>
								<TableCell colSpan={4}>{"No reports saved yet."}</TableCell>
							</TableRow>
						)}
						{!isLoading && rows.map((row) => (
							<TableRow key={row._id}>
								<TableCell>{row.title}</TableCell>
								<TableCell>{row.chartType}</TableCell>
								<TableCell>{formatTimestamp(row.createdAt)}</TableCell>
								<TableCell align="right">
									<Button
										size="small"
										color="error"
										onClick={() => onDelete(row._id)}
									>
										{"Delete"}
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default memo(Reports);
