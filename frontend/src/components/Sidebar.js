import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import Image from "mui-image";
import { ExpandMore } from "@mui/icons-material";

import Accordion from "./Accordion.js";

import { jwt } from "../utils/index.js";

const useStyles = makeStyles((theme) => ({
	sidebar: {
		height: "100%",
		position: "absolute",
		backgroundColor: theme.palette.secondary.main,
		color: "white",
		overflow: "auto",
	},
}));

const ButtonWithText = ({ text, icon, more, handler }) => (
	<span key={text}>
		{!more
		&& (
			<Button key={text} sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", padding: "8px 40px 8px 16px" }} onClick={(event) => handler(event)}>
				{icon && (<Image src={icon} alt={text} fit="contain" width="25px" />)}
				<Typography align="center" color="white.main" fontSize="medium" ml={1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
					{text}
					{more && <ExpandMore />}
				</Typography>
			</Button>
		)}
		{more
		&& (
			<Accordion
				key={text}
				title={(
					<Grid item sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
						<Image src={icon} alt={text} fit="contain" width="25px" />
						<Typography align="center" color="white.main" fontSize="medium" ml={1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
							{text}
						</Typography>
					</Grid>
				)}
				content={(
					<Grid container flexDirection="column" width="100%">
						{more.map((el) => (
							<Button key={el.title} color="white" onClick={el.handler}>
								<Typography sx={{ textTransform: "capitalize" }}>{el.title}</Typography>
							</Button>
						))}
					</Grid>
				)}
				alwaysExpanded={false}
				titleBackground="transparent"
				expandIconColor="white"
			/>
		)}
	</span>
);

const ButtonSimple = ({ text, icon, handler, ind }) => (
	<Button key={text} sx={{ minWidth: "30px!important", padding: "0px", marginTop: (ind === 0) ? "0px" : "10px" }} onClick={(event) => handler(event)}>
		<Image src={icon} alt={text} fit="contain" width="30px" />
	</Button>
);

const Sidebar = ({ isSmall: sidebarIsSmall }) => {
	const [isSmall, setIsSmall] = useState(false);
	const navigate = useNavigate();
	const classes = useStyles();

	const isAdmin = jwt.isAdmin();

	useEffect(() => setIsSmall(sidebarIsSmall), [sidebarIsSmall]);

	const buttons = [
		...(isAdmin ? [{
			text: "Users",
			handler: () => {
				navigate("/users");
			},
		}] : []),
		{
			text: "Overview",
			handler: () => {
				navigate("/dashboard");
			},
		},
		{
			text: "Analytics",
			handler: () => {
				navigate("/dashboard1");
			},
		},
		{
			text: "Insights",
			handler: () => {
				navigate("/dashboard2");
			},
		},
	];

	return (
		<div className={classes.sidebar} style={{ width: (isSmall) ? "50px" : "200px", padding: (isSmall) ? "20px 5px" : "20px 5px", textAlign: "center" }}>
			{!isSmall && buttons.map((button) => (
				<ButtonWithText
					key={button.text}
					icon={button.icon}
					text={button.text}
					handler={button.handler}
					more={button.more}
				/>
			))}
			{isSmall && buttons.map((button, ind) => (
				<ButtonSimple
					key={button.text}
					icon={button.icon}
					text={button.text}
					handler={button.handler}
					more={button.more}
					ind={ind}
				/>
			))}
			{isAdmin && (
				<Button
					data-testid="sidebar-activity-link"
					sx={{
						width: "100%",
						display: "flex",
						flexDirection: "row",
						justifyContent: "flex-start",
						padding: isSmall ? "8px 0" : "8px 40px 8px 16px",
						minWidth: "30px",
						mt: isSmall ? "10px" : 0,
					}}
					onClick={() => navigate("/activity")}
				>
					<Typography
						align="center"
						color="white.main"
						fontSize="medium"
						ml={isSmall ? 0 : 1}
						display="flex"
						alignItems="center"
						sx={{ textTransform: "capitalize" }}
					>
						{isSmall ? "A" : "Activity Log"}
					</Typography>
				</Button>
			)}
			<Button
				data-testid="sidebar-sales-data-link"
				sx={{
					width: "100%",
					display: "flex",
					flexDirection: "row",
					justifyContent: "flex-start",
					padding: isSmall ? "8px 0" : "8px 40px 8px 16px",
					minWidth: "30px",
					mt: isSmall ? "10px" : 0,
				}}
				onClick={() => navigate("/sales-data")}
			>
				<Typography align="center" color="white.main" fontSize="medium" ml={isSmall ? 0 : 1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
					{isSmall ? "S" : "Sales Data"}
				</Typography>
			</Button>
			<Button
				data-testid="sidebar-alerts-link"
				sx={{
					width: "100%",
					display: "flex",
					flexDirection: "row",
					justifyContent: "flex-start",
					padding: isSmall ? "8px 0" : "8px 40px 8px 16px",
					minWidth: "30px",
					mt: isSmall ? "10px" : 0,
				}}
				onClick={() => navigate("/alerts")}
			>
				<Typography align="center" color="white.main" fontSize="medium" ml={isSmall ? 0 : 1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
					{isSmall ? "!" : "Alerts"}
				</Typography>
			</Button>
			<Button
				data-testid="sidebar-reports-link"
				sx={{
					width: "100%",
					display: "flex",
					flexDirection: "row",
					justifyContent: "flex-start",
					padding: isSmall ? "8px 0" : "8px 40px 8px 16px",
					minWidth: "30px",
					mt: isSmall ? "10px" : 0,
				}}
				onClick={() => navigate("/reports")}
			>
				<Typography align="center" color="white.main" fontSize="medium" ml={isSmall ? 0 : 1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
					{isSmall ? "R" : "Reports"}
				</Typography>
			</Button>
			{isAdmin && (
				<Button
					data-testid="sidebar-audit-link"
					sx={{
						width: "100%",
						display: "flex",
						flexDirection: "row",
						justifyContent: "flex-start",
						padding: isSmall ? "8px 0" : "8px 40px 8px 16px",
						minWidth: "30px",
						mt: isSmall ? "10px" : 0,
					}}
					onClick={() => navigate("/audit")}
				>
					<Typography align="center" color="white.main" fontSize="medium" ml={isSmall ? 0 : 1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
						{isSmall ? "Au" : "Audit"}
					</Typography>
				</Button>
			)}
		</div>
	);
};

export default Sidebar;
