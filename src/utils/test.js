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

(function() {
    // TextReplacer 组件逻辑
function createTextReplacer() {
  const container = document.createElement("div");
  container.id = "textReplacer";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.width = "300px";
  container.style.backgroundColor = "white";
  container.style.border = "1px solid #ccc";
  container.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  container.style.padding = "10px";
  container.style.zIndex = "1000";

  // 创建元素
  const textTextArea = document.createElement("textarea");
  textTextArea.rows = 5;
  textTextArea.placeholder = "输入文本...";

  const accountInput = document.createElement("input");
  accountInput.type = "number";
  accountInput.placeholder = "请输入要生成的广告组数量";

  const generateButton = document.createElement("button");
  generateButton.textContent = "开始生成";

  // 将元素添加到容器
  container.appendChild(document.createElement("h2")).textContent =
    "脚本生成工具";
  container.appendChild(document.createElement("h4")).textContent =
    "1. 将create fetch的代码粘贴在下列窗口";
  container.appendChild(textTextArea);
  container.appendChild(document.createElement("h4")).textContent =
    "2. 输入要生成的广告组数量";
  container.appendChild(accountInput);
  container.appendChild(document.createElement("h4")).textContent =
    "3. 开始生成";
  container.appendChild(generateButton);

  // 事件处理
  function getNeedBeCopyString() {
    // 创建一个 URL 对象
    const urlObj = new URL(window.location.href);
    // 使用 URLSearchParams 获取 aadvid 的值
    const newAadvidValue = urlObj.searchParams.get("aadvid");
    const newCampaignIdValue = JSON.parse(
      window.sessionStorage.getItem("perf_cache_selections")
    ).campaign[0].id;

    console.log(">>>newAadvidValue", newAadvidValue, newCampaignIdValue);

    let newText = "";
    const match = textTextArea.value.match(/aadvid=([^&]*)/);
    const aadvidValue = match ? match[1] : null;
    console.log(">>>>aadvidValue", aadvidValue);

    const arr = textTextArea.value.split(aadvidValue);
    newText = arr.join(newAadvidValue);

    console.log(">>>newText", newText);

    const campaignIdValue = newText
      .split(`campaign_id`)[1]
      .split("%22:")[1]
      .split("%2C%22")[0]
      .split("};")[0];

    const arr2 = newText.split(campaignIdValue);
    newText = arr2.join(newCampaignIdValue);

    return newText;
  }

  generateButton.addEventListener("click", () => {
    const account = accountInput.value;
    let fnStr = `Array.from({ length: ${account} }, (_, index) => index + 1).map((i) => { ${getNeedBeCopyString()} });`;

    eval(fnStr);
  });

  return container;
}

// 将组件注入到页面
document.getElementById("app").appendChild(createTextReplacer());


    // Your code here...
})();