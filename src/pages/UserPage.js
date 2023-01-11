import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/apiCalls";
import Alert from "../components/Alert";
import ProfileCard from "../components/ProfileCard";
import Spinner from "../components/Spinner";

const UserPage = () => {
  const [user, setUser] = useState({});
  const [pendingAPICalls, setPendingAPICalls] = useState(false);
  const [failResponse, setFailResponse] = useState();
  const params = useParams();

  useEffect(() => {
    async function getUser() {
      setPendingAPICalls(true);
      try {
        const result = await getUserById(params.id);
        setUser(result.data);
      } catch (error) {
        setFailResponse("User not found");
      }
      setPendingAPICalls(false);
    }
    getUser();
  }, [params.id]);

  return (
    <div className="container" data-testid="user-page">
      {!pendingAPICalls ? (
        <ProfileCard user={user} />
      ) : (
        <Alert type={"success"}>
          <Spinner size="big" />
        </Alert>
      )}
      {failResponse && <Alert type={"secondary"}>{failResponse}</Alert>}
    </div>
  );
};

export default UserPage;
