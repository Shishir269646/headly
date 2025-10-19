
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
    fetchMedia,
    uploadMedia,
    uploadMultipleMedia,
    updateMedia,
    deleteMedia,
    clearError
} from '@/store/slices/mediaSlice';

export const useMedia = (filters = null) => {
    const dispatch = useDispatch();
    const { media, pagination, uploading, loading, error } = useSelector(
        (state) => state.media
    );

    useEffect(() => {
        if (filters) {
            dispatch(fetchMedia(filters));
        }
    }, [dispatch, JSON.stringify(filters)]);

    const upload = (file, metadata = {}) => {
        return dispatch(uploadMedia({ file, metadata }));
    };

    const uploadMultiple = (files) => {
        return dispatch(uploadMultipleMedia(files));
    };

    const update = (id, metadata) => {
        return dispatch(updateMedia({ id, metadata }));
    };

    const remove = (id) => {
        return dispatch(deleteMedia(id));
    };

    const refetch = () => {
        dispatch(fetchMedia(filters || {}));
    };

    return {
        media,
        pagination,
        uploading,
        loading,
        error,
        upload,
        uploadMultiple,
        update,
        remove,
        refetch,
        clearError: () => dispatch(clearError())
    };
};
