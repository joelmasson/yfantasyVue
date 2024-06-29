import Axios from "axios";

export async function APINHLStandings() {
  try {
    return await Axios.get("https://api-web.nhle.com/v1/standings/now");
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

export async function APINHLSchedule(team_id: string, season: string) {
  let params = "";
  if (team_id !== undefined) {
    params += "&teamId=" + team_id;
  }
  if (team_id !== undefined) {
    params += "&season=" + season;
  }
  console.log(params);
  try {
    return await Axios.get(
      "https://api-web.nhle.com/v1/schedule/" + params
    );
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
