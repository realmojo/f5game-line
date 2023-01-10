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

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const getRandomEmoji = () => {
  const emoji = ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎"];
  return emoji[getRandomInt(emoji.length)];
};

const getRandomFaceEmoji = () => {
  const emoji = [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐻‍❄️",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🙉",
    "🐥",
    "🦑",
    "🐙",
  ];
  return emoji[getRandomInt(emoji.length)];
};

const getRandomTitle = () => {
  const arr = [
    "이름 적어줘",
    "닉네임 뭐야?",
    "이름 알려줘",
    "너 이름이 뭐니",
    "별명 지어줘",
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
  return `${trendItems.trends[0]}${trendItems.trends[1]}${trendItems.trends[2]}`;
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
          `[단어${i}]`,
          item.word[`word${i}`][getRandomInt(item.word[`word${i}`].length)]
        );
      }
    }
    tempMessage = tempMessage.replace("[닉네임]", nickname);

    resultMessage = `${getRandomEmoji()} ${
      item.title
    }${getRandomFaceEmoji()}%0A${tempMessage}%0A%0A👉 https://line.f5game.co.kr/${
      item.idx
    }%0A${getTrendTextTop3()}`;
    setResult(resultMessage);
  };

  const kakaoResultMessage = (item) => {
    let resultMessage = "";
    let tempMessage = item.message;

    for (let i = 1; i <= 5; i++) {
      if (item.word[`word${i}`] && item.word[`word${i}`].length > 0) {
        tempMessage = tempMessage.replace(
          `[단어${i}]`,
          item.word[`word${i}`][getRandomInt(item.word[`word${i}`].length)]
        );
      }
    }
    tempMessage = tempMessage.replace("[닉네임]", nickname);

    resultMessage = `👉 ${tempMessage}`;

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
      alert("이미 투표를 하셨습니다.");
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
      url = `https://story.kakao.com/share?text=${result}&url=https://line.f5game.co.kr/${item.idx}`;
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
            mobileWebUrl: `https://line.f5game.co.kr/${item.idx}`,
            webUrl: `https://line.f5game.co.kr/${item.idx}`,
          },
        },
        buttons: [
          {
            title: "플레이 하기",
            link: {
              mobileWebUrl: `https://line.f5game.co.kr/${item.idx}`,
              webUrl: `https://line.f5game.co.kr/${item.idx}`,
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

      const idx =
        window.location.pathname.length !== 1
          ? window.location.pathname.replace("/", "")
          : list[0].idx;
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
            👉 {randomTitle}{" "}
            <a href="/make" className="text-blue-400">
              [테스트 만들기]
            </a>
          </div>
          <Input
            size="large"
            placeholder="이름 혹은 별명을 적어주세요"
            value={nickname}
            onChange={(e) => setChangeNickname(e)}
          />
        </div>
        <div>
          <ButtonGroup className="vote-button-group text-center">
            <Button onClick={() => doActionVote("up")}>
              좋아요 {voteUpCount}
            </Button>
            <Button onClick={() => doActionVote("down")}>
              싫어요 {voteDownCount}
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
              트위터로 확인
            </Button>
          </div>
          <div className="pb-2 px-2">
            <Button
              type="primary"
              className="btn-kakaostory"
              size="large"
              onClick={() => doPost("kakaostory")}
            >
              카카오스토리 확인
            </Button>
          </div>
          <div className="px-2">
            <Button
              id="kakao-link-btn"
              type="primary"
              className="btn-kakao"
              size="large"
            >
              카카오톡 확인
            </Button>
          </div>
        </div>

        <div className="pt-4 px-2 pb-2">
          <div className="font-bold input-title">👉 반응 살펴보기</div>
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
                placeholder="어떤 반응을 느끼셨어요?"
              />
            </div>
            <div className="second-flex mt-2">
              <Button
                type="primary"
                className="btn-add"
                style={{ height: 54 }}
                onClick={() => doActionComment()}
              >
                등록
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
              테스트 더 가져오기
            </Button>
          </div>
        </div>

        <Footer className="text-center py-8 text-sm">
          Copyright(ⓒ)F5 Games All rights reserved.
        </Footer>
      </div>
    </div>
  );
};
