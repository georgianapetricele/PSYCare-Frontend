export const PsychologistPage = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div>
      <h2>Welcome, Dr. {user.data.name}</h2>
      <p>Email: {user.data.email}</p>
      <p>Location: {user.data.location}</p>
      <p>Pacients assigned: {user.data.pacients?.length || 0}</p>
    </div>
  );
};
