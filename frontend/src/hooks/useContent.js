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

    const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);


    const getContents = useCallback((filters) => {
        dispatch(fetchContents(filters));
    }, [dispatch]);

    const getContentBySlug = useCallback((slug) => {
        return dispatch(fetchContentBySlug(slug)).unwrap();
    }, [dispatch]);

    const clearErrorState = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearContentState = useCallback(() => {
        dispatch(clearCurrentContent());
    }, [dispatch]);


  
    
    useEffect(() => {
        if (memoizedFilters) {
            getContents(memoizedFilters);
        }
    }, [memoizedFilters, getContents]);

  
    useEffect(() => {
        if (contentId) {
            dispatch(fetchContentById(contentId));
        }
       
        
    }, [dispatch, contentId]);



    const create = useCallback((contentData) => {
        return dispatch(createContent(contentData)).unwrap();
    }, [dispatch]);

    const update = useCallback((id, contentData) => {
        return dispatch(updateContent({ id, contentData })).unwrap();
    }, [dispatch]);

    const remove = useCallback((id) => {
        return dispatch(deleteContent(id)).unwrap();
    }, [dispatch]);

    const publish = useCallback((id) => {
        return dispatch(publishContent(id)).unwrap();
    }, [dispatch]);

    const schedule = useCallback((id, publishAt) => {
        return dispatch(scheduleContent({ id, publishAt })).unwrap();
    }, [dispatch]);

    const updateFlags = useCallback((id, flags) => {
        return dispatch(updateContentFlags({ id, flags })).unwrap();
    }, [dispatch]);

    const getFeatured = useCallback(() => {
        return dispatch(fetchFeaturedContents()).unwrap();
    }, [dispatch]);

    const getLatest = useCallback(() => {
        return dispatch(fetchLatestContents()).unwrap();
    }, [dispatch]);

    const getPopular = useCallback(() => {
        return dispatch(fetchPopularContents()).unwrap();
    }, [dispatch]);

    const getTrending = useCallback(() => {
        return dispatch(fetchTrendingContents()).unwrap();
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
        getContents,
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
        clearError: clearErrorState,
        clearCurrentContent: clearContentState
    };
};