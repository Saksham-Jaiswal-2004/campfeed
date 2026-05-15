import { useEffect, useState, useCallback } from "react";
import { getEventsPage } from "@/services/events.service";
import { useData } from "@/context/DataContext";

export const useInfiniteEvents = () => {

  const { eventsCache, setEventsCache } = useData();

  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // INITIAL LOAD
  const loadInitial = useCallback(async () => {
    if (eventsCache.length > 0) return; // prevent refetch

    setLoading(true);

    const res = await getEventsPage();

    setEventsCache(res.data);
    setCursor(res.lastDoc);
    setHasMore(res.hasMore);

    setLoading(false);
  }, [eventsCache]);

  // LOAD MORE
  const loadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);

    const res = await getEventsPage(cursor);

    setEventsCache(prev => [...prev, ...res.data]);
    setCursor(res.lastDoc);
    setHasMore(res.hasMore);

    setLoading(false);
  };

  return {
    events: eventsCache,
    loading,
    hasMore,
    loadInitial,
    loadMore
  };
};