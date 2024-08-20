import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  bitable,
  IAttachmentField,
  FieldType,
  ISingleSelectField,
  IAddFieldConfig,
} from "@lark-base-open/js-sdk";
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // 或其他样式
import Clipboard from 'clipboard';
import { getCodeString } from "./const";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LoadApp />
  </React.StrictMode>
);


const CodeBlock = ({ originArr }: { originArr: any[] }) => {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const codeString = getCodeString(originArr);

  useEffect(() => {
    if (ref.current) {
      hljs.highlightBlock(ref.current);
    }

    // 创建 clipboard 实例并保存到变量中
    const clipboard = new Clipboard(`#copy_btn`, {
      text: () => codeString,
    });

    // 监听复制成功事件
    clipboard.on('success', () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    });

    // 销毁 clipboard 实例
    return () => {
      clipboard.destroy();
    };

  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <button id="copy_btn" style={{ position: 'absolute', top: 12, right: 12, lineHeight: '14px' }}>
        {copied ? '复制成功' : '复制'}
      </button>
      <div style={{
        height: "200px",
        overflowY: "scroll",
        border: "1px dotted rgb(118, 118, 118)",
        padding: "2px 6px 2px 6px",
      }}>
        <pre ref={ref}>
          <code className="javascript">{codeString}</code>
        </pre>
      </div>
    </div>
  );
};

