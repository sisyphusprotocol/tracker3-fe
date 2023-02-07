import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(advancedFormat);
dayjs.extend(timezone);

export { dayjs };
