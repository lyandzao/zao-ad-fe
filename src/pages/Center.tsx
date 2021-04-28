import styled from "@emotion/styled";
import { Button, Form, Input, message, Popconfirm } from "antd";
import Avatar from "@/components/Avatar";
import { userState } from "@/globalState/user";
import { useState } from "react";
import { ROLE } from "@/constants";
import { useRequest } from "ahooks";
import { updateUser } from "@/apis/user";
import { getImgUrl } from "@/utils";
import { BoxWrapper } from "@/styles/wrapper";
import FooterBtnGroup from "@/components/FooterBtnGroup";
import { useUser } from "@/hooks/useUser";

const { Item } = Form;

const Center = () => {
  const { user, refreshUserStatus } = useUser();
  const [avatar, setAvatar] = useState<any>();
  const [form] = Form.useForm();
  const initialValues = {
    username: user.username,
    role: (ROLE as any)[user.role],
    name: user.name,
  };

  const { loading, run } = useRequest(updateUser, {
    manual: true,
    onSuccess: (res) => {
      message.success("保存成功");
      refreshUserStatus();
    },
  });
  const handleSubmit = async () => {
    const res = await form.validateFields();
    const req = new FormData();
    req.set("avatar", avatar);
    req.set("name", res.name);
    run(req);
  };
  return (
    <div>
      <BoxWrapper>
        <h2>个人中心</h2>
        <div>
          <Avatar
            bind={setAvatar}
            initialData={getImgUrl(user.avatar)}
            allowEdit
            showEdit
          />
          <Form form={form} layout="vertical" initialValues={initialValues}>
            <Item label="账户" name="username">
              <Input disabled />
            </Item>
            <Item label="角色" name="role">
              <Input disabled />
            </Item>
            <Item
              label="用户名"
              name="name"
              rules={[{ required: true, message: "请填写用户名" }]}
            >
              <Input placeholder="请填写用户名" />
            </Item>
          </Form>
        </div>
      </BoxWrapper>
      <FooterBtnGroup onConfirm={handleSubmit} loading={loading} />
    </div>
  );
};

export default Center;
