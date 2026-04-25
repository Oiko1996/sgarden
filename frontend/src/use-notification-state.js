import { create } from "zustand";
import { persist } from "zustand/middleware";

const useNotificationState = create(persist(
	(setState, getState) => ({
		notifications: [],
		addNotification: (notification) => {
			const next = {
				id: notification.id || `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
				message: notification.message || "",
				severity: notification.severity || "info",
				read: false,
				createdAt: notification.createdAt || new Date().toISOString(),
				...notification,
			};
			setState({ notifications: [next, ...getState().notifications] });
		},
		markAllRead: () => {
			setState({
				notifications: getState().notifications.map((n) => ({ ...n, read: true })),
			});
		},
		clearAll: () => setState({ notifications: [] }),
		get unreadCount() {
			return getState().notifications.filter((n) => !n.read).length;
		},
	}),
	{
		name: "sgarden-notifications",
	},
));

export default useNotificationState;
