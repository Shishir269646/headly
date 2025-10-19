// src/hooks/useContent.js
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import {
    fetchContents,
    fetchContentById,
    fetchContentBySlug,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    scheduleContent,
    clearError,
    clearCurrentContent
} from '@/store/slices/contentSlice';

export const useContent = (filters = null, contentId = null) => {
    const dispatch = useDispatch();
    const { contents, currentContent, pagination, loading, error } = useSelector(
        (state) => state.content
    );

    // Get user role from auth state
    const { user } = useSelector((state) => state.auth);

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

    const getContentBySlug = (slug) => {
        return dispatch(fetchContentBySlug(slug));
    };

    const create = (contentData) => {
        return dispatch(createContent(contentData));
    };

    const update = (id, contentData) => {
        return dispatch(updateContent({ id, contentData }));
    };

    const remove = (id) => {
        return dispatch(deleteContent(id));
    };

    const publish = (id) => {
        return dispatch(publishContent(id));
    };

    const schedule = (id, publishAt) => {
        return dispatch(scheduleContent({ id, publishAt }));
    };

    const clearErrors = () => {
        dispatch(clearError());
    };

    // Role checks
    const isAdmin = user?.role === 'admin';
    const isEditor = user?.role === 'editor' || isAdmin;
    const isAuthor = user?.role === 'author' || isEditor;

    return {
        contents,
        currentContent,
        pagination,
        loading,
        error,
        isAdmin,
        isEditor,
        isAuthor,
        getContentBySlug,
        create,
        update,
        remove,
        publish,
        schedule,
        clearErrors
    };
};