import { IoChatbubblesOutline } from "react-icons/io5";
import styles from "./chatbot.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  setChatbotInput,
  setChatbotIsActive,
} from "./chatbotSlice";
import { RootState } from "../store";
import { useState } from "react";

export default function Chatbot() {
  const dispatch = useDispatch();
  const { isActive } = useSelector((store: RootState) => store.chatbot);
  const handleButton = () => {
    dispatch(setChatbotIsActive(!isActive));
  };

  return (
    <div className={`${styles.chatbot_container}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {isActive && <ChatSection />}
        <div
          style={{
            width: "3rem",
            height: "3rem",
            backgroundColor: "orange",
            borderRadius: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #fff2",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={handleButton}
        >
          <IoChatbubblesOutline color="white" size="1.5rem" />
        </div>
      </div>
    </div>
  );
}

function ChatSection() {
  const { chatInputValue, messages } = useSelector(
    (store: RootState) => store.chatbot,
  );

  const dispatch = useDispatch();

  const handleInputChange = (val: string) => {
    dispatch(setChatbotInput(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addMessage({
        sender: "self",
        message: chatInputValue,
        date: Date.now(),
      }),
    );
    dispatch(setChatbotInput(""));

    setTimeout(() => {
      dispatch(
        addMessage({
          sender: "bot",
          message: "on it",
          date: Date.now(),
        }),
      );
    }, 500);
  };

  return (
    <div
      style={{
        backgroundColor: "orange",
        borderRadius: "0.5rem",
        border: "1px solid #fff2",
        padding: "0.5rem",
        height: "20rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#222",
          borderRadius: "0.5rem",
          padding: "0.5rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#222",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            boxSizing: "border-box",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: msg.sender === "self" ? "end" : "start",
              }}
            >
              <div
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "orange",
                  maxWidth: "70%",
                }}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
        }}
        onSubmit={handleSubmit}
      >
        <input
          style={{
            padding: "0.25rem 0.5rem",
            backgroundColor: "#222",
            border: "#fff3",
            color: "white",
            height: "100%",
          }}
          onChange={(e) => handleInputChange(e.target.value)}
          value={chatInputValue}
        />
        <div
          style={{
            padding: "0.5rem",
            backgroundColor: "#222",
            color: "white",
            borderRadius: "0.5rem",
            cursor: "pointer",
            userSelect: "none",
            opacity: chatInputValue.length > 0 ? 1 : 0.5,
          }}
          onClick={handleSubmit}
        >
          Send
        </div>
      </form>
    </div>
  );
}
