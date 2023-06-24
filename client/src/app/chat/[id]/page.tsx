import Chat from "@/components/Chat";
import { cookies } from "next/headers";
import React from "react";

export const getData = async (id: number) => {
  const res = await fetch(`http://localhost:4000/chat/${id}`, {
    headers: {
      Authorization: `Bearer ${cookies().get("token")}`,

      Cookie: cookies()
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join("; "),
    },
    credentials: "include",
    next: {
      revalidate: 10,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const page = async ({ params: { id } }: any) => {
  const data = await getData(+id);

  return (
    <div>
      <Chat chat={data} receiverId={+id} />
    </div>
  );
};

export default page;
