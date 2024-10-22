export const getCodeString = (originArr: any[]) => `
// 开始执行脚本之前，记得检查 TODO 事项
// TODO: 先去飞书表格获取arrInfo
const arrInfo = ${JSON.stringify(originArr)};
// TODO: 确认一下物流仓信息
const whCode = "13366"
// TODO: 设置鉴权信息
const Authorization =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIlN0IlMjJidXNpbmVzc1R5cGUlMjIlM0ElMjJvbXMlMjIlMkMlMjJsb2dpbkFjY291bnQlMjIlM0ElMjJDdDI5OCUyMiUyQyUyMnVzZXJOYW1lQ24lMjIlM0ElMjIlMjIlMkMlMjJ1c2VyTmFtZUVuJTIyJTNBJTIyJTIyJTJDJTIyY3VzdG9tZXJDb2RlJTIyJTNBJTIyMTE1MTM3MiUyMiUyQyUyMnRlbmFudENvZGUlMjIlM0FudWxsJTJDJTIydGVybWluYWxUeXBlJTIyJTNBbnVsbCU3RCIsImlzcyI6InhpbmdsaWFuLnNlY3VyaXR5IiwiYnVzaW5lc3NUeXBlIjoib21zIiwiZXhwIjoxNzI5Njc1ODUzLCJpYXQiOjE3Mjk1ODk0NTMsImp0aSI6IjZmMjMxOGZlLTFhMmMtNDdmZi04NjA0LTYwM2Q2NzU0N2Q1ZSJ9.saUWd5vwl4lXUaH2n9XzLk5DN0Gn031EW3Kzb4ylOBA";
let skuListMap = {};
async function asyncLimit(limitNum, arr, fn) {
  let resArr = []; // 所有promise实例
  let running = []; // 执行中的promise数组
  for (const item of arr) {
    const p = Promise.resolve(fn(item)); // 遍历arr，对于每一项，创建一个promise实例存储到resArr中，创建的时候就已经开始执行了
    resArr.push(p);
    if (arr.length >= limitNum) {
      // 对于每一项设置其then操作，并将其存储到running数组中，作为执行中的标识，当then操作触发之后则将running中的对应这一项删除，执行中的数组减一
      const e = p.then(() => running.splice(running.indexOf(e), 1));
      running.push(e);
      if (running.length >= limitNum) {
        // 当数量达到限制时开始批量执行，处理完一个即跳走，重新往running中注入新的实例
        await Promise.race(running);
      }
    }
  }
  return Promise.allSettled(resArr);
}
const fn = async (i) => {
  await fetch(i.pdfUrl, {
    method: "GET",
  })
    .then((response) => {
      return response.blob();
    })
    .then(async (blob) => {
      const formData = new FormData();
      formData.append("bizAppendixType", "1");
      formData.append("bizCode", "outbound");
      formData.append("bizNo", ""); // 如果需要，可以留空
      formData.append("file", blob, i.fileName);
      await fetch("https://oms.xlwms.com/gateway/woms/appendix/upload", {
        method: "POST",
        headers: {
          Authorization,
        },
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          const pdfInfo = response.data;
          console.log(">>>>pdfInfo", pdfInfo);
          return pdfInfo;
        })
        .then(async (pdfInfo) => {
          const params = {
            outboundOrderNo: "",
            whCode,
            salesPlatform: "",
            referOrderNo: "",
            platformOrderNo: "",
            logisticsChannel: "Upload_Shipping_Label",
            logisticsCarrier: "usps",
            trackNo: "",
            remark: "",
            channelType: 3,
            logisticsSheet: i.fileName,
            insureMoney: 0,
            receiver: \`\${i.orderId} - \${i.tableName}\`,
            telephone: "",
            email: "",
            taxNum: "",
            companyName: "",
            countryRegionCode: "US",
            provinceCode: "",
            provinceName: "",
            cityName: "1",
            postCode: "1",
            houseNum: "",
            addressOne: "1",
            addressTwo: i.addressTwo,
            subOrderType: 1,
            orderType: 1,
            productList: [{ ...skuListMap[i.sku], quantity: i.count }],
            insuranceFlag: 1,
            signatureTypeList: ["DIRECT", "INDIRECT", "ADULT"],
            countryRegionName: "United States of America (USA)",
            expressTypeList: [
              {
                packQty: 1,
                expressDetailList: [
                  {
                    item: skuListMap[i.sku].sku,
                    availableAmount: skuListMap[i.sku].availableAmount,
                    quantity: i.count,
                  },
                ],
              },
            ],
            appendixList: [pdfInfo],
          };
          await fetch(
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
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              if (data.code == "200") {
                console.log(\`>>>create记录 \${i.orderId} 成功， 结果\`, data);
              } else {
                console.error(">>>单条数据创建create 请求失败:", data);
                throw new Error("单条数据创建create 请求失败");
              }
            })
            .catch((error) => {
              console.log(">>>create请求失败", error);
            });
        });
    })
    .catch((error) => {
      console.error("请求失败:", error);
      console.log(
        "部分数据或全部数据导入失败，可查询草稿查看具体哪些生成成功，剩余的就是失败的: 建议解决方法 1. 数据过期，就重新去飞书表格生产数据 2. 数据太多，就减少一下数量，一次生成100条以内是比较稳妥的。"
      );
      alert("部分数据或全部数据导入失败，详见log");
    });
};
// 获取sku
fetch(
  \`https://oms.xlwms.com/gateway/woms/product/getProductList?type=1&skuOrProductName=&size=50&current=1&whCode=\${whCode}&sizeUnit=cm&weightUnit=kg\`,
  {
    headers: {
      Authorization,
    },
    method: "GET",
  }
)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const skuList = data.data.records;
    // TODO: 这个地方是需要手动维护的, key必须是小写
    skuListMap = {
      "mm-ysj": skuList.find(
        (i) => i.mainCode === "mm-ysj"
      ),
    };
    console.log(">>>>skuList", skuList, skuListMap);
    const errorSkuList = arrInfo.filter((i) => {
      if (!Object.keys(skuListMap).includes(i.sku) || !skuListMap[i.sku]) {
        return i;
      } else {
        return;
      }
    });
    if (errorSkuList.length) {
      alert("sku异常，存在不正确的sku，请检查");
      console.error(">>>异常的sku如下:", errorSkuList);
    } else {
      asyncLimit(1, arrInfo, fn);
    }
  });
`;