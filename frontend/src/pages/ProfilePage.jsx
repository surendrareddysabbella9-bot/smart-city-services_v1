import React from 'react';
import ProfileEditor from '../components/ProfileEditor';

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <ProfileEditor userRole={user?.role} />
    </div>
  );
}

export default ProfilePage;
