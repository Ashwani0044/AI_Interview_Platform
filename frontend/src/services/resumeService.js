import api from "./api";

export async function uploadResume(file) {

    const formData = new FormData();

    formData.append("resume", file);

    const response = await api.post(
        "/resume/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;

}

export async function getResumes() {

    const response = await api.get("/resume");

    return response.data;

}