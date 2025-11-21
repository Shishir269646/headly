// ============================================
// 📄 app/(dashboard)/dashboard/profile/page.js
// ============================================

'use client';

import withAuth from '@/hoc/withAuth';
import { useAuth } from '@/hooks/useAuth';
import ProfilePageComponent from '@/components/profile/ProfilePage';

function DashboardProfilePage() {
    const { user } = useAuth();
    return <ProfilePageComponent user={user} isDashboard={true} />;
}

const AuthenticatedProfilePage = withAuth(DashboardProfilePage, ['admin', 'editor', 'author', 'viewer']);

export default AuthenticatedProfilePage;