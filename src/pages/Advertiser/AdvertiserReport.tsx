import { useEffect } from "react";
import { Line, DualAxes } from "@ant-design/charts";
import { getAdsList, IAds } from "@/apis/ads";
import {
  getAdsReportChart,
  getAdsReportTable,
  IGetAdsReportChartReq,
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
import { getTime, getNameFromIndustryCode } from "@/utils";
import moment from "moment";
import { CODE_TYPE, EVENT_TYPE } from "@/constants";

const { Item, useForm } = Form;
const { RangePicker } = DatePicker;

const ReportWrapper = styled.div`
  margin: 50px;
  padding-bottom: 50px;
  .ant-form-item-label {
    text-align: left;
  }
`;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const AdvertiserReport = () => {
  const [data, setData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [adsInfoListData, setAdsInfoListData] = useState<IAds[]>([]);
  const [initAdsId, setInitAdsId] = useState("");
  const [reqConfig, setReqConfig] = useState<IGetAdsReportChartReq>();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [form] = useForm();

  const [indicators, setIndicators] = useState("show");
  const [date, setDate] = useState("day");

  const getAdsInfoListR = useRequest(getAdsList, {
    manual: true,
    onSuccess: (res) => {
      setAdsInfoListData(res);
      if (res.length > 0) {
        setInitAdsId(res[0]._id);
        form.setFieldsValue({
          ads_id: res[0]._id,
        });
      }
    },
  });

  const getReportChartR = useRequest(getAdsReportChart, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setData(res);
    },
  });

  const getReportTableR = useRequest(getAdsReportTable, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setTableData(res.data);
      setTotal(res.pagination.total);
    },
  });

  useEffect(() => {
    if (initAdsId) {
      const start = getTime("yesterday")?.start;
      const end = getTime("yesterday")?.end;
      const req = {
        ads_id: initAdsId,
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
  }, [initAdsId]);

  useMount(() => {
    getAdsInfoListR.run();
  });

  const handleDateRange1Change = (time: any, timeString: any) => {
    console.log(timeString);
    setDate("");
    const req: any = {};
    req.ads_id = reqConfig?.ads_id;
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
    req.ads_id = reqConfig?.ads_id;
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

  const handleAdsIdChange = (e: any) => {
    console.log(e);
    const req: any = reqConfig;
    req.ads_id = e;
    setReqConfig(req);
    getReportChartR.run(req);
  };

  const handleIndicatorsChange = (e: any) => {
    setIndicators(e);
    const req: any = {
      ads_id: reqConfig?.ads_id,
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
      dataIndex: "buried_date_string",
      key: "buried_date_string",
      // render: (text: any) => text,
    },
    {
      title: " ????????????ID",
      dataIndex: "_id",
      key: "_id",
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
      dataIndex: "pay_method",
      key: "pay_method",
    },
    {
      title: "????????????",
      dataIndex: "ads_amount",
      key: "ads_amount",
    },
    {
      title: "????????????",
      dataIndex: "buried_event",
      key: "buried_event",
      render: (text: any) => (EVENT_TYPE as any)[text],
    },
    {
      title: "???",
      dataIndex: "buried_value",
      key: "buried_value",
      // render: (text: any) => text,
    },
  ];
  return (
    <ReportWrapper>
      <Spin spinning={getAdsInfoListR.loading}>
        <BoxWrapper width="100%">
          <Form
            {...layout}
            form={form}
            style={{ width: "600px" }}
            initialValues={{ date: "day" }}
          >
            <Item label="?????????????????????" name="ads_id">
              <Select onChange={handleAdsIdChange}>
                {adsInfoListData.map((i) => (
                  <Select.Option key={i._id} value={i._id}>
                    {i.ads_name}
                  </Select.Option>
                ))}
              </Select>
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
      </Spin>
      <BoxWrapper width="100%">
        <Line {...config} />
      </BoxWrapper>
      <BoxWrapper width="100%">
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
    </ReportWrapper>
  );
};

export default AdvertiserReport;
