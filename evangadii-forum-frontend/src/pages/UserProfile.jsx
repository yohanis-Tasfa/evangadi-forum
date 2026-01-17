import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppState } from "../AppState";
import axios from "../axios";

function UserProfile() {
  const { userid } = useParams();
  const { user: currentUser } = useContext(AppState);
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: "",
    location: "",
    website: ""
  });

  const token = localStorage.getItem("token");
  const isOwnProfile = currentUser && currentUser.userid === userid;

  async function fetchProfile() {
    setIsLoading(true);
    setError("");
    
    try {
      const endpoint = isOwnProfile ? "/profile/me" : `/profile/${userid}`;
      const { data } = await axios.get(endpoint, {
        headers: { Authorization: "Bearer " + token }
      });
      
      setProfile(data.profile);
      
      // Set edit form with current data
      if (isOwnProfile) {
        setEditForm({
          bio: data.profile.user.bio || "",
          location: data.profile.user.location || "",
          website: data.profile.user.website || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load user profile");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    
    try {
      await axios.put("/profile/me", editForm, {
        headers: { Authorization: "Bearer " + token }
      });
      
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getInitials(firstname, lastname) {
    const first = (firstname || "").trim();
    const last = (lastname || "").trim();
    return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "?";
  }

  useEffect(() => {
    if (userid) {
      fetchProfile();
    }
  }, [userid, isOwnProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Profile not found"}</p>
          <button 
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { user, stats, recentActivity } = profile;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            
            {/* Avatar */}
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {getInitials(user.firstname, user.lastname)}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstname} {user.lastname}
                </h1>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                )}
              </div>
              
              <p className="text-gray-600 text-lg mb-2">@{user.username}</p>
              
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      rows="3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        placeholder="City, Country"
                        className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={editForm.website}
                        onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                        className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  {user.bio && (
                    <p className="text-gray-700">{user.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {user.location && (
                      <span className="flex items-center gap-1">
                        📍 {user.location}
                      </span>
                    )}
                    {user.website && (
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        🔗 Website
                      </a>
                    )}
                    <span className="flex items-center gap-1">
                      📅 Joined {formatDate(user.joinedDate)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.reputation}</div>
            <div className="text-gray-600">Reputation</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalQuestions}</div>
            <div className="text-gray-600">Questions</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalAnswers}</div>
            <div className="text-gray-600">Answers</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.votesReceived}</div>
            <div className="text-gray-600">Votes Received</div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Questions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Questions</h2>
              
              {recentActivity.questions.length === 0 ? (
                <p className="text-gray-500">No questions yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.questions.map((question) => (
                    <div key={question.questionid} className="border-l-4 border-blue-500 pl-4">
                      <h3 
                        className="font-medium text-blue-600 hover:underline cursor-pointer"
                        onClick={() => navigate(`/question/${question.questionid}`)}
                      >
                        {question.title}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {question.answerCount} answers • {formatDate(question.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Answers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Answers</h2>
              
              {recentActivity.answers.length === 0 ? (
                <p className="text-gray-500">No answers yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.answers.map((answer) => (
                    <div key={answer.answerid} className="border-l-4 border-green-500 pl-4">
                      <h3 
                        className="font-medium text-green-600 hover:underline cursor-pointer"
                        onClick={() => navigate(`/question/${answer.questionid}`)}
                      >
                        {answer.questionTitle}
                      </h3>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                        {answer.answer.substring(0, 100)}...
                      </p>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDate(answer.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;