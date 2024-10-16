// ==UserScript==
// @name         ads
// @name:zh      批量创建广告脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于批量创建广告
// @author       zheng nanxin
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.deleteValue
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @match        https://ads.tiktok.com/i18n/perf/*
// @include     https://*
// @include     http://*
// @note        2024.10-02 v0.1 测试
// ==/UserScript==

(function () {
  "use strict";

  const styles = `
      #textReplacer {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 300px;
          background-color: white;
          border: 1px solid #ccc;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 10px;
          z-index: 1000;
      }
      #textReplacer textarea,
      #textReplacer input {
          width: 100%;
          margin-bottom: 10px;
      }
      #textReplacer button {
          width: 100%;
      }
  `;

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

  const deepReplace = (obj, keyToReplace, newValue) => {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }
    const newObj = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === keyToReplace) {
          newObj[key] = newValue;
        } else {
          newObj[key] = deepReplace(obj[key], keyToReplace, newValue);
        }
      }
    }
    return newObj;
  };

  const createTextReplacer = () => {
    const container = document.createElement("div");
    container.id = "textReplacer";
    container.innerHTML = `
          <h2>脚本生成工具</h2>
          <h4>1. 将create fetch的代码粘贴在下列窗口</h4>
          <textarea rows="5" id="fetchCode" placeholder="输入文本..."></textarea>
          <span>新的广告户id aadvid</span>
          <input type="text" id="newAadvid" placeholder="aadvid" readonly />
          <span>新的广告系列id campaign_id</span>
          <input type="text" id="newCampaignId" placeholder="campaignId" readonly />
          <h4>2. 开始生成</h4>
          <p>（1） 输入要生成的广告组数量</p>
          <input type="number" id="account" placeholder="请输入要生成的广告组数量" />
          <button id="startGeneration">开始生成</button>
          <p>（2）基于规则去批量生产广告组</p>
          <span>* ${storehouseOptions[0].label}</span>
          <button id="batchGeneration">开始生成</button>
          <h3>脚本</h3>
          <textarea rows="5" id="resultText" readonly style="background-color: #f0f0f0;"></textarea>
      `;
    document.body.appendChild(container);

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const fetchCodeEl = document.getElementById("fetchCode");
    const newAadvidEl = document.getElementById("newAadvid");
    const newCampaignIdEl = document.getElementById("newCampaignId");
    const accountEl = document.getElementById("account");
    const resultTextEl = document.getElementById("resultText");

    // 从 localStorage 读取初始值
    const initialText = window.localStorage.getItem("ads_fetch_demo_str") || "";
    console.log(">>>initialText", initialText);
    fetchCodeEl.value = initialText;

    fetchCodeEl.oninput = () => {
      text = fetchCodeEl.value;
      window.localStorage.setItem("ads_fetch_demo_str", text); // 每次输入时保存到 localStorage
    };

    let text = fetchCodeEl.value;
    let account = 0;

    const getNeedBeCopyString = (adsConfig) => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const newAadvidValue = urlParams.get("aadvid") || "";
        newAadvidEl.value = newAadvidValue;

        const newCampaignIdValue = JSON.parse(
          window.sessionStorage.getItem("perf_cache_selections")
        ).campaign[0].id;
        newCampaignIdEl.value = newCampaignIdValue;

        let newText = "";
        const match = text.match(/aadvid=([^&]*)/);
        console.log(">>>match", match);
        const aadvidValue = match ? match[1] : null;
        if (aadvidValue === null) {
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
        console.log(">>>>bodyParamString", bodyParamString);
        let bodyParams = JSON.parse(JSON.parse(bodyParamString));

        const campaignIdValue = bodyParams.campaign_id;
        bodyParams = deepReplace(bodyParams, "campaign_id", newCampaignIdValue);
        if (adsConfig) {
          const { budget, cpa_bid } = adsConfig;
          bodyParams = deepReplace(bodyParams, "cpa_bid", cpa_bid);
          bodyParams = deepReplace(bodyParams, "budget", budget);
          bodyParams.ad_infos[0].ad_info.base_info.name += `日预算: ${budget}, 出价：${cpa_bid}`;
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
        return newText;
      } catch (error) {
        console.error(">>>error", error);
        alert(JSON.stringify(error) + "获取新推广系列id或新广告户id失败");
      }
    };

    document.getElementById("startGeneration").onclick = () => {
      if (
        JSON.parse(window.sessionStorage.getItem("perf_cache_selections"))
          .campaign[0] &&
        JSON.parse(window.sessionStorage.getItem("perf_cache_selections"))
          .campaign[0].id
      ) {
        text = fetchCodeEl.value;
        account = +accountEl.value;
        if (account === 0) {
          alert("请输入要生成的广告组数量");
          return;
        }
        let fnStr = Array.from({ length: account }, (_, index) => index + 1)
          .map((i) => {
            return getNeedBeCopyString();
          })
          .join("\n");
        resultTextEl.value = fnStr;
        eval(fnStr);
      } else {
        alert("请先选中一个推广系列");
      }
    };

    document.getElementById("batchGeneration").onclick = () => {
      resultTextEl.value = "";
      if (
        JSON.parse(window.sessionStorage.getItem("perf_cache_selections"))
          ?.campaign?.[0]?.id
      ) {
        const adsConfigArr = storehouseOptions[0].value;
        adsConfigArr.budget.forEach((budget, index) => {
          let fnStr = getNeedBeCopyString({
            budget,
            cpa_bid: adsConfigArr.cpa_bid[index],
          });
          resultTextEl.value = fnStr;
          setTimeout(() => {
            eval(fnStr);
          }, 20000 * index);
        });
      } else {
        alert("请先选中一个推广系列");
      }
    };
  };

  createTextReplacer();
})();
