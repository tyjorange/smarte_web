import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       component: () => import('@/views/redirect/index')
  //     }
  //   ]
  // },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // {
  //   path: '/auth-redirect',
  //   component: () => import('@/views/login/authredirect'),
  //   hidden: true
  // },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/Dashboard',
    children: [
      {
        path: '/Dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/deviceManagement',
    component: Layout,
    redirect: '/ElectricBox',
    name: 'DeviceManagement',
    meta: { title: 'DeviceManagement', icon: 'example' },
    children: [
      {
        path: '/electricBox',
        name: 'ElectricBox',
        component: () => import('@/views/client/deviceManagement/electricBox/index.vue'),
        meta: { title: 'ElectricBox', icon: 'component' }
      },
      // {
      //   path: '/myShare',
      //   name: 'MyShare',
      //   component: () => import('@/views/client/deviceManagement/myShare/index.vue'),
      //   meta: { title: 'MyShare', icon: 'example' }
      // },
      {
        path: '/scene',
        name: 'Scene',
        component: () => import('@/views/client/deviceManagement/scene/index.vue'),
        meta: { title: 'Scene', icon: 'guide' }
      },
      {
        path: '/timingTask',
        name: 'TimingTask',
        component: () => import('@/views/client/deviceManagement/timingTask/index.vue'),
        meta: { title: 'TimingTask', icon: 'excel' }
      }
    ]
  },
  {
    path: '/appStatistics',
    component: Layout,
    redirect: '/electricityDailyIndex',
    name: 'AppStatistics',
    meta: { title: 'AppStatistics', icon: 'tree' },
    children: [
      {
        path: '/electricityDailyIndex',
        name: 'ElectricityDailyIndex',
        component: () => import('@/views/client/appStatistics/electricityDailyIndex/index.vue'),
        meta: { title: 'ElectricityDailyIndex', icon: 'star' }
      },
      {
        path: '/electricityMonthlyIndex',
        name: 'ElectricityMonthlyIndex',
        component: () => import('@/views/client/appStatistics/electricityMonthlyIndex/index.vue'),
        meta: { title: 'ElectricityMonthlyIndex', icon: 'table' }
      },
      {
        path: '/electricityFees',
        name: 'ElectricityFees',
        component: () => import('@/views/client/appStatistics/electricityFees/index.vue'),
        meta: { title: 'ElectricityFees', icon: 'money' }
      }
    ]
  },
  {
    path: '/logBook',
    component: Layout,
    redirect: '/alarmInformation',
    name: 'LogBook',
    meta: { title: 'LogBook', icon: 'list' },
    children: [
      {
        path: '/alarmInformation',
        name: 'AlarmInformation',
        component: () => import('@/views/client/logBook/alarmInformation/index.vue'),
        meta: { title: 'AlarmInformation', icon: 'message' }
      },
      {
        path: '/logInformation',
        name: 'LogInformation',
        component: () => import('@/views/client/logBook/logInformation/index.vue'),
        meta: { title: 'LogInformation', icon: 'form' }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/backend/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/backend/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    redirect: '/realData',
    name: 'Monitor',
    meta: {
      title: 'Monitor',
      icon: 'example',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [{
      path: '/realData',
      name: 'RealData',
      component: () => import('@/views/backend/monitor/realdata/index'),
      meta: {
        title: 'RealData',
        icon: 'table'
        // roles: ['admin'] // or you can only set roles in sub nav
      }
    },
    {
      path: '/hisData',
      name: 'HisData',
      component: () => import('@/views/backend/monitor/hisdata/index'),
      meta: {
        title: 'HisData',
        icon: 'nested'
      }
    },
    {
      path: '/pointUsed',
      name: 'PointUsed',
      component: () => import('@/views/backend/monitor/pointused/index'),
      meta: {
        title: 'PointUsed',
        icon: 'edit'
      }
    }
    ]
  },
  {
    path: '/quality',
    component: Layout,
    redirect: '/powerFactor',
    name: 'Quality',
    meta: {
      title: 'Quality',
      icon: 'size',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [{
      path: '/powerFactor',
      name: 'PowerFactor',
      component: () => import('@/views/backend/quality/powerFactor/index'),
      meta: {
        title: 'PowerFactor',
        icon: 'guide'
      }
    },
    {
      path: '/loadRate',
      name: 'LoadRate',
      component: () => import('@/views/backend/quality/loadRate/index'),
      meta: {
        title: 'LoadRate',
        icon: 'eye'
      }
    }, {
      path: '/pointCurve',
      name: 'PointCurve',
      component: () => import('@/views/backend/quality/pointCurve/index'),
      meta: {
        title: 'PointCurve',
        icon: 'clipboard'
      }
    }, {
      path: '/unbalanceRate',
      name: 'UnbalanceRate',
      component: () => import('@/views/backend/quality/unbalanceRate/index'),
      meta: {
        title: 'UnbalanceRate',
        icon: 'drag'
      }
    }, {
      path: '/balanceReport',
      name: 'BalanceReport',
      component: () => import('@/views/backend/quality/balanceReport/index'),
      meta: {
        title: 'BalanceReport',
        icon: 'nested'
      }
    }, {
      path: '/alarmRecord',
      name: 'AlarmRecord',
      component: () => import('@/views/backend/quality/alarmRecord/index'),
      meta: {
        title: 'AlarmRecord',
        icon: 'tab'
      }
    }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/gradeSubentry',
    name: 'Statistics',
    meta: {
      title: 'Statistics',
      icon: 'nested',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [{
      path: '/gradeSubentry',
      name: 'GradeSubentry',
      component: () => import('@/views/backend/statistics/GradeSubentry'),
      meta: {
        title: 'GradeSubentry',
        icon: 'form'
      }
    }, {
      path: '/gradeTime',
      name: 'GradeTime',
      component: () => import('@/views/backend/statistics/GradeTime'),
      meta: {
        title: 'GradeTime',
        icon: 'form'
      }
    }, {
      path: '/classifyItemTime',
      name: 'ClassifyItemTime',
      component: () => import('@/views/backend/statistics/ClassifyItemTime'),
      meta: {
        title: 'ClassifyItemTime',
        icon: 'form'
      }
    }, {
      path: '/classifySumm',
      name: 'ClassifySumm',
      component: () => import('@/views/backend/statistics/ClassifySumm'),
      meta: {
        title: 'ClassifySumm',
        icon: 'form'
      }
    }, {
      path: '/compHorizontal',
      name: 'CompHorizontal ',
      component: () => import('@/views/backend/statistics/CompH'),
      meta: {
        title: 'CompHorizontal',
        icon: 'form'
      }
    }, {
      path: '/compVertical ',
      name: 'CompVertical',
      component: () => import('@/views/backend/statistics/CompV'),
      meta: {
        title: 'CompVertical',
        icon: 'form'
      }
    }, {
      path: '/compSameTerm ',
      name: 'CompSameTerm',
      component: () => import('@/views/backend/statistics/CompSameTerm'),
      meta: {
        title: 'CompSameTerm',
        icon: 'form'
      }
    }, {
      path: '/usedReport ',
      name: 'UsedReport',
      component: () => import('@/views/backend/statistics/UsedReport'),
      meta: {
        title: 'UsedReport',
        icon: 'form'
      }
    }]
  },
  {
    path: '/record',
    component: Layout,
    redirect: '/enterprise',
    name: 'Record',
    meta: {
      title: 'Record',
      icon: 'message',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [{
      path: '/enterprise',
      name: 'Enterprise',
      component: () => import('@/views/backend/record/enterprise/index'),
      meta: {
        title: 'Enterprise',
        icon: 'tree'
      }
    },
    {
      path: '/energyStructure',
      name: 'EnergyStructure',
      component: () => import('@/views/backend/record/energyStructure/index'),
      meta: {
        title: 'EnergyStructure',
        icon: 'tree'
      }
    },
    {
      path: '/rtuManage',
      name: 'RtuManage',
      component: () => import('@/views/backend/record/rtumanage/index'),
      meta: {
        title: 'RtuManage',
        icon: 'tree'
      }
    },
    {
      path: '/balanceFormula',
      name: 'BalanceFormula',
      component: () => import('@/views/backend/record/balanceformula/index'),
      meta: {
        title: 'BalanceFormula',
        icon: 'tree'
      }
    },
    {
      path: '/alarmParam',
      name: 'AlarmParam',
      component: () => import('@/views/backend/record/alarmparameter/index'),
      meta: {
        title: 'AlarmParam',
        icon: 'tree'
      }
    }
    ]
  },
  /** When your routing table is too long, you can split it into small modules**/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  { path: '*', redirect: '/404', hidden: true }
]
