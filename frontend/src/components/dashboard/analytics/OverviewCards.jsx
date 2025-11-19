"use client";

import { FaUsers, FaNewspaper, FaEnvelope, FaChartLine, FaRegComments, FaRegEye, FaRegThumbsUp } from "react-icons/fa";

const OverviewCards = ({ overview }) => {
  const {
    totalUsers,
    totalPosts,
    totalContacts,
    totalNewsletterSubscribers,
    totalComments,
    totalViews,
    totalLikes,
  } = overview;

  const stats = [
    { id: 'views', icon: <FaRegEye className="text-3xl" />, value: totalViews, title: "Total Views", desc: "In selected period" },
    { id: 'likes', icon: <FaRegThumbsUp className="text-3xl" />, value: totalLikes, title: "Total Likes", desc: "In selected period" },
    { id: 'comments', icon: <FaRegComments className="text-3xl" />, value: totalComments, title: "Total Comments", desc: "In selected period" },
    { id: 'posts', icon: <FaNewspaper className="text-3xl" />, value: totalPosts, title: "Total Posts", desc: "All time" },
    { id: 'users', icon: <FaUsers className="text-3xl" />, value: totalUsers, title: "Total Users", desc: "All time" },
    { id: 'contacts', icon: <FaEnvelope className="text-3xl" />, value: totalContacts, title: "Total Contacts", desc: "All time" },
    { id: 'subscribers', icon: <FaChartLine className="text-3xl" />, value: totalNewsletterSubscribers, title: "Subscribers", desc: "All time" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {stats.map((stat) => (
        <div key={stat.id} className="stats shadow bg-base-200">
          <div className="stat text-center">
            <div className="stat-figure text-primary mx-auto">{stat.icon}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-value text-primary">{(stat.value || 0).toLocaleString()}</div>
            <div className="stat-desc">{stat.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
