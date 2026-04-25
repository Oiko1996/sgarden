import { memo, useCallback, useEffect, useState } from "react";
import { Grid, Paper, Typography, TextField, Box, Stack, Button } from "@mui/material";

import Spinner from "../components/Spinner.js";
import { getMyProfile, updateMyProfile, changePassword } from "../api/index.js";
import { dayjs, useSnackbar } from "../utils/index.js";

const formatDate = (value) => (value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—");

const Profile = () => {
	const { success, error } = useSnackbar();
	const [isLoading, setIsLoading] = useState(false);
	const [profile, setProfile] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [emailDraft, setEmailDraft] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const loadProfile = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await getMyProfile();
			if (response?.success && response.profile) {
				setProfile(response.profile);
				setEmailDraft(response.profile.email || "");
			} else {
				error("Failed to load profile");
			}
		} catch {
			error("Failed to load profile");
		}
		setIsLoading(false);
	}, [error]);

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	const onEdit = () => {
		setEmailDraft(profile?.email || "");
		setIsEditing(true);
	};

	const onCancelEdit = () => {
		setEmailDraft(profile?.email || "");
		setIsEditing(false);
	};

	const onSaveProfile = async () => {
		setIsLoading(true);
		try {
			const response = await updateMyProfile({ email: emailDraft });
			if (response?.success && response.profile) {
				setProfile(response.profile);
				setEmailDraft(response.profile.email || "");
				setIsEditing(false);
				success("Profile updated");
			} else {
				error(response?.message || "Failed to update profile");
			}
		} catch {
			error("Failed to update profile");
		}
		setIsLoading(false);
	};

	const onChangePassword = async () => {
		setIsLoading(true);
		try {
			const response = await changePassword(currentPassword, newPassword, confirmPassword);
			if (response?.success) {
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
				success(response.message || "Password changed");
			} else {
				error(response?.message || "Failed to change password");
			}
		} catch {
			error("Failed to change password");
		}
		setIsLoading(false);
	};

	const username = profile?.username || "—";
	const email = profile?.email || "—";
	const role = profile?.role || "—";
	const createdAt = formatDate(profile?.createdAt);
	const lastActiveAt = formatDate(profile?.lastActiveAt);

	return (
		<Grid
			container
			py={2}
			px={2}
			flexDirection="column"
			data-testid="profile-page"
		>
			<Spinner open={isLoading} />
			<Typography variant="h4" gutterBottom color="white.main">
				{"Profile"}
			</Typography>

			<Paper sx={{ p: 3, mb: 2 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
					<Typography variant="h6">{"Account details"}</Typography>
					<Box>
						{!isEditing && (
							<Button
								variant="outlined"
								color="secondary"
								data-testid="profile-edit-button"
								onClick={onEdit}
							>
								{"Edit"}
							</Button>
						)}
						{isEditing && (
							<Stack direction="row" spacing={1}>
								<Button
									variant="outlined"
									color="secondary"
									onClick={onCancelEdit}
								>
									{"Cancel"}
								</Button>
								<Button
									variant="contained"
									color="secondary"
									data-testid="profile-save-button"
									onClick={onSaveProfile}
								>
									{"Save"}
								</Button>
							</Stack>
						)}
					</Box>
				</Stack>

				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<Typography variant="caption" color="text.secondary">{"Username"}</Typography>
						<Typography data-testid="profile-username">{username}</Typography>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography variant="caption" color="text.secondary">{"Email"}</Typography>
						{isEditing ? (
							<TextField
								fullWidth
								size="small"
								value={emailDraft}
								onChange={(event) => setEmailDraft(event.target.value)}
								inputProps={{ "data-testid": "profile-email-input" }}
							/>
						) : (
							<Typography data-testid="profile-email">{email}</Typography>
						)}
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography variant="caption" color="text.secondary">{"Role"}</Typography>
						<Typography data-testid="profile-role">{role}</Typography>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography variant="caption" color="text.secondary">{"Created at"}</Typography>
						<Typography data-testid="profile-created-at">{createdAt}</Typography>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography variant="caption" color="text.secondary">{"Last active"}</Typography>
						<Typography data-testid="profile-last-active">{lastActiveAt}</Typography>
					</Grid>
				</Grid>
			</Paper>

			<Paper sx={{ p: 3 }}>
				<Typography variant="h6" gutterBottom>{"Change password"}</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={4}>
						<TextField
							fullWidth
							size="small"
							type="password"
							label="Current password"
							value={currentPassword}
							onChange={(event) => setCurrentPassword(event.target.value)}
							inputProps={{ "data-testid": "profile-password-current" }}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							fullWidth
							size="small"
							type="password"
							label="New password"
							value={newPassword}
							onChange={(event) => setNewPassword(event.target.value)}
							inputProps={{ "data-testid": "profile-password-new" }}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							fullWidth
							size="small"
							type="password"
							label="Confirm new password"
							value={confirmPassword}
							onChange={(event) => setConfirmPassword(event.target.value)}
							inputProps={{ "data-testid": "profile-password-confirm" }}
						/>
					</Grid>
					<Grid item xs={12} display="flex" justifyContent="flex-end">
						<Button
							variant="contained"
							color="secondary"
							data-testid="profile-password-save"
							onClick={onChangePassword}
						>
							{"Update password"}
						</Button>
					</Grid>
				</Grid>
			</Paper>
		</Grid>
	);
};

export default memo(Profile);
