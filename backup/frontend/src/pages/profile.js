import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { getUserProfile, updateUserProfile } from '../utils/api';

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <p>Please log in to view your profile.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {profile ? (
        <div>
          {isEditing ? (
            <form onSubmit={handleUpdateProfile}>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="mb-2 p-2 border rounded"
              />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="mb-2 p-2 border rounded"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</button>
            </form>
          ) : (
            <div>
              <p>Name: {profile.name}</p>
              <p>Email: {profile.email}</p>
              <button onClick={() => setIsEditing(true)} className="bg-gray-200 p-2 rounded mt-2">Edit Profile</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </Layout>
  );
}