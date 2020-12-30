import io from "socket.io-client";

const endpoint = `${process.env.REACT_APP_API_URL}`;

export const socket = io(endpoint);