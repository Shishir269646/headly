// ============================================
// ✅ FIXED: src/hooks/useContent.js
// ============================================

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
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

    useEffect(() => {
        if (filters) {
            dispatch(fetchContents(filters));
        }
    }, [dispatch, JSON.stringify(filters)]);

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

    const clear = () => {
        dispatch(clearError());
    };

    return {
        contents,
        currentContent,
        pagination,
        loading,
        error,
        getContentBySlug,
        create,
        update,
        remove,
        publish,
        schedule,
        clearError: clear
    };
};
