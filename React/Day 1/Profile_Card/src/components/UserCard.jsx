import './userCard.css'

function UserCard({ name, role, isAvailable }) {
  return (
    <div className="user-card">
      <div className="user-header">
        <h3 className="user-name">{name}</h3>
        <p className="user-role">{role}</p>
      </div>

      <div className="user-status">
        Status: {" "}
        <span className={isAvailable ? "status-online" : "status-offline"}>
          {isAvailable ? " Available" : " Unavailable"}
        </span>
      </div>
    </div>
  );
}

export default UserCard;