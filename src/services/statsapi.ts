import Axios from "axios";

export async function APINHLStandings() {
  try {
    return await Axios.get("https://statsapi.web.nhl.com/api/v1/standings");
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
}
