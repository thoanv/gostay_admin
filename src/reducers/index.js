/**
 * App Reducers
 */
import { combineReducers } from "redux";
import AccountReducer from "./AccountReducer";
import AirlineReducer from "./AirlineReducer";
import AssetReducer from "./AssetReducer";
import authUserReducer from "./AuthUserReducer";
import CategoryReducer from "./CategoryReducer";
import ItineraryReducer from "./ItineraryReducer";
import ContractReducer from "./ContractReducer";
import CountryReducer from "./CountryReducer";
import customer from "./CustomerReducer";
import DestinationReducer from "./DestinationReducer";
import GroupReducer from "./GroupReducer";
import settings from "./settings";
import sidebarReducer from "./SidebarReducer";
import TourReducer from "./TourReducer";
import { listProduct } from "./ProductReducer";
import ConfigReducer from "./ConfigReducer";
import FileManager from "./FileManagerReducer";
import ReviewReducer from "./ReviewReducer";
import RulesReducer from "./RulesReducer";
import FlightReducer from "./FlightReducer";
import CommonReducer from "./CommonReducer";
import CurrencyReducer from "./CurrencyReducer";
import Email_templatesReducer from "./Email_templatesReducer";
import WidgetReducer from "./WidgetReducer";
import OrderTourReducer from "./OrderTourReducer";
import MessagesReducer from "./MessagesReducer";
import SubcribersReducer from "./SubcribersReducer";
import PagesReducer from "./PagesReducer";
import OfficeReducer from "./OfficeReducer";
import CouponReducer from "./CouponReducer";
import ActivityReducer from "./ActivityReducer";
import HotelReducer from "./HotelReducer";
import InquiryReducer from "./InquiryReducer";
import TicketReducer from "./TicketReducer";
import GuideCalendarReducer from "./GuideCalendarReducer";
import GitReducer from "./GitReducer";
import SendMessagesResucer from "./SendMessagesResucer";
import chatAppReducer from "./ChatAppReducer";
import InboxReducer from "./InboxReducer";
import TicketItineraryReducer from "./TicketItineraryReducer";
import ReportReducer from "./ReportReducer";
import CruiseReducer from "./CruiseReducer";
import AmenityReducer from "./AmenityReducer";
import RestaurantReducer from "./RestaurantReducer";
import PropertyTypeReducer from "./PropertyTypeReducer";
import PropertyReducer from "./PropertyReducer";
import RoomReducer from "./RoomReducer";
import CancelPolicyReducer from "./CancelPolicyReducer";
import CarReducer from "./CarReducer";
import Permission from './PermissionReducer';
import RouteReducer from "./RouteReducer";
import NewsletterReducer from "./NewsletterReducer";
import GrowthHackingCampaignReducer from "./GrowthHackingCampaignReducer";
import GrowthHackingRuleReducer from "./GrowthHackingRuleReducer";
import promotion from './PromotionReducer';
import ApiKeyReducer from './ApiKeyReducer';
import ProvincesReducer from './ProvincesReducer';
import DistrictsReducer from './DistrictsReducer';
import WardsReducer from './WardsReducer';
import RoomUtilTypeReducer from "./RoomUtilTypeReducer";
import RoomUtilReducer from "./RoomUtilReducer";
import WishlistReducer from "./WishlistReducer";
import EarningReducer from "./EarningReducer";
import TransactionsReducer from "./TransactionsReducer";
import transportOrder from './TransportBookingReducer';
import route_service from './RouteServiceReducer';
import flightOrder from './FlighttBookingReducer'
import HolidayReducer from "./HolidayReducer";
import CarTypeReducer from './CarTypeReducer';
import ComboReducer from "./ComboReducer";
import OrderComboReducer from "./OrderComboReducer";
import TravelLocationReducer from "./TravelLocationReducer";
import UtilitiesHotelReducer from "./UtilitiesHotelReducer";
import UtilitiesRoomReducer from "./UtilitiesRoomReducer";
import ManagePopupReducer from "./ManagePopupReducer";
import ManageSliderReducer from "./ManageSliderReducer";
import ManageBrandReducer from "./ManageBrandReducer";
import ManageHotelReducer from './ManageHotelReducer';
import ManageEventReducer from "./ManageEventReducer";
import ManageVoucherReducer from "./ManageVoucherReducer";

const reducers = combineReducers({
  settings,
  sidebar: sidebarReducer,
  config: ConfigReducer,
  authUser: authUserReducer,
  customer: customer,
  itinerary: ItineraryReducer,
  flight: FlightReducer,
  group: GroupReducer,
  asset: AssetReducer,
  category: CategoryReducer,
  destination: DestinationReducer,
  country: CountryReducer,
  ticket: TicketReducer,
  tour: TourReducer,
  hotel: HotelReducer,
  airline: AirlineReducer,
  review: ReviewReducer,
  account: AccountReducer,
  rules: RulesReducer,
  common: CommonReducer,
  listProduct,
  fileManager: FileManager,
  currency: CurrencyReducer,
  email_template: Email_templatesReducer,
  widget: WidgetReducer,
  orderTour: OrderTourReducer,
  office: OfficeReducer,
  coupon: CouponReducer,
  inquiry: InquiryReducer,
  guideCalendar: GuideCalendarReducer,
  git: GitReducer,
  messages: MessagesReducer,
  subcribers: SubcribersReducer,
  activity: ActivityReducer,
  send_messages: SendMessagesResucer,
  pages: PagesReducer,
  chatAppReducer,
  inboxReducer: InboxReducer,
  ticketitinerary: TicketItineraryReducer,
  report: ReportReducer,
  cruise: CruiseReducer,
  amenity: AmenityReducer,
  restaurant: RestaurantReducer,
  property_type: PropertyTypeReducer,
  property: PropertyReducer,
  room: RoomReducer,
  cancel_policy: CancelPolicyReducer,
  car: CarReducer,
  permission: Permission,
  route: RouteReducer,
  newsletter: NewsletterReducer,
  province: ProvincesReducer,
  district: DistrictsReducer,
  ward: WardsReducer,
  room_util_type: RoomUtilTypeReducer,
  room_util: RoomUtilReducer,

  growthHackingCampaign: GrowthHackingCampaignReducer,
  growthHackingRule: GrowthHackingRuleReducer,
  promotion,
  apiKey: ApiKeyReducer,

  wishlist: WishlistReducer,
  earning: EarningReducer,
  transaction: TransactionsReducer,
  transportOrder,
  flightOrder,
  route_service,
  holiday: HolidayReducer,
  car_type: CarTypeReducer,
  combo: ComboReducer,
  orderCombo: OrderComboReducer,
  travellocation: TravelLocationReducer,
  utilitiesHotel: UtilitiesHotelReducer,
  utilitiesRoom: UtilitiesRoomReducer,
  managePopup: ManagePopupReducer,
  manageSlider: ManageSliderReducer,
  manageBrand: ManageBrandReducer,
  manageHotel: ManageHotelReducer,
  manageEvent: ManageEventReducer,
  manageVoucher: ManageVoucherReducer,
});

export default reducers;
