import React, { useState } from "react";

const TextReplacer = () => {
  const [demo, setDemo] = useState(`
    // 创建一个 URL 对象
    const urlObj = new URL(window.location.href);
    // 使用 URLSearchParams 获取 aadvid 的值
    const newAadvidValue = urlObj.searchParams.get("aadvid");


    const newCampaignIdValue = JSON.parse(
    window.sessionStorage.getItem("perf_cache_selections")
    ).campaign[0].id;

    console.log(">>>newCampaignIdValue", newCampaignIdValue, 'newAadvidValue', newAadvidValue);
    console.log("baseIds", {newCampaignIdValue, newAadvidValue});

  `);
  const [baseIds, setBaseIds] = useState("");
  const [text, setText] = useState("");
  const [account, setAccount] = useState(0);
  const [replacement, setReplacement] = useState("");
  const [resultText, setResultText] = useState("");

  // 工具函数，用于替换字符串
  const getNeedBeCopyString = () => {
    const { newCampaignIdValue, newAadvidValue } = JSON.parse(baseIds);
    let newText = "";
    const match = text.match(/aadvid=([^&]*)/);
    const aadvidValue = match ? match[1] : null;

    const arr = text.split(aadvidValue);
    newText = arr.join(newAadvidValue);

    console.log(
      ">>>>aadvidValue",
      aadvidValue,
      text,
      text.split(aadvidValue),
      text.split(aadvidValue).join(newAadvidValue),
      arr,
      newText
    );

    // -------------
    const campaignIdValue = newText
      .split(`campaign_id`)[1]
      .split("%22:")[1]
      .split("%2C%22")[0]
      .split("};")[0];
    console.log(">>>>campaignIdValue", campaignIdValue);
    const arr2 = newText.split(campaignIdValue);
    newText = arr2.join(newCampaignIdValue);

    console.log(">>>>>newText", newText);

    //---
    return newText;
  };

  const handleRun = () => {
    const fnStr = `
    Array.from({ length: ${account} }, (_, index) => index + 1).map((i) => {
      ${getNeedBeCopyString()}
    });
    `;

    // // 创建一个 URL 对象
    // const urlObj = new URL(window.location.href);
    // // 使用 URLSearchParams 获取 aadvid 的值
    // const newAadvidValue = urlObj.searchParams.get("aadvid");
    // const newCampaignIdValue = JSON.parse(
    //   window.sessionStorage.getItem("perf_cache_selections")
    // ).id;

    const needBeCopyString = fnStr;
    setResultText(needBeCopyString);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>脚本生成工具</h2>
      <h4>1. 复制下列脚本到广告户，得到基本的参数，并粘贴到下方的结果框</h4>
      <textarea
        rows="5"
        value={demo}
        onChange={(e) => {
          console.log(">>>>>e.target.value", e.target.value);
          setDemo(e.target.value);
        }}
        placeholder="输入文本..."
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <h4>结果框</h4>
      <textarea
        rows="5"
        value={baseIds}
        onChange={(e) => {
          console.log(">>>>>e.target.value account", e.target.value);
          setBaseIds(e.target.value);
        }}
        placeholder="输入基础id"
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <h4>2. 将create fetch的代码粘贴在下列窗口</h4>
      <textarea
        rows="5"
        value={text}
        onChange={(e) => {
          console.log(">>>>>e.target.value", e.target.value);
          setText(e.target.value);
        }}
        placeholder="输入文本..."
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <h4>3. 输入要生成的广告组数量</h4>
      <input
        type="number"
        placeholder="请输入要生成的广告组数量"
        value={account}
        onChange={(e) => {
          console.log(">>>>>e.target.value account", e.target.value);
          setAccount(e.target.value);
        }}
      />
      <h4>4. 点击开始生成，并将下方输入框的脚本内容复制到广告平台进行执行</h4>
      <button onClick={handleRun} style={{ width: "100%" }}>
        开始生成
      </button>
      <h3>脚本</h3>
      <textarea
        rows="5"
        value={resultText}
        readOnly
        style={{ width: "100%", backgroundColor: "#f0f0f0" }}
      />
    </div>
  );
};

export default TextReplacer;
