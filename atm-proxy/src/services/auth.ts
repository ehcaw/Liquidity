export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/signinWithToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      },
    );

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      return {
        user: data.data,
        token: data.session.access_token,
      };
    }
    return null;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}
