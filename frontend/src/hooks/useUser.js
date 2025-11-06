
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useCallback } from 'react';
import {
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    updateProfile,
    uploadimage,
    clearError
} from '@/store/slices/userSlice';

export const useUser = (filters = null) => {


    const dispatch = useDispatch();
    const { users, currentUser, pagination, loading, error } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        dispatch(fetchUsers(filters));
    }, [dispatch, JSON.stringify(filters)]);



    const getUserById = useCallback((id) => {
        return dispatch(fetchUserById(id));
    }, [dispatch]);


    const create = useCallback((userData) => {
        return dispatch(createUser(userData));
    }, [dispatch]);

    const update = (id, userData) => {
        return dispatch(updateUser({ id, userData }));
    };

    const remove = (id) => {
        return dispatch(deleteUser(id));
    };

    const updateMyProfile = (profileData) => {
        return dispatch(updateProfile(profileData));
    };

    const uploadUserimage = (file) => {
        return dispatch(uploadimage(file));
    };

    return {
        users,
        currentUser,
        pagination,
        loading,
        error,
        getUserById,
        create,
        update,
        remove,
        updateMyProfile,
        uploadUserimage,
        clearError: () => dispatch(clearError())
    };

};
