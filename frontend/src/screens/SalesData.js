import { memo, useState } from "react";
import useSWR from "swr";
import {
	Box,
	Button,
	Grid,
	MenuItem,
	Paper,
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

import {
	getSalesRecords,
	createSalesRecord,
	deleteSalesRecord,
} from "../api/index.js";
import { useSnackbar } from "../utils/index.js";

const MONTHS = [
	{ value: 1, label: "January" },
	{ value: 2, label: "February" },
	{ value: 3, label: "March" },
	{ value: 4, label: "April" },
	{ value: 5, label: "May" },
	{ value: 6, label: "June" },
	{ value: 7, label: "July" },
	{ value: 8, label: "August" },
	{ value: 9, label: "September" },
	{ value: 10, label: "October" },
	{ value: 11, label: "November" },
	{ value: 12, label: "December" },
];

const CURRENT_YEAR = new Date().getFullYear();

const blankForm = () => ({
	category: "",
	month: "",
	year: String(CURRENT_YEAR),
	value: "",
	unit: "EUR",
	notes: "",
});

const SalesData = () => {
	const { success, error } = useSnackbar();
	const [showForm, setShowForm] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState(blankForm());

	const { data, mutate, isLoading } = useSWR("sales-records", () => getSalesRecords());
	const rows = data?.rows || [];

	const handleField = (field) => (event) => {
		const value = event?.target ? event.target.value : event;
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const onAdd = () => {
		setForm(blankForm());
		setShowForm(true);
	};

	const onCancel = () => {
		setForm(blankForm());
		setShowForm(false);
	};

	const onSubmit = async (event) => {
		event?.preventDefault?.();
		if (!form.category || !form.month || !form.year || form.value === "") {
			error("Please fill in category, month, year and value");
			return;
		}

		setSubmitting(true);
		try {
			const payload = {
				category: form.category,
				month: Number.parseInt(form.month, 10),
				year: Number.parseInt(form.year, 10),
				value: Number.parseFloat(form.value),
				unit: form.unit,
				notes: form.notes,
			};
			const response = await createSalesRecord(payload);
			if (response?.success) {
				success("Sales record added");
				setShowForm(false);
				setForm(blankForm());
				mutate();
			} else {
				error(response?.message || "Failed to add record");
			}
		} catch {
			error("Failed to add record");
		}

		setSubmitting(false);
	};

	const onDelete = async (id) => {
		try {
			const response = await deleteSalesRecord(id);
			if (response?.success) {
				success("Record removed");
				mutate();
			} else {
				error("Failed to remove record");
			}
		} catch {
			error("Failed to remove record");
		}
	};

	return (
		<Box data-testid="sales-data-page" sx={{ width: "100%", p: 2 }}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
				<Typography variant="h5" sx={{ color: "white" }}>
					{"Sales Records"}
				</Typography>
				<Button
					variant="contained"
					color="primary"
					data-testid="sales-data-add-button"
					onClick={onAdd}
				>
					{"Add Record"}
				</Button>
			</Stack>

			{showForm && (
				<Paper
					component="form"
					data-testid="sales-data-form"
					sx={{ p: 2, mb: 2 }}
					onSubmit={onSubmit}
				>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								fullWidth
								label="Category"
								value={form.category}
								data-testid="sales-data-field-category"
								onChange={handleField("category")}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								select
								fullWidth
								label="Month"
								value={form.month}
								data-testid="sales-data-field-month"
								onChange={handleField("month")}
							>
								{MONTHS.map((m) => (
									<MenuItem key={m.value} value={m.value}>
										{m.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								fullWidth
								type="number"
								label="Year"
								value={form.year}
								data-testid="sales-data-field-year"
								onChange={handleField("year")}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								fullWidth
								type="number"
								label="Value"
								value={form.value}
								data-testid="sales-data-field-value"
								onChange={handleField("value")}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								fullWidth
								label="Unit"
								value={form.unit}
								data-testid="sales-data-field-unit"
								onChange={handleField("unit")}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								fullWidth
								label="Notes"
								multiline
								minRows={1}
								value={form.notes}
								data-testid="sales-data-field-notes"
								onChange={handleField("notes")}
							/>
						</Grid>
					</Grid>
					<Stack direction="row" spacing={2} sx={{ mt: 2 }} justifyContent="flex-end">
						<Button
							variant="outlined"
							color="secondary"
							data-testid="sales-data-form-cancel"
							onClick={onCancel}
						>
							{"Cancel"}
						</Button>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							disabled={submitting}
							data-testid="sales-data-form-submit"
						>
							{"Save"}
						</Button>
					</Stack>
				</Paper>
			)}

			<TableContainer component={Paper}>
				<Table data-testid="sales-data-table">
					<TableHead>
						<TableRow>
							<TableCell>{"Category"}</TableCell>
							<TableCell>{"Month"}</TableCell>
							<TableCell>{"Year"}</TableCell>
							<TableCell>{"Value"}</TableCell>
							<TableCell>{"Unit"}</TableCell>
							<TableCell>{"Notes"}</TableCell>
							<TableCell>{""}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading && (
							<TableRow>
								<TableCell colSpan={7}>{"Loading..."}</TableCell>
							</TableRow>
						)}
						{!isLoading && rows.length === 0 && (
							<TableRow>
								<TableCell colSpan={7}>{"No sales records yet."}</TableCell>
							</TableRow>
						)}
						{!isLoading && rows.map((row) => (
							<TableRow key={row._id}>
								<TableCell>{row.category}</TableCell>
								<TableCell>{row.month}</TableCell>
								<TableCell>{row.year}</TableCell>
								<TableCell>{row.value}</TableCell>
								<TableCell>{row.unit}</TableCell>
								<TableCell>{row.notes}</TableCell>
								<TableCell>
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

export default memo(SalesData);
