
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAnalytics } from "@/store/slices/analyticsSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { FaUsers, FaNewspaper, FaEnvelope, FaChartLine } from "react-icons/fa";
import { MdOutlineArticle } from "react-icons/md";
import { RiEyeLine, RiHeartLine, RiChat3Line } from "react-icons/ri";
import { format } from "date-fns";

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(getAnalytics());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (error)
    return (
      <div className="text-center text-error">
        Failed to load analytics: {error}
      </div>
    );

  if (!data) return null;

  const {
    totalUsers,
    totalPosts,
    totalContacts,
    totalNewsletterSubscribers,
    userGrowth,
    contentActivity,
    popularContent,
  } = data;

  const userGrowthData = userGrowth.map((item) => ({
    date: format(new Date(item._id), "MMM dd"),
    users: item.count,
  }));

  const contentActivityData = [
    { name: "Views", value: contentActivity.totalViews },
    { name: "Likes", value: contentActivity.totalLikes },
    { name: "Comments", value: contentActivity.totalComments },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">
        Analytics Dashboard
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div key="totalUsersCard" className="stats shadow bg-base-200">
          <div key="stat-totalUsers" className="stat">
            <div className="stat-figure text-primary">
              <FaUsers className="text-3xl" />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">{totalUsers}</div>
            <div className="stat-desc">Registered users</div>
          </div>
        </div>

        <div key="totalPostsCard" className="stats shadow bg-base-200">
          <div key="stat-totalPosts" className="stat">
            <div className="stat-figure text-secondary">
              <MdOutlineArticle className="text-3xl" />
            </div>
            <div className="stat-title">Total Posts</div>
            <div className="stat-value text-secondary">{totalPosts}</div>
            <div className="stat-desc">Published content</div>
          </div>
        </div>

        <div key="totalContactsCard" className="stats shadow bg-base-200">
          <div key="stat-totalContacts" className="stat">
            <div className="stat-figure text-accent">
              <FaEnvelope className="text-3xl" />
            </div>
            <div className="stat-title">Total Contacts</div>
            <div className="stat-value text-accent">{totalContacts}</div>
            <div className="stat-desc">Messages received</div>
          </div>
        </div>

        <div key="newsletterSubscribersCard" className="stats shadow bg-base-200">
          <div key="stat-newsletterSubscribers" className="stat">
            <div className="stat-figure text-info">
              <FaNewspaper className="text-3xl" />
            </div>
            <div className="stat-title">Newsletter Subscribers</div>
            <div className="stat-value text-info">
              {totalNewsletterSubscribers}
            </div>
            <div className="stat-desc">Active subscribers</div>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="card bg-base-200 shadow-xl mb-10">
        <div className="card-body">
          <h2 className="card-title text-2xl text-primary-content">
            User Registrations (Last 7 Days)
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={userGrowthData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Content Activity & Popular Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Content Activity */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl text-primary-content">
              Content Activity
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={contentActivityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Popular Content */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl text-primary-content">
              Popular Content
            </h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Views</th>
                    <th>Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {popularContent.map((content) => (
                    <tr key={content._id}>
                      <td>{content.title}</td>
                      <td>{content.views}</td>
                      <td>{content.likes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
