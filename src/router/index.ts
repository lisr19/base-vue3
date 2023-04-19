import {createRouter, createWebHashHistory} from 'vue-router';
import Layout from '@/layout/index.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/:pathMatch(.*)*', 	// 匹配不到路由跳转页面，真实项目中去除
            redirect: '/working',
            component: () => Layout,
            children: [
                {
                    path: '/:pathMatch(.*)*',
                    meta: {title: 'working'},
                    component: () => import('@/layout/working.vue')
                },
            ]
        },
        {
            path: '/login',
            component: () => import('@/views/Login/index.vue'),
            meta: {
                title: '登录'
            }
        },
        {
            path: '/',
            redirect: '/workTable',
            component: Layout,
            children: [
                {
                    path: '/workTable',
                    meta: {title: '我的工作台'},
                    component: () => import('@/views/workTable/index.vue')
                },
            ]
        },
        {
            path: '/my',
            redirect: '/my/account',
            component: Layout,
            meta: {title: '个人中心'},
            children: [
                {
                    path: 'account',
                    name: 'Account',
                    component: () => import('@/views/my/Account.vue'),
                    meta: {title: '账号信息'}
                },
            ]
        },
        {
            path: '/admin',
            redirect: '/admin/users',
            component: Layout,
            meta: {title: '系统管理'},
            children: [
                {
                    path: 'users',
                    name: 'Users',
                    component: () => import('@/views/admin/Users.vue'),
                    meta: {title: '用户管理'}
                },
                {
                    path: 'organization',
                    name: 'Organization',
                    component: () => import('@/views/admin/Organization.vue'),
                    meta: {title: '部门管理'}
                },
                {
                    path: 'region',
                    name: 'Region',
                    component: () => import('@/views/admin/Region.vue'),
                    meta: {title: '区域管理'}
                },
                {
                    path: 'roles',
                    name: 'Roles',
                    component: () => import('@/views/admin/Roles.vue'),
                    meta: {title: '角色管理'}
                },
                {
                    path: 'operationLog',
                    name: 'OperationLog',
                    component: () => import('@/views/admin/OperationLog.vue'),
                    meta: {title: '日志管理'}
                },
                {
                    path: 'personalConf',
                    name: 'personalConf',
                    component: () => import('@/views/admin/PersonalConf.vue'),
                    meta: {title: '个性化配置'}
                },
            ]
        },
        {
            path: '/401',
            component: () => import('@/views/error-page/401.vue'),
        },
        {
            path: '/404',
            component: () => import('@/views/error-page/404.vue'),
        },
    ]
})
export default router;