import { useState, memo } from "react";
import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton, Button, Paper, Breadcrumbs, Box, Popover, Badge, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
	ExpandMore,
	MoreVert as MoreIcon,
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
	Notifications as NotificationsIcon,
	Home as HomeIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { Image } from "mui-image";

import { jwt, capitalize } from "../utils/index.js";
import logo from "../assets/images/logo.png";
import { ReactComponent as LogoutIcon } from "../assets/images/logout.svg";
import useThemeState from "../use-theme-state.js";
import useNotificationState from "../use-notification-state.js";

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
		flexBasis: "auto",
		background: "white",
		zIndex: 1200,
		height: "70px",
	},
	root: {
		height: "30px",
		padding: theme.spacing(0.5),
		borderRadius: "0px",
		background: theme.palette.grey.main,
	},
	icon: {
		marginRight: 0.5,
		width: 20,
		height: 20,
	},
	expanded: {
		background: "transparent",
	},
	innerSmallAvatar: {
		color: theme.palette.common.black,
		fontSize: "inherit",
	},
	anchorOriginBottomRightCircular: {
		".MuiBadge-anchorOriginBottomRightCircular": {
			right: 0,
			bottom: 0,
		},
	},
	avatar: {
		width: "30px",
		height: "30px",
		background: "white",
	},
	iconButton: {
		padding: "3px 6px",
	},
	menuItemButton: {
		width: "100%",
		bgcolor: "grey.light",
		"&:hover": {
			bgcolor: "grey.dark",
		},
	},
	grey: {
		color: "grey.500",
	},
	svgIcon: {
		width: "100%",
		height: "100%",
		"& g": {
			"& path": {
				fill: theme.palette.secondary.main,
			},
		},
	},
}));

const ButtonWithText = ({ text, icon, more, handler }) => (
	<Button sx={{ height: "100%", display: "flex", flexDirection: "column", p: 1, mx: 1 }} onClick={(event) => handler(event)}>
		<div style={{ width: "100%", height: "100%" }}>
			{icon}
		</div>
		<Typography align="center" color="secondary.main" fontSize="small" fontWeight="bold" display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
			{text}
			{more && <ExpandMore />}
		</Typography>
	</Button>
);

