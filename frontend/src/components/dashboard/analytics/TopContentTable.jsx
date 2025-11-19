"use client";

import Link from 'next/link';

const TopContentTable = ({ content }) => {
    if (!content || content.length === 0) {
        return (
            <div className="card bg-base-200 shadow-xl h-full">
                <div className="card-body">
                    <h2 className="card-title text-2xl text-primary-content mb-4">Top Performing Content</h2>
                    <p>No content to display for this period.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-200 shadow-xl h-full">
            <div className="card-body">
                <h2 className="card-title text-2xl text-primary-content mb-4">Top Performing Content</h2>
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Views</th>
                            </tr>
                        </thead>
                        <tbody>
                            {content.map((post, index) => (
                                <tr key={post._id} className="hover">
                                    <th>{index + 1}</th>
                                    <td>
                                        <Link href={`/posts/${post.slug || post._id}`} className="link link-hover">
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td>{post.author ? post.author.name : 'N/A'}</td>
                                    <td>{(post.views || 0).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TopContentTable;
