"use client";
import { useActions } from "@/hooks/useActions";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useTypedSelector } from "@/hooks/useTypedSelector";

const Login: FC = () => {
  const { push } = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useActions();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // console.log(username, password);
    await login({ username, password });
    push("/");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">submit</button>
    </form>
  );
};

export default Login;
