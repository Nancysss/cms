import React, { useEffect, useState } from "react";

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

const storehouseOptions = [
  {
    label:
      "三组：1.预算 25， 出价不设置;2.预算 50， 出价 2 刀; 3.预算 50， 出价 4 刀",
    value: {
      budget: [25, 50, 50],
      cpa_bid: ["", "2", "4"],
    },
  },
];

const TextReplacer = () => {
  const [text, setText] = useState("");
  const [account, setAccount] = useState(0);
  const [resultText, setResultText] = useState("");
  const [newAadvid, setNewAadvid] = useState("");
  const [newCampaignId, setNewCampaignId] = useState("");

  useEffect(() => {
    const fetchDemoStr = window.localStorage.getItem("ads_fetch_demo_str");
    setText(fetchDemoStr ?? "");
  }, []);

  const handleOptionChange = (event: any) => {
    const value = event.target.value;
    setSelectedOption(value);
    console.log(">>>value", value);
  };

  // 工具函数，用于替换字符串
  const getNeedBeCopyString = (adsConfig?: any) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const newAadvidValue = urlParams.get("aadvid")!;
      setNewAadvid(newAadvidValue);
      console.log(">>>>newAadvidValue", newAadvidValue);

      // TODO: 改成sessionStorage
      const newCampaignIdValue = JSON.parse(
        window.localStorage.getItem("perf_cache_selections")!
      )!.campaign[0]!.id;
      setNewCampaignId(newCampaignIdValue);
      console.log(">>>>newCampaignIdValue", newCampaignIdValue);

      let newText = "";
      const match = text.match(/aadvid=([^&]*)/);
      const aadvidValue = match ? match[1] : null;
      if(aadvidValue === null) {
        alert("获取新广告户id失败");
        throw new Error("获取新广告户id失败");  
      } 

      const arr = text.split(aadvidValue);
      newText = arr.join(newAadvidValue);

      // 解析bodyParam参数
      const bodyParamString = text.split(`"body": `)[1].split(
        `,
  "method": "POST",`
      )[0];

      // console.log('>>>>bodyParamString', bodyParamString);
      let a = bodyParamString;

      let bodyParams = JSON.parse(JSON.parse(a));
      console.log(">>>>bodyParam", bodyParams, typeof bodyParams);

      const campaignIdValue = bodyParams.campaign_id;
      console.log(">>>>campaign_id", campaignIdValue, newCampaignId);
      bodyParams = deepReplace(bodyParams, "campaign_id", newCampaignIdValue);
      if (adsConfig) {
        const { budget, cpa_bid } = adsConfig;
        bodyParams = deepReplace(bodyParams, "cpa_bid", cpa_bid);
        bodyParams = deepReplace(bodyParams, "budget", budget);
        bodyParams.ad_infos[0].ad_info.base_info.name = bodyParams.ad_infos[0].ad_info.base_info.name + `日预算: ${budget}, 出价：${cpa_bid}`;  
      }

      newText =
        newText.split(`"body": `)[0] +
        `"body": ` +
        JSON.stringify(JSON.stringify(bodyParams)) +
        `,
  "method": "POST",` +
        newText.split(
          `,
  "method": "POST",`
        )[1];
      //---
      console.log(">>>newText", newText);

      return newText;
    } catch (error) {
      console.error(">>>error", error);

      alert(JSON.stringify(error) + "获取新推广系列id或新广告户id失败");
    }
  };

  const handleRun = (adsConfig?: { budget: number; cpa_bid: string }) => {
    console.log(">>>handleRun", adsConfig);

    setResultText("");
    let fnStr = "";
    if (adsConfig) {
      fnStr = `
      ${getNeedBeCopyString(adsConfig)}
    `;
    } else {
      console.log(">>>run", account);

      if (account === 0) {
        alert("请输入要生成的广告组数量");
        return;
      }
      fnStr = `
    Array.from({ length: ${account} }, (_, index) => index + 1).map((i) => {
      ${getNeedBeCopyString()}
    });
    `;
    }

    const needBeCopyString = fnStr;
    setResultText(needBeCopyString);
    eval(needBeCopyString);
  };

  return (
    <div id="textReplacer" style={styles.container}>
      <h2>脚本生成工具</h2>
      <h4>1. 将create fetch的代码粘贴在下列窗口</h4>
      <textarea
        rows="5"
        value={text}
        onChange={(e) => {
          console.log(">>>>>e.target.value", e.target.value);
          setText(e.target.value);
          window.localStorage.setItem("ads_fetch_demo_str", e.target.value);
        }}
        placeholder="输入文本..."
        style={styles.textarea}
      />
      <span>新的广告户id aadvid</span>
      <input
        type="text"
        placeholder="aadvid"
        value={newAadvid}
        readOnly
        style={styles.input}
      />
      <span>新的广告系列id campaign_id</span>
      <input
        type="text"
        placeholder="campaignId"
        value={newCampaignId}
        readOnly
        style={styles.input}
      />
      <h4>2. 开始生成</h4>
      <p>（1） 输入要生成的广告组数量</p>
      <input
        type="number"
        placeholder="请输入要生成的广告组数量"
        value={account}
        onChange={(e) => {
          console.log(">>>>>e.target.value account", e.target.value);
          setAccount(e.target.value);
        }}
      />
      <button onClick={() => handleRun()}>开始生成</button>
      <p>（2）基于规则去批量生产广告组</p>
      <span>* {storehouseOptions[0].label}</span>
      <button
        onClick={() => {
          const adsConfigArr = storehouseOptions[0].value;
          adsConfigArr.budget.map((budget, index) => {
            console.log(">>>>i", budget, adsConfigArr.cpa_bid[index]);

            handleRun({ budget, cpa_bid: adsConfigArr.cpa_bid[index] });
          });
        }}
      >
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
