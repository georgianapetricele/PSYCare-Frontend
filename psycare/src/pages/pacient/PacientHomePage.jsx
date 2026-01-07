export const PacientPage = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div>
      <h2>Welcome, {user.data.name}</h2>
      <p>Email: {user.data.email}</p>
      <p>Phone: {user.data.phoneNumber}</p>
      <p>Faculty: {user.data.faculty}</p>
      <p>Problem: {user.data.problem}</p>
      <p>Age: {user.data.age}</p>
      <p>Location: {user.data.location}</p>
    </div>
  );
};
