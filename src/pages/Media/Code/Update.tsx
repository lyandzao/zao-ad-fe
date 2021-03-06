import { Steps, Row, Col, Spin, message, DatePicker } from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import { useMount, useRequest } from "ahooks";
import { updateCode, getCodeInfo } from "@/apis/code";
import FooterBtnGroup from "@/components/FooterBtnGroup";
import useConfirm from "@/hooks/useConfirm";
import useForm, { IFormItem } from "@/hooks/useForm";
import useUrlSearchParams from "@/hooks/useUrlSearchParams";
import PageHeader from "@/components/PageHeader";
import { getIndustryTreeSelectData, getCodeType } from "@/utils";
import moment from "moment";

const { Step } = Steps;

const Update = () => {
  const history = useHistory();
  const { form, Form, renderFormItem } = useForm();
  const [isSplash, setIsSplash] = useState(false);
  const { showConfirm } = useConfirm({
    title: "修改成功",
    content: "你可以选择返回主页,或者继续修改配置",
    okText: "继续修改",
    onCancel: () => history.push("/flow/code"),
  });
  const code_id = useUrlSearchParams("code_id");

  const getCodeInfoR = useRequest(getCodeInfo, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      if (res.code_type === "splash") {
        setIsSplash(true);
        const _ads_date = res.date ? res.date : [0, 0];
        const dateArr = [moment(_ads_date[0]), moment(_ads_date[1])];
        form.setFieldsValue({
          price: res.price,
          date: dateArr,
        });
      }
      form.setFieldsValue({
        code_type: getCodeType(res.code_type),
        app_id: res.app.app_name,
        shield: res.shield,
        code_name: res.code_name,
      });
    },
  });

  const updateCodeR = useRequest(updateCode, {
    manual: true,
    onSuccess: (res) => {
      message.success("更新成功");
      code_id && getCodeInfoR.run(code_id);
      showConfirm();
    },
  });

  useMount(() => {
    if (code_id) {
      getCodeInfoR.run(code_id);
    }
  });

  const handleSubmit = async () => {
    const res = await form.validateFields();
    const { shield } = res;
    res.shield = JSON.stringify(shield);
    res._id = code_id;
    delete res.app_id;
    console.log(res);
    updateCodeR.run(res);
  };

  const formConfig: IFormItem<any>[] = [
    {
      name: "code_type",
      type: "Input",
      label: "广告位类型",
      disabled: true,
    },
    {
      name: "app_id",
      type: "Input",
      label: "所属应用",
      disabled: true,
    },
    {
      name: "shield",
      type: "TreeSelect",
      label: "屏蔽管理",
      placeholder: "请选择需要屏蔽的行业",
      config: {
        data: getIndustryTreeSelectData(),
      },
    },
    {
      name: "code_name",
      type: "Input",
      label: "广告位名称",
      requiredMessage: "请输入广告位名称",
      placeholder: "请输入广告位名称",
    },
    {
      name: "price",
      type: "Input",
      label: "售价",
      disabled: true,
      requiredMessage: "请输入广告位售价",
      placeholder: "请输入广告位售价",
    },
    {
      name: "date",
      type: "Custom",
      label: "出售时间",
      requiredMessage: "出售时间",
      placeholder: "出售时间",
      customComponent: <DatePicker.RangePicker disabled format="YYYY-MM-DD" />,
    },
  ];

  return (
    <>
      <Row justify="center">
        <Col span={16}>
          <BoxWrapper margin="30px 0 0 0">
            <Steps current={1}>
              <Step title="选择广告位类型" />
              <Step title={"修改配置"} />
            </Steps>
          </BoxWrapper>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          <BoxWrapper>
            <Spin spinning={updateCodeR.loading || getCodeInfoR.loading}>
              <PageHeader title="修改广告位" />
              <Col span={15}>
                <Form>
                  {formConfig.slice(0, 4).map((i) => renderFormItem(i))}
                  {isSplash
                    ? formConfig.slice(4, 6).map((i) => renderFormItem(i))
                    : null}
                </Form>
              </Col>
            </Spin>
          </BoxWrapper>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          <FooterBtnGroup
            onConfirm={handleSubmit}
            onCancel={() => history.push("/flow/code")}
            loading={updateCodeR.loading || getCodeInfoR.loading}
          />
        </Col>
      </Row>
    </>
  );
};

export default Update;
