export default [
  {
    data: 'dashboard',
    _tag: 'CSidebarNavItem',
    key: 'sidebar.dashboard',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'info',
      text: 'NEW',
    }
  },
  {
    key: 'sidebar.inventory',
    _tag: 'CSidebarNavTitle',
    _children: ['Inventory']
  },
  {
    key: 'sidebar.apiaries',
    _tag: 'CSidebarNavItem',
    className:'sidebar-apiaries',
    name: 'Apiaries',
    to: '/apiaries',
    exact: false,
    icon: 'apiary-logo',
  },
  {
    key: 'sidebar.beehives',
    _tag: 'CSidebarNavItem',
    className:'sidebar-beehives',
    name: 'Beehives',
    to: '/beehives',
    exact: false,
    icon: 'beehive-logo',
  },
  {
    key: 'sidebar.maintenance',
    _tag: 'CSidebarNavTitle',
    _children: ['Maintenance']
  },
  {
    key: 'sidebar.calendar',
    _tag: 'CSidebarNavItem',
    name: 'Calendar',
    className:'sidebar-calendar',
    to: '/calendar',
    icon: 'calendar-logo',
  },
  {
    key: 'sidebar.plans',
    _tag: 'CSidebarNavItem',
    name: 'Plans',
    className:'sidebar-plans' ,
    to: '/plans',
    exact: false,
    icon: 'plan-logo',
  },
  {
    key: 'sidebar.operations',
    _tag: 'CSidebarNavDropdown',
    name: 'Operations',
    className: 'sidebar-operations',
    icon: 'operation-logo',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Planned',
        key: 'sidebar.operations',
        className:'sidebar-planned' ,
        to: '/operations',
      },
      {
        key: 'sidebar.operations.ongoing',
        _tag: 'CSidebarNavItem',
        name: 'Ongoing',
        className:'sidebar-ongoing' ,
        to: '/ongoing',
      },
      {
        key: 'sidebar.operations.finished',
        _tag: 'CSidebarNavItem',
        name: 'Finished',
        className:'sidebar-finished' ,
        to: '/finished',
      },
    ]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Templates',
    className: 'sidebar-template',
    to: '/templates',
    exact: false,
    icon: 'template-logo',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Configuration']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'User management',
    className:'sidebar-user-management',
    to: '/users',
    icon: 'cil-people',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'System settings',
    className:'sidebar-system-settings',
    to: '/settings',
    icon: 'cil-settings',
  },
  {
    data: 'theme',
    _tag: 'CSidebarNavTitle',
    _children: ['Theme']
  },
  {
    data: 'theme',
    _tag: 'CSidebarNavItem',
    name: 'Colors',
    to: '/theme/colors',
    icon: 'cil-drop',
  },
  {
    data: 'theme',
    _tag: 'CSidebarNavItem',
    name: 'Typography',
    to: '/theme/typography',
    icon: 'cil-pencil',
  },
  {
    data: 'components',
    _tag: 'CSidebarNavTitle',
    _children: ['Components']
  },
  {
    data: 'components',
    _tag: 'CSidebarNavDropdown',
    name: 'Base',
    route: '/base',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Breadcrumb',
        to: '/base/breadcrumbs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Cards',
        to: '/base/cards',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Carousel',
        to: '/base/carousels',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Collapse',
        to: '/base/collapses',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Forms',
        to: '/base/forms',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Jumbotron',
        to: '/base/jumbotrons',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'List group',
        to: '/base/list-groups',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Navs',
        to: '/base/navs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Navbars',
        to: '/base/navbars',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Pagination',
        to: '/base/paginations',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Popovers',
        to: '/base/popovers',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Progress',
        to: '/base/progress-bar',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Switches',
        to: '/base/switches',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tables',
        to: '/base/tables',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tabs',
        to: '/base/tabs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tooltips',
        to: '/base/tooltips',
      },
    ],
  },
  {
    data: 'components',
    _tag: 'CSidebarNavDropdown',
    name: 'Buttons',
    route: '/buttons',
    icon: 'cil-cursor',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Buttons',
        to: '/buttons/buttons',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Brand buttons',
        to: '/buttons/brand-buttons',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Buttons groups',
        to: '/buttons/button-groups',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Dropdowns',
        to: '/buttons/button-dropdowns',
      }
    ],
  },
  {
    data: 'components',
    _tag: 'CSidebarNavItem',
    name: 'Charts',
    to: '/charts',
    icon: 'cil-chart-pie'
  },
  {
    data: 'components',
    _tag: 'CSidebarNavDropdown',
    name: 'Icons',
    route: '/icons',
    icon: 'cil-star',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'CoreUI Free',
        to: '/icons/coreui-icons',
        badge: {
          color: 'success',
          text: 'NEW',
        },
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'CoreUI Flags',
        to: '/icons/flags',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'CoreUI Brands',
        to: '/icons/brands',
      },
    ],
  },
  {
    data: 'components',
    _tag: 'CSidebarNavDropdown',
    name: 'Notifications',
    route: '/notifications',
    icon: 'cil-bell',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Modal',
        to: '/notifications/modals',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Toaster',
        to: '/notifications/toaster'
      }
    ]
  },
  {
    data: 'components',
    _tag: 'CSidebarNavItem',
    name: 'Widgets',
    to: '/widgets',
    icon: 'cil-calculator',
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    _tag: 'CSidebarNavDivider'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Settings'],
  },
]

