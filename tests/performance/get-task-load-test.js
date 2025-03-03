import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: `${__ENV.STAGE_1_DURATION}`, target: __ENV.STAGE_1_TARGET },
    { duration: `${__ENV.STAGE_2_DURATION}`, target: __ENV.STAGE_2_TARGET },
    { duration: `${__ENV.STAGE_3_DURATION}`, target: __ENV.STAGE_3_TARGET },
  ],
};

const TASK_ID = __ENV.TASK_ID;

export default function () {
  let res = http.get(`http://localhost:4000/api/tasks/${TASK_ID}`);

  check(res, {
    "Status 200": (r) => r.status === 200,
    "Response time < 200ms": (r) => r.timings.duration < 200,
  });

  sleep(1);
}
