import React from 'react';


const Toaster = React.lazy(() => import('./views/notifications/toaster/Toaster'));
const Tables = React.lazy(() => import('./views/base/tables/Tables'));

const Apiaries = React.lazy(() => import('./views/apiaries/Apiaries'));
const Beehives = React.lazy(() => import('./views/beehives/Beehives'));
const PlannedOperations = React.lazy(() => import('./views/operations/PlannedOperations'));
const FinishedOperations = React.lazy(() => import('./views/operations/FinishedOperations'));
const CalendarComponent = React.lazy(() => import('./views/calendar/Calendar'));
const OperationDetailedView = React.lazy(() => import('./views/operations/OperationDetailedView'));
const OperationsTemplates = React.lazy(() => import('./views/operations/OperationsTemplates'));
const OngoingOperations = React.lazy(() => import('./views/operations/OngoingOperations'));

const ApiaryDetailedView = React.lazy(() => import('./views/apiaries/ApiaryDetailedView'));
const BeehiveDetailedView = React.lazy(() => import('./views/beehives/BeehiveDetailedView'));

const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/base/cards/Cards'));
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
const BasicForms = React.lazy(() => import('./views/base/forms/BasicForms'));

const Jumbotrons = React.lazy(() => import('./views/base/jumbotrons/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
const Navbars = React.lazy(() => import('./views/base/navbars/Navbars'));
const Navs = React.lazy(() => import('./views/base/navs/Navs'));
const Paginations = React.lazy(() => import('./views/base/paginations/Pagnations'));
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
const ProgressBar = React.lazy(() => import('./views/base/progress-bar/ProgressBar'));
const Switches = React.lazy(() => import('./views/base/switches/Switches'));

const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/buttons/brand-buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/buttons/button-dropdowns/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
const Charts = React.lazy(() => import('./views/charts/Charts'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
const Brands = React.lazy(() => import('./views/icons/brands/Brands'));
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const Typography = React.lazy(() => import('./views/theme/typography/Typography'));
const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/UserDetailedView'));
const Settings = React.lazy(() => import('./views/settings/Settings'));
const Plans = React.lazy(() => import('./views/plans/Plans'));
const PlansTemplates = React.lazy(() => import('./views/plans/PlansTemplates'));
const PlanDetailedView = React.lazy(() => import('./views/plans/PlanDetailedView'));
const Templates = React.lazy(() => import('./views/templates/Templates'));
const OperationTemplateDetailedView= React.lazy(() => import('./views/operations/OperationTemplateDetailedView'));
const PlanTemplateDetailedView= React.lazy(() => import('./views/plans/PlanTemplateDetailedView'));


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', name: 'Theme', component: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', name: 'Base', component: Cards, exact: true },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/forms', name: 'Forms', component: BasicForms },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/brands', name: 'Brands', component: Brands },
  { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/notifications/toaster', name: 'Toaster', component: Toaster },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/apiaries', exact: true, name: 'Apiaries', component: Apiaries },
  { path: '/beehives', exact: true, name: 'Beehives', component: Beehives },
  { path: '/apiaries/:id', exact: true, name: 'Apiary Details', component: ApiaryDetailedView },
  { path: '/beehives/:id', exact: true, name: 'Beehive Details', component: BeehiveDetailedView },
  { path: '/operations', exact: true, name: 'Operations', component: PlannedOperations},
  { path: '/templates', exact: true, name: 'Templates', component: Templates},
  { path: '/finished', name: 'Finished', component: FinishedOperations},
  { path: '/ongoing', name: 'Ongoing', component: OngoingOperations},
  { path: '/operations/:id', exact: true, name: 'Operation Details', component:OperationDetailedView },
  { path: '/calendar', name: 'Calendar', component: CalendarComponent},
  { path: '/settings', name: 'Settings', component: Settings},
  { path: '/plans', exact: true, name: 'Plans', component: Plans},
  { path: '/plans/:id', exact: true, name: 'Plan Details', component: PlanDetailedView},
  { path: '/templates/plan/:id', exact: true, name: 'Template Plan Details', component: PlanTemplateDetailedView},
  { path: '/templates/operation/:id', exact:false, name: 'Template Operation Details', component: OperationTemplateDetailedView},
];

export default routes;
