import { memo, useCallback, useEffect, useState } from "react";
import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Stack,
	Switch,
	Typography,
} from "@mui/material";

import Spinner from "../components/Spinner.js";
import { getMySettings, updateMySettings } from "../api/index.js";
import { useSnackbar } from "../utils/index.js";
import useGlobalState from "../use-global-state.js";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DASHBOARD_OPTIONS = [
	{ value: "dashboard", label: "Overview" },
	{ value: "dashboard1", label: "Analytics" },
	{ value: "dashboard2", label: "Insights" },
];
const DATE_FORMAT_OPTIONS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];

const Settings = () => {
	const { success, error } = useSnackbar();
	const setDefaultPageSize = useGlobalState((state) => state.setDefaultPageSize);
	const [isLoading, setIsLoading] = useState(false);
	const [pageSize, setPageSize] = useState(10);
	const [defaultDashboard, setDefaultDashboard] = useState("dashboard");
	const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	const loadSettings = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await getMySettings();
			if (response?.success && response.settings) {
				const s = response.settings;
				setPageSize(s.pageSize || 10);
				setDefaultDashboard(s.defaultDashboard || "dashboard");
				setDateFormat(s.dateFormat || "DD/MM/YYYY");
				setSidebarCollapsed(Boolean(s.sidebarCollapsed));
			} else {
				error("Failed to load settings");
			}
		} catch {
			error("Failed to load settings");
		}

		setIsLoading(false);
	}, [error]);

	useEffect(() => {
		loadSettings();
	}, [loadSettings]);

	const onSave = useCallback(async () => {
		setIsLoading(true);
		try {
			const payload = {
				pageSize: Number(pageSize),
				defaultDashboard,
				dateFormat,
				sidebarCollapsed,
			};
			const response = await updateMySettings(payload);
			if (response?.success && response.settings) {
				success("Settings saved");
				if (typeof setDefaultPageSize === "function") {
					setDefaultPageSize(response.settings.pageSize);
				}
			} else {
				error(response?.message || "Failed to save settings");
			}
		} catch {
			error("Failed to save settings");
		}

		setIsLoading(false);
	}, [dateFormat, defaultDashboard, error, pageSize, setDefaultPageSize, sidebarCollapsed, success]);

	return (
		<Box data-testid="settings-page" sx={{ width: "100%", p: 2 }}>
			<Spinner open={isLoading} />
			<Typography variant="h5" sx={{ color: "white", mb: 2 }}>
				{"User Preferences"}
			</Typography>

			<Paper sx={{ p: 3 }}>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<InputLabel>{"Page size"}</InputLabel>
							<Select
								label="Page size"
								value={pageSize}
								data-testid="settings-page-size"
								onChange={(event) => setPageSize(event.target.value)}
							>
								{PAGE_SIZE_OPTIONS.map((option) => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<InputLabel>{"Default dashboard"}</InputLabel>
							<Select
								label="Default dashboard"
								value={defaultDashboard}
								data-testid="settings-default-dashboard"
								onChange={(event) => setDefaultDashboard(event.target.value)}
							>
								{DASHBOARD_OPTIONS.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<InputLabel>{"Date format"}</InputLabel>
							<Select
								label="Date format"
								value={dateFormat}
								data-testid="settings-date-format"
								onChange={(event) => setDateFormat(event.target.value)}
							>
								{DATE_FORMAT_OPTIONS.map((option) => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControlLabel
							label="Collapse sidebar by default"
							control={(
								<Switch
									checked={sidebarCollapsed}
									data-testid="settings-sidebar-collapsed"
									onChange={(event) => setSidebarCollapsed(event.target.checked)}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} display="flex" justifyContent="flex-end">
						<Stack direction="row" spacing={1}>
							<Button
								variant="contained"
								color="secondary"
								data-testid="settings-save-button"
								onClick={onSave}
							>
								{"Save"}
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	);
};

export default memo(Settings);
