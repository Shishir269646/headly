
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    updateProfile,
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

    
    const getUserById = (id) => {
        return dispatch(fetchUserById(id));
    };

    const create = (userData) => {
        return dispatch(createUser(userData));
    };

    const update = (id, userData) => {
        return dispatch(updateUser({ id, userData }));
    };

    const remove = (id) => {
        return dispatch(deleteUser(id));
    };

    const updateMyProfile = (profileData) => {
        return dispatch(updateProfile(profileData));
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
        clearError: () => dispatch(clearError())
    };
};
