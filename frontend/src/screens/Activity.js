import { memo, useMemo, useState } from "react";
import useSWR from "swr";
import {
	Box,
	Grid,
	MenuItem,
	Pagination,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";

import { getActivity } from "../api/index.js";
import { dayjs } from "../utils/index.js";

const PAGE_SIZE = 10;

const formatTimestamp = (value) => {
	if (!value) return "";
	const d = dayjs(value);
	return d.isValid() ? d.format("DD/MM/YYYY HH:mm:ss") : "";
};

const Activity = () => {
	const [userFilter, setUserFilter] = useState("");
	const [actionFilter, setActionFilter] = useState("");
	const [dateFrom, setDateFrom] = useState(null);
	const [dateTo, setDateTo] = useState(null);
	const [page, setPage] = useState(1);

	const queryParams = useMemo(() => {
		const params = { page, pageSize: PAGE_SIZE };
		if (userFilter) params.user = userFilter;
		if (actionFilter) params.action = actionFilter;
		if (dateFrom && dayjs(dateFrom).isValid()) params.dateFrom = dayjs(dateFrom).startOf("day").toISOString();
		if (dateTo && dayjs(dateTo).isValid()) params.dateTo = dayjs(dateTo).endOf("day").toISOString();
		return params;
	}, [actionFilter, dateFrom, dateTo, page, userFilter]);

	const swrKey = useMemo(() => ["activity", JSON.stringify(queryParams)], [queryParams]);

	const { data, isLoading } = useSWR(swrKey, () => getActivity(queryParams));

	const rows = data?.rows || [];
	const total = data?.total || 0;
	const users = data?.users || [];
	const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

	const handlePageChange = (_event, value) => setPage(value);

	const handleUserChange = (event) => {
		setUserFilter(event.target.value);
		setPage(1);
	};

	const handleActionChange = (event) => {
		setActionFilter(event.target.value);
		setPage(1);
	};

	const handleDateFromChange = (value) => {
		setDateFrom(value);
		setPage(1);
	};

	const handleDateToChange = (value) => {
		setDateTo(value);
		setPage(1);
	};

	return (
		<Box data-testid="activity-page" sx={{ width: "100%", p: 2 }}>
			<Typography variant="h5" sx={{ color: "white", mb: 2 }}>
				{"Activity Log"}
			</Typography>

			<Grid container spacing={2} sx={{ mb: 2 }}>
				<Grid item xs={12} sm={6} md={3}>
					<Select
						fullWidth
						displayEmpty
						value={userFilter}
						data-testid="activity-filter-user"
						sx={{ backgroundColor: "white" }}
						onChange={handleUserChange}
					>
						<MenuItem value="">{"All users"}</MenuItem>
						{users.map((u) => (
							<MenuItem key={u._id} value={u._id}>
								{u.username}
							</MenuItem>
						))}
					</Select>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<TextField
						fullWidth
						placeholder="Filter by action"
						value={actionFilter}
						data-testid="activity-filter-action"
						sx={{ backgroundColor: "white" }}
						onChange={handleActionChange}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Box data-testid="activity-filter-date-from" sx={{ backgroundColor: "white", borderRadius: 1 }}>
						<DesktopDatePicker
							label="From"
							inputFormat="DD/MM/YYYY"
							value={dateFrom}
							renderInput={(params) => <TextField {...params} fullWidth />}
							onChange={handleDateFromChange}
						/>
					</Box>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Box data-testid="activity-filter-date-to" sx={{ backgroundColor: "white", borderRadius: 1 }}>
						<DesktopDatePicker
							label="To"
							inputFormat="DD/MM/YYYY"
							value={dateTo}
							renderInput={(params) => <TextField {...params} fullWidth />}
							onChange={handleDateToChange}
						/>
					</Box>
				</Grid>
			</Grid>

			<TableContainer component={Paper} sx={{ mb: 2 }}>
				<Table data-testid="activity-table">
					<TableHead>
						<TableRow>
							<TableCell>{"Timestamp"}</TableCell>
							<TableCell>{"User"}</TableCell>
							<TableCell>{"Action"}</TableCell>
							<TableCell>{"Target"}</TableCell>
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
								<TableCell colSpan={4}>{"No activity recorded yet."}</TableCell>
							</TableRow>
						)}
						{!isLoading && rows.map((row) => (
							<TableRow key={row._id}>
								<TableCell>{formatTimestamp(row.createdAt)}</TableCell>
								<TableCell>{row.user?.username || "—"}</TableCell>
								<TableCell>{row.action}</TableCell>
								<TableCell>{row.target}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Box
				data-testid="activity-pagination"
				sx={{ display: "flex", justifyContent: "center", backgroundColor: "white", borderRadius: 1, py: 1 }}
			>
				<Pagination
					count={pageCount}
					page={page}
					color="primary"
					onChange={handlePageChange}
				/>
			</Box>
		</Box>
	);
};

export default memo(Activity);
