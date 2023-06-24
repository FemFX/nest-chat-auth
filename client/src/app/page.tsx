import AuthProvider from "@/providers/AuthProvider";
import { $api } from "@/utils/axios";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const getData = async () => {
  const res = await fetch(`http://localhost:4000/user`, {
    next: {
      revalidate: 10,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
// const checkAuth = async () => {
//   const token = cookies().get("token");
//   if (!token) {
//     return false;
//   }
//   $api.defaults.headers.Authorization = "Bearer " + token;
//   const { data } = await $api.post("/auth/refresh");
//   console.log("here ", data);
//   // redirect("/login");
//   return data.accessToken;
// };
export default async function Home() {
  const data = await getData();
  // const accessToken = await checkAuth();
  // console.log("here ", accessToken);

  return (
    <>
      <main>
        <ul>
          {data.map((user: any) => (
            <li key={user.id}>
              <Link href={`/chat/${user.id}`}>{user.username}</Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
