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
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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

export default withAuth(AnalyticsPage, ['admin', 'editor']);