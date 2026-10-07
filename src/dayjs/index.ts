import dayjs from "dayjs";
import "dayjs/locale/zh-cn.js";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

export default dayjs;
