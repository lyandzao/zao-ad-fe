import { IApp } from "./app";
import axios from "./index";

export interface IBuried {
  _id: string;
  app_id: string;
  event: string;
  desc: string;
  data: {
    date: number;
    date_string: string;
    click: number;
    show: number;
  };
}

export interface ICreateCustomBuriedReq {
  app_id: string;
  event: string;
  desc: string;
}

export const createCustomBuried = (
  req: ICreateCustomBuriedReq
): Promise<IBuried> => axios.post("/self/create", req);

export const updateCustomBuried = (req: {
  buried_id: string;
  desc: string;
}): Promise<{}> => axios.post("/self/update", req);

export const getCustomBuriedList = (app_id: string): Promise<IBuried[]> =>
  axios.get("/self/list", { params: { app_id } });

export interface IGetCustomBuriedInfoRes extends IBuried {
  app: IApp;
}
export const getCustomBuriedInfo = (
  buried_id: string
): Promise<IGetCustomBuriedInfoRes> =>
  axios.get("/self/info", { params: { buried_id } });

export interface IGetCustomBuriedReportReq {
  event_id: string;
  start: string;
  end: string;
}
export interface IGetCustomBuriedReportRes {
  date: number;
  date_string: string;
  click: number;
  show: number;
  click_rate: number;
}
export const getCustomBuriedReport = (
  req: IGetCustomBuriedReportReq
): Promise<IGetCustomBuriedReportRes[]> =>
  axios.get("/self/report", {
    params: req,
  });

export interface IGetCustomTopBuriedRes {
  _id: string;
  value: number;
  event_name: string;
}
export const getCustomTopBuried = (req: {
  app_id: string;
  type: string;
}): Promise<IGetCustomTopBuriedRes[]> =>
  axios.get("/self/top", { params: req });

export const getCustomBuriedName = (app_id: string): Promise<any> =>
  axios.get("/self/name", { params: { app_id } });

export interface IGetFilterBuriedList extends IApp {
  events: IBuried[];
}
export const getFilterBuriedList = (): Promise<IGetFilterBuriedList[]> =>
  axios.get("/self/filter_list");

export const deleteEvent = (event_id: string): Promise<{}> =>
  axios.get("/self/delete", { params: { event_id } });
