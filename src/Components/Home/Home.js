import React from "react";

import styles from "./Home.module.css";
import { Banner } from "./Banner";
import { Feature } from "./Feature";

//images
import chatWithFriends from "./img/chat-with-friends.svg";
import bothMobilePc from "./img/both-mobile-pc.svg";

export const Home = ({ history }) => {
  const feature = [
    {
      title: "Chat With Friends In Real Time.",
      note:
        "Provides reliable and real time message feature so you can keep up with what your friends and family are doing anytime.",
      image: chatWithFriends,
    },
    {
      title: "PC and mobile friendly design.",
      note:
        "can be used to chat with anyone anywhere with any device, both PC or a mobile device.",
      image: bothMobilePc,
    },
  ];
  return (
    <div className={styles.container}>
      <Banner history={history} />
      {feature.map((data, i) => (
        <Feature
          image={data.image}
          title={data.title}
          note={data.note}
          key={i}
        />
      ))}
    </div>
  );
};
