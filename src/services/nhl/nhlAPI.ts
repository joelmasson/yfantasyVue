import Axios from "axios";

export async function APINHLStandings(date: string) {
  try {
    return await Axios.get("/api/standings/" + date);
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      console.log("error message: ", error);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
}

export async function APINHLScheduleCalendar(date: string) {
  try {
    return await Axios.get("/api/schedule-calendar/" + date);
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

export async function APINHLSchedule(date: string) {
  try {
    return await Axios.get("/api/schedule/" + date);
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