const Header = ({ isAuthenticated }) => {
	const classes = useStyles();

	const location = useLocation();
	const navigate = useNavigate();
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const themeMode = useThemeState((state) => state.mode);
	const toggleThemeMode = useThemeState((state) => state.toggleMode);

	const notifications = useNotificationState((state) => state.notifications);
	const markAllRead = useNotificationState((state) => state.markAllRead);
	const clearAll = useNotificationState((state) => state.clearAll);
	const unreadCount = notifications.filter((n) => !n.read).length;
	const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
	const isNotificationOpen = Boolean(notificationAnchorEl);
	const handleNotificationOpen = (event) => setNotificationAnchorEl(event.currentTarget);
	const handleNotificationClose = () => setNotificationAnchorEl(null);

	const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
	const handleMobileMenuOpen = (event) => setMobileMoreAnchorEl(event.currentTarget);

	const CrumpLink = styled(Link)(({ theme }) => ({ display: "flex", color: theme.palette.third.main }));

	const buttons = [
		{
			icon: <LogoutIcon className={classes.svgIcon} />,
			text: "Logout",
			handler: () => {
				jwt.destroyToken();
				navigate("/");
			},
		},
	];

	const renderMobileMenu = (
		<Menu
			keepMounted
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			{buttons.map((button) => (
				<MenuItem key={button.text} onClick={button.handler}>
					<Image src={button.icon} width="20px" sx={{ fill: "third" }} />
					<p style={{ marginLeft: "5px" }}>{button.text}</p>
					{button.more && <ExpandMore />}
				</MenuItem>
			))}
		</Menu>
	);

	const renderNotificationDropdown = (
		<Popover
			anchorEl={notificationAnchorEl}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isNotificationOpen}
			onClose={handleNotificationClose}
			PaperProps={{ "data-testid": "notification-dropdown", sx: { width: 320, maxHeight: 400 } }}
		>
			<Box sx={{ p: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="subtitle1" fontWeight="bold">{"Notifications"}</Typography>
				<Typography variant="caption" color="text.secondary">
					{unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
				</Typography>
			</Box>
			<Divider />
			<List dense sx={{ maxHeight: 240, overflowY: "auto", p: 0 }}>
				{notifications.length === 0
					? (
						<ListItem>
							<ListItemText
								primary="No notifications"
								primaryTypographyProps={{ color: "text.secondary", align: "center" }}
							/>
						</ListItem>
					)
					: notifications.map((n) => (
						<ListItem key={n.id} sx={{ bgcolor: n.read ? "transparent" : "action.hover" }}>
							<ListItemText
								primary={n.message}
								secondary={n.createdAt}
								primaryTypographyProps={{ fontWeight: n.read ? "normal" : "bold" }}
							/>
						</ListItem>
					))}
			</List>
			<Divider />
			<Box sx={{ p: 1, display: "flex", gap: 1, justifyContent: "flex-end" }}>
				<Button
					size="small"
					data-testid="notification-mark-all-read"
					onClick={markAllRead}
				>
					{"Mark all read"}
				</Button>
				<Button
					size="small"
					color="error"
					data-testid="notification-clear-all"
					onClick={clearAll}
				>
					{"Clear all"}
				</Button>
			</Box>
		</Popover>
	);

	const pathnames = location.pathname.split("/").filter(Boolean);
	const crumps = [];

	crumps.push(
		<CrumpLink
			key="crump-home"
			to="/dashboard"
			data-testid="breadcrumb-home"
		>
			<HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
			{"Home"}
		</CrumpLink>,
	);

	for (const [ind, path] of pathnames.entries()) {
		const text = capitalize(path);
		const isLast = ind === pathnames.length - 1;
		if (isLast) {
			crumps.push(
				<Typography
					key={`crump-current-${ind}`}
					component="span"
					data-testid="breadcrumb-current"
					sx={{ display: "flex", color: "third.main", fontWeight: "bold" }}
				>
					{text}
				</Typography>,
			);
		} else {
			crumps.push(
				<CrumpLink
					key={`crump-${ind}`}
					to={`/${pathnames.slice(0, ind + 1).join("/")}`}
				>
					{text}
				</CrumpLink>,
			);
		}
	}

	return (
		<>
			<AppBar id="header" position="static" className={classes.grow}>
				<Toolbar className="header-container">
					<Box component={Link} to="/">
						<Image src={logo} alt="Logo" sx={{ p: 0, my: 0, height: "100%", maxWidth: "200px" }} />
					</Box>
					<Box className={classes.grow} style={{ height: "100%" }} />
					{isAuthenticated
					&& (
						<>
							<Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
								<Button
									data-testid="profile-nav-link"
									sx={{ textTransform: "none", color: "secondary.main", fontWeight: "bold", mx: 1 }}
									onClick={() => navigate("/profile")}
								>
									{"Profile"}
								</Button>
								<IconButton
									color="primary"
									aria-label="Toggle dark mode"
									data-testid="dark-mode-toggle"
									onClick={toggleThemeMode}
								>
									{themeMode === "dark"
										? <DarkModeIcon />
										: <LightModeIcon />}
								</IconButton>
								{themeMode === "light"
									? <Box component="span" data-testid="theme-indicator-light" sx={{ ml: 0.5, fontSize: "0.75rem", color: "secondary.main" }}>{"Light"}</Box>
									: <Box component="span" data-testid="theme-indicator-dark" sx={{ ml: 0.5, fontSize: "0.75rem", color: "secondary.main" }}>{"Dark"}</Box>}
								<IconButton
									color="primary"
									aria-label="Notifications"
									data-testid="notification-bell"
									onClick={handleNotificationOpen}
									sx={{ ml: 1 }}
								>
									<Badge badgeContent={unreadCount} color="error" overlap="circular">
										<NotificationsIcon />
									</Badge>
								</IconButton>
							</Box>
							<Box sx={{ display: { xs: "none", sm: "none", md: "flex" }, height: "100%", py: 1 }}>
								{buttons.map((button) => (
									<ButtonWithText
										key={button.text}
										icon={button.icon}
										text={button.text}
										handler={button.handler}
										more={button.more}
									/>
								))}
							</Box>
							<Box sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>
								<IconButton color="primary" onClick={handleMobileMenuOpen}><MoreIcon /></IconButton>
							</Box>
						</>
					)}
				</Toolbar>
			</AppBar>
			{isAuthenticated
			&& (
				<Paper elevation={0} className={classes.root} data-testid="breadcrumb-bar">
					<Breadcrumbs className="header-container">{crumps}</Breadcrumbs>
				</Paper>
			)}
			{isAuthenticated
			&& (
				<>
					{renderMobileMenu}
					{renderNotificationDropdown}
				</>
			)}
		</>
	);
};

export default memo(Header);
