// sidebar nav links
export default {
    dashboard: [
        {
            menu_title: "sidebar.dashboard",
            menu_icon: "fas fa-chart-pie",
            new_item: false,
            type_multi: null,
            child_routes: null,
            path: "/app/dashboard",
            resource: 'dashboard'
        },
    ],
    earning: [
        {
            menu_title: "sidebar.earning",
            menu_icon: "fas fa-dollar-sign",
            new_item: false,
            type_multi: null,
            child_routes: [
                {
                    menu_title: "sidebar.overview",
                    path: "/app/earning/overview",
                    new_item: false,
                    resource: "withdraw",
                },
                {
                    menu_title: "sidebar.transaction",
                    path: "/app/earning/withdraw",
                    new_item: false,
                    resource: "withdraw",
                },
            ],
        },
    ],
    orders: [
        {
            menu_title: "sidebar.orders",
            menu_icon: "fas fa-file-invoice-dollar",
            path: "/app/new-modules",
            resource: "orders",
            type_multi: null,
            new_item: false,
            child_routes: [
                // {
                //   menu_title: "sidebar.attraction",
                //   path: "/app/orders/attraction",
                //   new_item: false,
                //   resource: "order",
                // },
                // {
                //   menu_title: "sidebar.cities_Escape",
                //   path: "/app/orders/cities_escape",
                //   new_item: false,
                //   resource: "order",
                // },
                {
                    menu_title: "sidebar.combo",
                    path: "/app/orders/combo",
                    new_item: false,
                    resource: "orders",
                  },
                {
                  menu_title: "sidebar.tours",
                  path: "/app/orders/tours",
                  new_item: false,
                  resource: "orders",
                },
                {
                  menu_title: "sidebar.voucher",
                  path: "/app/orders/voucher",
                  new_item: false,
                  resource: "orders",
                },
                {
                  menu_title: "sidebar.event",
                  path: "/app/orders/event",
                  new_item: false,
                  resource: "orders"
                },
                {
                    menu_title: "sidebar.flight",
                    path: "/app/orders/flight",
                    new_item: false,
                    resource: "orders",
                },
                {
                    menu_title: "sidebar.stay_order",
                    path: "/app/orders/hotel",
                    new_item: false,
                    resource: "orders",
                },
                {
                    menu_title: "sidebar.transfer",
                    path: "/app/orders/transfer",
                    new_item: false,
                    resource: "orders",
                },
                // {
                //   menu_title: "sidebar.hotel",
                //   path: "/app/orders/hotel",
                //   new_item: false,
                //   resource: "order",
                // },
                // {
                //     menu_title: "sidebar.inquiry",
                //     path: "/app/orders/inquiry",
                //     new_item: false,
                //     resource: "order",
                // },
            ],
        },
    ],
    accounts: [
        {
            menu_title: "sidebar.account",
            menu_icon: "fas fa-user",
            resource: "customer",
            new_item: false,
            type_multi: null,
            child_routes: [
                {
                    menu_title: "sidebar.admin",
                    path: "/app/account/admin",
                    new_item: false,
                    resource: "customer",
                },
                {
                    menu_title: "sidebar.registered",
                    path: "/app/account/registered",
                    new_item: false,
                    resource: "customer",
                },
                // {
                //     menu_title: "sidebar.agent",
                //     path: "/app/account/agent",
                //     new_item: false,
                //     resource: "customer",
                // },
                {
                    menu_title: "sidebar.supplier",
                    path: "/app/account/supplier",
                    new_item: false,
                    resource: "customer",
                },
                // {
                //   menu_title: "sidebar.passenger",
                //   path: "/app/account/passenger",
                //   new_item: false,
                //   resource: "customer",
                // },
            ],
        },
    ],
    // restaurent: [
    //     {
    //         menu_title: "sidebar.restaurent",
    //         menu_icon: "fas fa-utensils",
    //         new_item: false,
    //         type_multi: null,
    //         child_routes: null,
    //         path: "/app/stay/restaurant",
    //     },
    // ],
    stay: [
        {
            menu_title: "sidebar.stay",
            menu_icon: "fas fa-hotel",
            type_multi: null,
            new_item: false,
            child_routes: [
                // {
                //   menu_title: "sidebar.amenity",
                //   path: "/app/stay/amenity",
                //   new_item: false,
                // },
                // {
                //     menu_title: "sidebar.restaurant",
                //     path: "/app/stay/restaurant",
                //     new_item: false,
                // },
                {
                    menu_title: "sidebar.room",
                    path: "/app/stay/room",
                    new_item: false,
                    resource: "property"
                },
                {
                    menu_title: "sidebar.cancel_policy",
                    path: "/app/stay/cancel_policy",
                    new_item: false,
                    resource: "property"
                },
                {
                    menu_title: "sidebar.room_util_type",
                    path: "/app/stay/room_util_type",
                    new_item: false,
                    resource: "room_util_type"
                },
                {
                    menu_title: "sidebar.room_util",
                    path: "/app/stay/room_util",
                    new_item: false,
                    resource: "room_util"
                },
                {
                    menu_title: "sidebar.property_type",
                    path: "/app/stay/property_type",
                    new_item: false,
                    resource: "propertyType"
                },
                {
                    menu_title: "sidebar.property",
                    path: "/app/stay/property",
                    new_item: false,
                    resource: "property"
                },
            ],
        },
    ],
    utilities: [
        {
            menu_title: "sidebar.utilities",
            menu_icon: "fa-solid fa-braille",
            type_multi: null,
            new_item: false,
            child_routes: [
                {
                    menu_title: "sidebar.utilities_hotel",
                    path: "/app/utilities/hotel",
                    new_item: false,
                    resource: "property"
                },
                {
                    menu_title: "sidebar.utilities_room",
                    path: "/app/utilities/room",
                    new_item: false,
                    resource: "property"
                }
            ],
        },
    ],
    manageHotel: [
        {
            menu_title: "sidebar.manage_hotel",
            menu_icon: "fa fa-hotel",
            type_multi: null,
            path: "/app/manage-hotel",
            new_item: false
        }
    ],
    otherManager : [
        {
            menu_title: "sidebar.other",
            menu_icon: "fas fa-file-invoice-dollar",

            type_multi: null,

            new_item: false,
            child_routes: [

                {
                    menu_title: "sidebar.manage_popup",
                    menu_icon: "fa fa-cloud",
                    type_multi: null,
                    path: "/app/manage-popup",
                    new_item: false
                },
                {
                    menu_title: "sidebar.utilities_hotel",
                    path: "/app/utilities/hotel",
                    new_item: false,
                    resource: "property"
                },
                {
                    menu_title: "sidebar.utilities_room",
                    path: "/app/utilities/room",
                    new_item: false,
                    resource: "property"
                }

            ],
        },
    ],

    manageBrand: [
        {
            menu_title: "sidebar.manage_brand",
            menu_icon: "fa fa-newspaper",
            type_multi: null,
            path: "/app/manage-brand",
            new_item: false
        }
    ],
    manageEvent: [
        {
            menu_title: "sidebar.manage_event",
            menu_icon: "fa fa-newspaper",
            type_multi: null,
            path: "/app/manage-event",
            new_item: false
        }
    ],
    manageVoucher: [
        {
            menu_title: "sidebar.manage_voucher",
            menu_icon: "fa fa-newspaper",
            type_multi: null,
            path: "/app/manage-voucher",
            new_item: false
        }
    ],
    manageSlider: [
        {
            menu_title: "sidebar.manage_slider",
            menu_icon: "fa fa-bars",
            type_multi: null,
            path: "/app/manage-slider",
            new_item: false
        }
    ],
    // flights: [
    //     {
    //         menu_title: "sidebar.flights",
    //         menu_icon: "fas fa-plane-departure",
    //         new_item: false,
    //         type_multi: null,
    //         child_routes: [

    //             {
    //                 menu_title: "sidebar.airlines",
    //                 path: "/app/masters/airlines",
    //                 new_item: false,
    //                 resource: "airline",
    //             },

    //             {
    //                 menu_title: "sidebar.flight",
    //                 path: "/app/products/flight",
    //                 new_item: false,
    //                 resource: "flight"
    //             },

    //         ],
    //     },
    // ],
    transports: [
        {
            menu_title: "sidebar.transport",
            menu_icon: "fas fa-bus-alt",
            type_multi: null,
            new_item: false,
            child_routes: [
                {
                    menu_title: "sidebar.car_type",
                    path: "/app/transport/car_type",
                    new_item: false,
                    resource: "car_type"
                },
                {
                    menu_title: "sidebar.vehicle",
                    path: "/app/transport/car",
                    new_item: false,
                    resource: "vehicle"
                },
                {
                    menu_title: "sidebar.route_service",
                    path: "/app/transport/route_service",
                    new_item: false,
                    resource: "route_service"
                },
                {
                    menu_title: "sidebar.route",
                    path: "/app/transport/route",
                    new_item: false,
                    resource: "route"
                },
            ],
        },
    ],
    reviews: [
        {
            menu_title: "sidebar.reviews",
            menu_icon: "far fa-thumbs-up",
            // menu_icon: "fas fa-file-invoice-dollar",
            new_item: false,
            type_multi: null,
            child_routes: null,
            path: "/app/reviews",
            resource: "review"
        },
    ],
    files: [
        {
            menu_title: "sidebar.file-manager",
            menu_icon: "fas fa-folder",
            // menu_icon: "fas fa-file-invoice-dollar",
            new_item: false,
            type_multi: null,
            child_routes: null,
            path: "/app/file-manager",
            resource: "media"
        },
    ],
    promotion: [
        {
            menu_title: "sidebar.promotion",
            menu_icon: "fas fa-percent",
            new_item: false,
            type_multi: null,
            child_routes: null,
            path: "/app/promotion",
            resource: "promotion"
        },
    ],
    growthHacking: [
        {
            menu_title: "sidebar.growthHacking",
            menu_icon: "fas fa-chart-line",
            new_item: false,
            type_multi: null,
            child_routes: null,
            path: "/app/growth-hacking",
        },
    ],
    loyalty: [
        {
            menu_title: "sidebar.loyalty",
            menu_icon: "fas fa-medal",
            new_item: false,
            type_multi: null,
            child_routes: [
                {
                    path: "/app/loyalty/rules",
                    menu_title: "sidebar.rules",
                    new_item: false,
                    resource: "loyalty_rule"
                },
                {
                    path: "/app/loyalty/activities",
                    menu_title: "sidebar.activities",
                    new_item: false,
                    resource: "loyalty_activity"
                },
                {
                    menu_title: "sidebar.coupon",
                    path: "/app/loyalty/coupon",
                    new_item: false,
                    resource: "coupon"
                },
            ],
        },
    ],
    newsletter: [
        {
            menu_title: "sidebar.newsletter",
            menu_icon: "fas fa-envelope-open-text",
            new_item: false,
            type_multi: null,
            child_routes: null,
            // path: "/app/newsletter",
            child_routes: [
                {
                    menu_title: "sidebar.newsletter.list",
                    new_item: false,
                    type_multi: null,
                    path: "/app/newsletter/list",
                    resource: "newsletter"
                },
                {
                    menu_title: "sidebar.newsletter.campaign",
                    new_item: false,
                    type_multi: null,
                    path: "/app/newsletter/campaign",
                    resource: "newsletter"
                },
                {
                    menu_title: "sidebar.newsletter.segment",
                    new_item: false,
                    type_multi: null,
                    path: "/app/newsletter/segment",
                    resource: "newsletter"
                },

            ],
        },
    ],
    wishlist: [
        {
            menu_title: "sidebar.wishlist",
            menu_icon: "fas fa-heart",
            new_item: false,
            type_multi: null,
            child_routes: null,
            // path: "/app/wishlist",
            child_routes: [
                {
                    menu_title: "sidebar.wishlist.list",
                    new_item: false,
                    type_multi: null,
                    path: "/app/wishlist/list",
                    resource: "wishlist"
                },
                {
                    menu_title: "sidebar.wishlist.logs",
                    new_item: false,
                    type_multi: null,
                    path: "/app/wishlist/logs",
                    resource: "wishlist"
                },


            ],
        },
    ],
    chat: [
        {
            menu_title: "sidebar.chat",
            menu_icon: "fas fa-comment-alt",
            new_item: false,
            type_multi: null,
            path: "/app/conversation",
            child_routes: null,
            resource: "conversaion"
            // child_routes: [
            //     {
            //         menu_title: "sidebar.conversation",
            //         new_item: false,
            //         type_multi: null,
            //         path: "/app/conversation",
            //         resource: "chat"
            //     },
            // ],
        },
    ],
    // pages: [
    //     {
    //         menu_title: "sidebar.pages",
    //         menu_icon: "fas fa-newspaper",
    //         new_item: false,
    //         type_multi: null,
    //         child_routes: null,
    //         // path: "/app/wishlist",
    //         child_routes: [
    //             {
    //                 menu_title: "sidebar.category",
    //                 path: "/app/masters/category",
    //                 new_item: false,
    //                 resource: "category",
    //             },
    //             {
    //                 menu_title: "sidebar.pages",
    //                 menu_icon: "fas fa-newspaper",
    //                 new_item: false,
    //                 type_multi: null,
    //                 path: "/app/pages",
    //             },
    //         ],
    //     },
    // ],
    holiday: [
        {
            menu_title: "sidebar.holiday",
            menu_icon: "fas fa-umbrella-beach",
            new_item: false,
            type_multi: null,
            child_routes: null,
            child_routes: [
                {
                    menu_title: "sidebar.holiday",
                    path: "/app/holidays",
                    new_item: false,
                    resource: "holiday",
                },
                {
                    menu_title: "sidebar.holiday_exchange",
                    path: "/app/holiday/exchanges",
                    new_item: false,
                    resource: "holiday",
                },
            ]
        },
    ],
    widgets: [
        {
            menu_title: "sidebar.widgets",
            menu_icon: "fas fa-shapes",
            new_item: false,
            type_multi: null,
            child_routes: null,
            path: "/app/widgets",
            resource: "widgets"
        },
    ],
    masters: [
        {
            menu_title: "sidebar.masters",
            menu_icon: "fas fa-tags",
            new_item: false,
            type_multi: null,
            child_routes: [
                {
                    menu_title: "sidebar.travel_point",
                    path: "/app/masters/travel-location",
                    new_item: false,
                    resource: "country",
                },
                {
                    menu_title: "sidebar.country",
                    path: "/app/masters/country",
                    new_item: false,
                    resource: "country",
                },
                {
                    menu_title: "sidebar.destination",
                    path: "/app/masters/destination",
                    new_item: false,
                    resource: "destination",
                },
                {
                    menu_title: "sidebar.email_templates",
                    path: "/app/masters/email_templates",
                    new_item: false,
                    resource: "messagetmpl",
                },
                // {
                //     menu_title: "sidebar.currency",
                //     path: "/app/masters/currency",
                //     new_item: false,
                //     resource: "currency",
                // },
                // {
                //     menu_title: "sidebar.contract",
                //     path: "/app/masters/contract",
                //     new_item: false,
                //     resource: "contract",
                // },
                // {
                //     menu_title: "sidebar.language",
                //     path: "/app/masters/language",
                //     new_item: false,
                // },
            ],
        },
    ],
    settings: [
        {
            menu_title: "sidebar.settings",
            menu_icon: "fas fa-cogs",
            new_item: false,
            type_multi: null,
            child_routes: [
                // {
                //     menu_title: "sidebar.integration",
                //     path: "/app/settings/integration",
                //     new_item: false,
                //     resource: "common"
                // },
                {
                    menu_title: "sidebar.config",
                    path: "/app/settings/config",
                    new_item: false,
                    resource: "config"
                },
                // {
                //     menu_title: "sidebar.office",
                //     path: "/app/settings/office",
                //     new_item: false,
                //     resource: "office"
                // },
                {
                    menu_title: "sidebar.api_key",
                    menu_icon: "zmdi zmdi-link",
                    new_item: false,
                    type_multi: null,
                    child_routes: null,
                    path: "/app/api-key",
                    resource: "api-key"
                },
                {
                    menu_title: "sidebar.grouping",
                    menu_icon: "zmdi zmdi-group",
                    new_item: false,
                    type_multi: null,
                    path: "/app/grouping",
                    resource: "role"
                },
                {
                    menu_title: "sidebar.homepage_widgets",
                    path: "/app/settings/homepage/widgets",
                    new_item: false,
                    resource: "homepage_widgets"
                },
                {
                    menu_title: "sidebar.uactivity",
                    path: "/app/settings/uactivity",
                    menu_icon: "zmdi zmdi-eye",
                    new_item: false,
                    resource: "uactivity"
                },
            ],
        },
    ],

    combo: [
        {
            menu_title: "sidebar.combo",
            menu_icon: "zmdi zmdi-labels",
            new_item: false,
            type_multi: null,
            path: "/app/combo",
            resource: "review",
            child_routes: null
        },
    ],
    tours: [
        {
            menu_title: "sidebar.tours",
            menu_icon: "zmdi zmdi-format-align-center",
            new_item: false,
            type_multi: null,
            path: "/app/products/tours",
            resource: "review",
            child_routes: null
            // child_routes: [
            //     {
            //         menu_title: "sidebar.tours",
            //         path: "/app/products/tours",
            //         new_item: false,
            //         resource: "review"
            //     },
                // {
                //     menu_title: "sidebar.attraction",
                //     path: "/app/products/attraction",
                //     new_item: false,
                //     resource: "ticket"
                // },
                // {
                //     menu_title: "sidebar.cities_Escape",
                //     path: "/app/products/cities_Escape",
                //     new_item: false,
                //     resource: "ticket"
                // },

                // {
                //     menu_title: "sidebar.hotels",
                //     path: "/app/products/hotels",
                //     new_item: false,
                //     resource: "hotel"
                // },
                // {
                //     menu_title: "sidebar.reviews",
                //     path: "/app/products/reviews",
                //     new_item: false,
                //     resource: "review"
                // },
                
            // ],
        },
    ],
    // cruise: [
    //     {
    //         menu_title: "sidebar.cruise",
    //         menu_icon: "zmdi zmdi-boat",
    //         new_item: false,
    //         type_multi: null,
    //         child_routes: null,
    //         path: "/app/cruise",
    //     },
    // ],

    // permissions: [
    //     {
    //         menu_title: "sidebar.grouping",
    //         menu_icon: "zmdi zmdi-group",
    //         new_item: false,
    //         type_multi: null,
    //         path: "/app/grouping",
    //         resource: "group"
    //     },
    // ],

    // reports: [
    //     {
    //         menu_title: "sidebar.reports",
    //         menu_icon: "zmdi zmdi-alert-triangle",
    //         new_item: false,
    //         type_multi: null,
    //         child_routes: [
    //             {
    //                 menu_title: "sidebar.sale_reports",
    //                 path: "/app/reports/sale_reports",
    //                 new_item: false,
    //                 resource: "report"
    //             },
    //             {
    //                 menu_title: "sidebar.customer_report",
    //                 path: "/app/reports/customer_report",
    //                 new_item: false,
    //                 resource: "report"
    //             },
    //         ],
    //     },
    // ],
    messages: [
        {
            menu_title: "sidebar.messages",
            menu_icon: "zmdi zmdi-notifications-active",
            new_item: false,
            type_multi: null,
            child_routes: [
                {
                    menu_title: "sidebar.messages",
                    path: "/app/messages/messages",
                    new_item: false,
                    resource: "messages"
                },
                {
                    menu_title: "sidebar.subscriber",
                    path: "/app/messages/subscribers",
                    new_item: false,
                    resource: "subscriber"
                },
            ],
            path: "/app/messages",
        },
    ],
    // guide: [
    //     {
    //         menu_title: "sidebar.guide",
    //         menu_icon: "zmdi zmdi-walk",
    //         new_item: false,
    //         type_multi: null,
    //         child_routes: [
    //             {
    //                 menu_title: "sidebar.guide",
    //                 path: "/app/guide/guide",
    //                 new_item: false,
    //             },
    //             {
    //                 menu_title: "sidebar.guide_calendar",
    //                 path: "/app/guide/guide_calendar",
    //                 new_item: false,
    //                 resource: "guide_calendar"
    //             },
    //             {
    //                 menu_title: "sidebar.git",
    //                 path: "/app/guide/git",
    //                 new_item: false,
    //             },
    //         ],
    //         path: "/app/guide",
    //     },
    // ],
    statistic: [
        {
            menu_title: "sidebar.statistic",
            menu_icon: "zmdi zmdi-trending-up",
            new_item: false,
            type_multi: null,
            path: "/app/statistic",
            child_routes: [
                {
                    menu_title: "sidebar.account",
                    path: "/app/statistic/account",
                    new_item: false,
                    resource: "statistic_account"
                },
                {
                    menu_title: "sidebar.orders",
                    path: "/app/statistic/order",
                    new_item: false,
                    resource: "statistic_order"
                },
                {
                    menu_title: "sidebar.revenue",
                    path: "/app/statistic/revenue",
                    new_item: false,
                    resource: "statistic_revenue"
                },
                {
                    menu_title: "sidebar.revenue_customer",
                    path: "/app/statistic/revenue_customer",
                    new_item: false,
                    resource: "revenue_customer"
                },
                {
                    menu_title: "sidebar.performance_room",
                    path: "/app/statistic/performance_room",
                    new_item: false,
                    resource: "performance_room"
                }
            ],
        },
    ],
};
