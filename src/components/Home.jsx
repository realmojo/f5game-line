import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { AdsenseMain } from "./adsense/main";
import { TestList } from "./TestList";
import { CommentList } from "./CommentList";
import {
  getList,
  getLine,
  getTwitterTrends,
  doVote,
  addComment,
  getCommentList,
} from "../api";
const { TextArea } = Input;
import ButtonGroup from "antd/es/button/button-group";
import { Footer } from "antd/es/layout/layout";
import queryString from "query-string";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const getRandomEmoji = () => {
  const emoji = ["โค๏ธ", "๐งก", "๐", "๐", "๐", "๐", "๐ค", "๐ค", "๐ค"];
  return emoji[getRandomInt(emoji.length)];
};

const getRandomFaceEmoji = () => {
  const emoji = [
    "๐ถ",
    "๐ฑ",
    "๐ญ",
    "๐น",
    "๐ฐ",
    "๐ฆ",
    "๐ป",
    "๐ผ",
    "๐ปโโ๏ธ",
    "๐จ",
    "๐ฏ",
    "๐ฆ",
    "๐ฎ",
    "๐ท",
    "๐ธ",
    "๐ต",
    "๐",
    "๐ฅ",
    "๐ฆ",
    "๐",
  ];
  return emoji[getRandomInt(emoji.length)];
};

const getRandomTitle = () => {
  const arr = [
    "์ด๋ฆ ์ ์ด์ค",
    "๋๋ค์ ๋ญ์ผ?",
    "์ด๋ฆ ์๋ ค์ค",
    "๋ ์ด๋ฆ์ด ๋ญ๋",
    "๋ณ๋ช ์ง์ด์ค",
  ];
  return arr[getRandomInt(5)];
};

const shuffle = (arr) => {
  arr.sort(() => Math.random() - 0.5);
};

const getTrendTextTop3 = () => {
  let trendItems = localStorage.getItem("twitter-trends")
    ? JSON.parse(localStorage.getItem("twitter-trends"))
    : "";
  if (trendItems.trends.length > 0) {
    shuffle(trendItems.trends);
  }
  return `${trendItems.trends[0]},${trendItems.trends[1]},${trendItems.trends[2]}`;
};

