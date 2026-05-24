import {
  Bell,
  CheckCheck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/notificationApi";

export default function NotificationBell() {
  const [notifications, setNotifications] =
    useState<any[]>([]);

  const [count, setCount] =
    useState(0);

  const [open, setOpen] =
    useState(false);

  const loadData = async () => {
    try {
      const [
        notifRes,
        countRes,
      ] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);

      setNotifications(
        notifRes.notifications || []
      );

      setCount(
        countRes.count || 0
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRead = async (
    id: string
  ) => {
    try {
      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );

      setCount((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    } catch {
      console.error(
        "Read failed"
      );
    }
  };

  const handleReadAll =
    async () => {
      try {
        await markAllNotificationsRead();

        setNotifications((prev) =>
          prev.map((item) => ({
            ...item,
            isRead: true,
          }))
        );

        setCount(0);
      } catch {
        console.error(
          "Read all failed"
        );
      }
    };

  return (
    <div className="relative">
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="relative p-3 rounded-2xl bg-white shadow hover:bg-slate-50"
      >
        <Bell size={20} />

        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[420px] bg-white rounded-xl shadow-2xl border z-50">
          <div className="p-5 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg">
              Notifications
            </h3>

            <button
              onClick={
                handleReadAll
              }
              className="text-indigo-600 text-sm flex items-center gap-2"
            >
              <CheckCheck
                size={16}
              />
              Mark all read
            </button>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {notifications.length >
            0 ? (
              notifications.map(
                (item: any) => (
                  <button
                    key={item._id}
                    onClick={() =>
                      handleRead(
                        item._id
                      )
                    }
                    className={`w-full text-left p-5 border-b hover:bg-slate-50 transition ${
                      !item.isRead
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <h4 className="font-semibold">
                      {item.title}
                    </h4>

                    <p className="text-sm text-slate-600 mt-2">
                      {item.message}
                    </p>
                  </button>
                )
              )
            ) : (
              <div className="p-10 text-center text-slate-400">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}