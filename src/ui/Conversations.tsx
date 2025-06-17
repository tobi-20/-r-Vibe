import { useEffect } from "react";
import { getConversations } from "../services/apiConversations";

function Conversations() {
  useEffect(function () {
    getConversations().then((data) => console.log(data));
  }, []);
  return <div>Conversations</div>;
}

export default Conversations;
