export var UserID = null;
export async function fetchInfo() {
  try {
    const response = await fetch("http://social-net.duckdns.org/api/info", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch user info");
    }
    console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    const data = await response.json();
    UserID = data.Id;
    console.log("User ID:", UserID);
    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
}

export async function CheckLogin() {
  try {
    const response = await fetch("http://social-net.duckdns.org/middle", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (data.message === "Login successful") {
      this.isLoggedIn = true;
      this.$router.push("/home");
    } else {
      this.isLoggedIn = false;
      this.$router.push("/login");
    }
  } catch (error) {
    console.error("Error during login check:", error);
    this.isLoggedIn = false;
    this.$router.push("/login");
    throw error;
  }
}
