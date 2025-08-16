const Profile = ({ user }) => {
    return (
      <div>
        <h2>Profile</h2>
        {user ? (
          <div>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
          </div>
        ) : (
          <p>Please login to view profile.</p>
        )}
      </div>
    );
  };
  
  export default Profile;
  