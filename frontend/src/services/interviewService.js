import api from "./api";

export async function startInterview(data) {

    const response = await api.post(
        "/interview/start",
        data
    );

    return response.data;

}

export async function getInterviewHistory() {

    const response = await api.get(
        "/interview/history"
    );

    return response.data;

}