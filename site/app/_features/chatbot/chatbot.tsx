import { useState, useRef, useEffect } from "react";
import styles from "./chatbot.module.css";

import { HiOutlineSparkles } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import { LuSend, LuSquareArrowOutUpRight } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { setChatbotDisableScrollOnMobile, setOverflowY } from "../body/bodySlice";
import { usePublicEnv } from "@/app/_context/PublicEnvContext/PublicEnvContext";

import { checkQueryResponse } from '@shared/types/query/queryCheck';

// temporary, seeing how to format msgs (CSS) + scrolling to bottom
interface Message {
  sender: "user" | "bot";
  message: string;
  timestamp: Date;
  relevant_actions?: {
    label: string;
    href: string;
  }[];
}

const logoPNG = "/Logo.png";

export default function Chat() {
  const dispatch = useDispatch();
  const public_env = usePublicEnv();
  const [isOpenWebChat, setOpenWebChat] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      message: "Hey, welcome to UHD ACM! What are you looking for today?",
      timestamp: new Date(),
      // just to show "relavent actions" & style since im retrieving nothing
      relevant_actions: [
        {
          label: "click me",
          href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
      ],
    },
  ]);

  // CHATBOT PART!
  // scrolls down when new messages are sent
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // loading bubble
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message: message,
        timestamp: new Date(),
      },
    ]);

    setIsLoading(true);
    setInputValue("");

    try {
      const response = await fetch(public_env.NEXT_PUBLIC_CHATBOT_ENDPOINT, {
        method: "POST",
        headers: {
          whatever: "whatever",
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          query: message,
        }),
      });

      const data = await response.json();
      const { response: query_response } = data;
      checkQueryResponse(query_response);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          message: query_response.response,
          timestamp: new Date(),
          relevant_actions: query_response.relevant_actions,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          message: "ERROORRRR!!!!",
          timestamp: new Date(),
        },
      ]);

      // testing bubble. COMMENT THIS OUT & uncomment the finally block
      // setTimeout(() => {
      //     setMessages(prev => [...prev, {
      //         sender: 'bot',
      //         message: "ERRRORRR!!",
      //         timestamp: new Date(),
      //     }]);
      //     setIsLoading(false);
      // }, 2000)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendClick = () => {
    if (isButtonDisabled) return;
    sendMessage(inputValue);
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isButtonDisabled) return;
    if (e.key === "Enter") {
      (e.preventDefault(), sendMessage(inputValue));
    }
  };

  // quickreplies
  const [inputValue, setInputValue] = useState("");
  const isButtonDisabled = inputValue.trim() === "" || isLoading;

  const handleOpening = () => {
    setIsClosing(false);
    setOpenWebChat(true);
  };
  const handleClosing = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenWebChat(false);
      setIsClosing(false);
    }, 300);
  };

  // time + timestamps
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning,";
    } else if (hour < 18) {
      return "Good Afternoon,";
    } else {
      return "Good Evening,";
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  // quickreplies button handlr
  const handleQuickreply = (text: string) => {
    setInputValue(text);
    inputRef.current?.focus();
  };
  // disable scrolling in chatbot when on mobile
  useEffect(() => {
    if (isOpenWebChat) {
      dispatch(setChatbotDisableScrollOnMobile(true));
    } else {
      dispatch(setChatbotDisableScrollOnMobile(false));
    }

    return () => {
      dispatch(setChatbotDisableScrollOnMobile(true));
    };
  }, [isOpenWebChat]);

  return (
    <>
      {/*open chat button */}
      {!isOpenWebChat && (
        <button onClick={handleOpening} className={styles.toggleButton}>
          <HiOutlineSparkles size={30} />
        </button>
      )}

      {/* actual chat window */}
      {isOpenWebChat && (
        <div
          className={`${styles.chatWindow} ${isClosing ? styles.chatWindowClose : styles.chatWindowOpen}`}
        >
          {/* header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <img src={logoPNG} className={styles.ACMlogo} />
              <div className={styles.headerText}>
                <h3 className="H5">ACM assistant</h3>
                <p>Here to help you!</p>
              </div>
            </div>
            <button className={styles.closeChatButton} onClick={handleClosing}>
              <MdOutlineClose size={20} />
            </button>
          </div>

          {/*body */}
          <div className={styles.messagesContainer}>
            <div className={styles.messagesContent}>
              <div className={styles.greetingBlock}>
                <h3 className="H5">{getGreeting()}</h3>
                <h3 className="H5">How can I help out?</h3>
                <p style={{ marginTop: "0.25rem" }}>
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })},{" "}
                  {formatTime(new Date())}
                </p>
              </div>

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${styles.messageWrapper} ${msg.sender === "bot" ? styles.botWrapper : styles.userWrapper}`}
                >
                  {msg.sender === "bot" && (
                    <img src={logoPNG} className={styles.botIconContainer} />
                  )}
                  <div className={styles.messageGroup}>
                    <span className={styles.messageTime}>
                      {formatTime(msg.timestamp)}
                    </span>
                    <div
                      className={`${styles.messageBubble} ${msg.sender === "bot" ? styles.messagesBot : styles.messagesUser}`}
                    >
                      <p>{msg.message}</p>
                    </div>

                    {msg.relevant_actions && (
                      <div className={styles.relevantActions}>
                        {msg.relevant_actions.map((action, index) => (
                          <a
                            className={styles.actionsBubble}
                            key={index}
                            href={action.href}
                            target="_blank"
                          >
                            <LuSquareArrowOutUpRight size={16} /> {action.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div
                  className={`${styles.messageWrapper} ${styles.botWrapper}`}
                >
                  <img src={logoPNG} className={styles.botIconContainer} />
                  <div className={styles.messageGroup}>
                    <div className={styles.loadingBubble}>
                      <div className={styles.loadingDots}>
                        <div className={styles.dot} />
                        <div className={styles.dot} />
                        <div className={styles.dot} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* input area*/}
          <div className={styles.inputArea}>
            <div className={styles.inputWrapper}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask me anything"
                className={styles.chatInput}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleEnterPress}
              />
              <button
                className={styles.sendButton}
                onClick={handleSendClick}
                disabled={isButtonDisabled}
              >
                <LuSend style={{ width: "100%", height: "100%" }} />
              </button>
            </div>
          </div>

          {/* quick replies */}
          <div className={styles.quickReplies}>
            <p className={styles.quickRepliesLabel}>Quick Replies</p>
            <div className={styles.quickRepliesButtonContainer}>
              <button
                className={styles.quickRepliesButtons}
                onClick={() => handleQuickreply("What events are coming up?")}
              >
                <HiOutlineSparkles size={12} />
                View events
              </button>
              <button
                className={styles.quickRepliesButtons}
                onClick={() => handleQuickreply("How do I join ACM?")}
              >
                <HiOutlineSparkles size={12} />
                How to join
              </button>
              <button
                className={styles.quickRepliesButtons}
                onClick={() =>
                  handleQuickreply("What projects does ACM work on?")
                }
              >
                <HiOutlineSparkles size={12} />
                Projects
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
