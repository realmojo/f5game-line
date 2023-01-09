import React, { useEffect, useState } from "react";
import { Button, Input, List } from "antd";

const timeForToday = (value) => {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) return "방금 전";
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간 전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일 전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년 전`;
};

export const CommentList = ({ list }) => {
  return (
    <List
      bordered
      locale={{ emptyText: "댓글을 입력해주세요" }}
      dataSource={list}
      renderItem={(item) => (
        <List.Item style={{ display: "block" }}>
          <div>
            <span className="font-bold mr-2">
              {item.nickname}
              <span className="text-gray-300 ml-2 font-light">
                {timeForToday(item.regdate)}
              </span>
            </span>
          </div>
          <div>{item.comment}</div>
        </List.Item>
      )}
    />
  );
};
