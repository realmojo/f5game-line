import axios from "axios";

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://storypickup.com"
    : "https://storypickup.com";

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

const addTest = async (params) => {
  try {
    const res = await axios.post(`${API_URL}/api/add/`, params);
    return res.data;
  } catch (e) {
    return new Error("addTest error");
  }
};

const getList = async (page = 0) => {
  try {
    const res = await axios.get(`${API_URL}/api/list/?page=${page}`);
    return res.data;
  } catch (e) {
    return new Error("getList error");
  }
};

const getTest = async (idx) => {
  try {
    const res = await axios.get(`${API_URL}/api/test/?idx=${idx}`);
    return res.data;
  } catch (e) {
    return new Error("getTest error");
  }
};

const getCommentList = async (idx) => {
  try {
    const res = await axios.get(`${API_URL}/api/comments/list/?testIdx=${idx}`);
    return res.data;
  } catch (e) {
    return new Error("getComments error");
  }
};

const addComment = async (params) => {
  try {
    const res = await axios.post(`${API_URL}/api/comments/add/`, params);
    return res.data;
  } catch (e) {
    return new Error("getComments error");
  }
};

const doVote = async (idx, type) => {
  try {
    const res = await axios.get(`${API_URL}/api/vote/?idx=${idx}&type=${type}`);
    return res.data;
  } catch (e) {
    return new Error("doVote error");
  }
};

export {
  getTwitterTrends,
  addTest,
  getList,
  getTest,
  addComment,
  getCommentList,
  doVote,
};
