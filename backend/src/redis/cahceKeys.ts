const cacheKeys = {
    announcements: "announcements",
    events: "events",
    event: (id: string) => `event:${id}`,
    user: (id: string) => `user:${id}`,
    dashboardStats: "dashboard:stats",
};

export default cacheKeys;