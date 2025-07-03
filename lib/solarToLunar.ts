
import { calendar } from 'korean-lunar-calendar';

// korean-lunar-calendar 라이브러리는 별도의 타입(@types)을 제공하지 않아 any 타입을 사용합니다.

interface LunarResult {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
}

/**
 * 양력 날짜를 음력 날짜로 변환합니다.
 * @param year 양력 년도
 * @param month 양력 월 (1-12)
 * @param day 양력 일
 * @returns 음력 날짜 객체 { year, month, day, isLeapMonth }
 */
export function solarToLunar(year: number, month: number, day: number): LunarResult {
  const lunarDate = calendar.solarToLunar(year, month, day);
  
  return {
    year: lunarDate.lunarYear,
    month: lunarDate.lunarMonth,
    day: lunarDate.lunarDay,
    isLeapMonth: lunarDate.isLeapMonth,
  };
}

// --- 사용 예시 ---
/*
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();

const lunarDate = solarToLunar(year, month, day);

console.log(`양력: ${year}년 ${month}월 ${day}일`);
console.log(`음력: ${lunarDate.year}년 ${lunarDate.month}월 ${lunarDate.day}일 ${lunarDate.isLeapMonth ? '(윤달)' : ''}`);

// 특정 날짜 변환
const specificLunarDate = solarToLunar(2024, 7, 3);
console.log(`양력 2024년 7월 3일은 음력으로 ${specificLunarDate.year}년 ${specificLunarDate.month}월 ${specificLunarDate.day}일 입니다.`);
*/

