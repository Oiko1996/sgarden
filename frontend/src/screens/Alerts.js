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
	getAlertRules,
	createAlertRule,
	deleteAlertRule,
} from "../api/index.js";
import { useSnackbar } from "../utils/index.js";
import useNotificationState from "../use-notification-state.js";

const OPERATORS = [">", "<", ">=", "<="];

const blankForm = () => ({
	metric: "",
	operator: ">",
	threshold: "",
});

const Alerts = () => {
	const { success, error } = useSnackbar();
	const addNotification = useNotificationState((state) => state.addNotification);
	const [showForm, setShowForm] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState(blankForm());

	const { data, mutate, isLoading } = useSWR("alert-rules", () => getAlertRules());
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
		if (!form.metric || !form.operator || form.threshold === "") {
			error("Please fill in metric, operator and threshold");
			return;
		}

		setSubmitting(true);
		try {
			const payload = {
				metric: form.metric,
				operator: form.operator,
				threshold: Number.parseFloat(form.threshold),
			};
			const response = await createAlertRule(payload);
			if (response?.success) {
				success("Alert rule created");
				addNotification({
					type: "info",
					severity: "info",
					message: `Alert rule for ${payload.metric} created`,
				});
				setShowForm(false);
				setForm(blankForm());
				mutate();
			} else {
				error(response?.message || "Failed to create rule");
			}
		} catch {
			error("Failed to create rule");
		}

		setSubmitting(false);
	};

	const onDelete = async (id) => {
		try {
			const response = await deleteAlertRule(id);
			if (response?.success) {
				success("Rule removed");
				mutate();
			} else {
				error("Failed to remove rule");
			}
		} catch {
			error("Failed to remove rule");
		}
	};

	const isEmpty = !isLoading && rows.length === 0;

	return (
		<Box data-testid="alerts-page" sx={{ width: "100%", p: 2 }}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
				<Typography variant="h5" sx={{ color: "white" }}>
					{"Threshold Alerts"}
				</Typography>
				<Button
					variant="contained"
					color="primary"
					data-testid="alerts-add-button"
					onClick={onAdd}
				>
					{"Add Rule"}
				</Button>
			</Stack>

			{showForm && (
				<Paper
					component="form"
					data-testid="alerts-form"
					sx={{ p: 2, mb: 2 }}
					onSubmit={onSubmit}
				>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								fullWidth
								label="Metric"
								value={form.metric}
								data-testid="alerts-field-metric"
								onChange={handleField("metric")}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								select
								fullWidth
								label="Operator"
								value={form.operator}
								data-testid="alerts-field-operator"
								onChange={handleField("operator")}
							>
								{OPERATORS.map((op) => (
									<MenuItem key={op} value={op}>
										{op}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								fullWidth
								type="number"
								label="Threshold"
								value={form.threshold}
								data-testid="alerts-field-threshold"
								onChange={handleField("threshold")}
							/>
						</Grid>
					</Grid>
					<Stack direction="row" spacing={2} sx={{ mt: 2 }} justifyContent="flex-end">
						<Button
							variant="outlined"
							color="secondary"
							data-testid="alerts-form-cancel"
							onClick={onCancel}
						>
							{"Cancel"}
						</Button>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							disabled={submitting}
							data-testid="alerts-form-submit"
						>
							{"Save"}
						</Button>
					</Stack>
				</Paper>
			)}

			{isEmpty && (
				<Paper sx={{ p: 3, textAlign: "center" }} data-testid="alerts-empty">
					<Typography variant="body1">{"No alert rules yet."}</Typography>
				</Paper>
			)}

			{!isEmpty && (
				<TableContainer component={Paper}>
					<Table data-testid="alerts-table">
						<TableHead>
							<TableRow>
								<TableCell>{"Metric"}</TableCell>
								<TableCell>{"Operator"}</TableCell>
								<TableCell>{"Threshold"}</TableCell>
								<TableCell>{""}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{isLoading && (
								<TableRow>
									<TableCell colSpan={4}>{"Loading..."}</TableCell>
								</TableRow>
							)}
							{!isLoading && rows.map((row) => (
								<TableRow key={row._id}>
									<TableCell>{row.metric}</TableCell>
									<TableCell>{row.operator}</TableCell>
									<TableCell>{row.threshold}</TableCell>
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
			)}
		</Box>
	);
};

export default memo(Alerts);
