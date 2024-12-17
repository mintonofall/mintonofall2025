//id가 4인 사용자가 속한 클럽을 찾는 함수

import db from "./db";

const syssop = async () => {
  const syssop = await db.club.findMany({
    where: {
      users: {
        some: {
          id: 4,
        },
      },
    },
  });
  console.log("syssop : ", syssop);
};
