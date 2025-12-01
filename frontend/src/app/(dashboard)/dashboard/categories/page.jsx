"use client";

import withAuth from '@/hoc/withAuth';
import CategoryManager from '@/components/dashboard/CategoryManager';


function CategoriesPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Category Management</h1>
            <CategoryManager />
        </div>
    );
}

function AuthWrapper() {
    const AuthenticatedCategoriesPage = withAuth(CategoriesPage, ['admin', 'editor']);
    return <AuthenticatedCategoriesPage />;
}

export default AuthWrapper;