export const Home = () => {
  const [page, setPage] = useState(1);
  const [randomTitle, setRandomTitle] = useState(getRandomTitle());
  const [list, setList] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [item, setItem] = useState({
    title: "",
  });
  const [result, setResult] = useState("");
  const [nickname, setNickname] = useState(
    localStorage.getItem("f5game-line-nickname")
      ? localStorage.getItem("f5game-line-nickname")
      : ""
  );
  const [voteUpCount, setVoteUpCount] = useState(0);
  const [voteDownCount, setVoteDownCount] = useState(0);

  const doMore = async () => {
    const morelist = await getList(page);
    setList([...list, ...morelist]);
    setPage(page + 1);
  };

  const getMessage = (item) => {
    let resultMessage = "";
    let tempMessage = item.message;

    for (let i = 1; i <= 5; i++) {
      if (item.word[`word${i}`] && item.word[`word${i}`].length > 0) {
        tempMessage = tempMessage.replace(
          `[๋จ์ด${i}]`,
          item.word[`word${i}`][getRandomInt(item.word[`word${i}`].length)]
        );
      }
    }
    tempMessage = tempMessage.replace("[๋๋ค์]", nickname);

    resultMessage = `${getRandomEmoji()} ${
      item.title
    }${getRandomFaceEmoji()}%0A${tempMessage}%0A%0A๐ https://line.f5game.co.kr/t?idx=${
      item.idx
    }%0A&hashtags=${getTrendTextTop3()}`;
    setResult(resultMessage);
  };

  const kakaoResultMessage = (item) => {
    let resultMessage = "";
    let tempMessage = item.message;

    for (let i = 1; i <= 5; i++) {
      if (item.word[`word${i}`] && item.word[`word${i}`].length > 0) {
        tempMessage = tempMessage.replace(
          `[๋จ์ด${i}]`,
          item.word[`word${i}`][getRandomInt(item.word[`word${i}`].length)]
        );
      }
    }
    tempMessage = tempMessage.replace("[๋๋ค์]", nickname);

    resultMessage = `๐ ${tempMessage}`;

    return resultMessage;
  };

  const setChangeNickname = (e) => {
    localStorage.setItem("f5game-line-nickname", e.target.value);
    setNickname(e.target.value);
  };

  const doActionVote = (type) => {
    const voteArr = localStorage.getItem("f5game-line-vote")
      ? JSON.parse(localStorage.getItem("f5game-line-vote"))
      : [];

    if (voteArr.includes(item.idx)) {
      alert("์ด๋ฏธ ํฌํ๋ฅผ ํ์จ์ต๋๋ค.");
      return;
    } else {
      doVote(item.idx, type);
      if (type === "up") {
        setVoteUpCount(Number(voteUpCount) + 1);
      } else if (type === "down") {
        setVoteDownCount(Number(voteDownCount) + 1);
      }
      voteArr.push(item.idx);
      localStorage.setItem("f5game-line-vote", JSON.stringify(voteArr));
    }
  };

  const doPost = (type) => {
    let url = "";
    if (type === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${result}`;
      location._blank = "_self";
      location.href = url;
    } else if (type === "kakaostory") {
      url = `https://story.kakao.com/share?text=${result}&url=https://line.f5game.co.kr/t?idx=${item.idx}`;
      location._blank = "_self";
      location.href = url;
    }
  };

  const doActionComment = async () => {
    const params = {
      lineIdx: item.idx,
      nickname,
      comment,
      regdate: new Date(),
    };
    await addComment(params);
    setComments([params, ...comments]);
  };

  const createKakaoButton = (item, message) => {
    if (window.Kakao) {
      const kakao = window.Kakao;
      if (!kakao.isInitialized()) {
        kakao.init("4620ebc4c39b8b6bb94e0e471b33de8c");
      }
      kakao.Link.createDefaultButton({
        container: "#kakao-link-btn",
        objectType: "feed",
        content: {
          title: `${getRandomEmoji()} ${item.title}`,
          description: message,
          imageUrl: "https://f5game.s3.ap-northeast-2.amazonaws.com/f5game.png",
          link: {
            mobileWebUrl: `https://line.f5game.co.kr/t?idx=${item.idx}`,
            webUrl: `https://line.f5game.co.kr/t?idx=${item.idx}`,
          },
        },
        buttons: [
          {
            title: "ํ๋ ์ด ํ๊ธฐ",
            link: {
              mobileWebUrl: `https://line.f5game.co.kr/t?idx=${item.idx}`,
              webUrl: `https://line.f5game.co.kr/t?idx=${item.idx}`,
            },
          },
        ],
      });
    }
  };

  useEffect(() => {
    (async () => {
      const nick = localStorage.getItem("f5game-line-nickname")
        ? localStorage.getItem("f5game-line-nickname")
        : "";
      const today = new Date().toISOString().slice(0, 10);
      const twitterTrends = localStorage.getItem("twitter-trends")
        ? JSON.parse(localStorage.getItem("twitter-trends"))
        : "";
      if (!twitterTrends || twitterTrends.today !== today) {
        getTwitterTrends();
      }
      const list = await getList();
      setList(list);

      const parsed = queryString.parse(location.search);
      const idx = parsed.idx ? parsed.idx : list[0].idx;
      const lineItem = await getLine(idx);
      const comments = await getCommentList(idx);
      setItem(lineItem);
      setComments(comments);
      setVoteUpCount(lineItem.up);
      setVoteDownCount(lineItem.down);
      setNickname(nick);
      getMessage(lineItem);
      setTimeout(() => {
        createKakaoButton(lineItem, kakaoResultMessage(lineItem));
      }, 500);
    })();
  }, []);

  return (
    <div style={{ background: "#f1f2f3" }}>
      <div>
        <h1 className="pt-4 nickname-title">{item.title ? item.title : ""}</h1>
        <div className="pt-4 px-4 pb-2">
          <div className="input-title font-bold">
            ๐ {randomTitle}{" "}
            <a href="/make" className="text-blue-400">
              [ํ์คํธ ๋ง๋ค๊ธฐ]
            </a>
          </div>
          <Input
            size="large"
            placeholder="์ด๋ฆ ํน์ ๋ณ๋ช์ ์ ์ด์ฃผ์ธ์"
            value={nickname}
            onChange={(e) => setChangeNickname(e)}
          />
        </div>
        <div>
          <ButtonGroup className="vote-button-group text-center">
            <Button onClick={() => doActionVote("up")}>
              ์ข์์ {voteUpCount}
            </Button>
            <Button onClick={() => doActionVote("down")}>
              ์ซ์ด์ {voteDownCount}
            </Button>
          </ButtonGroup>
        </div>
        <AdsenseMain />
        <div className="w-full">
          <div className="py-2 px-2">
            <Button
              type="primary"
              className="btn-twitter"
              size="large"
              onClick={() => doPost("twitter")}
            >
              ํธ์ํฐ๋ก ํ์ธ
            </Button>
          </div>
          <div className="pb-2 px-2">
            <Button
              type="primary"
              className="btn-kakaostory"
              size="large"
              onClick={() => doPost("kakaostory")}
            >
              ์นด์นด์ค์คํ ๋ฆฌ ํ์ธ
            </Button>
          </div>
          <div className="px-2">
            <Button
              id="kakao-link-btn"
              type="primary"
              className="btn-kakao"
              size="large"
            >
              ์นด์นด์คํก ํ์ธ
            </Button>
          </div>
        </div>

        <div className="pt-4 px-2 pb-2">
          <div className="font-bold input-title">๐ ๋ฐ์ ์ดํด๋ณด๊ธฐ</div>
        </div>
        <div className="flex flex-col bg-blue-100	py-2">
          <div className="px-2">
            <Input
              size="large"
              value={nickname}
              onChange={(e) => setChangeNickname(e)}
            />
          </div>
          <div className="flex">
            <div className="first-flex pl-2 pr-2 pt-2">
              <TextArea
                row={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="์ด๋ค ๋ฐ์์ ๋๋ผ์จ์ด์?"
              />
            </div>
            <div className="second-flex mt-2">
              <Button
                type="primary"
                className="btn-add"
                style={{ height: 54 }}
                onClick={() => doActionComment()}
              >
                ๋ฑ๋ก
              </Button>
            </div>
          </div>
        </div>
        {comments.length > 0 ? <CommentList list={comments} /> : ""}

        {list.length > 0 ? <TestList list={list} /> : ""}

        <div className="w-full">
          <div className="py-2 px-2">
            <Button
              type="primary"
              className="btn-twitter"
              size="large"
              onClick={() => doMore()}
            >
              ํ์คํธ ๋ ๊ฐ์ ธ์ค๊ธฐ
            </Button>
          </div>
        </div>

        <Footer className="text-center py-8 text-sm">
          Copyright(โ)F5 Games All rights reserved.
        </Footer>
      </div>
    </div>
  );
};