export default function LoadApp() {
  const [needUpdateTableName, setNeedUpdateTableName] = useState("Sheet1");
  const [originArr, setOriginArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const [flag, setFlag] = useState(false);
  const [sortedFileArr, setSortedFileArr] = useState<
    {
      orderId: number;
      pdfUrl: string;
      fileName: any;
    }[]
  >([]);

  const run = async (type: "multi" | "single") => {
    setFlag(true);
    setLoading(true);
    setOriginArr([]);
    setErrorStatus(false);
    setSortedFileArr([]);
    try {
      // 1. 找出表
      const tables = await bitable.base.getTableMetaList();
      console.log(">>>>tables", tables);

      const [needUpdateTable] = tables.filter(({ name }) => {
        return name === needUpdateTableName;
      });

      const table = await bitable.base.getTableById(needUpdateTable.id);
      // 使用数据表table实例的api：getFieldMetaList,获取数据表所有字段信息
      const metaList = await table.getViewMetaList();

      console.log(">>>>metaList", metaList);

      const [{ id: viewId }] = metaList.filter((meta) => {
        return meta.name == "表格";
      });

      // 获取‘表格’列表下的数据
      const { records } = await table.getRecords({ viewId });
      // 获取对应列的id
      const fieldList = await table.getFieldMetaList();
      console.log(">>>>fieldList", fieldList);

      // (1)获取‘sku’列对应的id
      const [{ id: skuFieldId }] = fieldList.filter((meta) => {
        return meta.name === "sku";
      });
      // (2)获取‘面单’列对应的id
      const [pdfField] = fieldList.filter((meta) => {
        return meta.name === "面单";
      });
      const pdfFieldId = pdfField?.id;

      // (2)获取‘批量面单’列对应的id
      const [multiPdfField] = fieldList.filter((meta) => {
        return meta.name === "批量面单";
      });
      const multiPdfFieldId = multiPdfField?.id;

      // (3)获取‘数量’列对应的id
      const [{ id: countFieldId }] = fieldList.filter((meta) => {
        return meta.name === "数量";
      });
      // (4)获取‘序号’列对应的id
      const [{ id: OrderFieldId }] = fieldList.filter((meta) => {
        return meta.name === "id";
      });

      // (5)获取‘sku异常’列对应的id
      const [errorField] = fieldList.filter((meta) => {
        return meta.name === "sku异常";
      });
      const errorFieldId = errorField?.id;
      // (6)获取'已发货'列对应的id
      const [hadFinishField] = fieldList.filter((meta) => {
        return meta.name === "已发货";
      });
      const hadFinishFieldId = hadFinishField?.id;

      console.log(">>>>records", records, pdfFieldId, skuFieldId);

      const attachmentField = await table.getField<IAttachmentField>(
        pdfFieldId
      );

      let commonRecords = records;
      // 过滤sku异常的订单
      if (errorFieldId) {
        commonRecords = commonRecords.filter((i) => {
          return i.fields[errorFieldId]?.text !== "是";
        });
      }

      // 过滤已发货的订单
      if (hadFinishFieldId) {
        commonRecords = commonRecords.filter((i) => {
          return i.fields[hadFinishFieldId]?.text !== "是";
        });
      }

      // 如果批量面单列存在，就读取第一行的批量面单列的值
      const sortedFileNames = await getSortedFileNames();

      const promises = commonRecords.map(async (record) => {
        try {
          let eachLineFirstPdfUrl = "";
          if (type === "single") {
            const eachLinePdfUrls = await attachmentField.getAttachmentUrls(
              record.recordId
            );
            eachLineFirstPdfUrl = eachLinePdfUrls[0];
          }

          console.log(
            ">>>>每行的面单pdf",
            eachLineFirstPdfUrl,
            "sku",
            skuFieldId,
            record.fields[skuFieldId],
            "count",
            countFieldId,
            record.fields[countFieldId]
          );

          // 可能的case
          // >>>>sku {id: 'opt8Jed7rf', text: 'xt-2-10cm'} >>>>count [{ "type": "text", "text": "1"}]
          // >>>>sku [id: 'opt8Jed7rf', text: 'xt-2-10cm'] >>>>count 1

          const sku = Array.isArray(record.fields[skuFieldId])
            ? (record.fields[skuFieldId] as any)[0].text.toLowerCase()
            : (record.fields[skuFieldId] as any).text.toLowerCase();
          const count = Array.isArray(record.fields[countFieldId])
            ? (record.fields[countFieldId] as any)[0].text
            : record.fields[countFieldId];
          const orderId = Number(record.fields[OrderFieldId]);
          const fileName =
            type === "single"
              ? (record.fields[pdfFieldId] as any)[0].name
              : sortedFileNames!.find((i) => i.orderId === orderId)?.fileName;
          const pdfUrl =
            type === "single"
              ? eachLineFirstPdfUrl
              : sortedFileNames!.find((i) => i.orderId === orderId)?.pdfUrl;
          return {
            sku,
            count,
            fileName,
            pdfUrl,
            addressTwo: `核验信息：订单号：${orderId}, sku: ${sku},  数量：${count} `,
            orderId,
            tableName: needUpdateTable.name,
          };
        } catch (error) {
          setErrorStatus(true);
          console.log(">>>生成单条数据失败", error);
          // alert("生成单条数据失败,可能原因：插入了空的数据行、没有创建面单列并上传数据:" + error);
          throw new Error(JSON.stringify(error));
        }
      });

      Promise.all(promises)
        .then((data) => {
          console.log(">>>列表信息", data);

          // 校验一下文件名有没有重复的
          const res = new Set(data.map((i) => i.fileName)).size !== data.length;
          console.log(
            ">>>>文件名查重结果",
            data.map((i) => i.fileName),
            new Set(data).size,
            res
          );
          if (res) {
            alert("有重复的文件,请处理！！！！！");
          }

          setOriginArr(data);
          setSortedFileArr(
            data.map(({ orderId, fileName, pdfUrl }) => {
              return {
                orderId,
                fileName,
                pdfUrl,
              } as { orderId: number; pdfUrl: string; fileName: any };
            })
          );
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setOriginArr([]);
          setLoading(false);
          setErrorStatus(true);
        });

      async function getSortedFileNames() {
        if (multiPdfFieldId && type === "multi") {
          console.log(">>>开始给文件排序");
          const multiPdfRecord = records.find(
            (record) => Number(record.fields[OrderFieldId]) === 1
          );
          const multiPdfFieldAttachmentField =
            await table.getField<IAttachmentField>(multiPdfFieldId);

          // 1. url列表
          const multiPdfFieldAttachmentUrls =
            await multiPdfFieldAttachmentField.getAttachmentUrls(
              multiPdfRecord!.recordId
            );

          // 校验一下上传的面单pdf数量对不对
          const isCountRight =
            multiPdfFieldAttachmentUrls.length === records.length;
          if (!isCountRight) {
            throw new Error(
              `上传的面单pdf数量不匹配, 总共上传了${multiPdfFieldAttachmentUrls.length}个面单,但是总共有${records.length}条记录。请处理！！！`
            );
          }

          // 2. 在面单数量和订单数量匹配的情况下，将 文件名和url链接起来
          const multiPdfFileList = multiPdfRecord!.fields[multiPdfFieldId];
          // 3. 把url列表和面单列表组和起来
          const sortedFileList = multiPdfFieldAttachmentUrls.map((url, i) => {
            return {
              pdfUrl: url,
              fileName: multiPdfFileList[i].name,
            };
          });

          // 对面单进行排序： 文件名如果带有括号，就取括号内的值，比如 "2 (9).pdf", 值就为9; "2 .pdf" 值就为2
          sortedFileList.sort((a, b) => {
            // 提取括号内的数字
            const extractNumber = ({ fileName }) => {
              const match = fileName.match(/\((\d+)\)/);
              return match ? parseInt(match[1], 10) : parseInt(fileName);
            };

            // 对比提取的数字
            return extractNumber(a) - extractNumber(b);
          });

          const sortedFileListWithOrder = sortedFileList.map((v, i) => {
            return { ...v, orderId: i + 1 };
          });

          setSortedFileArr(sortedFileListWithOrder);

          const sortedFileNames = sortedFileListWithOrder.map(
            (i) => i.fileName
          );
          console.log(
            ">>>>multiPdfFieldAttachmentUrls",
            multiPdfFieldAttachmentUrls,
            multiPdfRecord,
            "multiPdfFileList",
            sortedFileNames,
            "sortedFileNames"
          );

          // 校验一下文件名有没有重复的
          const isSortedFileNamesRepeated =
            new Set(sortedFileNames).size !== sortedFileNames.length;
          if (isSortedFileNamesRepeated) {
            throw new Error(
              "批量上传的面单重，存在重复的面单文件,请处理！！！"
            );
          }
          return sortedFileListWithOrder;
        }
      }
    } catch (error) {
      console.log(">>>>run failed, detail info:", error);
      setLoading(false);
      setErrorStatus(true);
      console.log(">>>生成数据失败", error);
      alert("生成数据失败:" + error);
    }
  };

  const handleCreateMultiPdfField = async () => {
    createField("批量面单", {
      name: "批量面单",
      type: FieldType.Attachment,
    });
  };

  const handleCreatePdfField = async () => {
    createField("面单", {
      name: "面单",
      type: FieldType.Attachment,
    });
  };

  const handleCreateSkuErrorField = async () => {
    const fieldItem = await createField("sku异常", {
      name: "sku异常",
      type: FieldType.SingleSelect,
    });

    if (fieldItem) {
      const singleSelectField = fieldItem as ISingleSelectField;
      // 如果是单选类型，默认再给新增一下
      await singleSelectField.addOption("是");
    }
  };

  const handleCreateHadFinishField = async () => {
    const fieldItem = await createField("已发货", {
      name: "已发货",
      type: FieldType.SingleSelect,
    });

    if (fieldItem) {
      const singleSelectField = fieldItem as ISingleSelectField;
      // 如果是单选类型，默认再给新增一下
      await singleSelectField.addOption("是");
    }
  };

  const createField = async (
    fieldName: string,
    fieldConfig: IAddFieldConfig
  ) => {
    // 找出表
    const tables = await bitable.base.getTableMetaList();
    const [needUpdateTable] = tables.filter(({ name }) => {
      return name === needUpdateTableName;
    });
    const table = await bitable.base.getTableById(needUpdateTable.id);
    const fieldList = await table.getFieldMetaList();

    const [field] = fieldList.filter((meta) => {
      return meta.name === fieldName;
    });
    if (field?.id) {
      alert(
        `在${needUpdateTableName}表中${fieldName}列之前已经创建了，无需重新创建~`
      );
      return;
    } else {
      const field = await table.addField(fieldConfig);
      const fieldItem = await table.getField(field);
      alert(`${fieldName}列创建成功！`);
      return fieldItem;
    }
  };
  const arrInfoStr = JSON.stringify(originArr);

  return (
    <div style={{ padding: "20px" }}>
      <h4>1. 输入表格名称，如：Sheet1</h4>
      <input
        type="text"
        onChange={(e) => {
          setNeedUpdateTableName(e.target.value);
        }}
        value={needUpdateTableName}
        style={{ width: "100%" }}
      />

      <div
        style={{
          width: "100%",
          marginTop: "12px",
          border: "1px dotted rgb(118, 118, 118)",
          padding: "3px",
          backgroundColor: "rgba(245, 246, 247, 1)",
        }}
      >
        <button
          onClick={handleCreateMultiPdfField}
          style={{ marginRight: "12px", transform: "scale(0.9)" }}
        >
          给表格插入'批量面单'列(推荐)
        </button>
        <button
          onClick={handleCreatePdfField}
          style={{ marginRight: "12px", transform: "scale(0.9)" }}
        >
          给表格插入'面单'列
        </button>
        <button
          onClick={handleCreateSkuErrorField}
          style={{ marginRight: "12px", transform: "scale(0.9)" }}
        >
          给表格插入'sku异常'列
        </button>
        <button
          onClick={handleCreateHadFinishField}
          style={{ marginRight: "12px", transform: "scale(0.9)" }}
        >
          给表格插入'已发货'列
        </button>
      </div>
      <button onClick={() => run("multi")} style={{ marginTop: "12px", marginRight: "12px" }}>
        开始生成(基于批量面单)
      </button>

      <button onClick={() => run("single")} style={{ marginTop: "12px" }}>
        开始生成(基于面单)
      </button>

      {loading ? (
        <p style={{ color: "gray" }}>生成中...</p>
      ) : (
        <>{flag ? <p style={{ color: "black" }}>执行完毕！</p> : null}</>
      )}

      <h4>2. 检查文件顺序</h4>
      <div
        style={{
          height: "100px",
          overflowY: "scroll",
          backgroundColor: "rgb(245, 246, 247)",
          border: "1px solid rgb(118, 118, 118)",
          padding: "2px 6px 2px 6px",
        }}
      >
        {sortedFileArr.map(({ fileName, orderId, pdfUrl }) => {
          return (
            <p style={{ fontSize: "12px" }} key={fileName + orderId}>
              <span
                style={{
                  marginRight: "6px",
                  width: "50px",
                  display: "inline-block",
                }}
              >
                id: {orderId}
              </span>
              <a href={pdfUrl}>{fileName}</a>
            </p>
          );
        })}
      </div>

      <h4>3. 复制脚本</h4>
      <p>注意：数据在十分钟内有效， 过期之后需要重新点击‘开始生成’按钮</p>
      {errorStatus ? (
        <p style={{ color: "red" }}>
          生成失败！有异常情况，请关注弹窗信息 或联系管理员
        </p>
      ) : null}
      {flag && !loading && !errorStatus ? (
        <p style={{ color: "green" }}>
          生成成功！过滤已发货的订单以及sku异常的订单，总共还有
          <span style={{ fontWeight: "500", color: "goldenrod" }}>
            {originArr.length}
          </span>
          条订单
        </p>
      ) : null}
      {originArr.length ?
        <CodeBlock originArr={originArr} />
        : null}

    </div>
  );
}
