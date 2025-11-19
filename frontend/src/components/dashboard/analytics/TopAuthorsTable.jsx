"use client";

const TopAuthorsTable = ({ authors }) => {
    if (!authors || authors.length === 0) {
        return (
            <div className="card bg-base-200 shadow-xl h-full">
                <div className="card-body">
                    <h2 className="card-title text-2xl text-primary-content mb-4">Top Authors</h2>
                    <p>No author data to display for this period.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-200 shadow-xl h-full">
            <div className="card-body">
                <h2 className="card-title text-2xl text-primary-content mb-4">Top Authors</h2>
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Author</th>
                                <th>Posts</th>
                                <th>Total Views</th>
                            </tr>
                        </thead>
                        <tbody>
                            {authors.map((author, index) => (
                                <tr key={author._id} className="hover">
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="font-bold">{author.name}</div>
                                    </td>
                                    <td>{author?.postCount?.toLocaleString() || '0'}</td>
                                    <td>{author?.totalViews?.toLocaleString() || '0'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TopAuthorsTable;
