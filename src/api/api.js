const baseUrl = process.env.BASE_URL;

export const apiFetch = {
  createRoom: async (host, roomName) => {
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        host: host,
        roomName: roomName,
      }),
    };
    try {
      const res = await fetch(baseUrl + "/create-room", fetchOptions);
      const result = await res.json();
      return result;
    } catch (e) {
      console.log(e);
      return "Can't create room";
    }
  },
};
