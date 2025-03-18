import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const fetchData = async<T>(path: string,options?: RequestInit): Promise<T> => {
  const cookieStore = await cookies();
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}${path}`, {
    ...options,
    headers: {
      ...options?.headers,
      Cookie: cookieStore.toString(),
    }
  });
  const data = await response.json();
  if (response.status === 401) {
    redirect('/signin');
  } else if (response.status === 403) {
    redirect('/dashboard');
  } else if (response.status === 404) {
    notFound();
  } else if (response.status >= 500) {
    redirect('/500');
  }
  return data.data;
};
