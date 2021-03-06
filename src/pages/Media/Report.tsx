import { useEffect } from "react";
import { Line, DualAxes } from "@ant-design/charts";
import { getAdsList } from "@/apis/ads";
import {
  getReportChart,
  getReportTable,
  IGetReportChartReq,
} from "@/apis/report";
import { useRequest, useMount } from "ahooks";
import { BoxWrapper } from "@/styles/wrapper";
import { getCodeName } from "@/apis/code";
import styled from "@emotion/styled";
import { useState } from "react";
import {
  Select,
  Form,
  DatePicker,
  Radio,
  Cascader,
  Spin,
  Row,
  Col,
  Checkbox,
  Tag,
  Table,
  Space,
} from "antd";
import { getAppInfoList } from "@/apis/app";
import { getTime, getNameFromIndustryCode } from "@/utils";
import moment from "moment";
import { CODE_TYPE, EVENT_TYPE } from "@/constants";

const { Item, useForm } = Form;
const { RangePicker } = DatePicker;

const ReportWrapper = styled.div`
  /* margin: 50px; */
  /* padding-bottom: 50px; */
  .ant-form-item-label {
    text-align: left;
  }
`;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const Report = () => {
  const [data, setData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [appInfoListData, setAppInfoListData] = useState<any[]>([]);
  const [initCodeId, setInitCodeId] = useState("");
  const [reqConfig, setReqConfig] = useState<IGetReportChartReq>();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [form] = useForm();

  const [indicators, setIndicators] = useState("show");
  const [date, setDate] = useState("day");

  const getAppInfoListR = useRequest(getAppInfoList, {
    manual: true,
    onSuccess: (res) => {
      let initCount = 0;
      const _res = res.map((i) => {
        return {
          value: i._id,
          label: i.app_name,
          children: i.codes.map((j) => {
            if (j._id && initCount === 0) {
              form.setFieldsValue({
                code_id: [i._id, j._id],
              });
              setInitCodeId(j._id);
              initCount = initCount + 1;
            }
            return { value: j._id, label: j.code_name };
          }),
        };
      });
      setAppInfoListData(_res);
    },
  });

  const getReportChartR = useRequest(getReportChart, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setData(res);
    },
  });

  const getReportTableR = useRequest(getReportTable, {
    manual: true,
    onSuccess: (res) => {
      setTableData(res.data);
      setTotal(res.pagination.total);
    },
  });

  useEffect(() => {
    if (initCodeId) {
      const start = getTime("yesterday")?.start;
      const end = getTime("yesterday")?.end;
      const req = {
        code_id: initCodeId,
        type: "show",
        start,
        end,
      };
      form.setFieldsValue({
        date_range1: [moment(start), moment(end)],
      });
      setReqConfig(req);
      getReportChartR.run(req);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initCodeId]);

  useMount(() => {
    getAppInfoListR.run();
  });

  const handleDateRange1Change = (time: any, timeString: any) => {
    console.log(timeString);
    setDate("");
    const req: any = {};
    req.code_id = reqConfig?.code_id;
    req.type = reqConfig?.type;
    req.start = timeString[0];
    req.end = timeString[1];
    setReqConfig(req);
    getReportChartR.run(req);
  };

  const handleDateChange = (e: any) => {
    console.log(e.target.value);
    setDate(e.target.value);
    const req: any = {};
    let start = reqConfig?.start;
    let end = reqConfig?.end;
    req.code_id = reqConfig?.code_id;
    req.type = reqConfig?.type;
    if (e.target.value === "day") {
      start = getTime("yesterday")?.start;
      end = getTime("yesterday")?.end;
    }
    if (e.target.value === "week") {
      start = getTime("week")?.start;
      end = getTime("week")?.end;
    }
    if (e.target.value === "month") {
      start = getTime("month")?.start;
      end = getTime("month")?.end;
    }
    req.start = start;
    req.end = end;
    form.setFieldsValue({
      date_range1: [moment(start), moment(end)],
    });
    setReqConfig(req);
    getReportChartR.run(req);
  };

  const handleCodeIdChange = (e: any) => {
    console.log(e);
    const req: any = reqConfig;
    if (e.length > 1) {
      req.code_id = e[1];
      setReqConfig(req);
      getReportChartR.run(req);
    }
  };

  const handleIndicatorsChange = (e: any) => {
    setIndicators(e);
    const req: any = {
      code_id: reqConfig?.code_id,
      type: e,
      start: reqConfig?.start,
      end: reqConfig?.end,
    };
    setReqConfig(req);
    getReportChartR.run(req);
  };

  useMount(() => {
    getReportTableR.run({ current, page_size: pageSize });
  });

  const config = {
    data: data,
    height: 400,
    xField: "date_string",
    yField: "value",
    seriesField: "event",
    point: {
      size: 5,
      shape: "diamond",
    },
  };

  const columns = [
    {
      title: "??????",
      dataIndex: "date_string",
      key: "date_string",
      // render: (text: any) => text,
    },
    {
      title: "??????ID",
      dataIndex: "_id",
      key: "_id",
      // render: (text: any) => text,
    },
    {
      title: "????????????",
      dataIndex: "app_name",
      key: "app_name",
      // render: (text: any) => text,
    },
    {
      title: "??????",
      dataIndex: "industry",
      key: "industry",
      render: (text: any) => getNameFromIndustryCode(text),
    },
    {
      title: "?????????ID",
      dataIndex: "code_id",
      key: "code_id",
      // render: (text: any) => text,
    },
    {
      title: "???????????????",
      dataIndex: "code_name",
      key: "code_name",
      // render: (text: any) => text,
    },
    {
      title: "???????????????",
      dataIndex: "code_type",
      key: "code_type",
      render: (text: any) => (CODE_TYPE as any)[text],
    },
    {
      title: "????????????",
      dataIndex: "event",
      key: "event",
      render: (text: any) => (EVENT_TYPE as any)[text],
    },
    {
      title: "???",
      dataIndex: "value",
      key: "value",
      // render: (text: any) => text,
    },
  ];
  return (
    <ReportWrapper>
      <Spin spinning={getAppInfoListR.loading}>
        <Row justify="center">
          <Col span={18}>
            <BoxWrapper>
              <Form
                {...layout}
                form={form}
                style={{ width: "600px" }}
                initialValues={{ date: "day" }}
              >
                <Item label="??????????????????" name="code_id">
                  <Cascader
                    placeholder="??????????????????"
                    options={appInfoListData}
                    onChange={handleCodeIdChange}
                  />
                </Item>
                <Item label="????????????">
                  <Row gutter={8}>
                    <Col span={12}>
                      <Item noStyle>
                        <Radio.Group value={date} onChange={handleDateChange}>
                          <Radio.Button value="day">??????</Radio.Button>
                          <Radio.Button value="week">??????7???</Radio.Button>
                          <Radio.Button value="month">??????30???</Radio.Button>
                        </Radio.Group>
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item name="date_range1" noStyle>
                        <RangePicker
                          format="YYYY-MM-DD"
                          onChange={handleDateRange1Change}
                        />
                      </Item>
                    </Col>
                  </Row>
                </Item>
                <Item label="??????">
                  <Select
                    placeholder="???????????????"
                    value={indicators}
                    onChange={handleIndicatorsChange}
                  >
                    <Select.Option value="show">?????????</Select.Option>
                    <Select.Option value="click">?????????</Select.Option>
                    <Select.Option value="click_rate">?????????</Select.Option>
                  </Select>
                </Item>
              </Form>
            </BoxWrapper>
          </Col>
        </Row>
      </Spin>
      <Row justify="center">
        <Col span={18}>
          <BoxWrapper margin="0 0 30px 0">
            <Line {...config} />
          </BoxWrapper>
        </Col>
      </Row>

      <Row justify="center">
        <Col span={18}>
          <BoxWrapper margin="0 0 30px 0">
            <Table
              columns={columns}
              dataSource={tableData}
              loading={getReportTableR.loading}
              pagination={{
                total,
                pageSize,
                current,
                showTotal: (total) => `???${total}???`,
              }}
              onChange={(e) => {
                setPageSize(e.pageSize as any);
                setCurrent(e.current as any);
                getReportTableR.run({
                  page_size: e.pageSize as any,
                  current: e.current as any,
                });
              }}
            />
          </BoxWrapper>
        </Col>
      </Row>
    </ReportWrapper>
  );
};

export default Report;
