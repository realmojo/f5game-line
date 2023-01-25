import React from "react";
import { List } from "antd";

export const TestList = ({ list }) => {
  return (
    <>
      <div className="pt-4 px-2 pb-2">
        <div className="font-bold input-title">👉 다른 테스트 하러가기</div>
      </div>
      <List
        bordered
        dataSource={list}
        renderItem={(item) => (
          <List.Item style={{ display: "block" }}>
            <a href={`/t?idx=${item.idx}`}>
              <div>
                <span className="font-bold mr-2">{item.title}</span>
              </div>
              <div className="text-gray-400">{item.description}</div>
            </a>
          </List.Item>
        )}
      />
    </>
  );
};
