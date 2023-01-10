import axios from "axios";

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://f5game.co.kr/api/line"
    : "https://f5game.co.kr/api/line";

const getTwitterTrends = async () => {
  try {
    const res = await axios.get(
      "https://f5game-bot.herokuapp.com/twitter/trends"
    );
    let today = new Date().toISOString().slice(0, 10);
    const filterTrends = res.data.filter((item) => {
      return !item.includes("#");
    });
    const d = {
      today,
      trends: filterTrends,
    };
    localStorage.setItem("twitter-trends", JSON.stringify(d));
    return res.data;
  } catch (e) {
    return new Error("getTwitterTrends error");
  }
};

const addLine = async (params) => {
  try {
    const res = await axios.post(`${API_URL}/add/`, params);
    return res.data;
  } catch (e) {
    return new Error("addLine error");
  }
};

const getList = async (page = 0) => {
  try {
    const res = await axios.get(`${API_URL}/list/?page=${page}`);
    return res.data;
  } catch (e) {
    return new Error("getList error");
  }
};

const getLine = async (idx) => {
  try {
    const res = await axios.get(`${API_URL}/line/?idx=${idx}`);
    return res.data;
  } catch (e) {
    return new Error("getLine error");
  }
};

const getCommentList = async (idx) => {
  try {
    const res = await axios.get(`${API_URL}/comments/list/?lineIdx=${idx}`);
    return res.data;
  } catch (e) {
    return new Error("getComments error");
  }
};

const addComment = async (params) => {
  try {
    const res = await axios.post(`${API_URL}/comments/add/`, params);
    return res.data;
  } catch (e) {
    return new Error("getComments error");
  }
};

const doVote = async (idx, type) => {
  try {
    const res = await axios.get(`${API_URL}/vote/?idx=${idx}&type=${type}`);
    return res.data;
  } catch (e) {
    return new Error("doVote error");
  }
};

export {
  getTwitterTrends,
  addLine,
  getList,
  getLine,
  addComment,
  getCommentList,
  doVote,
};
