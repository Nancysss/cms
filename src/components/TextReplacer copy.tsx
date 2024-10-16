import React, { useState, useEffect } from "react";

const getCookieValue = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null; // 如果没有找到对应的 cookie，返回 null
};

export function deepReplace(
  obj: Record<string, any>,
  keyToReplace: string,
  newValue: any
) {
  // 检查是否是对象或数组
  if (typeof obj !== "object" || obj === null) {
    return obj; // 如果不是对象或数组，直接返回
  }

  // 创建新对象或数组
  const newObj = Array.isArray(obj) ? [] : {};

  // 遍历对象的每个属性
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === keyToReplace) {
        newObj[key] = newValue; // 替换指定键名的值
      } else {
        newObj[key] = deepReplace(obj[key], keyToReplace, newValue); // 递归处理
      }
    }
  }

  return newObj; // 返回新对象
}


const TextReplacer = () => {
  const [text, setText] = useState("");
  const [newAadvid, setNewAadvid] = useState("");
  const [newCampaignId, setNewCampaignId] = useState("");
  const [accountCount, setAccountCount] = useState(0);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const newAadvidValue = urlParams.get("aadvid")!;
      setNewAadvid(newAadvidValue);
      console.log(">>>>newAadvidValue", newAadvidValue);

      // TODO: 改成sessionStorage
      const newCampaignIdValue = JSON.parse(
        window.sessionStorage.getItem("perf_cache_selections")!
      )!.campaign[0]!.id;
      setNewCampaignId(newCampaignIdValue);
      console.log(">>>>newCampaignIdValue", newCampaignIdValue);
    } catch (error) {
      alert(JSON.stringify(error) + "获取新推广系列id或新广告户id失败");
    }
  }, [text]);

  const handleGenerate = () => {
    let bodyParams = JSON.parse(text);
    bodyParams = deepReplace(bodyParams, "aadvid", newAadvid);
    bodyParams = deepReplace(bodyParams, "campaign_id", newCampaignId);
    console.log(">>>>bodyParams", bodyParams);

    const csrftoken = getCookieValue("csrftoken") as string;
    const msToken = window.localStorage.getItem("msToken") as string;  
    fetch(
      `https://ads.tiktok.com/api/v3/i18n/perf/async_creation/create/?aadvid=${newAadvid}&msToken${msToken}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-csrftoken": csrftoken
        },
        body: JSON.stringify(bodyParams),
        method: "POST",
      }
    );
  };

  return (
    <div id="textReplacer" style={styles.container}>
      <h2>脚本生成工具</h2>
      <h4>1. 将create fetch body 的代码粘贴在下列窗口</h4>
      <textarea
        rows="5"
        placeholder="输入文本..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={styles.textarea}
      />
      <input
        type="text"
        placeholder="aadvid"
        value={newAadvid}
        readOnly
        style={styles.input}
      />
      <input
        type="text"
        placeholder="campaignId"
        value={newCampaignId}
        readOnly
        style={styles.input}
      />
      <h4>2. 输入要生成的广告组数量</h4>
      <input
        type="number"
        placeholder="请输入要生成的广告组数量"
        value={accountCount}
        onChange={(e) => setAccountCount(e.target.value)}
        style={styles.input}
      />
      <h4>3. 开始生成</h4>
      <button onClick={handleGenerate} style={styles.button}>
        开始生成
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "300px",
    backgroundColor: "white",
    border: "1px solid #ccc",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: "10px",
    zIndex: 1000,
  },
  textarea: {
    width: "100%",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
  },
};

export default TextReplacer;
