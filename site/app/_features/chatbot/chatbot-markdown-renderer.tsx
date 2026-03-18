import Markdown from "react-markdown";
import styles from './chatbot-markdown-renderer.module.css';

export default function ChatbotMarkdownRenderer({
  children,
}: {
  children: string;
}) {
  return <div className={styles.md}>
    <Markdown children={children} />
  </div>
}
