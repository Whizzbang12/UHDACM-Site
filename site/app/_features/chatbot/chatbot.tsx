import { useState, useRef, useEffect } from "react";
import styles from "./chatbot.module.css";

import { HiOutlineSparkles } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import { LuSend, LuSquareArrowOutUpRight } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { setChatbotDisableScrollOnMobile } from "../body/bodySlice";
import { usePublicEnv } from "@/app/_context/PublicEnvContext/PublicEnvContext";

import { checkQueryResponse } from "@shared/types/query/queryCheck";
import { QueryResponse } from "@shared/types/query/queryTypes";
import { contextMsgLimit } from "@shared/types/query/queryData";

import Link from "next/link";
import { usePostHog } from "posthog-js/react";

// temporary, seeing how to format msgs (CSS) + scrolling to bottom
interface QueryMessage extends QueryResponse {
  sender: "user" | "bot";
  timestamp: Date;
}

const logoPNG = "/Logo.png";

export default function Chat() {
  const posthog = usePostHog();

  const dispatch = useDispatch();
  const public_env = usePublicEnv();
  const [isOpenWebChat, setOpenWebChat] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const getLinkPath = (url: string): string => {
    try {
      const link = new URL(url);
      const currentOrigin = window.location.origin;

      if (link.origin === currentOrigin) {
        return link.pathname + link.search + link.hash;
      }
      return url;
    } catch (error) {
      console.error("Invalid URL:", error);
      return url;
    }
  };

  const [messages, setMessages] = useState<QueryMessage[]>([
    {
      sender: "bot",
      response: "Hey, welcome to UHD ACM! What are you looking for today?",
      timestamp: new Date(),
      // just to show "relavent actions" & style since im retrieving nothing
      relevant_actions: [
        // {
        //   label: "click me",
        //   // href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        //   href: "http://localhost:3000/events",
        // },
      ],
      quick_replies: [
        {
          label: "View events",
          value: "What events are coming up?",
        },
        {
          label: "How to join",
          value: "How do I join ACM?",
        },
        {
          label: "Cool Stuff!",
          value: "Can you tell me what Galleries and QnAs are at UHD ACM?",
        },
      ],
    },
  ]);

  // CHATBOT PART!
  // scrolls down when new messages are sent
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior: behavior });
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
        response: message,
        timestamp: new Date(),
        quick_replies: [],
        relevant_actions: [],
      },
    ]);

    setIsLoading(true);
    setInputValue("");

    let resMsg = "error";
    let resActions: QueryMessage["relevant_actions"] = [];
    let resQuickReps: QueryMessage["quick_replies"] = [];
    try {
      // adds some of the most recent messages as context.
      const context: QueryMessage[] = [];
      let count = 0;
      for (let i = messages.length - 1; i >= 0; i--) {
        if (i == 0) break; // excludes very first message (template message)
        count += 1;
        context.unshift(messages[i]);
        if (count >= contextMsgLimit) {
          break;
        }
      }

      const response = await fetch(public_env.NEXT_PUBLIC_CHATBOT_ENDPOINT, {
        method: "POST",
        headers: {
          whatever: "whatever",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message,
          context: context,
        }),
      });

      const data = await response.json();
      const { response: query_response } = data;
      checkQueryResponse(query_response);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          response: query_response.response,
          timestamp: new Date(),
          relevant_actions: query_response.relevant_actions,
          quick_replies: query_response.quick_replies,
        },
      ]);
      resMsg = query_response.response;
      resActions.push(...query_response.relevant_actions);
      resQuickReps.push(...query_response.quick_replies);
    } catch (error) {
      console.error("cb", error);
      posthog.captureException("send_message_error", {
        msg: message,
        error: (error as Error).message,
      });
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          response: "Something went wrong, try again later!",
          timestamp: new Date(),
          quick_replies: [],
          relevant_actions: [],
        },
      ]);

      // testing bubble. COMMENT THIS OUT & uncomment the finally block
      // setTimeout(() => {
      //     setMessages(prev => [...prev, {
      //         sender: 'bot',
      //         response: "ERRRORRR!!",
      //         timestamp: new Date(),
      //     }]);
      //     setIsLoading(false);
      // }, 2000)
    } finally {
      posthog.capture("sent_message", {
        msg: message,
        prev_msg: messages[messages.length - 1].response,
        res: {
          resMsg,
          resActions,
          resQuickReps,
        },
      });
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
    posthog.capture("opened_chatbot");
    setIsClosing(false);
    setOpenWebChat(true);
  };
  const handleClosing = () => {
    posthog.capture("closed_chatbot");
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
  // also auto scrolls to bottom
  useEffect(() => {
    if (isOpenWebChat) {
      dispatch(setChatbotDisableScrollOnMobile(true));
    } else {
      dispatch(setChatbotDisableScrollOnMobile(false));
    }

    scrollToBottom("instant");
    return () => {
      dispatch(setChatbotDisableScrollOnMobile(true));
    };
  }, [isOpenWebChat]);

  const screenWidthRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      screenWidthRef.current = window.innerWidth;
    };

    handleResize(); // Set the initial value after the component mounts

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <>
      {/*open chat button */}
      {!isOpenWebChat && (
        <button onClick={handleOpening} className={styles.toggleButton}>
          <HiOutlineSparkles size={30} strokeWidth={1} />
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
                <p style={{ fontSize: "1rem" }}>Here to help you!</p>
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

              {messages.map((msg, msgIndex) => (
                <div
                  key={msgIndex}
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
                      <p>{msg.response}</p>
                    </div>

                    {msg.relevant_actions && (
                      <div className={styles.relevantActions}>
                        {msg.relevant_actions.map((action, actionIndex) => (
                          <Link
                            onClick={() => {
                              // tells posthog
                              posthog.capture("clicked_action", {
                                action: action,
                                action_msg: messages[msgIndex].response,
                              });

                              // closes if full screened and button press
                              if (
                                getLinkPath(action.href).charAt(0) == "/" &&
                                (screenWidthRef.current || 0) <= 576
                              ) {
                                handleClosing();
                              }
                            }}
                            className={styles.actionsBubble}
                            key={actionIndex}
                            href={getLinkPath(action.href)}
                            target={
                              getLinkPath(action.href).charAt(0) == "/"
                                ? "_self"
                                : "_blank"
                            }
                          >
                            {getLinkPath(action.href).charAt(0) != "/" && (
                              <LuSquareArrowOutUpRight size={"1rem"} />
                            )}{" "}
                            {action.label}
                          </Link>
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
            {!isLoading && messages.length != 1 && (messages[messages.length - 1].quick_replies.length == 0) && (
              <p
                style={{ opacity: 0.5, marginLeft: "0.5rem" }}
                className={styles.quickRepliesLabel}
              >
                None
              </p>
            )}
            {isLoading && (
              <div style={{marginLeft: '1em'}} className={styles.loadingDots}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
              </div>
            )}
            <div className={styles.quickRepliesButtonContainer}>
              {
                messages.length > 0 ? (
                  <>
                    {messages[messages.length - 1].quick_replies.map(
                      (quick_reply, i) => {
                        return (
                          <button
                            className={styles.quickRepliesButtons}
                            onClick={() => {
                              posthog.capture("clicked_quick_reply", {
                                prev_msg:
                                  messages[messages.length - 1].response,
                                quick_reply: quick_reply,
                              });
                              handleQuickreply(quick_reply.value);
                            }}
                            key={i}
                          >
                            <HiOutlineSparkles size={12} />
                            {quick_reply.label}
                          </button>
                        );
                      },
                    )}
                  </>
                ) : null
                // (
                //   <>
                //     <button
                //       className={styles.quickRepliesButtons}
                //       onClick={() =>
                //         handleQuickreply("What events are coming up?")
                //       }
                //     >
                //       <HiOutlineSparkles size={12} />
                //       View events
                //     </button>
                //     <button
                //       className={styles.quickRepliesButtons}
                //       onClick={() => handleQuickreply("How do I join ACM?")}
                //     >
                //       <HiOutlineSparkles size={12} />
                //       How to join
                //     </button>
                //     <button
                //       className={styles.quickRepliesButtons}
                //       onClick={() =>
                //         handleQuickreply("What projects does ACM work on?")
                //       }
                //     >
                //       <HiOutlineSparkles size={12} />
                //       Projects
                //     </button>
                //   </>
                // )
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}
