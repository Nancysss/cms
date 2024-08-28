import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const whCode = "13366";
const Authorization =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIlN0IlMjJidXNpbmVzc1R5cGUlMjIlM0ElMjJvbXMlMjIlMkMlMjJsb2dpbkFjY291bnQlMjIlM0ElMjJDdDI5OCUyMiUyQyUyMnVzZXJOYW1lQ24lMjIlM0ElMjIlMjIlMkMlMjJ1c2VyTmFtZUVuJTIyJTNBJTIyJTIyJTJDJTIyY3VzdG9tZXJDb2RlJTIyJTNBJTIyMTE1MTM3MiUyMiUyQyUyMnRlbmFudENvZGUlMjIlM0FudWxsJTJDJTIydGVybWluYWxUeXBlJTIyJTNBbnVsbCU3RCIsImlzcyI6InhpbmdsaWFuLnNlY3VyaXR5IiwiYnVzaW5lc3NUeXBlIjoib21zIiwiZXhwIjoxNzI0MTIzNDk0LCJpYXQiOjE3MjQwMzcwOTQsImp0aSI6IjJiMzQ1ZjM0LTZkMmItNGJmNi1iNjNjLWVhNzMxMWViMTg2NSJ9.SlI7b4RrcBuUM4-sV0Bnxiya5nB40dWAu29OwYbGE0k";

let skuListMap = {};

async function asyncLimit(limitNum, arr, fn) {
  let resArr = [];
  let running = [];
  for (const item of arr) {
    const p = Promise.resolve(fn(item));
    resArr.push(p);
    if (arr.length >= limitNum) {
      const e = p.then(() => running.splice(running.indexOf(e), 1));
      running.push(e);
      if (running.length >= limitNum) {
        await Promise.race(running);
      }
    }
  }
  return Promise.allSettled(resArr);
}

const fn = async (i) => {
  try {
    const response = await fetch(i.pdfUrl);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("bizAppendixType", "1");
    formData.append("bizCode", "outbound");
    formData.append("file", blob, i.fileName);

    const uploadResponse = await fetch(
      "https://oms.xlwms.com/gateway/woms/appendix/upload",
      {
        method: "POST",
        headers: {
          Authorization,
        },
        body: formData,
      }
    );

    const uploadData = await uploadResponse.json();
    const pdfInfo = uploadData.data;

    const params = {
      outboundOrderNo: "",
      whCode,
      logisticsChannel: "Upload_Shipping_Label",
      logisticsCarrier: "usps",
      logisticsSheet: i.fileName,
      appendixList: [pdfInfo],
      // 其他参数...
    };

    const createResponse = await fetch(
      "https://oms.xlwms.com/gateway/woms/outboundOrder/create",
      {
        method: "POST",
        headers: {
          Authorization,
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
        },
        body: JSON.stringify(params),
      }
    );

    const data = await createResponse.json();
    if (data.code == "200") {
      console.log(`>>>create记录 ${i.orderId} 成功， 结果`, data);
    } else {
      console.error(">>>单条数据创建create 请求失败:", data);
    }
  } catch (error) {
    console.error("请求失败:", error);
  }
};

app.post("/api/data", async (req, res) => {
    const arrInfo = req.body.arrInfo; // TODO: 从请求体获取数据
    console.log('>>>>req.body', JSON.stringify(req.body), req.body);
    return;
  const skuResponse = await fetch(
    `https://oms.xlwms.com/gateway/woms/product/getProductList?type=1&whCode=${whCode}`,
    {
      headers: { Authorization },
      method: "GET",
    }
  );

  const skuData = await skuResponse.json();

  console.log(">>>>skuData", skuData);
  const skuList = skuData.data.records;

  skuListMap = {
    // 手动维护的 SKU 映射
    "xt-2-10cm": skuList.find((i) => i.mainCode === "xt-2-10cm"),
    // 其他 SKU...
  };

  const errorSkuList = arrInfo.filter((i) => !skuListMap[i.sku]);

  if (errorSkuList.length) {
    return res
      .status(400)
      .json({ error: "sku异常，请检查", details: errorSkuList });
  } else {
    await asyncLimit(1, arrInfo, fn);
    return res.status(200).json({ message: "处理成功" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
