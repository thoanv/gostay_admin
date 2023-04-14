import Dashboard from "Routes/dashboard";
import Orders from "../routes/orders";

import Account from "../routes/account";
import Products from "../routes/products";
import Masters from "../routes/masters";
import Settings from "../routes/settings";
// import Itineraries from "../routes/itineraries";
import Reports from "../routes/reports";
import Grouping from "../routes/grouping";
// import GoPandaCalendar from "../routes/calendar";
import FileManager from "../routes/fileManager";
import Loyalty from "../routes/loyalty";
import Widgets from "../routes/widgets";
import Messages from "../routes/messages";
// import Pages from "../routes/pages";
// import Guide from "../routes/guide";
// import Vouchers from "Routes/vouchers";
// import TicketItineraries from "../routes/products/itineraries";
import Wishlist from "../routes/wishlist";
import Review from '../routes/review';

// import Assignment from 'Routes/assignment';
// async component
import { AsyncChatComponent } from "Components/AsyncComponent/AsyncComponent";
// import DetailCustomer from "../routes/detailcustomer";
import Stay from "../routes/stay";
import Room_rate from "../routes/room_rate";
import Transport from "../routes/transport";

// newsletter
import Newsletter from '../routes/newsletter';
import ListNewsletter from '../routes/newsletter/Lists';
import Segment from '../routes/newsletter/Recipents';
import GrowthHacking from "../routes/growthHacking";

//promotion
import Promotion from '../routes/promotion';
import ApiKey from "../routes/apiKey";
import Logs from "../routes/wishlist/logs";
import Earning from "../routes/earning";
import Statistic from "../routes/statistics";
import Holiday from "../routes/holiday";
import PrivilegeError from "../routes/error/PrivilegeError";
import HolidayRequest from "../routes/holiday/HolidayRequest";
// import Login from 'Routes/auth';

import Combo from '../routes/combo';
import Utilities from '../routes/utilities';
import ManagePopup from '../routes/manage-popup';
import ManageSlider from '../routes/manage-slider';
import ManageBrand from "../routes/manage-brand";
import EventManagerComponent from "../routes/manage-event";
import VoucherManagerComponent from "../routes/manage-voucher";
import HotelManager from "Routes/manage-hotel";

export default [
  {
    path: "dashboard",
    component: Dashboard,
  },
  {
    path: "orders",
    component: Orders,
  },
  {
    path: "account",
    component: Account,
  },
  {
    path: "masters",
    component: Masters,
  },
  {
    path: "settings",
    component: Settings,
  },
  {
    path: "reports",
    component: Reports,
  },
  {
    path: "grouping",
    component: Grouping,
  },
  {
    path: "file-manager",
    component: FileManager,
  },
  {
    path: "messages",
    component: Messages,
  },
  {
    path: "stay",
    component: Stay,
  },
  {
    path: "loyalty",
    component: Loyalty,
  },
  {
    path: "widgets",
    component: Widgets,
  },
  // {
  //   path: "pages",
  //   component: Pages,
  // },
  {
    path: "utilities",
    component: Utilities,
  },
  {
    path: "manage-popup",
    component: ManagePopup,
  },
  {
    path: "manage-slider",
    component: ManageSlider,
  },
  {
    path: "manage-brand",
    component: ManageBrand,
  },
  {
    path: "conversation",
    component: AsyncChatComponent,
  },
  {
    path: "room_rate/:id",
    component: Room_rate,
  },
  {
    path: "transport",
    component: Transport,
  },
  // newsletter
  {
    path: "newsletter/list",
    component: ListNewsletter,
  },
  {
    path: "newsletter/campaign",
    component: Newsletter,
  },
  {
    path: "newsletter/segment",
    component: Segment,
  },
  // end newsletter
  {
    path: "growth-hacking",
    component: GrowthHacking,
  },
  {
    path: "promotion",
    component: Promotion,
  },
  // {
  //   path: "wishlist",
  //   component: Wishlist,
  // },
  {
    path: "wishlist/list",
    component: Wishlist,
  },
  {
    path: "manage-hotel",
    component: HotelManager,
  },
  {
    path: "wishlist/logs",
    component: Logs,
  },
  // api-key
  {
    path: "api-key",
    component: ApiKey,
  },
  {
    path: "earning",
    component: Earning,
  },
  {
    path: "reviews",
    component: Review,
  },
  {
    path: "statistic",
    component: Statistic
  },
  {
    path: "holidays",
    component: Holiday
  },
  {
    path: "products",
    component: Products
  },
  {
    path: 'combo',
    component: Combo
  },
  {
    path: "holiday/exchanges",
    component: HolidayRequest
  },{
    path: "manage-event",
    component: EventManagerComponent
  },
  {
    path: "manage-voucher",
    component: VoucherManagerComponent
  },
  {
    path: "403",
    component: PrivilegeError
  }
];
