/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5500/api/v1",
  withCredentials: true,
});

export const signup = (data: any) => api.post("/signup", data);
export const signin = (data: any) => api.post("/signin", data);
export const emailVerify = (data: any) => api.post("/email-verify", data);
export const forgotPassword = (data: any) => api.post("/forgot", data);
export const resetPassword = (data: any) => api.post("/reset", data);
export const logOutUser = () => api.post("/logout", {});
export const getCurrent = () => api.get("/current");
export const mfaSetup = () => api.post("/mfa/setup", {});
export const mfaVerify = (data:any) => api.post("/mfa/verify", data);
export const mfa2faLogin = (data:any) => api.post("/mfa/verify-2fa", data);
export const mfaOff= () => api.post("/mfa/off", {});
export const getSessions = () => api.get("/sessions");
export const deleteSessionById = (id:string) => api.delete(`/session/${id}`,{});
