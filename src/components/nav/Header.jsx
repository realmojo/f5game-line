import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header>
      <div>
        <a href="/" target="_self">
          <h1>F5 GAMES</h1>
        </a>
      </div>
      <div className="pt-2 pr-2">
        <Button type="primary" size="large">
          <Link to="/make">만들기</Link>
        </Button>
      </div>
    </header>
  );
};
