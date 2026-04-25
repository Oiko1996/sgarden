import { memo, useMemo, useState } from "react";
import useSWR from "swr";
import {
	Box,
	Grid,
	Paper,
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

import { getAudit } from "../api/index.js";
import { dayjs } from "../utils/index.js";

const PAGE_SIZE = 25;

const formatTimestamp = (value) => {
	if (!value) return "";
	const d = dayjs(value);
	return d.isValid() ? d.format("DD/MM/YYYY HH:mm:ss") : "";
};

const Audit = () => {
	const [actionFilter, setActionFilter] = useState("");
	const [dateFrom, setDateFrom] = useState(null);
	const [dateTo, setDateTo] = useState(null);

	const queryParams = useMemo(() => {
		const params = { page: 1, pageSize: PAGE_SIZE };
		if (actionFilter) params.action = actionFilter;
		if (dateFrom && dayjs(dateFrom).isValid()) params.dateFrom = dayjs(dateFrom).startOf("day").toISOString();
		if (dateTo && dayjs(dateTo).isValid()) params.dateTo = dayjs(dateTo).endOf("day").toISOString();
		return params;
	}, [actionFilter, dateFrom, dateTo]);

	const swrKey = useMemo(() => ["audit", JSON.stringify(queryParams)], [queryParams]);

	const { data, isLoading } = useSWR(swrKey, () => getAudit(queryParams));

	const rows = data?.rows || [];

	return (
		<Box data-testid="audit-page" sx={{ width: "100%", p: 2 }}>
			<Typography variant="h5" sx={{ color: "white", mb: 2 }}>
				{"Audit Trail"}
			</Typography>

			<Grid container spacing={2} sx={{ mb: 2 }}>
				<Grid item xs={12} sm={4}>
					<TextField
						fullWidth
						placeholder="Filter by action"
						value={actionFilter}
						data-testid="audit-filter-action"
						sx={{ backgroundColor: "white" }}
						onChange={(event) => setActionFilter(event.target.value)}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<Box data-testid="audit-filter-date-from" sx={{ backgroundColor: "white", borderRadius: 1 }}>
						<DesktopDatePicker
							label="From"
							inputFormat="DD/MM/YYYY"
							value={dateFrom}
							renderInput={(params) => <TextField {...params} fullWidth />}
							onChange={(value) => setDateFrom(value)}
						/>
					</Box>
				</Grid>
				<Grid item xs={12} sm={4}>
					<Box data-testid="audit-filter-date-to" sx={{ backgroundColor: "white", borderRadius: 1 }}>
						<DesktopDatePicker
							label="To"
							inputFormat="DD/MM/YYYY"
							value={dateTo}
							renderInput={(params) => <TextField {...params} fullWidth />}
							onChange={(value) => setDateTo(value)}
						/>
					</Box>
				</Grid>
			</Grid>

			<TableContainer component={Paper}>
				<Table data-testid="audit-table">
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
								<TableCell colSpan={4}>{"No audit entries recorded yet."}</TableCell>
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
		</Box>
	);
};

export default memo(Audit);
