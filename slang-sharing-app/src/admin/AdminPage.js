import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminPage.module.css'; // 导入模块化 CSS 文件

const AdminPage = () => {
    const [registrations, setRegistrations] = useState([]);
    const [users, setUsers] = useState([]); // 新增状态来存储现有用户信息

    useEffect(() => {
        fetchRegistrations();
        fetchUsers(); // 获取现有用户信息
    }, []);

    const fetchRegistrations = async () => {
        try {
            const response = await axios.get('http://localhost/slang-sharing-backend/api/fetchRegistrations.php');
            setRegistrations(response.data);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost/slang-sharing-backend/api/fetchUsers.php'); // 获取现有用户信息的 API
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            const response = await axios.post('http://localhost/slang-sharing-backend/api/approveRegistration.php', { id });
            if (response.data.success) {
                fetchRegistrations();
                fetchUsers(); // 更新用户信息
            } else {
                alert('Approval failed');
            }
        } catch (error) {
            console.error('Error approving registration:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await axios.post('http://localhost/slang-sharing-backend/api/rejectRegistration.php', { id });
            if (response.data.success) {
                fetchRegistrations();
            } else {
                alert('Rejection failed');
            }
        } catch (error) {
            console.error('Error rejecting registration:', error);
        }
    };

    const handleRevertToRegistration = async (id) => {
        try {
            const response = await axios.post('http://localhost/slang-sharing-backend/api/revertToRegistration.php', { id });
            if (response.data.success) {
                fetchUsers();
                fetchRegistrations(); // 更新注册信息
            } else {
                alert('Revert failed: ' + (response.data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error reverting user:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const response = await axios.post('http://localhost/slang-sharing-backend/api/deleteUser.php', { id });
            if (response.data.success) {
                fetchUsers(); // 更新用户信息
            } else {
                alert('Deletion failed');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h2 className={styles.h2}>Pending Registrations</h2>
                <ul className={styles.ul}>
                    {registrations.map(reg => (
                        <li key={reg.id} className={styles.li}>
                            <span>{reg.username} ({reg.email})</span>
                            <div>
                                <button className={styles.button} onClick={() => handleApprove(reg.id)}>Approve</button>
                                <button className={`${styles.button} ${styles.buttonReject}`} onClick={() => handleReject(reg.id)}>Reject</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.section}>
                <h2 className={styles.h2}>Existing Users</h2>
                <ul className={styles.ul}>
                    {users.map(user => (
                        <li key={user.id} className={styles.li}>
                            <span>{user.username} ({user.email})</span>
                            <div>
                                <button className={styles.button} onClick={() => handleRevertToRegistration(user.id)}>Revert to Registration</button>
                                <button className={`${styles.button} ${styles.buttonReject}`} onClick={() => handleDeleteUser(user.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminPage;