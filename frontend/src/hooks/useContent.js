import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useCallback, useMemo } from 'react';
import {
    fetchContents,
    fetchContentById,
    fetchContentBySlug,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    scheduleContent,
    updateContentFlags,
    fetchFeaturedContents,
    fetchPopularContents,
    fetchLatestContents,
    fetchTrendingContents,
    clearError,
    clearCurrentContent
} from '@/store/slices/contentSlice';

export const useContent = (filters = null, contentId = null) => {
    const dispatch = useDispatch();
    const {
        contents,
        currentContent,
        featured,
        latest,
        popular,
        trending,
        pagination,
        loading,
        error
    } = useSelector((state) => state.content);

    // Memoize filters to prevent unnecessary re-renders
    const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

    useEffect(() => {
        if (memoizedFilters) {
            dispatch(fetchContents(memoizedFilters));
        }
    }, [dispatch, memoizedFilters]);

    useEffect(() => {
        if (contentId) {
            dispatch(fetchContentById(contentId));
        }
        return () => {
            dispatch(clearCurrentContent());
        };
    }, [dispatch, contentId]);

    const getContentBySlug = useCallback((slug) => {
        return dispatch(fetchContentBySlug(slug));
    }, [dispatch]);

    const create = useCallback((contentData) => {
        return dispatch(createContent(contentData));
    }, [dispatch]);

    const update = useCallback((id, contentData) => {
        return dispatch(updateContent({ id, contentData }));
    }, [dispatch]);

    const remove = useCallback((id) => {
        return dispatch(deleteContent(id));
    }, [dispatch]);

    const publish = useCallback((id) => {
        return dispatch(publishContent(id));
    }, [dispatch]);

    const schedule = useCallback((id, publishAt) => {
        return dispatch(scheduleContent({ id, publishAt }));
    }, [dispatch]);

    const updateFlags = useCallback((id, flags) => {
        return dispatch(updateContentFlags({ id, flags }));
    }, [dispatch]);

    const getFeatured = useCallback(() => {
        return dispatch(fetchFeaturedContents());
    }, [dispatch]);

    const getLatest = useCallback(() => {
        return dispatch(fetchLatestContents());
    }, [dispatch]);

    const getPopular = useCallback(() => {
        return dispatch(fetchPopularContents());
    }, [dispatch]);

    const getTrending = useCallback(() => {
        return dispatch(fetchTrendingContents());
    }, [dispatch]);

    const clear = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        contents,
        currentContent,
        featured,
        latest,
        popular,
        trending,
        pagination,
        loading,
        error,
        getContentBySlug,
        create,
        update,
        remove,
        publish,
        schedule,
        updateFlags,
        getLatest,
        getFeatured,
        getPopular,
        getTrending,
        clearError: clear
    };
};