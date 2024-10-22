import { useEffect, useRef, useState } from "react";
import { getCodeString as getCodeStringXLZ } from "../const/const-xlz";
import { getCodeString as getCodeStringXT } from "../const/const-xt";
import { getCodeString as getCodeStringWomenYsj } from "../const/const-mm-ysj";
import Clipboard from "clipboard";
import hljs from "highlight.js";

export const CodeBlock = ({
  originArr,
  storehouseName,
}: {
  originArr: any[];
  storehouseName: string;
}) => {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // TODO: 需要维护
  const getCodeStringFn = () => {
    switch (storehouseName) {
      // 保健品
      case "xlz":
        return getCodeStringXLZ(originArr);
      // 胸贴
      case "xt":
        return getCodeStringXT(originArr);
      case "mm-ysj":
        return getCodeStringWomenYsj(originArr);  
      default:
        break;
    }
  };

  const codeString = getCodeStringFn();

  useEffect(() => {
    if (ref.current) {
      hljs.highlightBlock(ref.current);
    }

    // 创建 clipboard 实例并保存到变量中
    const clipboard = new Clipboard(`#copy_btn`, {
      text: () => codeString,
    });

    // 监听复制成功事件
    clipboard.on("success", () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    });

    // 销毁 clipboard 实例
    return () => {
      clipboard.destroy();
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <button
        id="copy_btn"
        style={{ position: "absolute", top: 12, right: 12, lineHeight: "14px" }}
      >
        {copied ? "复制成功" : "复制"}
      </button>
      <div
        style={{
          height: "200px",
          overflowY: "scroll",
          border: "1px dotted rgb(118, 118, 118)",
          padding: "2px 6px 2px 6px",
        }}
      >
        <pre ref={ref}>
          <code className="javascript">{codeString}</code>
        </pre>
      </div>
    </div>
  );
};
