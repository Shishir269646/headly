"use client";

import withAuth from '@/hoc/withAuth';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAnalytics } from "@/store/slices/analyticsSlice";
import AnalyticsHeader from "@/components/dashboard/analytics/AnalyticsHeader";
import OverviewCards from "@/components/dashboard/analytics/OverviewCards";
import EngagementChart from "@/components/dashboard/analytics/EngagementChart";
import CategoryDistributionChart from "@/components/dashboard/analytics/CategoryDistributionChart";
import TopContentTable from "@/components/dashboard/analytics/TopContentTable";
import TopAuthorsTable from "@/components/dashboard/analytics/TopAuthorsTable";
import { XCircle } from 'lucide-react';
import Loader from '@/components/common/Loader';

function AnalyticsPage() {
  const [period, setPeriod] = useState(30);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(getAnalytics(period));
  }, [dispatch, period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <AnalyticsHeader
        selectedPeriod={period}
        onPeriodChange={handlePeriodChange}
        loading={loading}
      />

      {loading && !data && (
        <Loader />
      )}

      {error && (
        <div role="alert" className="alert alert-error">
          <XCircle className="stroke-current shrink-0 h-6 w-6" />
          <span>Error: {error}. Please try again.</span>
        </div>
      )}

      {data && (
        <>
          <OverviewCards overview={data.overview} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <EngagementChart trends={data.engagementTrends} />
            </div>
            <div>
              <CategoryDistributionChart distribution={data.categoryDistribution} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <TopContentTable content={data.topContent} />
            </div>
            <div>
              <TopAuthorsTable authors={data.topAuthors} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}



function AuthWrapper() {
    const AuthenticatedAnalyticsPage = withAuth(AnalyticsPage, ['admin', 'editor']);
    return <AuthenticatedAnalyticsPage />;
}

export default AuthWrapper;