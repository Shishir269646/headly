import CategoryManager from '@/components/dashboard/CategoryManager';

export const metadata = {
    title: 'Category Management',
};

export default function CategoriesPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Category Management</h1>
            <CategoryManager />
        </div>
    );
}
