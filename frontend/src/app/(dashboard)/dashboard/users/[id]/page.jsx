
import React from 'react';

const UserPage = ({ params }) => {
  return (
    <div>
      <h1>User ID: {params.id}</h1>
    </div>
  );
};

export default UserPage;
