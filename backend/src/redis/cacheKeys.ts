const cacheKeys = {
  announcements: "campus:announcements",

  events: "campus:events",
  
  campusIssues: "campus:issues",

  adminIssues: "campus:admin-issues",
  
  userIssues: (id: string) => `campus:user-issues:${id}`,

  announcement: (id: string) => `campus:announcement:${id}`,

  event: (id: string) => `campus:event:${id}`,
  
  issue: (id: string) => `campus:issue:${id}`,

  users: (id: string) => `campus:user:${id}`,

  dashboardStats: "campus:dashboard:stats",
};

export default cacheKeys;
