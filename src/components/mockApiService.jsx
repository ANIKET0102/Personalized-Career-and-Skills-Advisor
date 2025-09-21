import React, { useState, useEffect } from "react";
import styles from "./mockApiService.module.css";

const mockApiCall = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Aniket Pawar", role: "Frontend Developer" },
        { id: 2, name: "Sarah Lee", role: "Backend Developer" },
        { id: 3, name: "Michael Chen", role: "Fullstack Engineer" },
      ]);
    }, 1000);
  });
};

const MockApiService = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApiCall().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>👨‍💻 Mock API Users</h2>
      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user.id} className={styles.userCard}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>{user.role}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MockApiService;
