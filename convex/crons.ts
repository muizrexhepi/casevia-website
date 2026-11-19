import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
const crons = cronJobs();
crons.interval(
  "Sales workflow sweep",
  { minutes: 5 },
  internal.automation.tick,
  {},
);
crons.interval(
  "Zoho reply synchronization",
  { minutes: 5 },
  internal.zoho.sync,
  {},
);
crons.interval(
  "Recover interrupted work",
  { minutes: 10 },
  internal.integrations.recovery,
  {},
);
crons.interval(
  "Deliver owner notifications",
  { minutes: 5 },
  internal.push.deliver,
  {},
);
export default crons;
