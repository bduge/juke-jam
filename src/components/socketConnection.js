import io from "socket.io-client";

const endpoint = `${process.env.REACT_APP_BASE_URL}`;

export const socket = io(endpoint);