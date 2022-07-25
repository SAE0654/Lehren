import Login from "./login";
import Home from "./home";
import { useSession } from "next-auth/react";

export default function Index() {

  const { data } = useSession();

  if (data) {
      return <Home />;
  }

  return (
    <>
      <Login />
    </>
  )
}
