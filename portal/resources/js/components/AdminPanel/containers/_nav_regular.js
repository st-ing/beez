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
        key: 'sidebar.operations.planned',
        _tag: 'CSidebarNavItem',
        name: 'Planned',
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
    key: 'sidebar.templates',
    _tag: 'CSidebarNavItem',
    name: 'Templates',
    className: 'sidebar-template',
    to: '/templates',
    exact: false,
    icon: 'template-logo',
  },
  {
    key: 'sidebar.settings',
    _tag: 'CSidebarNavTitle',
    _children: ['Settings']
  },
  {
    key: 'sidebar.user.settings',
    _tag: 'CSidebarNavItem',
    className:'sidebar-user-settings',
    name: 'User Settings',
    to: '/users',
    icon: 'user-logo',
  },
]
