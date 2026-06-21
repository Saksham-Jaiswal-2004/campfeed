const cacheKeys = {
  announcements: "campus:announcements",

  events: "campus:events",
  
  issues: "campus:issues",

  announcement: (id: string) => `campus:announcement:${id}`,

  event: (id: string) => `campus:event:${id}`,
  
  issue: (id: string) => `campus:issue:${id}`,

  users: (id: string) => `campus:user:${id}`,

  dashboardStats: "campus:dashboard:stats",
};

export default cacheKeys;
