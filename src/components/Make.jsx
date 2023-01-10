import React, { useState } from "react";
import { Input, Button, Popover } from "antd";
import { addLine } from "../api";
import ButtonGroup from "antd/es/button/button-group";
const { TextArea } = Input;

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

export const Make = () => {
  const [open, setOpen] = useState(false);

  const [wordArr, setWordArr] = useState([1]);
  const [nickname, setNickname] = useState(
    localStorage.getItem("f5game-line-nickname")
      ? localStorage.getItem("f5game-line-nickname")
      : ""
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("[닉네임]님은 [단어1],[단어2]입니다.");
  const [word, setWord] = useState({
    word1: [],
  });
  const [preview, setPreview] = useState("");

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const doCheck = () => {
    if (title === "") {
      alert("테스트 제목을 입력해주세요");
      return false;
    }
    if (message === "") {
      alert("테스트 결과를 입력해주세요");
      return false;
    }
    if (word.word1.length === 0) {
      alert("단어를 입력해주세요");
      return false;
    }
    return true;
  };

  const doPreview = () => {
    if (!doCheck()) {
      return false;
    }
    let tempMessage = message;

    for (let i = 1; i <= 5; i++) {
      if (word[`word${i}`] && word[`word${i}`].length > 0) {
        tempMessage = tempMessage.replace(
          `[단어${i}]`,
          word[`word${i}`][getRandomInt(word[`word${i}`].length)]
        );
      }
    }
    tempMessage = tempMessage.replace("[닉네임]", nickname);

    setPreview(tempMessage);
  };

  const doAdd = async () => {
    if (!doCheck()) {
      return;
    }
    const params = {
      title,
      description,
      nickname,
      message,
      word,
    };
    const res = await addLine(params);
    location.href = `/?idx=${res}`;
  };

  const setChangeWord = (e, i) => {
    const value = e.target.value;
    let s = word;
    s[`word${i}`] = value.split("\n");
    setWord({ ...s });
  };

  const setChangeNickname = (e) => {
    setNickname(e.target.value);
    localStorage.setItem("f5game-line-nickname", e.target.value);
  };

  const setChangeMessage = (value) => {
    let changeMessage = "";
    if (message.includes(value)) {
      changeMessage = message.replace(value, "");
    } else {
      changeMessage = `${message}${value}`;
    }
    setMessage(changeMessage);
  };

  const addSetWord = () => {
    const len = wordArr.length;
    if (len > 4) {
      alert("5개를 넘길수 없습니다.");
      return;
    }
    setWordArr([...wordArr, len + 1]);
  };
  const removeSetWord = () => {
    const len = wordArr.length;
    if (len === 1) {
      alert("최소 1개는 등록해야 합니다.");
      return;
    }
    const newWordArr = wordArr;
    newWordArr.pop();
    setWordArr([...newWordArr]);
  };
  return (
    <div>
      <div className="pt-4 px-4 pb-2">
        <div className="input-title font-bold">
          👉 친구들에게 공유할 테스트를 만드세요.
        </div>

        <div className="my-2">
          <div className="test-subtitle mb-1">닉네임</div>
          <Input
            size="large"
            placeholder="이름 혹은 별명을 적어주세요"
            value={nickname}
            onChange={(e) => setChangeNickname(e)}
          />
        </div>

        <div className="my-2">
          <div className="test-subtitle mb-1">테스트 제목</div>
          <Input
            size="large"
            placeholder="테스트 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="my-2">
          <div className="test-subtitle mb-1">테스트 설명</div>
          <Input
            size="large"
            placeholder="설명은 간략하게 입력해주세요(선택)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="my-2">
          <div className="test-subtitle mb-1">
            테스트 결과
            <Popover
              title="괄호로 감싸진 [닉네임]과 [단어]들이 치환되어서 문장을 만듭니다. [단어]는 아래에 적은 단어들이 랜덤으로 적용이 됩니다."
              trigger="click"
              open={open}
              onOpenChange={handleOpenChange}
            >
              <Button type="ghost" size="small" shape="circle" className="ml-1">
                ?
              </Button>
            </Popover>
          </div>
          <TextArea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <ButtonGroup className="text-center mt-2 w-full">
            <Button
              className="btn-radio-word"
              onClick={() => setChangeMessage("[닉네임]")}
            >
              닉네임
            </Button>
            <Button
              className="btn-radio-word"
              onClick={() => setChangeMessage("[단어1]")}
            >
              단어1
            </Button>
            <Button
              className="btn-radio-word"
              onClick={() => setChangeMessage("[단어2]")}
            >
              단어2
            </Button>
            <Button
              className="btn-radio-word"
              onClick={() => setChangeMessage("[단어3]")}
            >
              단어3
            </Button>
            <Button
              className="btn-radio-word"
              onClick={() => setChangeMessage("[단어4]")}
            >
              단어4
            </Button>
            <Button
              className="btn-radio-word"
              onClick={() => setChangeMessage("[단어5]")}
            >
              단어5
            </Button>
          </ButtonGroup>
        </div>

        <div className="my-2">
          {wordArr.map((item) => (
            <div className="mb-2" key={item}>
              <div className="test-subtitle mb-1 ">
                단어{item} -{" "}
                <span className="text-gray-400 font-normal text-sm">
                  줄바꿈으로 여러개를 등록할 수 있습니다.
                </span>
              </div>
              <TextArea
                rows={3}
                value={
                  word[`word${item}`] ? word[`word${item}`].join("\n") : ""
                }
                onChange={(e) => setChangeWord(e, item)}
              />
            </div>
          ))}

          <div className="mt-2">
            <Button
              type="default"
              className="mr-2"
              onClick={() => removeSetWord()}
            >
              단어 삭제
            </Button>
            <Button type="default" onClick={() => addSetWord()}>
              단어 추가
            </Button>
          </div>
          <div className="mt-2">
            <div className="test-subtitle mb-1">미리보기 👀 - {preview}</div>
            <ButtonGroup className="w-full text-center">
              <Button
                type="default"
                className="radio-button"
                onClick={() => doPreview()}
              >
                미리보기
              </Button>
              <Button
                type="primary"
                className="btn-add radio-button"
                onClick={() => doAdd()}
              >
                등록
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
};
