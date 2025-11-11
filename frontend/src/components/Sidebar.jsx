import React, { useEffect } from "react";
import styles from "../Styles/Sidebar.module.css";
import { Users } from "lucide-react";
import { useChatStore } from "../Store/store";
import {useAuth} from "@clerk/clerk-react";


export default function Sidebar() {
  const {getToken} = useAuth();
  const{getUsers,users,selectedUser,setSelectedUser,onlineUsers} = useChatStore();

  useEffect(()=>{
    const fetchUsers = async () => {
      //  if (!isLoaded || !userId) return; 
      const token = await getToken({ template: "chatapp" });
      console.log(token);
      if(token){
        await getUsers(token);
      }
    };
    fetchUsers();
  },[getToken,getUsers])
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Users className="w-5 h-5" />
          <span className="font-medium hidden lg:block">Friends</span>
        </div>
      </div>

      <div className={styles.userList}>
        {users.length > 0 ? (
          users.map((user) => (
            <button
              key={user._id}
              className={`${styles.userItem} ${
                selectedUser?._id === user._id ? styles.userItemActive : " "
              }`}
              aria-label={`Chat with ${user.firstName}`}
              onClick={() => setSelectedUser(user)}
            >
              <div className={styles.avatarContainer}>
                <div className={styles.avatarImageWrapper}>
                  <img src={user.profileImage} className={styles.avatarImage} />
                  <span className={
                      onlineUsers.includes(user.clerkUserId) && (
                        <span className={styles.onlineIndicator} />
                      )
                    }
                  />
                </div>
              </div>
              <div className={styles.userDetails}>
                <div className={styles.userName}>
                  {user.firstName} {" " + user.lastName}
                </div>
                <div className={styles.userStatus}>
                  {onlineUsers.includes(
                    user.clerkUserId )? "Online" : "Offline"
                  }
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className={styles.noUsers}>
            <p>No users found</p>
          </div>
        )}
      </div>
    </aside>
  );
}


