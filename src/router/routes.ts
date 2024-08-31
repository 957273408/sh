import Layout from "@/layout/index.vue";
import type { RouteRecordRaw } from "vue-router";
import index from "@/views/index/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "root",
    component: Layout,
    redirect: { name: "index" },
    children: [
      {
        path: "index",
        name: "index",
        component: index,
        meta: {
          title: "主页"
        }
      },
      {
        path: "info",
        name: "info",
        component: () => import("@/views/info/index.vue"),
        meta: {
          title: "信息"
        }
      },
      {
        path: "kd",
        name: "kd",
        component: () => import("@/views/kd/index.vue"),
        meta: {
          title: "填写信息"
        }
      },
      {
        path: "az",
        name: "az",
        component: () => import("@/views/az/index.vue"),
        meta: {
          title: "填写信息"
        }
      }
    ]
  }
];

export default routes;
