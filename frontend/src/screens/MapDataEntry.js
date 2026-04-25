import { memo, useState } from "react";
import useSWR from "swr";
import {
	Box,
	Button,
	Grid,
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
	getMapDataEntries,
	createMapDataEntry,
} from "../api/index.js";
import { useSnackbar } from "../utils/index.js";

const REGIONS = [
	{ slug: "north", label: "North" },
	{ slug: "south", label: "South" },
	{ slug: "east", label: "East" },
	{ slug: "west", label: "West" },
	{ slug: "central", label: "Central" },
];

const blankForm = (regionLabel = "") => ({
	regionName: regionLabel,
	category: "",
	revenue: "",
});

const MapDataEntry = () => {
	const { success, error } = useSnackbar();
	const [selectedRegion, setSelectedRegion] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState(blankForm());

	const { data, mutate, isLoading } = useSWR("map-data-entries", () => getMapDataEntries());
	const rows = data?.rows || [];

	const handleRegionClick = (region) => {
		setSelectedRegion(region);
		setForm(blankForm(region.label));
	};

	const handleField = (field) => (event) => {
		const value = event?.target ? event.target.value : event;
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const onSubmit = async (event) => {
		event?.preventDefault?.();
		if (!form.regionName || !form.category || form.revenue === "") {
			error("Please fill in region, category and revenue");
			return;
		}

		setSubmitting(true);
		try {
			const payload = {
				regionName: form.regionName,
				category: form.category,
				revenue: Number.parseFloat(form.revenue),
			};
			const response = await createMapDataEntry(payload);
			if (response?.success) {
				success("Entry saved");
				setForm(blankForm(selectedRegion?.label || ""));
				mutate();
			} else {
				error(response?.message || "Failed to save entry");
			}
		} catch {
			error("Failed to save entry");
		}

		setSubmitting(false);
	};

	return (
		<Box data-testid="map-page" sx={{ width: "100%", p: 2 }}>
			<Typography variant="h5" sx={{ color: "white", mb: 2 }}>
				{"Regional Data Entry"}
			</Typography>

			<Paper sx={{ p: 2, mb: 2 }}>
				<Typography variant="subtitle1" sx={{ mb: 2 }}>
					{"Click a region to record sales data"}
				</Typography>
				<Grid container spacing={2}>
					{REGIONS.map((region) => {
						const isActive = selectedRegion?.slug === region.slug;
						return (
							<Grid item xs={6} sm={4} md={2} key={region.slug}>
								<Button
									fullWidth
									variant={isActive ? "contained" : "outlined"}
									color="primary"
									data-testid={`map-region-${region.slug}`}
									sx={{ height: "80px" }}
									onClick={() => handleRegionClick(region)}
								>
									{region.label}
								</Button>
							</Grid>
						);
					})}
				</Grid>
			</Paper>

			{selectedRegion && (
				<Paper
					component="form"
					data-testid="map-data-form"
					sx={{ p: 2, mb: 2 }}
					onSubmit={onSubmit}
				>
					<Typography variant="subtitle1" sx={{ mb: 2 }}>
						{`Record entry for ${selectedRegion.label}`}
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								label="Region"
								value={form.regionName}
								data-testid="map-data-field-region-name"
								onChange={handleField("regionName")}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								label="Category"
								value={form.category}
								data-testid="map-data-field-category"
								onChange={handleField("category")}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								type="number"
								label="Revenue"
								value={form.revenue}
								data-testid="map-data-field-revenue"
								onChange={handleField("revenue")}
							/>
						</Grid>
					</Grid>
					<Stack direction="row" spacing={2} sx={{ mt: 2 }} justifyContent="flex-end">
						<Button
							type="submit"
							variant="contained"
							color="primary"
							disabled={submitting}
							data-testid="map-data-form-submit"
						>
							{"Save Entry"}
						</Button>
					</Stack>
				</Paper>
			)}

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>{"Region"}</TableCell>
							<TableCell>{"Category"}</TableCell>
							<TableCell>{"Revenue"}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading && (
							<TableRow>
								<TableCell colSpan={3}>{"Loading..."}</TableCell>
							</TableRow>
						)}
						{!isLoading && rows.length === 0 && (
							<TableRow>
								<TableCell colSpan={3}>{"No entries yet."}</TableCell>
							</TableRow>
						)}
						{!isLoading && rows.map((row) => (
							<TableRow key={row._id}>
								<TableCell>{row.regionName}</TableCell>
								<TableCell>{row.category}</TableCell>
								<TableCell>{row.revenue}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default memo(MapDataEntry);
