import { INDUSTRY } from "@/constants";
import * as moment from 'moment';

export const getImgUrl = (url: string) => {
  const res = url.slice(8);
  return `http://${window.location.hostname}:8080${res}`;
};

export const getNameFromIndustryCode = (code: number) => {
  const preCode = Number(code.toString().slice(0, -2));
  const target = INDUSTRY.find((i) => i.code === preCode);
  const res = target?.children.find((i) => i.code === code)?.name;
  return `${target?.name}/${res}`;
};

export const getIndustryArray = (industry: number) => {
  if (!industry) {
    return [];
  }
  return [Number(industry.toString().slice(0, -2)), industry];
};

export const getTime = (tag: 'yesterday' | 'week' | 'month') => {
  const now = (moment as any)().format('YYYY-MM-DD');
  switch (tag) {
    case 'yesterday':
      return {
        start: (moment as any)().subtract(1, 'days').format('YYYY-MM-DD'),
        end: (moment as any)().subtract(1, 'days').format('YYYY-MM-DD'),
      };
    case 'week':
      return {
        start: (moment as any)().subtract(6, 'days').format('YYYY-MM-DD'),
        end: now,
      };
    case 'month':
      return {
        start: (moment as any)().subtract(29, 'days').format('YYYY-MM-DD'),
        end: now,
      };
    default:
      break;
  }
};