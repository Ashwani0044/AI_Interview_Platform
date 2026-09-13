import api from "./api";

export async function startInterview(data) {

    const response = await api.post(
        "/interview/start",
        data
    );

    return response.data;

}

export async function submitInterview(interviewId, data) {

    const response = await api.post(
        `/interview/submit/${interviewId}`,
        data
    );

    return response.data;

}

export async function getInterview(interviewId) {

    const response = await api.get(
        `/interview/${interviewId}`
    );

    return response.data;

}

export async function getInterviewHistory() {

    const response = await api.get(
        "/interview/history"
    );

    return response.data;

}